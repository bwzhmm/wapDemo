
一定不要写任何ES6的语法，IE11中运行会报错
任何时候不能使用"EVAL"
原因：eval是在运行的时候执行任意代码的函数，一般来说，用eval函数是很危险的，因为它可以执行任意的代码，如果经过必须使用该函数，则要特别注意该函数处理的任何用户输入数据。


不要使用 '==' 和 '!='，使用 '===' 和 '!==' 替代
// 原因：== 和 != 在判断值相等前会判断类型是否相等。这容易因为类型不同而造成错误。
// 比如：它会认为表达式：’\t\r\n’==0 是正确的。因此，要采用 === 和 !== 替代这两个符号。
// 建议的方式：
if (var === 'howdy') { ... }
// 不建议的方式：
if (var == 'howdy') { ... }

"DELETE"不能在数组中使用
// 原因：delete函数可以用来删除任何的对象。数组是对象，因此可以被delete操作。
// 但是如果这样使用了，就会在数组中产生一个undefined元素，无法从下标中反应出delete操作。
// 从含有下标的元素中移除元素的适当方法有：Array.prototype.splice 或者 _.remove (Lodash类库的方法)
// 建议的方式：
var myArray = [ 'a', 'b', 'c', 'd' ];
removed = myArray.splice(2, 1); // myArray => ['a', 'b', 'd']
// 不建议的方式：
var myArray = [ 'a', 'b', 'c', 'd' ]; delete myArray[2];

"FOR … IN"这种循环在每次操作前需要进行过滤判断
// 原因："for … in"这种循环允许开发人员按照属性的名字遍历对象。
// 这个属性的集合包括了对象自身和对象继承的对象的所有属性。如果程序不考虑这点可能会出现错误。
// 因此，对于每个”for … in”循环，都应该包括一个if判断来过滤你需要的属性。
// 建议的方式：
for (name in object) { if (object.hasOwnProperty(name)) { doSomething(name); } }
// 不建议的方式：
for (name in object) { doSomething(name); // Noncompliant }

    "INDEXOF"检测数组元素是否存在需要包括 0

// 原因：大部分字符串或者数组的indexOf方法的判断需要和-1而不是0作比较。因为0代表该元素存在于字符串或者数组中。
// 因此所有的indexOf(..)>0的判断都忽略的0这种情况，是一个典型的错误。
// 建议的方式：
    var color = 'blue';
    var name = 'ishmael';
    var number = 123;
    var arr = [color, name];
    if (arr.indexOf('blue') >= 0) {
        // ...
    }
    if (arr[0].indexOf('ish') > - 1{
        // ...
    }
// 不建议的方式：
    var color = 'blue';
    var name = 'ishmael';
    var number = 123;
    var arr = [color, name];
    if (arr.indexOf('blue') > 0) { // Noncompliant
        // ...
    }
    if (arr[0].indexOf('ish') > 0{ // Noncompliant
        // ...
    }
    不要使用ARRAY和OBJECT的构造方法

// 建议如下的方式：
    var a = [x1, x2, x3];
    var a2 = [x1, x2];
// 不建议如下的方式：
    var a3 = new Array(x1); // Noncompliant and variable in results
    var a4 = new Array(); // Noncompliant. Results in 0-element array.
    var a1 = new Array(x1, x2, x3); // Noncompliant. Results in 3-element array.
    调用PARSEINT函数要带两个参数

// 好的方法：
    parseInt("010", 10);
// 不建议如下的方式：
    parseInt("010");
    要使用大括号作为范围控制

// 原因：虽然没有语法的错误，但是不使用大括号会降低代码的可读性，还有可能造成逻辑上的错误。
// 建议如下的方式：
    if (condition) {
        executeSomething();
        checkSomething();
    }
// 不建议如下的方式：
    if (condition)
        executeSomething();
    checkSomething();
    函数中没有使用过的变量应该被删除

// 建议如下的方式：
    function doSomething(b) {
        return compute(b);
    }
// 不建议如下的方式：
    function doSomething(a, b) {
        // "a" is unused
        return compute(b);
    }
    保留字不能用作标识符

// 原因：以下的单词是JavaScript保留字，用于JavaScript以后的拓展，不能作为标识符使用。
    await
class
    const
        enum
    exports
extends
    implements
import
    interface
    let
        package
    private
    protected
    public
    static
    super
    yield
    CONSOLE LOGGING不应该被使用

// 原因：Debug信息在开发过程中很有用，但是在发布的版本中，特别是客户端保留Debug信息，会造成敏感信息泄露，使浏览器运行缓慢，甚至是浏览器进程崩溃错误。
// 生产环境不允许如下使用方式：
    console.log(password_entered);
    DEBUGGER语句不应该被使用

// 原因：Debugger语句可以在程序的任何地方声明来暂停程序执行。利用debugger语句就像在代码中加了一个断点一样。在发布的代码中，任何debugger语句都必须被移除。
// 不建议如下的使用方式：
    for (i = 1; i < 5; i++) {
        // Print i to the Output window.
        Debug.write('loop index is ' + i);
        // Wait for user to resume.
        debugger;
    }
    注释不应该写在每一行的最后面

// 不建议如下的方式：
    var a1 = b + c;  // This is a trailing comment that can be very very long建议如下的方式：
// 建议的方式：
// This very long comment is better placed before the line of code
    var a2 = b + c;
// 当注释只有一个单词的时候，允许注释写在代码的后面，这是一种特例
    doSomething(); // FIXME
    每一行的结尾必须要有 ";"

// 原因：虽然在JavaScript中，在声明后面添加“;”不是强制性的，但是省略“;”是一种不值得提倡的做法，在有些情况下可能会引起意想不到的结果。
// 不建议如下的方式：
    function fun() {
        return
        // Noncompliant. ';' implicitly inserted at end of line
        5
        // Noncompliant. ';' implicitly inserted at end of line
    }
    print(fun()); // prints "undefined", not "5"
// 建议如下的方式：
    function fun() {
        return 5;
    }
    print(fun())