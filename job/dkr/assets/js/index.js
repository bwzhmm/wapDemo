
window.jQuery = window.$ = jQuery;

// 滚动时头部样式及吸顶
function handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;   // 目前监听的是整个body的滚动条距离,兼容IE
      if(scrollTop > 100 ){
        $("#logo").addClass("logo-blue");
        $("#navmenu").addClass("navmenu-white");
        $("#header-box").addClass("header-white");
        $("#header-box").addClass("fixed-header");
        $("#logo").removeClass("logo-white");
        $("#navmenu").removeClass("navmenu");
      }else{
        $("#logo").removeClass("logo-blue");
        $("#navmenu").removeClass("navmenu-white");
        $("#header-box").removeClass("header-white");
        $("#header-box").removeClass("fixed-header");
        $("#logo").addClass("logo-white");
        $("#navmenu").addClass("navmenu");
      }
}


jQuery(document).ready(function() {
    // handleScroll();
    // 解决方案切换
    $('[icon-toggle="toggle"]').mouseover(function () {
      // $(this).addClass("active")
      $(this).addClass("active").siblings(".active").removeClass("active")
    });
    // $('[icon-toggle="toggle"]').mouseout(function () {
    //   $(this).removeClass("active")
    // });

	$(window).scroll(function(event) {
        handleScroll();
	});
});