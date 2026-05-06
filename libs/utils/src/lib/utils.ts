import { Category } from "@org/shared-types";

export function buildCategoryTree(categories: Category[]) : Category[] {
  const map = new Map<number, Category>();

  for (const c of categories) {
    map.set(c.id, { ...c, children: [] });
  }

  const roots: Category[] = [];

  for (const c of map.values()) {
    if (c.parent_id === null) {
      roots.push(c);
    } else {
      map.get(c.parent_id)?.children?.push(c);
    }
  }

  return roots;
}