const express = require('express')
const cors = require('cors')
const app = express()
var exec = require("child_process").exec;
var bodyParser = require('body-parser')
 
app.use(cors())
app.use(bodyParser.json());
 
app.get('/*', (req, res) => {
  res.send('Server is running.')
})
 
app.post('/*', (req, res) => {
  exec('php C:/Users/Administrator/Desktop/DC/Apps/calendar-app/src/php/api.php ' + req.params[0].split('/')[2] + ' ' + JSON.stringify(req.body).replace(/"/g, "'"), function (error, stdout, stderr) {console.log(stdout); res.send(stdout);});
})
 
app.listen(3001, () => {
  console.log('Example app listening on port 3001!')
})