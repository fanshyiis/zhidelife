var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var AV = require('leanengine');
var cookieSession = require('cookie-session');

// var users = require('./routes/users');
// var todos = require('./routes/todos');
// var login = require('./routes/login');
// var adhome = require('./routes/adhome');
// var manager = require('./routes/manager');
// var rate = require('./routes/rate');
var wxapp = require('./routes/wxapp');
// var mobile = require('./routes/mobile');
var index = require('./routes/index');
var user = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/static', express.static('public'));

// 加载云代码方法
require('./cloud');
app.use(AV.express());

// 加载 cookieSession 以支持 AV.User 的会话状态
app.use(AV.Cloud.CookieSession({ secret: '05XgTktKPMkU', maxAge: 3600000, fetchUser: true }));

// 强制使用 https
app.enable('trust proxy');
app.use(AV.Cloud.HttpsRedirect());

app.use(methodOverride('_method'))
app.use(bodyParser.json({limit:'10mb'}));
app.use(bodyParser.urlencoded({  limit:'10mb',extended: false }));
app.use(cookieSession({
  name: 'session',
  keys: ['abcdeeee'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// 可以将一类的路由单独保存在一个文件中
// app.use('/todos', todos);
// app.use('/users', users);
// app.use('/login', login);
// app.use('/adhome', adhome);
// app.use('/manager', manager);
// app.use('/rate', rate);
app.use('/wxapp', wxapp);
// app.use('/mobile', mobile);
app.use('/index', index);
app.use('/user',user)

//默认跳转
app.get('/', function(req, res) {
  res.redirect('/index');
})

// 如果任何路由都没匹配到，则认为 404
// 生成一个异常让后面的 err handler 捕获
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message || err,
      error: err
    });
  });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message || err,
    error: {}
  });
});

module.exports = app;
