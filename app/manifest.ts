import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KS Digital",
    short_name: "KS Digital",
    description: "KS Digital client workspace",
    start_url: "/",
    display: "standalone",
    background_color: "#08090d",
    theme_color: "#7657ff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
