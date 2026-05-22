import { prisma } from '../db/prisma';

export async function getArticles({ id = 1 }: { id?: number } = {}) {
  return prisma.articles.findUnique({ where: { id } });
}

export async function getAllArticles() {
  return prisma.articles.findMany({ orderBy: { created_at: 'desc' } });
}

export async function createArticle(data: { title: string; description: string; alt: string; image_url: string }) {
  return prisma.articles.create({ data });
}

export async function updateArticle(id: number, data: Partial<{ title: string; content: string; preview_text: string; image_url: string }>) {
  return prisma.articles.update({ where: { id }, data });
}

export async function deleteArticle(id: number) {
  return prisma.articles.delete({ where: { id } });
}
