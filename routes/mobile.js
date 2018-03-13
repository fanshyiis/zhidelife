var express = require('express');
var router = express.Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var findstaff = new AV.Query('Staff');
var fdesk = new AV.Query('Desk');
/**
 * 定义路由：获取所有 Todo 列表
 */
router.get('/', function(req, res) {
  res.render('mobile_login', { title: 'HOME'});
});

router.get('/home', function(req, res) {
  res.render('mobile_home', { title: 'HOME'});
});

router.get('/qcode', function(req, res) {
  res.render('mobile_qcode', { title: 'HOME'});
});

router.post('/login', function(req, res, next) {
	console.log("2222");
    var query = new AV.Query('General');
    var username = req.body.username;
    var password = req.body.password;
    query.equalTo('name', username);
    query.find().then(function(user) {
        if (user == '') {
            res.send({ state: 400, error: '用户名不存在' });

        } else {
            var _user = JSON.parse(JSON.stringify(user));
            console.log(_user);
            if (_user[0].password == password) {
                req.session.name = _user[0].name;
                req.session.id = _user[0].objectId;
                //res.redirect('/mobile/home');
                res.send({ state: 200});
            } else {
                res.send({ state: 400, error: '密码错误' });
            }
        }
    });
});

router.post('/getStaff',function(req, res) {
    var name = req.session.name;
    findstaff.equalTo('belong', name);
    findstaff.find().then(function (result) {
    var Staff = JSON.parse(JSON.stringify(result));
      res.send({state:200,Staff: Staff,
      });
  }, function (error) {
  });
});

router.post('/getDesk',function(req, res) {
    var f = new AV.Query('Desk');
    var name = req.session.name;
    f.equalTo('belong', name);
    f.include('relation');
    f.find().then(function (result) {
        // for (var i = 0; i < result.length; i++) {
        //     var relation = result[i].get('relation');
        //     //result[i].push(relation);
        // }
        // //console.log(result[1].get('relation'));
     var Desk = JSON.parse(JSON.stringify(result));
      res.send({state:200,Desk: Desk,});
  }, function (error) {
  });
});

router.post('/addRelation',function(req, res) {
    var onStaff = JSON.parse(req.body.onStaff);
    console.log(onStaff);
    var onChoose = JSON.parse(req.body.onChoose);
    console.log(onChoose);
    var relation = AV.Object.createWithoutData('Staff', onStaff.objectId);
    for (var i = 0; i < onChoose.length; i++) {
        var add = AV.Object.createWithoutData('Desk', onChoose[i]);
        add.set('relation',relation);
        add.save();
        if (i == onChoose.length-1) {
           res.send({state:200}); 
        }
    }
});


module.exports = router;