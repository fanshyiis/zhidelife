var express = require('express');
var router = express.Router();
var AV = require('leanengine');

var Rate = AV.Object.extend('Rate');
var findstaff = new AV.Query('Staff');
var finddesk = new AV.Query('Desk');
var findtag = new AV.Query('Tag');

/**
 * 定义路由：获取所有 Todo 列表
 */
var secret = [];
//console.log(secret);

 
router.get('/', function(req, res) {
  res.render('rate');
});

router.post('/secret', function(req, res) {
  var account = req.session.name;
  var rid = RandId();
  secret.push(rid);
  console.log(secret);
  setTimeout(function(){
	deletesecret(rid);
	console.log(secret);
},30000)
  res.send({state:200,secret:rid,account:account});
});

router.post('/getStaff',function(req, res){
    var staffid = req.body.staffid;
    findstaff.equalTo('staffid', staffid);
    findstaff.find().then(function (result) {
    var staff = JSON.parse(JSON.stringify(result));
    var objectId = staff[0].objectId;
    var name = staff[0].StaffName;
    var avatar = staff[0].avatar;
    var staffid = staff[0].staffid;
    res.send({
    	state:200,
    	objectId:objectId,
    	staffid:staffid,
    	name:name,
    	avatar:avatar
    })
  }, function (error) {
  	res.send({state:200,error:error})
  });

})

router.post('/getDesk',function(req, res){
    var deskid = req.body.deskid;
    finddesk.equalTo('deskid', deskid);
    finddesk.find().then(function (result) {
    var desk = JSON.parse(JSON.stringify(result));
    res.send({
    	state:200,
    	desk:desk[0]
    })
  }, function (error) {
  	res.send({state:200,error:error})
  });

})

router.post('/getTag', function(req, res) {
    var account = req.body.account;
    findtag.equalTo('belong', account);
    findtag.find().then(function (result) {
    var allTag = JSON.parse(JSON.stringify(result));
      res.send({state:200,allTag: allTag,
      });
  }, function (error) {
  });
})

router.post('/addRate', function(req, res) {
	var rate = JSON.parse(req.body.rate);
    var UrlArr = JSON.parse(req.body.UrlArr);
    var staffname = req.body.staffname;
    var desk = JSON.parse(req.body.desk);
    var date = getNowFormatDate();
    var sta = new Rate();
    var secretp = UrlArr.secret;
    if (!findsecret(secretp)) {

       console.log("er wei ma guo qi");
       res.send({state: 300})
       return;
    }
    //console.log(rate);
    sta.set('creatdate', date);
    sta.set('rateid',RandId());
    sta.set('creatdate',date);
    sta.set('belong',UrlArr.account);
    sta.set('deskname',desk.DeskName);
    sta.set('deskid',desk.deskid);
    sta.set('staffname',staffname);
    sta.set('staffid',UrlArr.staffid);
    for (var i = 0; i < rate.length; i++) {
    	if (rate[i].b) {
    		sta.set(rate[i].b,rate[i].a);
    	}
        //console.log(rate[i].a)
    	// sta.set(rate[i][1],rate[i][0]);
    }
    sta.save().then(function(e) {
        //console.log('objectId is ' + user.id);
        res.send({ state: 200 });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
});

function RandId() {
    var Num = "";
    for (var i = 0; i < 15; i++) {
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

function findsecret(e){
	var i = secret.length;
	while(i--){
		if (secret[i] === e) {
			return true;
		}
	}
	return false;
}

function deletesecret(e){
	var i = secret.length;
	while(i--){
		if (secret[i] === e) {
			secret.splice(i, 1);
            break;
		}
	}
}

module.exports = router;