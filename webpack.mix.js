let tailwindcss = require("tailwindcss");
let mix = require("laravel-mix");
mix
  .js("src/app.js", "assets")
  .css("src/style.css", "assets")
  .options({
    postCssUrls: false,
    postCss: [tailwindcss("tailwind.config.js")],
  });
