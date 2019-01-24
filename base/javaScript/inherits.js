 /*Javascript 原型继承 */

 //Student 构造函数
 function Student(props){
   this.name = props.name || 'Unnamed';
 }

 Student.prototype.hello = function(){
   alert('hello'+ this.name + '!');
 }
// 基于Student 扩展出 PrimaryStudent ，先定义出PrimaryStudent
function PrimaryStudent(props){
  //调用Student的构造函数，绑定this变量
  Student.call(this, props);
  this.grade = props.grade || 1;
}


 
