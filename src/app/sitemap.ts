import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://biwov.com";
  const hoy = new Date();

  return [
    { url: base, lastModified: hoy, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/kathe`, lastModified: hoy, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contrato`, lastModified: hoy, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/politica-datos`, lastModified: hoy, changeFrequency: "yearly", priority: 0.2 },
  ];
}
