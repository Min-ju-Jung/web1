
var express = require('express');
var app = express();
var port = 3000;

var db = require('./lib/db.js')
var center_express = require('./lib/center_express.js');
var service = require('./lib/service.js');
var bodyParser = require('body-parser');
var session = require('express-session');

var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');

app.use(express.static('public')); // public 외에 다른 파일에는 접근할 수 없으므로 안전
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat', // 미밀 코드, 별도의 파일로 저장
  resave: true, // 세션 데이터가 바뀌기 전까진 저장 x
  saveUninitialized: true,  // 세션이 필요하기 전까진 세션을 구동 x
//  store: new FileStore(), // 이 코드 실행하면 deserializeUser 선언이 안됨....
  cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    httpOnly: true,
    secure: false
  }
}))

app.use(flash()); // flash를 middleware로 설치

// local은 user name과 password를 이용하는 것(facebook이나 google은 다름)
var passport = require('./lib/passport')(app);

// router
var centerRouter = require('./routes/centerad');
var homeRouter = require('./routes/home_express');
var authRouter = require('./routes/auth')(passport);


app.use('/center', centerRouter); // /center 시작하는 주소들에게 centerRouter 라고 하는 middleware 를 적용하겠다는 의미
app.use('/', homeRouter);
app.use('/auth', authRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, function() {
  console.log(`Example app listening at http://localhost:${port}`)
})
