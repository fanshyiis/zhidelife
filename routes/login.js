var express = require('express');
var router = express.Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Todo = AV.Object.extend('Todo');

/**
 * 定义路由：获取所有 Todo 列表
 */
router.get('/', function(req, res) {
  res.render('login', { title: 'HOME'});
});

router.get('/reg', function(req, res) {
  res.render('reg', { title: 'HOME'});
});


module.exports = router;
