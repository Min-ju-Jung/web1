var db = require('./db.js');
var template_express = require('./template_express.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var auth = require('./auth');
var session = require('express-session');
//이미 만들어져있는 middleware 사용한 것
app.use(bodyParser.urlencoded({ extended: false }));

//미들웨어 생성해서 사용...
// app.use(compression());
// app.use(function(request, response, next){
//
// })


exports.home = function(request, response){
  db.query(`SELECT *FROM center`, function(error, center){
    var title = 'Welcome!!';
    var description = 'Hello, VAC!';
    var list = template_express.list(center);
    var html = template_express.HTML(title, list, `<h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width: 300px; display: block">
      `
      ,
          `<a href="/center/create">create</a>`,
            auth.statusUI(request, response)
    );
    response.writeHead(200);
    response.end(html);
  });
}

exports.page = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT *FROM center`, function(error, center){
    if(error){
      throw error;
    }
      var list = template_express.list(center);
    db.query(`SELECT * FROM center LEFT JOIN parking
      ON center.parking=parking.id WHERE center.id=?`,[request.params.pageId], function(error2, center){
      if(error2){
        next(error2);
      } else{
        var title = center[0].name;
        var description = center[0].description;
        var html = template_express.HTML(title, list,
              `<h2>${sanitizeHtml(title)}</h2>
              ${sanitizeHtml(description)}
              <p>주차가능여부 ${sanitizeHtml(center[0].availability)}</p>`,
              `<a href="/center/create">create</a>
              <a href="/center/update/${request.params.pageId}">update</a>
              <form action="/center/delete_process" method="post">
               <input type="hidden" name="id" value="${request.params.pageId}">
               <input type="submit" value="delete">
              </form>
              `,
              auth.statusUI(request, response)
        );
        response.writeHead(200);
        response.end(html);
      }
    });
  });
}

exports.create = function(request, response){
  if(!auth.isOwner(request, response)){
    response.redirect(`/`)
    return false;
  }
  db.query(`SELECT *FROM center`, function(error, center){
   db.query(`SELECT *FROM parking`,function(error2, parking){
      var title = 'Create';
      var list = template_express.list(center);
      var html = template_express.HTML(sanitizeHtml(title), list,
            `<form action = "/center/create_process" method="post">
              <p><input type="text" name ="name" placeholder="상담소 이름"></p>
              <p><input type="text" name ="gu_name" placeholder="구이름"></p>
              <p>
                <textarea name="address" placeholder="상세주소"></textarea>
              </p>
              <p>
                <textarea name="description" placeholder="상세설명"></textarea>
              </p>
              <p>
              주차가능여부
               ${template_express.parkingSelect(parking)}
              </P>
              <p>
                <input type = "submit">
              </p>
            </form>
            `, `<a href="/center/create">create</a>`,
              auth.statusUI(request, response)
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create_process = function(request, response){
/*
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      console.log(post);
      db.query(`INSERT INTO center (name, gu_name, address, description, created, parking)
      VALUES (?, ?, ?, ?, NOW(),?)`,
      [post.name,post.gu_name,post.address, post.description, post.parking],
      function(error, results) {
        if(error){
          throw error;
        }
        // response.writeHead(302, {Location: `/?id=${results.insertId}`});
        // response.end();
      response.redirect(`/page/${results.insertId}/${post.name}`);
      })
  });
  */
      var post = request.body;
      db.query(`INSERT INTO center (name, gu_name, address, description, created, parking)
      VALUES (?, ?, ?, ?, NOW(),?)`,
      [post.name,post.gu_name,post.address, post.description, post.parking],
      function(error, results) {
        if(error){
          throw error;
        }
        // response.writeHead(302, {Location: `/?id=${results.insertId}`});
        // response.end();
      response.redirect(`/center/${results.insertId}/${post.name}`);
    });

}

exports.update = function(request, response){
  if(!auth.isOwner(request, response)){
    response.redirect(`/`)
    return false;
  }
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT *FROM center`, function(error, center){
    if(error) {
      throw error;
    }
    var list = template_express.list(center);
    db.query(`SELECT *FROM center WHERE id = ?`,[request.params.pageId], function(error2, center){
      if(error2) {
        throw error2;
      }
      db.query(`SELECT *FROM parking`,function(error2, parking){
        var html = template_express.HTML(sanitizeHtml(center[0].name), list,
          `
          <form action = "/center/update_process" method="post">
          <input type="hidden" name="id" value=${center[0].id}>
          <p><input type="text" name="name" placeholder="상담소 이름" value="${sanitizeHtml(center[0].name)}"></p>
          <p><input type="text" name ="gu_name" placeholder="구 이름" value="${sanitizeHtml(center[0].gu_name)}"></p>
          <p>
            <textarea name="address" placeholder="상세주소">${sanitizeHtml(center[0].address)}</textarea>
          </p>
          <p>
            <textarea name="description" placeholder="상세설명">${sanitizeHtml(center[0].description)}</textarea>
          </p>
          <p>
          주차가능여부
           ${template_express.parkingSelect(parking, center[0].parking)}
          </p>
          <p>
            <input type = "submit">
          </p>
        </form>`,
          `<a href="/center/create">create</a>
           <a href="/center/update/${request.params.pageId}">update</a>
           `,
            auth.statusUI(request, response)
        );
        response.writeHead(200);
        response.end(html);
      });
  });
});
}

exports.update_process = function(request, response){
  /*
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`UPDATE center SET name=?, gu_name=?, address=?, description=?, parking=? WHERE id=? `,
      [post.name, post.gu_name,post.address, post.description, post.parking, post.id],
      function(error, results) {
        if(error){
          throw error;
        }
        // response.writeHead(302, {Location: `/page/${post.id}`});
        // response.end();
        response.redirect(`/page/${post.id}/${post.name}`);
      })
  });
  */

      var post = request.body;
      db.query(`UPDATE center SET name=?, gu_name=?, address=?, description=?, parking=? WHERE id=? `,
      [post.name, post.gu_name,post.address, post.description, post.parking, post.id],
      function(error, results) {
        if(error){
          throw error;
        }
        // response.writeHead(302, {Location: `/page/${post.id}`});
        // response.end();
        response.redirect(`/center/${post.id}/${post.name}`);
      });
}

exports.delete_process = function(request, response){
  /*
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
    db.query(`DELETE FROM center WHERE id=?`, [post.id], function(error, results) {
      if(error){
        throw error;
      }
      // response.writeHead(302, {Location: `/`});
      // response.end();
      response.redirect(`/`);
    });
  });
  */
  if(!auth.isOwner(request, response)){
    response.redirect(`/`)
    return false;
  }
    var post = request.body;
    db.query(`DELETE FROM center WHERE id=?`, [post.id], function(error, results) {
      if(error){
        throw error;
      }
      // response.writeHead(302, {Location: `/`});
      // response.end();
      response.redirect(`/`);
  });
}
