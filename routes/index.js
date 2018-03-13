var express = require('express');
var router = express.Router();
var AV = require('leanengine');
var axios = require('axios');
var https = require('https');
var WXBizDataCrypt = require('./WXBizDataCrypt')
// var request = require('request');

var LoginLog = AV.Object.extend('LoginLog');
var Zhide = AV.Object.extend('Zhide');
var Theme = AV.Object.extend('Theme');
var Comment = AV.Object.extend('Comment');
var Tag = AV.Object.extend('Tag');
var Comment_co = AV.Object.extend('Comment_co');
var Trends = AV.Object.extend('Trends');


router.get('/', function(req, res) {
    getClientIp(req);
    console.log('ip:' + req.ip);
    res.render('index');
});

router.get('/Newest', function(req, res) {
    res.render('newest');
});

router.get('/testWX', function(req, res) {
    console.log(req.query.code);
    // request('https://api.weixin.qq.com/sns/jscode2session?appid=wx75831db4618ce9a1&secret=b134b633c9678260caf4a10556e68078&js_code=' + req.query.code + '&grant_type=authorization_code', function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     console.log(body)
    //     res.send(body)
    //   }
    // })
    // var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx75831db4618ce9a1&secret=b134b633c9678260caf4a10556e68078&js_code=' + req.query.code + '&grant_type=authorization_code';
    var options = {
        host: 'api.weixin.qq.com',
        path: '/sns/jscode2session?appid=wx75831db4618ce9a1&secret=b134b633c9678260caf4a10556e68078&js_code=' + req.query.code + '&grant_type=authorization_code',
        method: 'GET'
    };

    var req = https.request(options, function(resp) {
        console.log('STATUS: ' + resp.statusCode);
        console.log('HEADERS: ' + JSON.stringify(resp.headers));
        resp.setEncoding('utf8');
        resp.on('data', function(chunk) {
            console.log('BODY: ' + chunk);
            res.send(chunk)
            // sendMessage()
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        res.send(e.message)
        // res.send('newest');
    });
    req.end();
});

router.get('/weRun', function(req, res) {
    var appId = 'wx75831db4618ce9a1'
    var sessionKey = req.query.sessionKey
    var encryptedData = req.query.encryptedData

    var iv = req.query.iv

    var pc = new WXBizDataCrypt(appId, sessionKey)

    var data = pc.decryptData(encryptedData, iv)

    console.log('解密后 data: ', data)
    res.send(data)

});

router.get('/NewZhide', requireGotoLogin, function(req, res) {
    res.render('newZhide');
});

router.post('/SendSmsCode', function(req, res) {
    var PhoneNum = req.body.PhoneNum;
    AV.Cloud.requestSmsCode(PhoneNum).then(function(success) {
        res.send({ state: 200 })
    }, function(error) {
        console.log(error);
    });
});

router.post('/getUser', function(req, res) {
    var user = req.currentUser;
    if (user) { res.send({ state: 200, user: user }) } else {
        res.send({ state: 400 })
    }

});

router.post('/Register', function(req, res) {
    var UserName = req.body.UserName;
    var Pwd = req.body.Pwdreg_1;
    var Nick = req.body.Nick;
    var user = new AV.User();
    user.setUsername(UserName);
    user.setPassword(Pwd);
    user.set('Nick', Nick);
    user.signUp().then(function(success) {
        // 成功
        console.log(success);
        res.send({ state: 200 })
    }, function(error) {
        // 失败
        console.log(error);
        res.send({ state: 4001 });
    });

})

router.post('/getZhide', function(req, res) {
    var query = new AV.Query(Zhide);
    query.descending('createdAt');
    query.limit(10);
    query.include('ZD_belong');
    query.find().then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var belong = result[i].get('ZD_belong');
            var m = JSON.parse(JSON.stringify(belong));
            result[i].attributes.belong = m;
        }
        res.send({ state: 200, zhide: result, date: new Date() })
    }, function(error) {
        res.send({ state: 601, error: error })
    })
})

router.post('/getZhideMore', function(req, res) {
    //console.log(new Date());
    var date = req.body.date;
    var num = req.body.num;
    var query = new AV.Query(Zhide);
    query.lessThanOrEqualTo('createdAt', new Date(date));
    query.descending('createdAt');
    query.limit(10);
    query.skip(num);
    query.include('ZD_belong');
    query.find().then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var belong = result[i].get('ZD_belong');
            var m = JSON.parse(JSON.stringify(belong));
            result[i].attributes.belong = m;
        }
        res.send({ state: 200, zhide: result })
    }, function(error) {
        res.send({ state: 601, error: error })
    })
})

