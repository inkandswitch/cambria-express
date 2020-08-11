/* this isn't right */

var express = require('express')
var app = express()

var cambriaExpress = require('../src')

app.use(cambriaExpress({/* nada */}))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000)
