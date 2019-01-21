'use strict'
const hello = require('./hello');
var s = 'Michael';
hello.greet(s);
hello.goodbye(s);

// commonJS实现原理  代码向一个立即执行函数提供 module 和exports两个外部变量，模块就放在这个立即执行函数 里面，
//这样模块的输出值放在modlue.exports之中，这样就实现了模块的加载。
var module = {
   exports:{}
};
(function(module,exports){
  exports.multiply =  function(n){ return n*1000};
}(module,module.exports))

var f = module.exports.multiply;
f(5) //5000

/* AMD :Asynchronous Module Definition 异步模块定义： 采用异步方式加载模块，模块的加载不影响后面语句的运行。
所有依赖这个模块的语句，都定义在一个回调函数中，等加载完成之后，这个回调函数才会运行
主要两个库实现：require.js 和 curl.js
使用require.js 的原因：代码越多 ，分成多个文件，依次加载，标签引入js文件：
缺点： 加载的时候，浏览器会停止网页渲染，加载文件越多，网页失去响应的时间就会越长；
js文件之间存在依赖关系，因此必须严格保证加载顺序，依赖性最大的模块放在最后，当依赖关系复杂是，代码很难维护。

所以使用require.js：实现js文件的异步加载，避免网页失去响应。  管理模块之间的依赖性，便于代码维护和编写。
<script src="js/require.js" defer async= "true"></script> :async表明这个文件需要异步加载，避免网页失去响应。
<script src="js/require.js" data-main = "js/main"></script>: data-main:指网页程序的主模块，js目录下面的main.js,这个文件会第一个被require.js加载
//main.js
require(['moduleA','moduleB','moduleC'],function(moduleA,moduleB,moduleC){
   //some code here
});
主模块依赖A B C 三个模块，第二参数是回调函数，当前面指定的模块都加载成功后，它将被调用。
require.config({
baseUrl:"js/lib"
paths:{
    "jquery":"jquery.min",
    "underscore":"underscore.min",
    "backbone":"backbone.min",
}
})
下面 math.add与math模块加载不是 同步的，浏览器不会发生假死*/
require (['math'],function(math){
  math.add(2,3);
});
