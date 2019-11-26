

//合并多个对象
Object.assign(target, ...sources);
var target = {a:1, b:1};
var source1 = { b:2, c:2};
var source2 = {c:3};
Object.assign(target, source1, source2); // {a:1, b:2, c:3}

//克隆对象  
Object.assign([], this.enterExperts)

// 更改属性的值
Object.assign(career, {entryData:'至今'})

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
this.setState((prevState, props) =>{
    console.log('prevState',prevState);//在改变state中的数据之前，
    return { auto:true};
}, () => console.log(this.state.auto));//更新state之后

//调用setSate，组件状态不会立即改变，setState只是把要修改的状态放在一个对了中
function add() {
    this.setState({count: this.state.count + 1});
    this.setState({count: this.state.count + 1});
    this.setState({count: this.state.count + 1});
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

class Parent extends Component{
    state ={
        msg:'start'
    }
    transferMsg(msg){
        this.setState({
            msg
        });
    }

    componentDidMount() {
        setTimeout(() =>{
            this.setState({
                msg:'end'
            });
        }, 1000);
    }
    render() {
        return <Child_1 msg={this.state.msg} />
    }
}

class Child_1 extends Component{
    render() {
        return <p>{this.props.msg}</p>
    }
}

export default Parent 

// 子向父 

class Parent extends Component{
    state = {
        msg:'start'
    }
    transferMsg(msg) {
        this.setState({
            msg
        })
    }
    render() {
        <div>
            <p>child msg : {this.state.msg}</p>
            <Child_1 transferMsg  = {msg  =>  
                this.transferMsg(msg)}/>
        </div>
    }
}

class Child1 extends Component{
    render(){
        return <div>
            <p>Child_1 </p>
        </div>
    }
}

export default Parent