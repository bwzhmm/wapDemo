var a = ['法国','澳大利亚','智利','新西兰','西班牙','加拿大','阿根廷','美国','0','国产','波多黎各','英国','比利时','德国','意大利','意大利'];
var b = [];
var result = [];
var k = 0;

for(var i = 0; i<a.length; ++i){
    if(i%3 == 0){
        b = [];
        for(var j = 0; j<3; ++j){
            if(a[i+j] == undefined){
                continue;
            } else{
                b[j] = a[i+j];
            }
        }
        result[k] = b;
        k++;
    }
    
}
console.log(result);


const hfAmounts = [2, 5, 10, 20, 50, 100, 200];  
<table>  
  <tbody>  
  {  
    hfAmounts.map((v, i) =>  
      i % 3 === 0 ?  
        <tr key={i}>  
          {  
            hfAmounts.slice(i, (i % 3 === 0 ? i + 3 : i % 3)).map((y, j) =>  
              <td key={j}>{y}元</td>  
            )  
          }  
        </tr>  
        : null  
    )  
  }  
  </tbody>  
</table> 