import { merge } from "lume/core/utils/object.ts";
import postcss from "lume/plugins/postcss.ts";
import pagefind from "lume/plugins/pagefind.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import nav from "lume/plugins/nav.ts";
import title from "https://deno.land/x/lume_markdown_plugins@v0.7.1/title.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.1/toc.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins@v0.7.1/footnotes.ts";
import prism from "lume/plugins/prism.ts";
import date from "lume/plugins/date.ts";
import basePath from "lume/plugins/base_path.ts";
import favicon, { Options as FaviconOptions } from "lume/plugins/favicon.ts";
import phosphor, {
  Options as IconOptions,
} from "https://deno.land/x/lume_icon_plugins@v0.2.3/phosphor.ts";
import { alert } from "npm:@mdit/plugin-alert@0.13.1";
import multilanguage from "lume/plugins/multilanguage.ts";

import "lume/types.ts";

export interface Options {
  /**
   * Options for the favicon plugin.
   */
  favicon?: FaviconOptions;

  /**
   * Options for the phosphor plugin.
   */
  icons?: IconOptions;

  /**
   * Language options for the multilanguage plugin.
   * The first language is the default language.
   */
  languages?: string[];
}
export const defaults: Options = {
  languages: ["en"],
};

export default function (userOptions?: Options) {
  const options = merge(defaults, userOptions);

  return (site: Lume.Site) => {
    site.use(nav())
      .use(title())
      .use(toc())
      .use(footnotes())
      .use(postcss())
      .use(pagefind())
      .use(prism())
      .use(resolveUrls())
      .use(date())
      .use(favicon(options.favicon))
      .use(basePath())
      .data("languages", options.languages)
      .use(multilanguage({
        languages: options.languages,
        defaultLanguage: options.languages[0],
      }))
      .use(phosphor({
        ...options.icons,
        name: "icon",
      }))
      .data("layout", "layout.vto")
      .data("order", 0)
      .mergeKey("extra_head", "stringArray")
      .copy("menu.js")
      .copy([
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".svg",
        ".mp4",
        ".webm",
        ".gif",
      ]);

    // Alert plugin
    site.hooks.addMarkdownItPlugin(alert);
  };
}
