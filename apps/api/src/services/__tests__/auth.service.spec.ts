import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loginUser,
  registerUser,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../auth.service';

// --- Моки ---
// Підміняємо prisma — тести не потребують реальної БД
vi.mock('../../db/prisma', () => ({
  prisma: {
    users: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock('../user.service', () => ({ createUser: vi.fn() }));
vi.mock('../cart.service', () => ({ createCart: vi.fn() }));

import { prisma } from '../../db/prisma';
import { createUser } from '../user.service';
import { createCart } from '../cart.service';
import bcrypt from 'bcrypt';

// --- Допоміжні дані ---
const mockUser = {
  id: BigInt(1),
  email: 'test@example.com',
  password_hash: '',
  role: 'user',
  first_name: 'Іван',
  last_name: 'Петренко',
  middle_name: null,
};

// --- Тести ---

describe('createAccessToken / verifyAccessToken', () => {
  it('створює валідний access token і верифікує його', () => {
    const payload = { id: '1', role: 'user' };
    const token = createAccessToken(payload);

    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT має 3 частини

    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe('1');
    expect(decoded.role).toBe('user');
  });

  it('кидає помилку для невалідного токена', () => {
    expect(() => verifyAccessToken('invalid.token.here')).toThrow();
  });

  it('кидає помилку для підробленого токена', () => {
    expect(() =>
      verifyAccessToken('eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEifQ.fakesignature')
    ).toThrow();
  });
});

describe('createRefreshToken / verifyRefreshToken', () => {
  it('створює валідний refresh token і верифікує його', () => {
    const payload = { id: '42', role: 'admin' };
    const token = createRefreshToken(payload);

    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe('42');
    expect(decoded.role).toBe('admin');
  });

  it('access token не можна верифікувати як refresh token', () => {
    // Різні секрети — токени не взаємозамінні
    const accessToken = createAccessToken({ id: '1', role: 'user' });
    expect(() => verifyRefreshToken(accessToken)).toThrow();
  });
});

describe('loginUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('повертає токени при правильних даних', async () => {
    const hash = await bcrypt.hash('password123', 10);
    vi.mocked(prisma.users.findUnique).mockResolvedValue({ ...mockUser, password_hash: hash } as any);

    const result = await loginUser('test@example.com', 'password123');

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.id).toBe('1');
    expect(result.user.role).toBe('user');
  });

  it('кидає помилку якщо користувач не існує', async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(null);

    await expect(loginUser('noone@example.com', 'pass'))
      .rejects.toMatchObject({ status: 400, message: 'Невірні облікові дані' });
  });

  it('кидає помилку при неправильному паролі', async () => {
    const hash = await bcrypt.hash('correctpassword', 10);
    vi.mocked(prisma.users.findUnique).mockResolvedValue({ ...mockUser, password_hash: hash } as any);

    await expect(loginUser('test@example.com', 'wrongpassword'))
      .rejects.toMatchObject({ status: 400, message: 'Невірні облікові дані' });
  });

  it('не розкриває чи email існує чи ні — однакова помилка', async () => {
    // Важливо для безпеки: обидва випадки дають однакове повідомлення
    vi.mocked(prisma.users.findUnique).mockResolvedValue(null);
    const err1 = await loginUser('noone@example.com', 'pass').catch(e => e);

    const hash = await bcrypt.hash('correct', 10);
    vi.mocked(prisma.users.findUnique).mockResolvedValue({ ...mockUser, password_hash: hash } as any);
    const err2 = await loginUser('test@example.com', 'wrong').catch(e => e);

    expect(err1.message).toBe(err2.message);
  });
});

describe('registerUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('успішно реєструє нового користувача', async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => fn(prisma));
    vi.mocked(createUser).mockResolvedValue(mockUser as any);
    vi.mocked(createCart).mockResolvedValue(undefined as any);

    const result = await registerUser('Іван', 'Петренко', '', 'new@example.com', 'pass123', 'pass123');

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.id).toBe('1');
  });

  it('кидає помилку якщо паролі не співпадають', async () => {
    await expect(
      registerUser('Іван', 'Петренко', '', 'test@example.com', 'pass123', 'different')
    ).rejects.toMatchObject({ status: 400, message: 'Паролі не співпадають' });
  });

  it('кидає помилку якщо email вже зайнятий', async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(mockUser as any);

    await expect(
      registerUser('Іван', 'Петренко', '', 'test@example.com', 'pass123', 'pass123')
    ).rejects.toMatchObject({ status: 400, message: 'Email вже використовується' });
  });

  it('не зберігає пароль у відкритому вигляді', async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => fn(prisma));
    vi.mocked(createUser).mockImplementation(async (_fn, _ln, _mn, _email, hash) => {
      // Перевіряємо що передається хеш, а не оригінальний пароль
      expect(hash).not.toBe('pass123');
      expect(hash.startsWith('$2b$')).toBe(true); // bcrypt формат
      return mockUser as any;
    });
    vi.mocked(createCart).mockResolvedValue(undefined as any);

    await registerUser('Іван', 'Петренко', '', 'new@example.com', 'pass123', 'pass123');
  });

  it('створює корзину разом з користувачем в одній транзакції', async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => fn(prisma));
    vi.mocked(createUser).mockResolvedValue(mockUser as any);
    vi.mocked(createCart).mockResolvedValue(undefined as any);

    await registerUser('Іван', 'Петренко', '', 'new@example.com', 'pass123', 'pass123');

    // Обидва мають бути викликані
    expect(createUser).toHaveBeenCalledOnce();
    expect(createCart).toHaveBeenCalledWith(1); // id з mockUser
  });
});
