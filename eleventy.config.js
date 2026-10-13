export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });
  eleventyConfig.addFilter("join_", (a, sep = ", ") => (a || []).join(sep));
  eleventyConfig.addFilter("cap", (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s));
  eleventyConfig.addFilter("slug_", (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  eleventyConfig.addFilter("number", (n) => Number(n).toLocaleString("en-US"));
  eleventyConfig.addFilter("urlencode", (s) => encodeURIComponent(String(s ?? "")));
  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
    pathPrefix: "/",
  };
}
