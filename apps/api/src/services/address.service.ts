import { prisma } from '../db/prisma';
import { CreateAddressDto } from '@org/shared-types';

export async function getAddresses(user_id: number) {
  return prisma.user_addresses.findMany({
    where: { user_id },
    orderBy: [{ is_default: 'desc' }, { id: 'desc' }]
  });
}

export async function createAddress(user_id: number, data: CreateAddressDto) {
  if (data.is_default) {
    await prisma.user_addresses.updateMany({
      where: { user_id },
      data: { is_default: false }
    });
  }

  const isFirst = (await prisma.user_addresses.count({ where: { user_id } })) === 0;

  return prisma.user_addresses.create({
    data: {
      user_id,
      region: data.region ?? '',         
      city: data.city,
      street: data.street ?? '',         
      house: data.house ?? '',           
      apartment: data.apartment,
      postal_code: data.postal_code,
      np_city_ref: data.np_city_ref,
      np_warehouse_ref: data.np_warehouse_ref,
      np_warehouse_description: data.np_warehouse_description,
      delivery_type: data.delivery_type ?? 'warehouse',
      is_default: data.is_default ?? isFirst
    }
  });
}

export async function setDefaultAddress(user_id: number, address_id: number) {
  const address = await prisma.user_addresses.findFirst({
    where: { id: address_id, user_id }
  });

  if (!address) throw new Error('Адресу не знайдено');

  await prisma.user_addresses.updateMany({
    where: { user_id },
    data: { is_default: false }
  });

  return prisma.user_addresses.update({
    where: { id: address_id },
    data: { is_default: true }
  });
}

export async function deleteAddress(user_id: number, address_id: number) {
  const address = await prisma.user_addresses.findFirst({
    where: { id: address_id, user_id }
  });

  if (!address) throw new Error('Адресу не знайдено');

  await prisma.user_addresses.delete({ where: { id: address_id } });

  if (address.is_default) {
    const next = await prisma.user_addresses.findFirst({
      where: { user_id },
      orderBy: { id: 'desc' }
    });
    if (next) {
      await prisma.user_addresses.update({
        where: { id: next.id },
        data: { is_default: true }
      });
    }
  }

  return { success: true };
}