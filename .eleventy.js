module.exports = function configure(eleventyConfig) {
    //Merge data and config with child props
    eleventyConfig.setDataDeepMerge(true);    

    //Return formatted date
    eleventyConfig.addFilter("date", value => {
        var date = new Date(value);
        if (date == null)
            return "";
        else
            return date.toDateString();
    });

    //Used by the menu to add a css class to the active page
    eleventyConfig.addShortcode("activePage", (item, page) => {
        if (page.url == "/" && item.url == "/")
            return "active";

        if (item.url != "/" && page.url.startsWith(item.url))
            return "active";

        return "";
    });

    //Easily display the year in html
    eleventyConfig.addShortcode("year", () => {
        return new Date().getFullYear().toString();
    });

    //Merges keywords from site.json and the page data as a string
    eleventyConfig.addShortcode("keywords", (pageTags, siteTags) => {
        return pageTags.concat(siteTags).join(',');
    });

    //Copy theme and custom JS/CSS to the dist/_assets folder
    eleventyConfig.addPassthroughCopy({ "src/theme": "." });
    eleventyConfig.addPassthroughCopy({ "src/site/_assets": "_assets" });

    //Returns a 11ty configuration using Nunjucks templating and default folders
    return {
        htmlTemplateEngine: "njk",
        templateFormats: ["md", "njk", "html"],
        dir: {
            input: "src/site",
            output: "dist"
        }
    };
};

