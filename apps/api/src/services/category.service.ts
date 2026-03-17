import { prisma } from '../db/prisma';

export async function createCategory(name: string, parent_id?: number | null) {
  return prisma.categories.create({
    data: {
      name,
      parent_id: parent_id ?? null
    }
  });
}

export async function getCategories() {
  return prisma.categories.findMany({
    orderBy: {
      id: "asc"
    }
  });
}