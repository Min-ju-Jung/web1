var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'manju8898',
  database : 'vacwebpage'
});

connection.connect();

connection.query('SELECT *FROM therapist', function (error, results, fields) {
  if (error) {
    console.log(error);
  };
  console.log(results);
});

connection.end();
