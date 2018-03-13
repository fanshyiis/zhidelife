var express = require('express');
var router = express.Router();
var AV = require('leanengine');

var General = AV.Object.extend('General');
var query = new AV.Query('General');

router.get('/login', function(req, res, next) {
    var errMsg = req.query.errMsg;
    res.render('users/login', { title: '用户登录', errMsg: errMsg });
})

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    AV.User.logIn(username, password).then(function(user) {
        res.saveCurrentUser(user);
        res.redirect('/adhome');
    }, function(err) {
        res.redirect('/users/login?errMsg=' + JSON.stringify(err));
    }).catch(next);
});

router.get('/register', function(req, res, next) {
    var errMsg = req.query.errMsg;
    res.render('users/register', { title: '用户注册', errMsg: errMsg });
});

router.post('/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || username.trim().length == 0 || !password || password.trim().length == 0) {
        return res.redirect('/users/register?errMsg=用户名或密码不能为空');
    }
    var user = new AV.User();
    user.set("username", username);
    user.set("password", password);
    user.signUp().then(function(user) {
        res.saveCurrentUser(user);
        res.redirect('/todos');
    }, function(err) {
        res.redirect('/users/register?errMsg=' + JSON.stringify(err));
    }).catch(next);
});

//超级管理员添加用户
router.post('/adduser',requireGotoLogin,function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var orgname = req.body.orgname;
    var note = req.body.note;
    var date = getNowFormatDate();
    query.equalTo('name', username);
    query.find().then(function(user) {
        if (user == '') {
            var general = new General();
            general.set('name', username);
            general.set('password', password);
            general.set('orgname',orgname);
            general.set('note',note);
            general.set('creatTime', date);
            general.set('priority', 1);
            general.save().then(function(user) {
                console.log('objectId is ' + user.id);
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });

        } else {
            //console.log("sss");
            res.send({state:400});
        }
    });
});

//编辑用户
router.post('/edituser',requireGotoLogin,function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var orgname = req.body.orgname;
    var note = req.body.note;
    var date = getNowFormatDate();
    query.equalTo('name', username);
    query.find().then(function(user) {
       var _user = JSON.parse(JSON.stringify(user));
       var id = _user[0].objectId;
       var edit = AV.Object.createWithoutData('General', id);
            edit.set('name', username);
            edit.set('password', password);
            edit.set('orgname',orgname);
            edit.set('note',note);
            edit.set('priority', 1);
            edit.save().then(function(user) {
                console.log('objectId is ' + user.id);
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });

    });
 });

//删除用户
router.post('/deleteuser',requireGotoLogin,function(req, res, next) {

    var username = req.body.username;
    query.equalTo('name', username);
    query.find().then(function(user) {
       var _user = JSON.parse(JSON.stringify(user));
       var id = _user[0].objectId;
       var deleteuser = AV.Object.createWithoutData('General', id);
            deleteuser.destroy().then(function(user) {
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });

    });
});

router.get('/logout', function(req, res, next) {
    req.currentUser.logOut();
    res.clearCurrentUser();
    return res.redirect('/user/login');
})


function requireGotoLogin(req, res, next) {

    if(req.currentUser){
        next();
    }else{
        res.redirect('/login');
    }
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
module.exports = router;