router.post('/getHotZhide', function(req, res) {
    var query = new AV.Query(Zhide);
    query.equalTo('isHot', 'yes');
    query.descending('createdAt');
    query.limit(4);
    query.include('ZD_belong');
    query.find().then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var belong = result[i].get('ZD_belong');
            var m = JSON.parse(JSON.stringify(belong));
            result[i].attributes.belong = m;
        }
        res.send({ state: 200, zhide: result })
    }, function(error) {
        res.send({ state: 601, error: error })
    })
})

router.post('/ThemeZhide', function(req, res) {
    var id = req.body.id;
    console.log(id);
    var theme = AV.Object.createWithoutData('Theme', id);
    var query = new AV.Query('Zhide');
    query.limit(10);
    query.include('ZD_belong');
    query.equalTo('Theme', theme);
    //query.descending('createdAt');
    query.find().then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var belong = result[i].get('ZD_belong');
            var m = JSON.parse(JSON.stringify(belong));
            result[i].attributes.belong = m;
        }
        res.send({ state: 200, zhide: result })
    }, function(error) {
        res.send({ state: 601, error: error })
    });
})

router.get('/Theme/:id', function(req, res) {
    var id = req.params.id;
    res.render('theme', { id: id });
})

router.get('/zhide/:id', function(req, res) {
    var id = req.params.id;
    res.render('zhide', { id: id });
})

router.post('/addPicContent', function(req, res) {
    var pic = { base64: req.body.pic };
    var pic2 = new AV.File(RandId() + '.png', pic);
    pic2.save().then(function(result) {
        res.send({ state: 200, pic: result });
    }, function(error) {
        res.send({ state: 600, error: error });
        console.error(error);
    });


})

router.post('/ThemeInfo', function(req, res) {
    var id = req.body.id;
    var query = new AV.Query('Theme');
    query.include('Theme_belong');
    query.equalTo('objectId', id);
    query.find().then(function(result) {
        var belong = result[0].get('Theme_belong');
        var m = JSON.parse(JSON.stringify(belong));
        result[0].attributes.belong = m;
        res.send({ state: 200, theme: result[0] });
    }, function(error) {
        res.send({ state: 601, error: error })
    })

})

router.post('/zhideContent', function(req, res) {
    var id = req.body.id;
    var query = new AV.Query('Zhide');
    var Zhide2 = AV.Object.createWithoutData('Zhide', id);
    var relation = Zhide2.relation('Tags');
    var query2 = relation.query();
    query.equalTo('objectId', id);
    query.include('ZD_belong');

    query.find().then(function(result) {
        var belong = result[0].get('ZD_belong');
        var m = JSON.parse(JSON.stringify(belong));
        result[0].attributes.belong = m;
        var zhide = result[0];
        var lookNum = result[0].attributes.lookNum;
        console.log(result[0].attributes.lookNum);
        var addzhide = AV.Object.createWithoutData('Zhide', id);
        addzhide.set('lookNum', lookNum + 1);
        addzhide.save();
        query2.find().then(function(results) {
            res.send({ state: 200, zhide: zhide, results: results });
            // results 是一个 AV.Object 的数组，它包含所有当前 todoFolder 的 tags
        }, function(error) {});

    }, function(error) {
        res.send({ state: 601, error: error })
    })

})

router.post('/getTheme', function(req, res) {
    var query = new AV.Query(Theme);
    query.descending('createdAt');
    query.limit(10);
    query.find().then(function(result) {
        res.send({ state: 200, theme: result })
    }, function(error) {
        res.send({ state: 601, error: error })
    })
})

router.post('/getThemeHot', function(req, res) {
    var query = new AV.Query(Theme);
    query.descending('createdAt');
    query.limit(7);
    query.find().then(function(result) {
        res.send({ state: 200, theme: result })
    }, function(error) {
        res.send({ state: 601, error: error })
    })
})

router.post('/CommentZan', function(req, res) {
    var user = req.currentUser;

    if (!user) {
        res.send({ state: 400, error: "亲！请登录再赞哦" })
    }
    var id = req.body.id;
    var zan = AV.Object.createWithoutData('Comment', id);
    zan.addUnique('Zan_arr', user.id);
    zan.save().then(function(e) {
        var l = e.attributes.Zan_arr.length;
        res.send({ state: 200, length: l })
    }, function(error) {
        res.send({ state: 400, error: error })
    });

})

