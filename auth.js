var express = require('express');
var router = express.Router();
var center_express = require('../lib/center_express.js');
var db = require('../lib/db.js');
var template_express = require('../lib/template_express.js');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var session = require('express-session');
var auth = require('../lib/auth');
const bcrypt = require('bcrypt');

module.exports = function(passport){
  router.get('/login', function(request, response){
    db.query(`SELECT *FROM center`, function(error, center){
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error){
          feedback = fmsg.error[0];
        }
        var title = 'Login';
        var list = template_express.list(center);
        var html = template_express.HTML(sanitizeHtml(title), list,
              `<div style="color:red">${feedback}<div>
              <form action = "/auth/login_process" method="post">
                <p><input type="text" name ="email" placeholder="email"></p>
                <p><input type="password" name ="pwd" placeholder="password"></p>
                <p>
                  <input type = "submit" value="login">
                </p>
              </form>
              `, `<a href="/center/create">create</a>`,
              ''
        );
      response.send(html);
    });
  });

  /* passport 안쓰고 session으로만 구현
  router.post('/login_process', function(request, response){
    var post = request.body;
    var email = post.email;
    var password = post.pwd;
    if(email === authData.email && password === authData.password){
      request.session.is_logined = true;
      request.session.nickname = authData.nickname;
      // 상담의 정보를 session store에 넣는 작업 바로 시작
      request.session.save(function(){
          response.redirect(`/`);
      });
    } else {
      response.send('Who?')
    }
  });
  */
  router.post('/login_process',
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/auth/login',
                                     failureFlash: true,
                                     successFlash: true}));

  router.get('/register', function(request, response){
      db.query(`SELECT *FROM center`, function(error, center){
       db.query(`SELECT *FROM inquiry_method`,function(error2, inquiry_method){
        db.query(`SELECT *FROM inflow_route`,function(error3, inflow_route){
          var fmsg = request.flash();
          var feedback = '';
          if(fmsg.error){
            feedback = fmsg.error[0];
          }
          var title = 'Login';
          var list = template_express.list(center);
          var html = template_express.HTML(sanitizeHtml(title), list,
                `<div style="color:red">${feedback}<div>
                <form action = "/auth/register_process" method="post">
                 <p><input type="text" name ="name" placeholder="name"></p>
                 <p><input type="text" name ="displayName" placeholder="nickname"></p>
                 <p><input type="text" name ="phonenumber" placeholder="phonenumber"></p>
                 <p><input type="text" name ="protectorname" placeholder="protector name"></p>
                 <p><input type="text" name ="protectornum" placeholder="protector number"></p>
                 <p><input type="text" name ="email" placeholder="email"></p>
                 <p><input type="password" name ="pwd" placeholder="password"></p>
                 <p><input type="password" name ="pwd2" placeholder="password"></p>
                 <p>
                 문의 방식
                  ${template_express.inquirySelect(inquiry_method)}
                 </P>
                 <p>
                 유입 경로
                  ${template_express.inflowSelect(inflow_route)}
                 </P>
                 <p>
                    <input type = "submit" value="register">
                 </p>
               </form>
                `, `<a href="/center/create">create</a>`,
                                                 ''
          );
        response.send(html);
        });
      });
    });
  });

  router.post('/register_process', function(request, response) {
    var post = request.body;
    console.log(post);
    if(post.pwd !== post.pwd2) {
        request.flash('error', 'Password must same!');
        response.redirect('/auth/register');
        } else {
          db.query(`INSERT INTO client (name, nickname, phone_number, protector_name, protector_num, email_address, password, inquiry_method_id, inflow_route_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [post.name, post.displayName, post.phonenumber, post.protectorname, post.protectornum, post.email, post.pwd, post.inquiry_method, post.inflow_route],
          function(error, results) {
            if(error){
              throw error;
            }
            })
            request.login(post, function(err){
              return response.redirect(`/`);
              });
        }
        // response.writeHead(302, {Location: `/?id=${results.insertId}`});
        // response.end();
  });

  router.get('/logout', function(request, response){
    // request.session.destroy(function(err){
    //     response.redirect(`/`);
    // });
    request.logout();
    request.session.save(function(){
      response.redirect('/');
    });
  });
 return router;
}
