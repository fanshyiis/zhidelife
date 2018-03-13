var express = require('express');
var router = express.Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Staff = AV.Object.extend('Staff');
var Tag = AV.Object.extend('Tag');
var StaffClass = AV.Object.extend('StaffClass');
var DeskClass = AV.Object.extend('DeskClass');
var Store = AV.Object.extend('Store');
var Desk = AV.Object.extend('Desk');
var findclass = new AV.Query('StaffClass');
var findstore = new AV.Query('Store');
var findtag = new AV.Query('Tag');
var findstaff = new AV.Query('Staff');
var finddesk = new AV.Query('DeskClass');
var fdesk = new AV.Query('Desk');


/**
 * 定义路由：获取所有 Todo 列表
 */
router.get('/', function(req, res) {
    res.render('manager');
});

router.get('/home', requireGotoLogin, function(req, res) {
    console.log(req.session.id);
    res.render('home', { username: req.session.name });
});

router.get('/logout', function(req, res, next) {
    req.session.name = '';
    req.session.id='';
    res.clearCurrentUser();
    return res.redirect('/manager');
})

router.get('/managerStaff', requireGotoLogin, function(req, res) {
    //console.log(req.session.id);
    res.render('managerStaff', { username: req.session.name });
});

router.get('/managerDesk', requireGotoLogin, function(req, res) {
    //console.log(req.session.id);
    res.render('managerDesk', { username: req.session.name });
});

router.get('/addStaffClass', requireGotoLogin, function(req, res) {
    console.log(req.session.id);
    res.render('addStaffClass', { username: req.session.name });
});

