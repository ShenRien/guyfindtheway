const pluginRss = require("@11ty/eleventy-plugin-rss");
const codeStyleHooks = require("eleventy-plugin-code-style-hooks");
const mathjaxPlugin = require("eleventy-plugin-mathjax");
const markdownLib = require('markdown-it')({html: true});
const mdAttrs = require('markdown-it-attrs');

module.exports = function (eleventyConfig) {

  eleventyConfig.setLibrary("md", markdownLib);
  eleventyConfig.amendLibrary("md", markdownLib => markdownLib.use(mdAttrs));

  eleventyConfig.addPairedShortcode("markdown", (content, inline = null) => {
    return inline
      ? markdownLib.renderInline(content)
      : markdownLib.render(content);
  });

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
  });

  eleventyConfig.addPassthroughCopy("./src/posts/assets/");
  eleventyConfig.addPassthroughCopy("assets/fonts/");
  eleventyConfig.addPlugin(codeStyleHooks, {
    lineNumbers: false,
  });

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  eleventyConfig.addLiquidFilter(
    "getNewestCollectionItemDate",
    pluginRss.getNewestCollectionItemDate
  );

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  eleventyConfig.addFilter("postTags", (tags) => {
    return Object.keys(tags)
      .filter((k) => k !== "posts")
      .filter((k) => k !== "all")
      .map((k) => ({ name: k, count: tags[k].length }))
      .sort((a, b) => b.count - a.count);
  });

  eleventyConfig.addPlugin(mathjaxPlugin);

  // ==================== CUSTOM FILTERS ====================
  
  // Filter lấy excerpt từ content
  eleventyConfig.addFilter("excerpt", function(content, length = 150) {
    if (!content) return '';
    
    // Xóa HTML tags
    let text = content.replace(/<[^>]*>/g, '');
    // Xóa khoảng trắng thừa
    text = text.replace(/\s+/g, ' ').trim();
    // Giới hạn độ dài
    return text.length > length ? text.substring(0, length) + '...' : text;
  });

  // Filter lấy excerpt thông minh (cắt sau câu)
  eleventyConfig.addFilter("smartExcerpt", function(content, length = 150) {
    if (!content) return '';
    
    let text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
    if (text.length <= length) return text;
    
    // Tìm vị trí cắt tự nhiên sau dấu câu
    let excerpt = text.substring(0, length + 50); // Lấy thêm để tìm dấu câu
    let lastDot = excerpt.lastIndexOf('.');
    let lastQuestion = excerpt.lastIndexOf('?');
    let lastExclamation = excerpt.lastIndexOf('!');
    
    let cutIndex = Math.max(lastDot, lastQuestion, lastExclamation);
    
    // Nếu tìm thấy dấu câu và không quá ngắn
    if (cutIndex > length * 0.5) {
      return text.substring(0, cutIndex + 1) + '..';
    }
    
    // Fallback: cắt tại khoảng trắng gần nhất
    let lastSpace = text.lastIndexOf(' ', length);
    if (lastSpace > length * 0.7) {
      return text.substring(0, lastSpace) + '...';
    }
    
    return text.substring(0, length) + '...';
  });

  // Filter lấy từ đầu tiên (cho tags, keywords)
  eleventyConfig.addFilter("firstWords", function(content, wordCount = 10) {
    if (!content) return '';
    
    let text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    let words = text.split(' ');
    
    return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
  });

  // Filter lấy paragraph đầu tiên
  eleventyConfig.addFilter("firstParagraph", function(content) {
    if (!content) return '';
    
    // Tách theo thẻ paragraph
    let paragraphs = content.split('</p>');
    if (paragraphs.length > 0) {
      let firstPara = paragraphs[0].replace(/<[^>]*>/g, '').trim();
      return firstPara.length > 0 ? firstPara : 'Xem thêm...';
    }
    
    return content.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md").reverse();
  });

  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/articles/*.md").reverse();
  });

  eleventyConfig.addCollection("tusixmode", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/tusixmode/*.md").reverse();
  });

  eleventyConfig.addLiquidFilter(
    "similarPosts",
    function (collection, path, tags) {
      if (!collection) return [];
      let similarPosts = collection
        .filter((post) => {
          return (
            getSimilarTags(post.data.tags, tags) >= 1 &&
            post.data.page.inputPath !== path
          );
        })
        .sort((a, b) => {
          return (
            getSimilarTags(b.data.tags, tags) -
            getSimilarTags(a.data.tags, tags)
          );
        });
      if (similarPosts.length < 4) {
        similarPosts = similarPosts
          .concat(collection.slice(0, 3))
          .filter((post) => post.data.page.inputPath !== path);
      }
      return getUniquePosts(similarPosts);
    }
  );

  

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // These are all optional:
    dir: {
      input: "src", // default: "."
      output: "_site", // THÊM DÒNG NÀY - quan trọng cho GitHub Pages
      includes: "_includes", // THÊM DÒNG NÀY
      data: "_data" // THÊM DÒNG NÀY
    },

    // -----------------------------------------------------------------
    // Optional items:
    // -----------------------------------------------------------------

    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

    // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
    // it will transform any absolute URLs in your HTML to include this
    // folder name and does **not** affect where things go in the output folder.
    pathPrefix: process.env.NODE_ENV === 'production' 
      ? '/guyfindtheway/'  
      : '/', 
  };

  
};

const getSimilarTags = function (categoriesA, categoriesB) {
  if (!categoriesA) return [];
  return categoriesA.filter(Set.prototype.has, new Set(categoriesB)).length;
};

const getUniquePosts = function (posts) {
  const field = "url";
  const uniqueValues = new Set();
  return posts.filter((item) => {
    if (!uniqueValues.has(item[field])) {
      uniqueValues.add(item[field]);
      return true;
    }
    return false;
  });
};