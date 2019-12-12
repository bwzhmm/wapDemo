import { is } from "immutable";

/**
 * 规范:
 * 常量名：ADD_METHOD  类名：ActiveDic  Bool类型：hasChild，isChild
 * CanLogin 是否执行某个权限 HasToken 是否含有某个值 IsShowModel 是否为某个值 GetUserId 获取某个值
 * SetCookie 设置某个值 LoadList 加载某些数据 Update更新某些数据 UpdateUserInfo Del删除数据DelMenu
 * 
 * 
 * 
 *
 * 
 */
// good 传递props ，无必要，不能传递整个props，只能传递props中所需要的属性（models中的reducers同理）
const { name } = this.props;

/**
 * state是一个组件的UI 数据模型，是组件渲染时的数据依据
 * this.setState({name:'Lucy'})
 * setState时异步，若需要马上调用，可以转化为同步；
 * setState方法通过一个队列机制实现state更新，当执行setState的时候，会将需要更新的state合并之后放入状态队列，而不会立即更新this.state
 * this.setState(newState)-》 newState存入pending队列---》调用enqueueUpdate 
 * --》是否处于批量更新模式【yes 是将租金保存到dirtyComponents 】 【No 遍历dirtyComponents；调用updateComponent 更新pending state or props 】
 * 
 * 
 * 
 */

componentDidMount(){
    setTimeOut(() => {
        this.setState({
            num: this.state.num + 1,
        });
        console.log(this.state.num);//1
        this.setState({
            num: this.state.num + 1,
        });
        console.log(this.state.num);//2
    }, 0)

}


// setState(updater,callback)
componentDidMount(){

    this.setState(((num) => {
        num.num++;
    }), () => {
        console.log(this.state.num);//2
    });

    this.setState(((num) => {
        num.num++;
    }), () => {
        console.log(this.state.num);//3
    });

}

//promise,进行封装
setStatePromise(updator) {
    return new Promise(((resolve, reject) => {
        this.setState(updator, resolve)
    }));
}

componentDidMount(){
    this.setStatePromise(({ num }) => ({
        num: num + 1,
    })).then(() => {
        console.log(this.state.num);
    });
}


//因为this.props 和 this.state 可能会异步更新，所以不应该依赖它们的值来计算下一个状态
this.setState((prevState, props) => ({
    counter: preState.counter + props.increment
}))
/**
 * 若是在shouldComponent 或 componentWillUpdate 方法中调用setState，此时this._pending-StateQueue != null, 就会
 * 造成循环调用，使得浏览器内存占满后崩溃。
 * 
 * 如果数据需要跨组件传输，则放在props中进行传递
 * 如果数据只能在本组件中使用，并且涉及到在render中进行渲染，则方在state中进行处理
 * 其余数据可在组件中直接定义
 */


//JSX 编码 

//1. JSX 中禁止使用if语句进行判定
ShowUserInfo() {
    return isShowUserInfo : (<div> 姓名：张三</div>) ? (<div> 姓名：未填写</div>)
 }

//2.尽量使用单标签
render(){
    return (
        <div>
            ..
         <UserInfo />
            ..
         </div>
    )
}

//3. 在标签中默认的都是true
<Foo hidden />

//4. 在map 循环时，不要用index作为每个标签的key
{
    todos.map(todo => (
        <Todo
            {...todo}
            key={todo.id}
        />
    ))
}

//5.使用ref的回调
<Foo
    ref={(ref) => { this.myRef = ref; }}
/>

//解构
const [langunage, country] = locale.split('-')

//变量判定  不要信任任何回调函数给你的变量，它们随时可能是undefined，使用初始值
onchange((value) => {
    if (!value) {
        value = {}
    }
    console.log(value.name)
})
onChange((value = {}) => console.log(value.name))
onChange(value => console.log(value ? value.name))

//自定义变量
let { newlist = [] } = this.props;
let b = a || [];

//React中常用ES6语法
//1. let 与 const 只能定义之后使用
console.log(a);// error
let a = 1;
console.log(b);//undefined
var b = 2;
console.log(c);// error
const c = 3

//2.let 与 const 不能重复定义
// 3. const 定义后的变量不可修改
let d = 1;
d = 2 // d为2
const c = 1;
c = 2;// assignment to constant variable
/**
 * var 是全局中声明的一个变量，使用后依然会存在内存中；let 在函数调用完成过后就会被立即消除
 */
for (var j = 0; j < 10; j++) {

}
console.log(j);//10

for (let i = 0; i < 10; i++) {

}
console.log(i);// i is not defined

//变量结构

//1.数组与数组合并
let a = [1, 2];
let b = [3, 4];

//bad 
let c = a.concat(b);
for (let i = 0; i < b.length; i++) {
    a.push(b[i]);
}

let c = [...a, ...b];

//2.对象与对象合并
let a = { name: '张三' }
let b = { age: 32 }
//bad
let c = {
    name: a.name,
    age: b.age
}
//good 
let c = { ...a, ...b }

