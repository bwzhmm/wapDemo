
// 1.数据驱动的方式
function Transfrom(element){
    var transfrom = {};
    var transfromValue = "";

    //转换属性数组
    var props = ['scaleX', 'scaleY','rotateX','rotateY']
    props.forEach(function (prop){
        if(prop.indexOf('scale') >=0) {
            transfrom[prop] = 1;
        }else {
            transfrom[prop] = 0;
        }
        Object.defineProperties(element ,prop, {
            get:function (){
                return transfrom[prop];
            },
            set:function(value){
                transfromValue = '';
                transfrom[prop] = value;
                for(var name in transfrom) {
                    switch (name){
                        case "scaleX":
                        case "scaleY":
                            transfromValue +=" " + name + "(" +transfrom[name] +")";
                            break;
                        case "rotate":
                        case "rotateX":
                        case "rotateY":   
                        case "rotateZ":
                        case "skewX":
                        case "skewY":  
                        transfromValue +=" " + name + "(" +transfrom[name] +"deg)";
                        break; 
                        default:
                            transfromValue +=" " + name + "(" +transfrom[name] +"px)";
                    }
                }
                element.style.WebkitTransform = element.style.transfrom = transfromValue;
            }
        })
    })
}

// this 原型上
HTMLElement.prototype.cssTransform = function (prop, value) {
    var transform,
    transformValue = "";
    if(this.transfrom === undefined){
        this.transfrom = transform = Object.create(null);
    }
    //设置元素
    if(value !== undefined) {
        this.transfrom[prop] = value;
        transform = this.transfrom;

        // transform 对象可能不止一个属性 遍历
        for (let name in transform) {
            switch(name){
                case "scaleX":
                    case "scaleY":
                        transfromValue +=" " + name + "(" +transfrom[name] +")";
                        break;
                    case "rotate":
                    case "rotateX":
                    case "rotateY":   
                    case "rotateZ":
                    case "skewX":
                    case "skewY":  
                    transfromValue +=" " + name + "(" +transfrom[name] +"deg)";
                    break; 
                    default:
                        transfromValue +=" " + name + "(" +transfrom[name] +"px)";
                }
            }
            element.style.WebkitTransform = element.style.transfrom = transfromValue;
            }else{
                return this.transfrom[prop];
            }
    }
