
module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("img");
    eleventyConfig.addPassthroughCopy("audio");
    eleventyConfig.addPassthroughCopy("CNAME");
    eleventyConfig.addPassthroughCopy("mail");

    // Handlebars Helper
    eleventyConfig.addPairedHandlebarsShortcode("ifEven", function(content, index) {
        if ((index == 0) || (index%2 == 0)) {
            return content;
        }
    });
    eleventyConfig.addPairedHandlebarsShortcode("ifOdd", function(content, index) {
        if (index%2 != 0) {
            return content;
        }
    });
    eleventyConfig.addPairedHandlebarsShortcode("token", function() {
        return Date.now();
    });

};