router.post('/FollowZhide', function(req, res) {
    var user = req.currentUser;
    if (!user) {
        res.send({ state: 400, error: "亲！请登录再关注哦" })
    }
    var time = req.body.time;
    var id = req.body.id;
    var follow = AV.Object.createWithoutData('_User', user.id);
    follow.addUnique('Follow_Zhide', id);
    follow.save().then(function(e) {
        var query = new AV.Query('Zhide');
        query.get(id).then(function(zhide) {
                var trends = new Trends();
                trends.set("Type", 'followzhide');
                trends.set('belong_user', zhide.get("ZD_belong"));
                trends.set('belong_zhide', zhide);
                trends.set("Time", time);
                trends.set("belong_author", user);
                trends.save().then(function(mm) {

                }, function(error) {
                    console.error(error);

                });
                res.send({ state: 200 });
            }),
            function(error) {
                res.send({ state: 400, error: error })
            }
    });

})

router.post('/FollowUser', function(req, res) {
    var user = req.currentUser;
    if (!user) {
        res.send({ state: 400, error: "亲！请登录再关注哦" })
    }
    var id = req.body.id;
    var follow = AV.Object.createWithoutData('_User', user.id);
    follow.addUnique('Follow_User', id);
    follow.save().then(function(e) {
        res.send({ state: 200 })
    }, function(error) {
        res.send({ state: 400, error: error })
    });

})

router.post('/FollowTheme', function(req, res) {
    var user = req.currentUser;
    if (!user) {
        res.send({ state: 400, error: "亲！请登录再关注哦" })
    }
    var id = req.body.id;
    var follow = AV.Object.createWithoutData('_User', user.id);
    follow.addUnique('Follow_Theme', id);
    follow.save().then(function(e) {
        res.send({ state: 200 })
    }, function(error) {
        res.send({ state: 400, error: error })
    });

})


router.post('/zhide', function(req, res) {
    //console.log('zhi--------------');
    var user = req.currentUser;
    var id = req.body.id;
    var tag = req.body.tag;
    var query = new AV.Query(Zhide);
    query.equalTo('objectId', id);
    query.find().then(function(result) {
        var rr = JSON.parse(JSON.stringify(result));
        var zhide = rr[0].zhide;
        //console.log(zhide);
        var Unzhide = rr[0].Unzhide;
        //console.log(Unzhide);
        var userO = JSON.parse(JSON.stringify(user));
        var ZD_userArr = rr[0].ZD_userArr;
        var UZD_userArr = rr[0].UZD_userArr;
        if (tag == 1) {
            Unzhide = Unzhide - 1;
            for (var i = 0; i < UZD_userArr.length; i++) {
                if (UZD_userArr[i] == userO.objectId) {
                    UZD_userArr.splice(i, 1);

                }
            }
        };
        ZD_userArr.push(userO.objectId);
        var addzhide = AV.Object.createWithoutData('Zhide', id);
        //console.log(ZD_userArr);
        addzhide.set('UZD_userArr', UZD_userArr);
        addzhide.set('ZD_userArr', ZD_userArr);
        //console.log(zhide+1);
        addzhide.set('zhide', zhide + 1);
        addzhide.set('Unzhide', Unzhide);
        //console.log(Unzhide);
        addzhide.save().then(function(user) {
            res.send({ state: 200 });
        }, function(error) {
            res.send({ state: 600, error: error });
            console.error(error);
        });
    }, function(error) {
        res.send({ state: 600, error: error });
    });
})

router.post('/unzhide', function(req, res) {
    //console.log('un--------------');
    var user = req.currentUser;
    var id = req.body.id;
    var tag = req.body.tag;
    var query = new AV.Query(Zhide);
    query.equalTo('objectId', id);
    query.find().then(function(result) {
        var rr = JSON.parse(JSON.stringify(result));
        var Unzhide = rr[0].Unzhide;
        var zhide = rr[0].zhide;
        //console.log(zhide);
        //console.log(Unzhide);
        var userO = JSON.parse(JSON.stringify(user));
        var ZD_userArr = rr[0].ZD_userArr;
        var UZD_userArr = rr[0].UZD_userArr;
        if (tag == 2) {
            zhide = zhide - 1;
            for (var i = 0; i < ZD_userArr.length; i++) {
                if (ZD_userArr[i] == userO.objectId) {
                    ZD_userArr.splice(i, 1);

                }
            }
        };
        UZD_userArr.push(userO.objectId);
        var addzhide = AV.Object.createWithoutData('Zhide', id);
        addzhide.set('ZD_userArr', ZD_userArr);
        addzhide.set('UZD_userArr', UZD_userArr);
        addzhide.set('Unzhide', Unzhide + 1);
        //console.log(zhide);
        //console.log(Unzhide+1);
        addzhide.set('zhide', zhide);
        addzhide.save().then(function(user) {
            res.send({ state: 200 });
        }, function(error) {
            res.send({ state: 600, error: error });
            console.error(error);
        });
    }, function(error) {
        res.send({ state: 600, error: error });
    });
})

