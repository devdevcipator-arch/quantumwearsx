import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QUANTUMWEARX — Custom Apparel Manufacturing",
    short_name: "QUANTUMWEARX",
    description:
      "Global B2B manufacturing partner for custom athletic apparel, activewear, streetwear, fine leather goods, safety wear, and tactical bags.",
    start_url: "/",
    display: "standalone",
    background_color: "#050507",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

