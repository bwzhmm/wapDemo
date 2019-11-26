组件生命周期顺序：首先挂载组件，挂载成功完成第一次渲染，然后传递新的props， 则会触发 componentWillReceiveProps,
    执行重新渲染的周期，直至渲染完成。


Constructor(props) :
       初始化局部State或把方法的句柄绑定到实例
        注意： 第一语句 必须是super(props)
        如果不初始化state或不进行方法绑定，则不需要为React组件实现构造函数；
        不要调用this.setState(); 直接赋值给state
        不要： this.state = { color: props.color}


GetDerivedStateFromProps(props, state)
          内部state变化依赖于props时，
        　注意：不要过度使用该函数。
　　　　　　　　如果你的操作依赖于props的更改并有副作用，最好放到ComponentDidUpdate中；
　　　　　　　　如果需要根据props的改变更新某些数据，最好使用memoization或Reselect做缓存处理；
　　　　　　　　如果你想根据props的改变重置state的值，使用全受控组件或带key的非受控组件


ComponentWillMount - Legacy: 组件挂载之前执行，只执行一次
             使用场景：遗留函数，在16.3以后不应该再使用。
　　　　　   注意：由于该函数在render之前调用，因此使用同步的setstate方法不会触发额外的render处理。
　　　　　　　　尽量使用constructor函数实现同样效果
               如果是处理带有后续操作或有副作用或订阅事件的处理，放到ComponentDidMount中。


componentWillReceiveProps(nextProps): 组件将要接收新的props执行， 不会再初始化渲染 或 当使用 forceUpdate()时被调用
           使用场景：遗留函数，在16.3以后不应该再使用。
　　　　　　　　　　组件将要接收新的props时被调用
          当props改变需要相应改变内部state时使用该函数。　　　　　　　　　　
　　　　　注意：如果父组件强制子组件更新，即使props没有改变也会调用该函数
          总是比较this.props 和 nextProps来确认是否需要调用setState。　

    首次通过componentDidMount接收, 非首次通过 componentWillReceiveProps（nextProps)接收
    好处： 子组件的render函数执行获取新的props； 从而更新子组件自己的state； 可以将数据请求放在这里进行执行，
            需要传入的参数则从 nextProps 中获取，而不必将所有请求都放在父组件中。 于是改请求只会在该组件渲染时才发出，
            从而减经请求负担；在初始化render时不会执行， 会在component 接受到新的状态 props时被触发
        // record 发生改变时且不同于上次则重新查询 可以设置this.setState()状态更新组件状态
        componentWillReceiveProps(nextProps) {
            let { currentRole } = nextProps;
            if (currentRole && this.props.currentRole.roleId !== currentRole.roleId) {
                this.getInitGroupFormRoleList(currentRole);
            }
        }


shouldComponentUpdate(nextProps, nextState): 判断组件是否应该重新渲染，默认是true  返回false,则不会调用render(),也不会调用 componentDidUpdate();
shouldComponentUpdate 避免组件重复或无意义渲染
接收到新属性或状态时， shouldComponentUpdate() 在渲染前被调用；
        　　使用场景：性能优化接口
       通过比较this.props与nextProps， 和比较this.state 与 nextState 来返回false阻止组件render
      注意：forceUpdate不会触发该函数
     某些情况可以使用React.PureComponent替代写该函数
      返回false并不会阻止子组件的重新render(如果他们的state改变的时候)
        shouldComponentUpdate(nextProps) {
    if( !_.isEqual( this.props, nextProps) || !_.isEqual( this.state, nextState)) {
        return true
    } else {
        return false
    }
}


componentWillUpdate: 组件将要重新渲染
ComponentWillUpdate(nextProps, nextState) - Legacy
使用场景：遗留函数，在16.3以后不应该再使用。
    注意：不能在该函数中通过this.setstate再次改变state，如果需要，则在componentWillReceiveProps函数中改变
        componentDidUpdate(prevProps) {
            let { currentRole } = prevProps;
            if (currentRole && this.props.currentRole.roleId !== currentRole.roleId) {
                console.log('prevProps',prevProps);
                console.log(' this.props', this.props)
                this.getInitGroupFormRoleList(this.props.currentRole);
            }
        }
        // record 发生改变时且不同于上次则重新查询 在组件接收到一个新prop(更新后）时被调用，这个方法在初始化render时不会被调用
        // componentWillReceiveProps(nextProps) {
        //     let { currentRole } = nextProps;
        //     if (currentRole && this.props.currentRole.roleId !== currentRole.roleId) {
        //         this.getInitGroupFormRoleList(currentRole);
        //     }
        // }


Render
使用场景：核心函数，必不可少。返回类型包括：react元素/数组或代码片段/入口/字符串或数字/bool或空。
　　　　　注意：不能在render函数中调用setState。
　　　　　在存活周期中，如果shouldUpdateComponent返回false，该方法不会被调用。


getSnapshotBeforeUpdate(prevProps, prevState)
使用场景：该函数在最终render结果提交到DOM之前被调用
记录DOM刷新前的特性，如：滚动位置
注意：该函数的返回值会作为参数传递给ComponentDidUpdate


componentDidMount: 组件渲染完成，只执行一次; 组件挂载后（插入DOM树中）立即调用。依赖DOM节点的初始化；网络请求获取数据；
    使用场景：真是DOM被更新之后调用
    在创建组件周期，该函数是异步请求的最佳接口，用以加载数据，AJAX/Fetch/redux-dispatch
    注意：这里也是产生性能问题最多的地方(因代码问题)

ComponentDidUpdate(prevProps, prevState, snapshot) 组件重新渲染完成
        会在更新后被立即调用，首次渲染不会执行此方法
        组件更新后，可以在此处对DOM进行操作，若对更新前后的props进行比较，可以选择此处进行网络请求；（props 未发生变化时，则不会执行网络请求）
        使用场景：通过比较prevProps或prevState 与 this.props或this.state，进行业务处理，发送网络请求
        注意：在处理业务或发送网络请求时，一定要做条件比较，否则容易造成死循环
        


componentWillUnmount: 卸载组件
使用场景：组件销毁时调用
清理无效timer；取消未完成的网络请求；清理已注册的订阅
注意：在这里setState是无效的

componentDidCatch()
使用场景：任何子组件的JS错误或异常发生时触发
初始化周期和运行时周期的错误都会触发该函数
注意：只捕获该组件的所有子组件异常，并不会捕获本身的异常
在该函数中调用setState以实现错误回滚至前一页面
不要使用该函数作为业务处理的一部分。