router.post('/Login', function(req, res) {
    var UserName = req.body.UserName;
    var Pwd = req.body.Pwd;
    AV.User.logIn(UserName, Pwd).then(function(loginedUser) {
        var user = JSON.parse(JSON.stringify(loginedUser));
        res.saveCurrentUser(loginedUser);
        res.send({ state: 200, user: user })
        console.log(loginedUser);
    }, (function(error) {
        console.log(error);
        res.send({ state: 4003 })
    }));
})

router.get('/logout', function(req, res, next) {
    req.currentUser.logOut();
    res.clearCurrentUser();
    return res.redirect('/index/newest');
})



router.post('/addNewPing', function(req, res) {
    var bid = req.body.bid;
    var user = req.currentUser;
    var time = req.body.Time;
    var ZD_content = req.body.ZD_content;
    var heart = req.body.heart;
    var zhideid = req.body.zhide;
    var zhide = AV.Object.createWithoutData('Zhide', zhideid);
    var comment = new Comment();
    comment.set('Belong', user);
    comment.set('Time', time);
    comment.set('Zhide', zhide);
    comment.set('Content', ZD_content);
    comment.set('Rate', heart);
    comment.save().then(function(e) {
        var beid = AV.Object.createWithoutData('_User', bid);
        var trends = new Trends();
        trends.set("Type", 'comment');
        trends.set('belong_user', beid);
        trends.set('belong_zhide', zhide);
        trends.set("Time", time);
        trends.set("belong_author", user);
        trends.set("commentid", e);
        trends.save().then(function(mm) {
            console.log(mm)
        }, function(error) {
            console.error(error);

        });
        zhide.add("Rate", heart);
        zhide.save().then(function(e) {}, function(error) {});;

        res.send({ state: 200 });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
})

router.post('/getComment', function(req, res) {
    var id = req.body.id;
    var zhide = AV.Object.createWithoutData('Zhide', id);
    var query = new AV.Query('Comment');
    query.include('Belong');
    query.descending('createdAt');
    query.equalTo('Zhide', zhide);
    query.find().then(function(result) {
        if (!result) {
            res.send({ state: 403 });
        }
        for (var i = 0; i < result.length; i++) {

            (function(e) {
                var m = 'm' + e
                var m = new AV.Query('Comment_co');
                //console.log(result[i].id);
                var c = AV.Object.createWithoutData('Comment', result[e].id);
                //console.log(c)
                m.equalTo('belong_comment', c);
                m.count().then(function(count) {

                    result[e].attributes.count = count;
                    var l = result.length - 1
                    if (e == l) {
                        res.send({ state: 200, comment: result });
                    }

                }, function(error) {
                    console.log(error)
                });
                var belong = result[e].get('Belong');
                var m = JSON.parse(JSON.stringify(belong));
                result[e].attributes.belong = m;
                result[e].attributes.comment_list = [];
                if (!result[e].attributes.Zan_arr) {
                    result[e].attributes.Zan_arr = [];
                }
            })(i)
        }

    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
})

router.post('/getCoCo', function(req, res) {
    var id = req.body.id;
    var comment = AV.Object.createWithoutData('Comment', id);
    var query = new AV.Query('Comment_co');
    query.include('belong_user');
    query.descending('createdAt');
    query.equalTo('belong_comment', comment);
    query.find().then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var belong = result[i].get('belong_user');
            var m = JSON.parse(JSON.stringify(belong));
            result[i].attributes.belong = m;
        }
        res.send({ state: 200, comment: result });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
})

router.post('/addNewZD', function(req, res) {
    var user = req.currentUser;
    var time = req.body.Time;
    var mainPic = { base64: req.body.UserPic };
    var ZD_title = req.body.ZD_title;
    var ZD_summary = req.body.ZD_summary;
    var ZD_content = req.body.ZD_content;
    var pic = new AV.File(RandId() + '.png', mainPic);
    var zhide = new Zhide();
    zhide.set('ZD_belong', user);
    zhide.set('Time', time);
    zhide.set('mainPic', pic);
    zhide.set('ZD_title', ZD_title);
    zhide.set('ZD_content', ZD_content);
    zhide.set('ZD_summary', ZD_summary);
    zhide.set('Unzhide', 0);
    zhide.set('zhide', 0);
    zhide.set('lookNum', 0);
    zhide.set('comment', '');
    zhide.set('ZD_userArr', []);
    zhide.set('UZD_userArr', []);
    zhide.save().then(function(e) {
        //console.log(JSON.parse(JSON.stringify(e)));
        res.send({ state: 200, zhide: e });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
})


router.post('/addCo_Co', function(req, res) {
    var user = req.currentUser;
    if (!user) {
        res.send({ state: 400 });
        return false
    }
    var id = req.body.id;
    var time = req.body.time;
    var commentid = req.body.commentid;
    var comment_co = req.body.comment_co;
    var zhide = AV.Object.createWithoutData('Zhide', id);
    var coid = AV.Object.createWithoutData('Comment', commentid);
    var comment = new Comment_co();
    comment.set('belong_user', user);
    comment.set('belong_zhide', zhide);
    comment.set('belong_comment', coid);
    comment.set('Time', time);
    comment.set('content', comment_co);
    comment.save().then(function(e) {
        var query = new AV.Query('Comment');
        query.get(commentid).then(function(comment) {
            var trends = new Trends();
            trends.set("Type", 'comment_co');
            trends.set('belong_user', comment.get("Belong"));
            trends.set('belong_zhide', zhide);
            trends.set("Time", time);
            trends.set("belong_author", user);
            trends.set("comment_co_id", e);
            trends.save().then(function(mm) {

            }, function(error) {
                console.error(error);

            });
            // 成功获得实例
            // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
        }, function(error) {
            // 异常处理
        });

        //console.log(JSON.parse(JSON.stringify(e)));
        res.send({ state: 200 });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
})


router.post('/addToZhide', function(req, res) {
    var id = req.body.id;
    var tag_arr = JSON.parse(req.body.tag_arr);
    var arr = [];
    for (var i = 0; i < tag_arr.length; i++) {
        var m = 'm' + i;
        m = new Tag();
        m.set('tag', tag_arr[i]);
        arr.push(m);
    }
    var checktheme = req.body.checktheme;
    var theme = AV.Object.createWithoutData('Theme', checktheme);
    var zhide = AV.Object.createWithoutData('Zhide', id);
    zhide.set('Theme', theme);
    AV.Object.saveAll(arr).then(function() {
        var relation = zhide.relation('Tags'); // 创建 AV.Relation
        arr.map(relation.add.bind(relation));
        return zhide.save(); // 保存到云端
    }).then(function(todoFolder) {
        res.send({ state: 200 })
        // 保存成功
    }, function(error) {
        // 异常处理
        res.send({ state: 400, error: error })
    });


})

router.post('/addNewTheme', function(req, res) {
    var user = req.currentUser;
    var time = req.body.Time;
    var mainPic = { base64: req.body.ThemePic };
    var Theme_title = req.body.Theme_title;
    var Theme_summary = req.body.Theme_summary;
    var pic = new AV.File(RandId() + '.png', mainPic);
    var theme = new Theme();
    theme.set('Theme_belong', user);
    theme.set('Time', time);
    theme.set('mainPic', pic);
    theme.set('Theme_title', Theme_title);
    theme.set('Theme_summary', Theme_summary);
    theme.set('zhideNum', 0);
    theme.set('ACT_userArr', []);
    theme.save().then(function(e) {

        res.send({ state: 200, theme: JSON.parse(JSON.stringify(e)) });
    }, function(error) {
        console.error(error);
        res.send({ state: 400 });
    });
})

function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

function RandId() {
    var Num = "";
    for (var i = 0; i < 9; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num
}

function requireGotoLogin(req, res, next) {

    if (req.currentUser) {
        next();
    } else {
        res.redirect('/index');
    }
}

function getClientIp(req) {
    var m = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var log = new LoginLog();
    log.set("IP2", req.ip);
    log.set("IP", m);
    log.set('OS', req.headers['user-agent']);
    log.save().then(function(mm) {

    }, function(error) {
        console.error(error);

    });
    //console.log(req.headers['user-agent']);

    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

};


module.exports = router;