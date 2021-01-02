var express = require('express');
var router = express.Router();
var center_express = require('../lib/center_express.js');
var session = require('express-session');

router.get('/create', function(request, response){
  center_express.create(request, response);
})

router.post('/create_process', function(request, response){
  center_express.create_process(request, response);
})

router.get('/update/:pageId', function(request, response){
  center_express.update(request, response);
})

router.post('/update_process', function(request, response){
  center_express.update_process(request, response);
})

router.post('/delete_process', function(request, response){
  center_express.delete_process(request, response);
})

router.get('/:pageId/:chapterId', function(request, response, next){
  center_express.page(request, response);
})

module.exports = router;
