(function (w) {
      w.gesture = (ele, callback) => {
          let isStart = false;
          ele.addEventListener("touchstart", (event) =>{
              if(event.touches.length >= 2) {
                  isStart = true;
                  //两点初始距离
                  this.startDistance = getDistance(event.touches[0], event.touches[1]);
                  //初始角度
                  this.startDeg = getDeg(event.touches[0], event.touches[1]);

                  if(callback && typeof callback['start'] === "function"){
                    callback['start']();
                  }
              }
          });
          ele.addEventListener("touchmove", (event) =>{
            if(event.touches.length >= 2) {
             
                //记录两点实时位置
                var currDistance = getDistance(event.touches[0], event.touches[1]);
                //记录实时角度
                var currDeg = getDeg(event.touches[0], event.touches[1]);
                    event.scale = currDistance / this.startDistance;
                    event.rotation = currDeg - this.startDeg;
                if(callback && typeof callback['change'] === "function"){
                    callback['change'](event);
                }
            }
        });
        ele.addEventListener("touchend", (event) =>{
            if(event.touches.length < 2 && isStart) {
                if(callback && typeof callback['change'] === "function"){
                    callback['end']();
                }
            }
            isStart = false;
        });
          // 两点的距离
          function getDistance(touch1, touch2){
              var a = touch1.clientX - touch2.clientX;
              var b = touch1.clientY - touch2.clientY;
              // 勾股定理
              return Math.sqrt(a*a + b*b);
          }
          // 两触点的角度
          function getDeg(){
            var a = touch1.clientX - touch2.clientX;
            var b = touch1.clientY - touch2.clientY;
            var radian = Math.atan2(b,a);
            return radian * 180 / Math.PI;

          }
      }
})(window)