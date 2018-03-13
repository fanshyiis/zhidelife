$(function () {
    $(".af1").slide({
    affect:1,
    time:7000,
    speed:400,
    dot_text:false,
  });
  $('#elevator').backTop();
  $('.nav-more').hoverDisplay('.nav-more__hover');
  $('#plus').hoverDisplay('#plus_popup');


  // 注册登录
  var $register_btn = $('#header').find('.register');
  var $login_btn = $('#header').find('.login');
  var $user = $('#user');
  var $user_inner = $user.find('.user-inner');
  var $user_register = $user.find('.register');
  var $user_login = $user.find('.login');
  var $close_btn = $user.find('.close');
  var $switch_login = $user.find('.cricle-3');
  var $switch_register = $user.find('.cricle-4');

  var user_h = 0;
  var register_h = $user_register.height();
  var login_h = $user_login.height();

  $register_btn.click(function () {
    $('.cricle-4').hide();
    $('.cricle-3').show();
    $user.show();
    $user_register.show();
    $user_login.hide();
    return false;
  });

  $login_btn.click(function () {
    $('.cricle-3').hide();
    $('.cricle-4').show();
    $user.show();
    $user_register.hide();
    $user_login.show();
    return false;
  });

  $close_btn.click(function () {
    $user.hide();
  });

  $(document).click(function () {
    $user.hide();
  });

  $user_inner.click(function () {
    return false;
  });

  $switch_login.click(function () {
    $user_register.hide();
    $user_login.show();
    $('.cricle-3').hide();
    $('.cricle-4').show();
  });

  $switch_register.click(function () {
    $user_login.hide();
    $user_register.show();
    $('.cricle-4').hide();
    $('.cricle-3').show();
  });
});

!(function ($, window, document, undefined) {

  $.fn.backTop = function () {
    var $elem = this;
    var $doc = $(document.body);
    var client_h = $(window).height();

    $elem.click(function () {
      $doc.animate({scrollTop: 0});
    });

    $(window).on('scroll', function () {
      if ($(this).scrollTop() >= client_h) {
        $elem.show();
      } else {
        $elem.hide();
      }
    });
  }

  $.fn.hoverDisplay = function (hoverElem) {
    var $oParent = this;
    var $disELem = $(hoverElem);
    var timer = null;

    $oParent.hover(function () {
      clearTimeout(timer);

      $disELem.show();
    }, function () {
      timer = setTimeout(function () {
        $disELem.hide();
      }, 100);
    });

    $disELem.hover(function () {
      clearTimeout(timer);

      $disELem.show();
    }, function () {
      timer = setTimeout(function () {
        $disELem.hide();
      }, 100);
    });
  };

})(window.jQuery, window, document);

(function($){
  $.fn.slide=function(options){
       var defaults= {
       affect:1,     //1：上下滚动; 2:幕布式; 3:左右滚动；4：淡入淡出
       time: 4000,   //间隔时间
       speed:500,    //动画快慢
       dot_text:true,//按钮上有无序列号
     };
     var opts=$.extend(defaults,options);
     
       var $this=$(this);
       var ool=$("<div class='dot'><p></p></div>");
       var $box=$this.find("ul");
       var $li=$box.find("li");
       var timer=null;
       var num=0;
     
     $this.append(ool);
     $box.find("li").each(function(i){
      ool.find("p").append($("<b></b>"));
      if(opts.dot_text){
        ool.find("b").eq(i).html(i+1)
      }
       })
     ool.find("b").eq(0).addClass("cur");
     switch(opts.affect){
       case 1:
          break;
       case 2:
          $box.find("li").css("display","none");
          break;
       case 3:
         $box.css({"width":$li.eq(0).width()*$li.length});
         $li.css("float","left");
         break;
       case 4:
          $box.find("li").css("display","none");
          break;
     }
     $box.find("li").eq(0).show(0);
     ool.find("b").mouseover(function(){  
      num=$(this).index();
      run ();
    })
    timer=setInterval(auto,opts.time);
      function auto(){
        num<$box.find("li").length-1?num++:num=0;
        run();
      }
    function run(){
      ool.find("b").eq(num).addClass("cur").siblings().removeClass("cur");
        switch(opts.affect){
            case 1:
            $box.stop(true,false).animate({"top":-240*num},opts.speed);
            break;
          case 2:
            $box.find("li").css({"position":"absolute"});
            $box.find("li").stop(false,true).fadeOut(opts.speed).eq(num).slideDown(opts.speed);
            break;
          case 3:
            $box.stop(true,false).animate({"left":-1001*num},opts.speed);
            break;  
          case 4:
            $box.find("li").css({"position":"absolute"});
            $box.find("li").stop(false,true).fadeOut(opts.speed).eq(num).fadeIn(opts.speed);
            break;  
        }
    }
    $this.mouseover(function(){
        clearInterval(timer); 
    })
     $this.mouseout(function(){
        timer=setInterval(auto,opts.time);  
    })
}
})(jQuery)
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
    var mm =date.getMinutes();
    if (mm >= 1 && mm <= 9) {
      mm = "0" + mm;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + mm;
    return currentdate;
}