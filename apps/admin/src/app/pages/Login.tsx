import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './pages.module.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Невірний email або пароль');
        return;
      }

      const { accessToken } = await res.json();
      localStorage.setItem('admin_token', accessToken);
      navigate('/dashboard');
    } catch {
      setError('Помилка підключення');
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__card}>
        <h1 className={styles.login__title}>Arusa Admin</h1>
        {error && <p className={styles.login__error}>{error}</p>}
        <input
          className={styles.login__input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className={styles.login__input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button className={styles.login__button} onClick={handleLogin}>
          Увійти
        </button>
      </div>
    </div>
  );
}