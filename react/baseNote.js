 1， 继承于 Component 组件；是有生命周期的；  继承的子类各不相同，是同一个类的两个 实例化 对象；

 组件被渲染完了以后执行的方法： componentDiaMount()
 组件即将更新的实时执行： componentWillUpdate()
 组件即将被销毁的时候执行： componentWillUnmount()

 函数式组件
 const  App = () => {
    return (
        <div>App</div>
    )
 }

 es6 组件
class App1 extends Component{
    render(){
        return (
            <div>app </div>
        )
    }
}
JSX渲染问题：
对象不能渲染；
 { showTitle && <h3>title</h3>}
     { showTitle ? <h3>title</h3> : <p> no title</p> }

2, 虚拟DOM
Tree-Diff算法 ：
标签变化：
组件变化：  删了上一个，新增一个  renderA: <Header />  renderB: < Content/> ;  [ removeNode , addNode]

key优化  : key设置唯一key 进行性能优化
     局部刷新list 删除 更新 创建