import { prisma } from '../db/prisma';

export async function getArticles({ id = 1 }: { id?: number; } = {}) {
  return prisma.articles.findUnique({
    where: { id }
  });
}