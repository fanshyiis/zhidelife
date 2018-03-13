var express = require('express');
var router = express.Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Dog = AV.Object.extend('Dog');

router.post('/getNewDog', function(req, res, next) {
    var objects = [];
    for (var i = 1; i < 10; i++) {
        var sex = Math.random() > 0.5 ? 0 : 1;
        var dog = new Dog();
        var belong = AV.Object.createWithoutData('_User', req.body.belong.objectId)
        dog.set('belong', belong);
        dog.set('Did', 1111);
        dog.set('attr1', 100);
        dog.set('attr2', 100);
        dog.set('attr3', 100);
        dog.set('attr4', 100);
        dog.set('attr5', 100);
        dog.set('birthday', new Date());
        dog.set('sex', sex);
        dog.set('name', 'GOD');
        dog.set('state', 0);
        dog.set('dis', null);
        objects.push(dog)
    }
    //随机
    AV.Object.saveAll(objects).then(function (todo) {
      // 成功保存之后，执行其他逻辑.
      res.send({code: 200})
    }, function (error) {
      // 异常处理
      res.send({code: 400})
      console.log(error)
    });
});


AV.Cloud.define('averageStars', function(req, res) {
    // console.log('===接受到====')
    // var objects = []
    console.log(req.params)
    // for (var i = 1; i < 10; i++) {
    //     var sex = Math.random() > 0.5 ? 0 : 1;
    //     var dog = new Dog();
    //     dog.set('belong', req.currentUser);
    //     dog.set('Did', 100000000);
    //     dog.set('attr1', 100);
    //     dog.set('attr2', 100);
    //     dog.set('attr3', 100);
    //     dog.set('attr4', 100);
    //     dog.set('attr5', 100);
    //     dog.set('birthday', new Date());
    //     dog.set('sex', sex);
    //     dog.set('name', 'GOD');
    //     dog.set('state', 0);
    //     dog.set('dis', null);
    //     objects.push(dog)
    // }

    // 随机
    res.success('200')
    // return AV.Object.saveAll(objects).then(function (todo) {
    //   // 成功保存之后，执行其他逻辑.
    //   res.success('200')
    // }, function (error) {
    //   // 异常处理
    //   res.success('400')
    // });
});


module.exports = router;