router.post('/addSfClass', requireGotoLogin, function(req, res) {
    var classname = req.body.StaffClassname;
    var sta = new StaffClass();
    var date = getNowFormatDate();
    var belong = req.session.name;
    sta.set('classname', classname);
    sta.set('classid',RandId());
    sta.set('creatdate',date);
    sta.set('belong',belong);
    sta.save().then(function(e) {
        //console.log('objectId is ' + user.id);
        res.send({ state: 200 });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
});

router.post('/addDeskClass', requireGotoLogin, function(req, res) {
    var classname = req.body.DeskClassname;
    var sta = new DeskClass();
    var date = getNowFormatDate();
    var belong = req.session.name;
    sta.set('deskclassname', classname);
    sta.set('deskclassid',RandId());
    sta.set('creatdate',date);
    sta.set('belong',belong);
    sta.save().then(function(e) {
        //console.log('objectId is ' + user.id);
        res.send({ state: 200 });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
});

router.post('/addStore', requireGotoLogin, function(req, res) {
    var storename = req.body.Storename;
    var addstore = new Store();
    var date = getNowFormatDate();
    var belong = req.session.name;
    addstore.set('storename', storename);
    addstore.set('storeid',RandId());
    addstore.set('creatdate',date);
    addstore.set('belong',belong);
    addstore.save().then(function(e) {
        //console.log('objectId is ' + user.id);
        res.send({ state: 200 });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
});

router.post('/addTag', requireGotoLogin, function(req, res) {
    var tagname = req.body.Tagname;
    var addtag = new Tag();
    var date = getNowFormatDate();
    var belong = req.session.name;
    addtag.set('tagname', tagname);
    addtag.set('tagid',RandId());
    addtag.set('creatdate',date);
    addtag.set('belong',belong);
    addtag.save().then(function(e) {
        //console.log('objectId is ' + user.id);
        res.send({ state: 200 });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
});

router.post('/getStaffClass', requireGotoLogin, function(req, res) {
    var name = req.session.name
    findclass.equalTo('belong', name);
    findclass.find().then(function (result) {
    var allClass = JSON.parse(JSON.stringify(result));
      res.send({state:200,allClass: allClass,
      });
  }, function (error) {
  });
});

router.post('/getDeskClass', requireGotoLogin, function(req, res) {
    var name = req.session.name
    finddesk.equalTo('belong', name);
    finddesk.find().then(function (result) {
    var allClass = JSON.parse(JSON.stringify(result));
      res.send({state:200,allDeskClass: allClass,
      });
  }, function (error) {
  });
});

router.post('/getStore', requireGotoLogin, function(req, res) {
    var name = req.session.name
    findstore.equalTo('belong', name);
    findstore.find().then(function (result) {
    var allStore = JSON.parse(JSON.stringify(result));
      res.send({state:200,allStore: allStore,
      });
  }, function (error) {
  });
});

router.post('/getTag', requireGotoLogin, function(req, res) {
    var name = req.session.name
    findtag.equalTo('belong', name);
    findtag.find().then(function (result) {
    var allTag = JSON.parse(JSON.stringify(result));
      res.send({state:200,allTag: allTag,
      });
  }, function (error) {
  });
});

router.post('/getStaff', requireGotoLogin, function(req, res) {
    var name = req.session.name
    findstaff.equalTo('belong', name);
    findstaff.find().then(function (result) {
    var Staff = JSON.parse(JSON.stringify(result));
      res.send({state:200,Staff: Staff,
      });
  }, function (error) {
  });
});

router.post('/getDesk', requireGotoLogin, function(req, res) {
    var name = req.session.name
    fdesk.equalTo('belong', name);
    fdesk.find().then(function (result) {
    var Desk = JSON.parse(JSON.stringify(result));
      res.send({state:200,Desk: Desk,
      });
  }, function (error) {
  });
});


router.post('/deleteClass', requireGotoLogin, function(req, res) {
    var query = new AV.Query('StaffClass');
    var classid = req.body.classid;
    query.equalTo('classid', classid);
    query.find().then(function (result) {
    var allClass = JSON.parse(JSON.stringify(result));
    var id = allClass[0].objectId;
    var deleteuser = AV.Object.createWithoutData('StaffClass', id);
            deleteuser.destroy().then(function(user) {
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });
  }, function (error) {
  });
});

router.post('/deleteDeskClass', requireGotoLogin, function(req, res) {
    var query = new AV.Query('DeskClass');
    var classid = req.body.deskclassid;
    query.equalTo('deskclassid', classid);
    query.find().then(function (result) {
    var allClass = JSON.parse(JSON.stringify(result));
    var id = allClass[0].objectId;
    var deleteuser = AV.Object.createWithoutData('DeskClass', id);
            deleteuser.destroy().then(function(user) {
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });
  }, function (error) {
  });
});


router.post('/deleteStore', requireGotoLogin, function(req, res) {
    var query = new AV.Query('Store');
    var storeid = req.body.storeid;
    query.equalTo('storeid', storeid);
    query.find().then(function (result) {
    var allClass = JSON.parse(JSON.stringify(result));
    var id = allClass[0].objectId;
    var deleteuser = AV.Object.createWithoutData('Store', id);
            deleteuser.destroy().then(function(user) {
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });
  }, function (error) {
  });
});


router.post('/deleteTag', requireGotoLogin, function(req, res) {
    var query = new AV.Query('Tag');
    var tagid = req.body.tagid;
    query.equalTo('tagid', tagid);
    query.find().then(function (result) {
    var allClass = JSON.parse(JSON.stringify(result));
    var id = allClass[0].objectId;
    var deleteuser = AV.Object.createWithoutData('Tag', id);
            deleteuser.destroy().then(function(user) {
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });
  }, function (error) {
  });
});

router.post('/editClass', requireGotoLogin, function(req, res) {
    var query = new AV.Query('StaffClass');
    var classid = req.body.classid;
    var classname = req.body.classname;
    query.equalTo('classid', classid);
    query.find().then(function (result) {
    var allClass = JSON.parse(JSON.stringify(result));
    var id = allClass[0].objectId;
    var editClass = AV.Object.createWithoutData('StaffClass', id);
            editClass.set('classname',classname);
            editClass.save().then(function(user) {
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });
  }, function (error) {
  });
});

router.post('/editDeskClass', requireGotoLogin, function(req, res) {
    var query = new AV.Query('DeskClass');
    var classid = req.body.deskid;
    var classname = req.body.deskname;
    query.equalTo('deskclassid', classid);
    query.find().then(function (result) {
    var allClass = JSON.parse(JSON.stringify(result));
    var id = allClass[0].objectId;
    var editClass = AV.Object.createWithoutData('DeskClass', id);
            editClass.set('deskclassname',classname);
            editClass.save().then(function(user) {
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });
  }, function (error) {
  });
});

router.post('/editStore', requireGotoLogin, function(req, res) {
    var query = new AV.Query('Store');
    var storeid = req.body.storeid;
    var storename = req.body.storename;
    query.equalTo('storeid', storeid);
    query.find().then(function (result) {
    var allStore = JSON.parse(JSON.stringify(result));
    var id = allStore[0].objectId;
    var editStore = AV.Object.createWithoutData('Store', id);
            editStore.set('storename',storename);
            editStore.save().then(function(user) {
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });
  }, function (error) {
  });
});


router.post('/editTag', requireGotoLogin, function(req, res) {
    var query = new AV.Query('Tag');
    var tagid = req.body.tagid;
    var tagname = req.body.tagname;
    query.equalTo('tagid', tagid);
    query.find().then(function (result) {
    var allTag = JSON.parse(JSON.stringify(result));
    var id = allTag[0].objectId;
    var editTag = AV.Object.createWithoutData('Tag', id);
            editTag.set('tagname',tagname);
            editTag.save().then(function(user) {
                res.send({state:200});
            }, function(error) {
                console.error(error);
            });
  }, function (error) {
  });
});


router.post('/login', function(req, res, next) {
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
                res.redirect('/manager/home');
            } else {
                res.send({ state: 400, error: '密码错误' });
            }
        }
    });
});

router.post('/addStaff',requireGotoLogin,function(req, res){
    var store = req.body.checkStore;
    var sclass = req.body.checkClass;
    var img = req.body.UserPic;
    var name = req.body.Staffname;
    var data = { base64: img};
    var rid = RandId();
    var belong = req.session.name;
    var classid = req.body.classid;
    var storeid = req.body.storeid;
    var avatar = new AV.File( rid +'.png',data);
    var add = new Staff();
    //var storeclass = AV.Object.createWithoutData('Store', store);
    //console.log(storeclass);
    add.set('StaffName',name);
    add.set('Class',sclass);
    add.set('Store',store);
    add.set('ClassId',classid);
    add.set('StoreId',storeid);
   // add.set('storeinfo',storeclass);
    add.set('belong',belong);
    add.set('staffid',rid);
    add.set('avatar',avatar);
    add.save().then(function(e) {
        //console.log(JSON.parse(JSON.stringify(e)));
        res.send({ state: 200 });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
});

router.post('/addDesk',requireGotoLogin,function(req, res){
    var store = req.body.checkStore;
    var sclass = req.body.checkDeskClass;
    var name = req.body.deskname;
    var rid = RandId();
    var belong = req.session.name;
    var classid = req.body.deskclassid;
    var storeid = req.body.storeid;
    var add = new Desk();
    add.set('DeskName',name);
    add.set('DeskClass',sclass);
    add.set('Store',store);
    add.set('DeskClassId',classid);
    add.set('StoreId',storeid);
    add.set('belong',belong);
    add.set('deskid',rid);
    add.save().then(function(e) {
        //console.log(JSON.parse(JSON.stringify(e)));
        res.send({ state: 200 });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
})

function requireGotoLogin(req, res, next) {

    if (req.session.name.length >2) {
        next();
    } else {
        res.redirect('/manager');
    }
}

function RandId() {
    var Num = "";
    for (var i = 0; i < 9; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num
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
