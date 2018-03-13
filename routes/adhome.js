var express = require('express');
var router = express.Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var query = new AV.Query('General');

/**
 * 定义路由：获取所有 Todo 列表
 */
router.get('/',requireGotoLogin, function(req, res) {
  query.find().then(function (user) {
  	var alluser = JSON.stringify(user);
  	  res.render('adhome', {
      title: 'TODO 列表',
      user: req.currentUser,
      alluser: alluser,
});
    // 成功获得实例
    // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
  }, function (error) {
    // 异常处理
  });

});

router.get('/alluser', requireGotoLogin,function(req, res) {
	//var alluser;
  query.find().then(function (user) {
  	var alluser = JSON.stringify(user);
  	  res.send( {alluser: alluser,
      });
    // 成功获得实例
    // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
  }, function (error) {
    // 异常处理
  });

});

function requireGotoLogin(req, res, next) {
    if(req.currentUser){
        next();
    }else{
        res.redirect('/login');
    }
}

module.exports = router;