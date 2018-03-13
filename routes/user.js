var express = require('express');
var router = express.Router();
var AV = require('leanengine');

var Zhide = AV.Object.extend('Zhide');
var Mail = AV.Object.extend('Mail');

router.get('/',requireGotoLogin, function(req, res) {
  var user = req.currentUser; 
  res.render('user');
});




router.post('/addSigna',function(req,res){
	var Signa = req.body.Signa;
	var id = req.currentUser.id;
	var user = AV.Object.createWithoutData('_User', id);
    user.set('Signature', Signa);
    user.save().then(function (todo) {
    	res.send({state:200})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})

router.post('/getUserZhide',function(req,res){
	var id = req.currentUser.id;
	var user = AV.Object.createWithoutData('_User', id);
	var query = new AV.Query('Zhide');
	query.equalTo('ZD_belong', user);
	query.include('ZD_belong');
    query.find().then(function (result) {
    	for (var i = 0; i < result.length; i++) {
          var belong = result[i].get('ZD_belong');
          var m = JSON.parse(JSON.stringify(belong));
          result[i].attributes.belong = m;
        }
    	res.send({state:200,zhide:result})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})

router.post('/CheckUser',function(req,res){
    var id = req.body.id;
	var query = new AV.Query('_User');
	query.equalTo('UserId', parseInt(id));
    query.find().then(function (result) {
    	if (result.length != 0) {
    		var m = result[0].attributes.Nick;
    		res.send({state:200,check:m,toid:result[0].id})
    	}else{
    		res.send({state:404})
    	}
    	
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    console.log(error)
    res.send({state:400})
  });
})



router.post('/getTrends',function(req,res){
	var id = req.currentUser.id;
	var user = AV.Object.createWithoutData('_User', id);
	var query = new AV.Query('Trends');
	query.descending('createdAt');
	query.equalTo('belong_user', user);
	query.include('commentid');
	query.include('comment_co_id');
	query.include('belong_author');
    query.include('belong_zhide');
    query.find().then(function (result) {
    	for (var i = 0; i < result.length; i++) {
    	  //console.log(result[i].get('commentid'))
    	  if (result[i].get('commentid')) {
    	  	var comment = result[i].get('commentid');
    	  	var m1 = JSON.parse(JSON.stringify(comment));
     	  	result[i].attributes.comment = m1;
    	  }	

    	  if (result[i].get('comment_co_id')) {
    	  	
    	  	var comment_co = result[i].get('comment_co_id');
    	  	var m2 = JSON.parse(JSON.stringify(comment_co));
    	  	result[i].attributes.comment_co = m2;
    	  	
    	  }
          
          if (result[i].get('belong_author')) {
          	var author = result[i].get('belong_author');                   
          var m3 = JSON.parse(JSON.stringify(author));       
          result[i].attributes.author = m3;
          }
          var zhide  = result[i].get('belong_zhide');
          var m4 = JSON.parse(JSON.stringify(zhide));
          result[i].attributes.zhide = m4;
       
        }
    	res.send({state:200,trends:result})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})

router.post('/getFollowTheme',function(req,res){	
	var id = req.currentUser.id;
	var theme = JSON.parse(req.body.Theme);
	
	var re = [];
	for (var i = 0; i < theme.length; i++) {
		(function(e){
		var query = new AV.Query('Theme');
		query.equalTo('objectId', theme[e]);
		query.find().then(function (result) {
		 	var m = JSON.parse(JSON.stringify(result[0]));
	
         re.push(m);
         if (re.length == theme.length) {
         	res.send({state:200,followtheme:re})
         }
		 
		 
         }, function (error) {
         	console.log(error)
       });
		})(i)
		
		
	}
	
	// var m = JSON.parse(JSON.stringify(arr));
	// // var query = new AV.Query('Theme');
	// for (var i = 0; i < arr1.length; i++) {
	// 	console.log(arr1[i])
	// }
	// query.equalTo('Belong', user);
	// query.include('Zhide');

})

router.post('/getFollowZhide',function(req,res){
	var id = req.currentUser.id;
	var zhide = JSON.parse(req.body.Zhide);
	var re = [];
	for (var i = 0; i < zhide.length; i++) {
		(function(e){
		var query = new AV.Query('Zhide');
		query.equalTo('objectId', zhide[e]);
		query.include('ZD_belong');
		query.find().then(function (result) {
		
          var belong = result[0].get('ZD_belong');
          var m1 = JSON.parse(JSON.stringify(belong));
          result[0].attributes.belong = m1;
        
		  var m = JSON.parse(JSON.stringify(result[0]));
		 //console.log(theme[e])
         re.push(m);
         if (re.length == zhide.length) {
         	res.send({state:200,followzhide:re})
         }
         }, function (error) {
       });
		})(i)
		
		
	}
	

})



router.post('/getUserComment',function(req,res){
	var id = req.currentUser.id;
	var user = AV.Object.createWithoutData('_User', id);
	var query = new AV.Query('Comment');
	query.equalTo('Belong', user);
	query.include('Zhide');
	query.descending('createdAt');
    query.find().then(function (result) {
    	for (var i = 0; i < result.length; i++) {
          var belong = result[i].get('Zhide');
          var m = JSON.parse(JSON.stringify(belong));
          result[i].attributes.zbelong = m;
        }
    	res.send({state:200,comment:result})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})

router.post('/getMails',function(req,res){
	var id = req.currentUser.id;
	var user = AV.Object.createWithoutData('_User', id);
	var query = new AV.Query('Mail');
	query.equalTo('to', user);
	query.include('autor');
	query.descending('createdAt');
    query.find().then(function (result) {
    	
    	for (var i = 0; i < result.length; i++) {
          var belong = result[i].get('autor');
          var m = JSON.parse(JSON.stringify(belong));
          result[i].attributes.author = m;
        }
    	res.send({state:200,mail:result})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})

router.post('/getMyMails',function(req,res){
	var id = req.currentUser.id;
	var user = AV.Object.createWithoutData('_User', id);
	var query = new AV.Query('Mail');
	query.equalTo('autor', user);
	query.include('to');
	query.descending('createdAt');
    query.find().then(function (result) {
    	for (var i = 0; i < result.length; i++) {
          var belong = result[i].get('to');
          var m = JSON.parse(JSON.stringify(belong));
          result[i].attributes.author = m;
        }
    	res.send({state:200,mail:result})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})

router.post('/updateInfo',function(req,res){
	var Nick = req.body.Nick;
	var Sex = req.body.Sex;
	var Xing = req.body.Xing;
	var Adress = req.body.Adress;
	var Job = req.body.Job;
	var mobilePhoneNumber = req.body.mobilePhoneNumber;
	var id = req.currentUser.id;
	var user = AV.Object.createWithoutData('_User', id);
    user.set('Nick', Nick);
    user.set('Sex', Sex);
    user.set('Xing', Xing);
    user.set('Adress', Adress);
    user.set('Job', Job);
    //user.set('mobilePhoneNumber', mobilePhoneNumber);
    user.save().then(function (todo) {
    	res.send({state:200})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})

router.post('/ReadMail',function(req,res){
	var id = req.body.id;
	var mail = AV.Object.createWithoutData('Mail', id);
    mail.set('state', 1);
    //user.set('mobilePhoneNumber', mobilePhoneNumber);
    mail.save().then(function (todo) {
    	res.send({state:200})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})


router.post('/updateAvatar',function(req,res){
	var avatarPic = {base64:req.body.avatarPic};
	var pic = new AV.File( RandId() +'.png',avatarPic);
	var id = req.currentUser.id;
	var user = AV.Object.createWithoutData('_User', id);
    user.set('avatar', pic);
    //user.set('mobilePhoneNumber', mobilePhoneNumber);
    user.save().then(function (todo) {
    	res.send({state:200})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})


router.post('/addHeadPic',function(req,res){
	var pic = {base64:req.body.pic};
	var pic2 = new AV.File( RandId() +'.png',pic);
	var id = req.currentUser.id;
	var user = AV.Object.createWithoutData('_User', id);
    user.set('Head_Pic', pic2);
    user.save().then(function (todo) {
    	res.send({state:200})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})

router.post('/sendMail',function(req,res){
	var toid = req.body.mailid;
	var mail_content = req.body.mail_content;
	var user = req.currentUser;
	var user2 = AV.Object.createWithoutData('_User', toid);
    var mail = new Mail();
    mail.set('autor', user);
    mail.set('to', user2);
    mail.set('state',0);
    mail.set('content',mail_content);
    mail.save().then(function (todo) {
    	res.send({state:200})
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
    res.send({state:400})
  });
})

function requireGotoLogin(req, res, next) {

    if (req.currentUser) {
        next();
    } else {
        res.redirect('/index');
    }
}

function RandId() {
    var Num = "";
    for (var i = 0; i < 9; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num
}

module.exports = router;