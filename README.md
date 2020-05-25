# cinziamilani.com

```bash
npm install
```

Watch and build `src/index.js` to `dist/main.js`

```bash
./node_modules/.bin/webpack -w --mode=development --output-path=$(pwd)/_site/
```

Watch and build `src/*.scss` to `_site/*.css`

```bash
./node_modules/.bin/sass --watch src/scss:_site/css
```

Development servers

```
npx @11ty/eleventy --input=src --serve
```

## Deploy

```sh
./node_modules/.bin/webpack --mode=production --output-path=$(pwd)/_site/
./node_modules/.bin/sass src/scss:_site/css --style compressed
npx @11ty/eleventy --input=src
git subtree push --prefix _site origin gh-pages
git push origin `git subtree split --prefix _site master`:gh-pages --force
```

[https://charlesmulder.github.io/cinziamilani.com/](https://charlesmulder.github.io/cinziamilani.com/)

## Inspiration

- [w3css photographer template](http://webdevable.com/w3schools/w3css/tryw3css_templates_photo2.html)
- [How TO - Responsive Image Grid](https://www.w3schools.com/howto/howto_css_image_grid_responsive.asp)
- [Sticky navbar](https://www.w3schools.com/howto/howto_js_navbar_sticky.asp)
- [Off canvas menu](https://www.w3schools.com/howto/howto_js_off-canvas.asp)
- [Black and white images](https://www.w3schools.com/howto/howto_css_image_bw.asp)
- [SVG drawing](http://scrollmagic.io/examples/advanced/svg_drawing.html)

## Resources

- [PayPal Buttons](https://www.paypal.com/buttons/)
