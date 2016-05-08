default:
	browserify -t [ babelify --presets [ es2015 react ] ] src/app.js -o lib/app.js

