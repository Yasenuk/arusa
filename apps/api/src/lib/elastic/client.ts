import { Client } from "@elastic/elasticsearch";

const isLocal = !process.env.ELASTICSEARCH_URL || process.env.ELASTICSEARCH_URL.startsWith("http://localhost");

export const esClient = isLocal
  ? new Client({ node: process.env.ELASTICSEARCH_URL ?? "http://localhost:9200" })
  : new Client({
      node: process.env.ELASTICSEARCH_URL!,
      auth: { apiKey: process.env.ELASTICSEARCH_API_KEY! },
    });