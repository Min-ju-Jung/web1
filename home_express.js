var express = require('express');
var router = express.Router();
var center_express = require('../lib/center_express.js');
var db = require('../lib/db.js');
var template_express = require('../lib/template_express.js');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var auth = require('../lib/auth');
var session = require('express-session');
var template_hw1 = require('../lib/hw1/template_hw1');

router.get('/', function(request, response){
  db.query(`SELECT *FROM center`, function(error, center){
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.success){
      feedback = fmsg.success[0];
    }
    var title = 'Welcome!!';
    var description = 'Hello, VAC!';
    var list = template_express.list(center);
    var html = template_express.HTML(title, list,
      `
      <div style="color:blue;">${feedback}</div>
      <h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width: 300px; display: block">
      `
      ,
      `
      <a href="/center/create">create</a>`,
       auth.statusUI(request, response)
    );
    response.send(html);
  });
 });

module.exports = router;
