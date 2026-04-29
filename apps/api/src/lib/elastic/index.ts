import { esClient } from "./client";

export async function initElastic() {
  const exists = await esClient.indices.exists({
    index: "product_variants",
  });

  if (!exists) {
    await esClient.indices.create({
      index: "product_variants",
      mappings: {
        properties: {
          product_id: { type: "integer" },
          variant_id: { type: "integer" },

          title: { type: "text" },
          description: { type: "text" },
          article: { type: "keyword" },

          category: { type: "keyword" },
          color: { type: "keyword" },
          material: { type: "keyword" },

          price: { type: "float" },
          quantity: { type: "integer" },

          size: { type: "keyword" },
        },
      },
    });
  }
}