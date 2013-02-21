var Rumours = require('rumours')
var ready   = require('domready')
var idle    = require('idle')
var parse   = require('./parse')

//expose 

CssColab = function (name, _host) {
  var host

  if(_host == null)
    host = 'http://rumoursdb.com'
  else if(_host == true)
    host = window.location.protocol + '//' +window.location.host
  else
    host = _host

  var rumours = Rumours({
    db: 'css-colab',
    host: host
  })


  ready(function () {

    var sheets = document.styleSheets
    for(var i in sheets) {

      var styleSheet = sheets[i]
      console.log(styleSheet.href)
      if(styleSheet.href && styleSheet.rules)
      (function (styleSheet) {

        var href = styleSheet.href.replace(window.location.origin, '')
 
        rumours.open(
        ['r-edit', 'stylesheet', name, encodeURIComponent(href)].join('!')
        , function (err, rEdit) {

          var css = rEdit.toJSON().join('/n').trim()

          function updateCss() {

            while(styleSheet.rules.length)
              styleSheet.deleteRule()

            parse(rEdit.toJSON().join('\n')).forEach(function (rule) {
              if(rule.valid) {
                console.log(rule.selector, rule.style)
                try {
                styleSheet.addRule(rule.selector, rule.style)
                } catch (err) {
                  console.log('error', err, rule.selector, rule.style)
                }
              } else
                console.log('invalid rule', rule)
            })
          }

          idle(rEdit, 'update', 500, updateCss)

          //if this is the first time, update with current values.

          if(!rEdit.toJSON().length) {
            var style = [].slice.call(styleSheet.rules).map(function (e) {
              return e.cssText
                .replace('{', '{\n ')
                .replace('}', '}\n\n')
                .split(';').join(';\n ')
              }).join('\n\n')


            var s = style.split('\n').map(function (e) {
              return e + '\n'
            })
            s.unshift(0)
            s.unshift(0)
            rEdit.splice.apply(rEdit, s)
          }

          updateCss()
        })

      })(styleSheet)

    }

  })

}
