var Rumours = require('rumours')
var h       = require('hyperscript')
var o       = require('observable')
var hash    = require('hash-change')

var text = h('textarea', {cols: 80, rows: 24, disabled: true})
var rumours = RUMOURS = Rumours({
  db: 'css-colab'
})

var opened = {}

//TODO allow user to pass in the target - by #address:port
//hmm, if we add http routes for the JSON and Text version
//of a Scuttlebutt then we'd be able to roll this out by just
//adding the stylesheet as a link to that route!

hash.on('change', onChange)
onChange()

function onChange() {
  var host = hash.hash() || window.location.host

  //close models/views that where opened.
  for(var k in opened) {
    opened[k].model.dispose()
    document.body.removeChild(opened[k].view)
    delete opened[k]
  }

  rumours.view('all', ['r-edit','stylesheet', hash.hash(), true])
  .on('data', function (d) {
    var k = d.key.join('!')
    opened[k] = opened[k] || {model:
      rumours.open(k, function (err, rEdit) {
        if(err) throw err

        var text = h('textarea', {cols: 80, rows: 24})

        document.body.appendChild(
          opened[k].view = h('div',
            h('h2', h('code', decodeURIComponent(d.key[3]))),
            text
          )
        )

        rEdit.wrap(text)
        text.disabled = false
      })    
    }
  })
}
//document.body.appendChild(text)

