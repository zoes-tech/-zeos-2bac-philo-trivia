import siteData from "@/data/site.json";

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || siteData.url;

export const SITE = {
  ...siteData,
  url: rawUrl.replace(/\/+$/, ""),
};
