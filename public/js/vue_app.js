var vm = new Vue({
    el: ".vue",
    data: {
        addPic:'',
        NewTheme:'',
        user: '',
        UserName: '',
        Nick: '',
        PhoneNum: '',
        Pwdreg_1: '',
        Pwdreg_2: '',
        SmsCode: '',
        SendBtn: '发送验证码',
        addPicText:'添加图片',
        wait: 60,
        Pwd: '',
        UserPic:'',
        Time:'',
        ZD_title:'',
        ZD_summary:'',
        ZD_content:'',
        errors:'',
        okBtn:0,
        ThemePic:'',
        Theme_title:'',
        Theme_summary:'',
        okThemeBtn:0,
        Theme:'',
        checktheme:'',
        OkZhide:'',
        tag_arr:[],
        tag:''
    },
    methods: {
        addtag:function(){
           this.tag_arr.push(this.tag);
           this.tag = '';
        },
        SendSmsCode: function() {
            var _this = this;
            if (!this.PhoneNum) {
                alert("请输入手机号");
                return false;
            }
            if (_this.wait != 60) {
                return false;
            }
            $.ajax({
                url: '/index/SendSmsCode',
                data: {
                    PhoneNum: _this.PhoneNum,
                },
                type: "POST",
                success: function(data) {
                    if (data.state == 200) {
                        _this.TimeGo();
                    }
                },
            })
        },
        TimeGo: function() {
            var _this = this;
            if (this.wait == 0) {
                this.SendBtn = '重新发送';
                this.wait = 60;
            } else {
                this.SendBtn = this.wait + '秒后重发';
                this.wait--;
                setTimeout(function() {
                        _this.TimeGo();
                    },
                    1000)
            }
        },
        Register: function() {
            var _this = this;
            if (!this.UserName || !this.Pwdreg_1 || !this.Pwdreg_2 || !this.Nick) {
                alert("请检查完善信息");
                return false;
            };
            if (this.Pwdreg_2 != this.Pwdreg_1) {
                alert("两次密码不一致");
                return false;
            };
            $.ajax({
                url: '/index/Register',
                data: {
                    UserName: _this.UserName,
                    Nick: _this.Nick,
                    Pwdreg_1: _this.Pwdreg_1,
                    //SmsCode:_this.SmsCode,
                },
                type: "POST",
                success: function(data) {
                    if (data.state == 200) {
                        $('#user').hide();
                        _this.infosTop('注册成功，请登陆！');

                        console.log("OK");
                    }
                },
            })

        },
        Login: function() {
            var _this = this;
            if (!this.Pwd || !this.UserName) {
                alert("请填写账号或密码");
                return false;
            }
            $.ajax({
                url: '/index/Login',
                data: {
                    UserName: _this.UserName,
                    Pwd: _this.Pwd,
                },
                type: "POST",
                success: function(data) {
                    if (data.state == 200) {
                        $('#user').hide();
                        location.reload();
                        _this.user = data.user;
                        console.log("登陆成功！");
                    }
                },
            })
        },
        getUser: function() {
            var _this = this;
            $.ajax({
                url: '/index/getUser',
                type: "POST",
                success: function(data) {
                    if (data.state == 200) {
                        _this.user = data.user;

                    }
                },
            })
        },
        getTheme: function() {
            var _this = this;
            $.ajax({
                url: '/index/getTheme',
                type: "POST",
                success: function(data) {
                    if (data.state == 200) {
                        _this.Theme = data.theme;
                    }
                },
            })
        },
        addText: function() {
            $(".main_content").append('<div class="main_first animated bounceInRight"><textarea class="main_first_t" type="text" rows="4"></textarea></div>');
        },
        FileChange: function(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            this.createImage(files);
        },

        createImage: function(file) {
            if (typeof FileReader === 'undefined') {
                alert('您的浏览器不支持图片上传，请升级您的浏览器');
                return false;
            }
            var image = new Image();
            var _this = this;
            var leng = file.length;
            for (var i = 0; i < leng; i++) {
                var reader = new FileReader();
                reader.readAsDataURL(file[i]);
                reader.onload = function(e) {
                    _this.UserPic = e.target.result;
                };
            }
        },
        FileChange2: function(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            this.createImage2(files);
        },

        createImage2: function(file) {
            if (typeof FileReader === 'undefined') {
                alert('您的浏览器不支持图片上传，请升级您的浏览器');
                return false;
            }
            var image = new Image();
            var _this = this;
            var leng = file.length;
            for (var i = 0; i < leng; i++) {
                var reader = new FileReader();
                reader.readAsDataURL(file[i]);
                reader.onload = function(e) {
                    _this.ThemePic = e.target.result;
                    _this.goPic();
                };
            }
        },
        inputImg:function(e){
          var el = event.currentTarget;
          $(el).find('input').click();
        },
        onTime:function(){
          var _this = this;
          _this.Time = getNowFormatDate();
          setInterval(function(){
            _this.Time = getNowFormatDate();
          },60000)
        },
        addNewZD:function(){
          this.goTrans();
          this.getTheme();
          this.okBtn = 1;
          var _this = this;
          $.ajax({
                url: '/index/addNewZD',
                type: "POST",
                data:{
                  user:_this.user,
                  ZD_title:_this.ZD_title,
                  ZD_content:_this.ZD_content,
                  ZD_summary:_this.ZD_summary,
                  UserPic:_this.UserPic,
                  Time:_this.Time,

                },
                success: function(data) {
                    if (data.state == 200) {
                        _this.OkZhide = data.zhide;
                        console.log('ok');
                        this.okBtn = 0;
                        $(".add_theme").show();
                        $('.add_content').hide();
                        //$('.all_ok').show();
                    }
                },
            })
        },
        addNewTheme:function(){
          this.okThemeBtn = 1;
          var _this = this;
          $.ajax({
                url: '/index/addNewTheme',
                type: "POST",
                data:{
                  user:_this.user,
                  Theme_title:_this.Theme_title,
                  Theme_summary:_this.Theme_summary,
                  ThemePic:_this.ThemePic,
                  Time:_this.Time
                },
                success: function(data) {
                    if (data.state == 200) {
                        console.log('ok');
                        _this.okThemeBtn = 0;
                        _this.NewTheme = data.theme;
                        // $('.add_content').hide();
                        // $('.all_ok').show();
                    }
                },
            })
        },
        infosTop:function(e){
            var _this = this;
            this.errors = e;
            setTimeout(function(){
              _this.errors = '';
            },2000);
          },
        CheckIn:function(e){
          if (this.checktheme == e) {
            return true;
          }else{
            return false;
          }
        },
        CheckC:function(e){
           this.checktheme = e;
        },
        addToZhide:function(){
          var _this = this;
          $.ajax({
            url:'/index/addToZhide',
            data:{
              checktheme:_this.checktheme,
              id:_this.OkZhide.objectId,
              tag_arr:JSON.stringify(_this.tag_arr)
            },
            type:"POST",
            success:function(e){
               if (e.state == 200) {
                        $(".add_theme").hide();
                        //$('.add_content').hide();
                        $('.all_ok').show();
               }
            }
          })
        },
        goTrans:function(){
            $('.main_first').each(function(){
                var v = $(this).find('textarea').val();
                $(this).html(v);
                $(this).removeClass('animated');
                $(this).removeClass('bounceInRight');
            })
            var mm = $('.main_content').html();
            this.ZD_content = mm;
        },
        goPic:function(){
          this.addPicText="添加中.."  
          var _this = this;
          $.ajax({
            url:'/index/addPicContent',
            data:{
              pic:_this.addPic,
            },
            type:"POST",
            success:function(e){
               if (e.state == 200) {
                  $(".main_content").append('<div style="width:100%"><img src="'+ e.pic.url +'"></div>');
                  console.log(e.pic.url);
                  _this.addPicText='添加图片'
               }
            }
          })
        }
    },


    created() {
        this.getUser();
        var id = $("#page_id").val();
        $(".header-nav a").eq(id).addClass('item-cur');
        this.onTime();
        
        
    },
})
