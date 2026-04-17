import { useEffect } from "react";
import { useLocation } from "react-router";
import { fullTitle, getSeoForPath, ogImageAbsoluteUrl, siteOrigin } from "../../lib/siteSeo";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const sel = `meta[${attr}="${key.replace(/"/g, "")}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function SiteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);
    const title = fullTitle(seo.title);
    document.title = title;

    upsertMeta("name", "description", seo.description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:type", "website");

    const origin = siteOrigin();
    const url = `${origin}${pathname.split("?")[0] || "/"}`;
    upsertMeta("property", "og:url", url);

    const ogImage = ogImageAbsoluteUrl();
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", ogImage);

    const robots = seo.noindex ? "noindex, nofollow" : "index, follow";
    upsertMeta("name", "robots", robots);
  }, [pathname]);

  return null;
}
