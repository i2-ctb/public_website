const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function configure(eleventyConfig) {
    eleventyConfig.setDataDeepMerge(true);
    
    //eleventyConfig.addGlobalData("layout", "main");

    //eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addFilter("date", value => {
        var date = new Date(value);
        if (date == null)
            return "";
        else
            return date.toDateString();
    });

    eleventyConfig.addShortcode("activePage", (item, page) => {
        if (page.url == "/" && item.url == "/")
            return "active";

        if (item.url != "/" && page.url.startsWith(item.url))
            return "active";

        return "";
    });

    eleventyConfig.addShortcode("year", () => {
        return new Date().getFullYear().toString();
    });

    eleventyConfig.addShortcode("keywords", (pageTags, siteTags) => {
        return pageTags.concat(siteTags).join(',');
    });

    eleventyConfig.addPassthroughCopy({ "src/theme": "_assets" });
    eleventyConfig.addPassthroughCopy({ "src/site/_assets": "_assets" });

    return {
        htmlTemplateEngine: "njk",
        templateFormats: ["md", "njk", "html"],
        dir: {
            input: "src/site",
            output: "dist"
        }
    };
};

