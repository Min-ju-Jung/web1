var sanitizeHtml = require('sanitize-html');
var session = require('express-session');

module.exports = {
  HTML: function (title, list, body, control, authStatusUI = `<a href="/auth/login">login</a> |  <a href="/auth/register">Register</a>`) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>vacwebpage - ${title}</title>
      <meta charset="utf-8">
    </head>

    <body>
      ${authStatusUI}
    <h1>환영해요 <a href="/">VAC</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list: function (center) {
    var list = '<ol>';

    var i = 0;
    while(i < center.length) {
      list = list + `<li><a href ="/center/${center[i].id}/${center[i].name}">${sanitizeHtml(center[i].name)}</a></li>`;
      i = i + 1;
    }

    list = list + '</ol>';
    return list;
  },
  parkingSelect : function(parking, parking_id){
    var tag = '';
    var i = 0;
    while(i < parking.length) {
      var selected='';
      if(parking[i].id === parking_id) {
        selected = 'selected';
      }
      tag += `<option value="${parking[i].id}"${selected}>${sanitizeHtml(parking[i].availability)}</option>`;
      i ++;
    }
    return `<select name="parking">
    ${tag}
    </select>`;
  },
  inquirySelect : function(inquiry_method){
    var tag = '';
    var i = 0;
    while(i < inquiry_method.length) {
      tag += `<option value="${inquiry_method[i].id}">${sanitizeHtml(inquiry_method[i].method_name)}</option>`;
      i ++;
    }
    return `<select name="inquiry_method">
    ${tag}
    </select>`;
  },
  inflowSelect : function(inflow_route){
    var tag = '';
    var i = 0;
    while(i < inflow_route.length) {
      tag += `<option value="${inflow_route[i].id}">${sanitizeHtml(inflow_route[i].route_name)}</option>`;
      i ++;
    }
    return `<select name="inflow_route">
    ${tag}
    </select>`;
  }
}