//3.对象并入数组
let a = [{ name: '张三' }]
let b = { name: 'lucy' }
let c = a.push(b);
let c = [...a, b]

//4. 更改变量名
let a = { name: 'lucy', age: 32 };
let NAME = a.name;
let { name: NAME } = a

//5.数值互换 
let a = 1;
let b = 2;
let t;
t = a;
a = b;
b = t;

[a, b] = [b, a];

//箭头函数 目的是解决this指针的问题；
let arr = [1, 2, 3]
arr.forEach(function (e) {
    console.log(e)
})
arr.forEach((e) => {
    console.log(e);
})

//es6中 创建一个class，若默认在其里面加入一个函数的话，其必须在调用的时候，必须绑定this指针，否则不能访问当前类的实例里面的属性
function Person() {
    this.age = 0;
    setInterval(function growUp() {
        this.age++;
        console.log(this.age);//NaN 
    }, 1000)
}
var p = new Person()
//在es5中需要穿过function 传递需怎么做呢？
function Person() {
    this.age = 0;
    let _this = this;
    setInterval(function growUp() {
        _this.age++;
        console.log(_this.age);// 1 2 3 ....
    }, 1000);
}
var p = new Person();
//使用es6的箭头函数  ;react中需要传递this指针也都是通过箭头函数来实现的，以前使用bind函数来绑定this
function Person() {
    this.age = 0;
    setInterval(() => {
        this.age++;
        console.log(this.age)// 1 2 3 ...
    }, 1000)
}
var p = new Person();

//遍历 在遍历过程中禁止删除、新增
//数组遍历
let a = [1, 2, 3, 4, 5];
for (let i = 0: i <a.length; i++) {
    console.log(a[i])
}
a.forEach(e => {
    console.log(e)
})
a.map(e => {
    console.log(e)
})
//对象遍历
let a = { name: 'Lucy', age: 32, sex: '女' }
for (o in a) {
    console.log(a[o])
}
for (o in a) {
    if (a.hasOwnProperty(o)) {
        console.log(a[o])
    }
}

//值判断
//判空 变量若不为0， null， undefined， false 都会被处理为true，只要变量有非0的值或某个对象，数组，非空字符串都为true
if ([]) {
    console.log('1')
}//1
if ({}) {
    console.log('1')
}//1
if ('') {
    console.log('1')
}

//2. true || false
[] == false // true
{ } == false // true
'' == false // false
0 == false //true 

//合并多个对象
Object.assign(target, ...sources);
var target = { a: 1, b: 1 };
var source1 = { b: 2, c: 2 };
var source2 = { c: 3 };
Object.assign(target, source1, source2); // {a:1, b:2, c:3}

//克隆对象  
Object.assign([], this.enterExperts)

// 更改属性的值
Object.assign(career, { entryData: '至今' })

this.setState((prevState, props) => ({
    counter: prevState.counter + props.increment
}));

//通过回调拿到 最新的state的值
updateData = (newData) => {
    this.setState(
        { data: newData },
        () => {
            //这里打印的是最新的state值
            console.log(this.state.data);
        }
    );
}
//或者 
this.setState((prevState, props) => {
    console.log('prevState', prevState);//在改变state中的数据之前，
    return { auto: true };
}, () => console.log(this.state.auto));//更新state之后

//调用setSate，组件状态不会立即改变，setState只是把要修改的状态放在一个对了中
function add() {
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
}

//直观上来看，当上面的add函数被调用时，组件状态的count值被增加了3次，每次增加1，那后count被增加了3，但是，实际上的结果state只增加了1。
// currentCount就是一个快照结果，重复地给count设置同一个值，不管重复几次，得到的结果也只是增加1而已。
//想要使最后的结果是3，实现代码如下：
add = () => {
    this.setState(prevState => ({
        count: prevState.count + 1
    }));
    this.setState(prevState => ({
        count: prevState.count + 1
    }));
    this.setState(prevState => ({
        count: prevState.count + 1
    }));
}
//这样，每次改变count时，都是prevState.count + 1，pervState是前一个状态，当每次setState之后，前一个状态都会改变，结果就是想要的3了。如果需要立即setState 那么就需要传入一个函数来执行setState



// 父向子

class Parent extends Component {
    state = {
        msg: 'start'
    }
    transferMsg(msg) {
        this.setState({
            msg
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                msg: 'end'
            });
        }, 1000);
    }
    render() {
        return <Child_1 msg={this.state.msg} />
    }
}

class Child_1 extends Component {
    render() {
        return <p>{this.props.msg}</p>
    }
}

export default Parent

// 子向父 

class Parent extends Component {
    state = {
        msg: 'start'
    }
    transferMsg(msg) {
        this.setState({
            msg
        })
    }
    render() {
        <div>
            <p>child msg : {this.state.msg}</p>
            <Child_1 transferMsg={msg =>
                this.transferMsg(msg)} />
        </div>
    }
}

class Child1 extends Component {
    render() {
        return <div>
            <p>Child_1 </p>
        </div>
    }
}

export default Parent