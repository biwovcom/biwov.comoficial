import type { MetadataRoute } from "next";
import { ARTICULOS } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://biwov.com";
  const hoy = new Date();

  return [
    { url: base, lastModified: hoy, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tienda`, lastModified: hoy, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: hoy, changeFrequency: "weekly", priority: 0.8 },
    ...ARTICULOS.map((a) => ({
      url: `${base}/blog/${a.slug}`,
      lastModified: new Date(a.actualizado),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${base}/kathe`, lastModified: hoy, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contrato`, lastModified: hoy, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/politica-datos`, lastModified: hoy, changeFrequency: "yearly", priority: 0.2 },
  ];
}
