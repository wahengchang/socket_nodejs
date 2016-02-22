var express = require('express');
var router = express.Router();

// var io = require('socket.io').listen(app);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/command', function(req, res, next) {
  res.render('command', { title: 'command' });
});


module.exports = router;
