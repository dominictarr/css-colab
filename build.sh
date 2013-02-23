#!/usr/bin/env bash
browserify css.js -o static/css-colab.js --debug

{
  echo '<!DOCTYPE HTML><html><head>'
  echo '<link rel=stylesheet href=./style.css >'
#  echo '<script'\
#  'src=http://rumoursdb.com/examples/css-colab/css-colab.js>'\
#  '></script>'
  echo '<script>if(window.location.hash != '#CSS-LAB') CssColab("CSS-LAB")</script>'
  echo '</head><body></body><script>'
  browserify client.js --debug --exports require || exit 1
  echo '</script></html>'
} > static/editor.html

