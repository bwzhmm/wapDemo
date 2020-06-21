import axios from 'axios';
import Qs from 'qs'; // 引入qs模块，用来序列化post类型的数据
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth';
const http ={};
//https://jy.dev.angke.cn
var BASE_URL = location.origin +  '';
// 创建axios实例
var instance =  axios.create({
  baseURL: BASE_URL, // api的base_url
  timeout: 5000 ,// 请求超时时间
  transformRequest: [(data) => {
    data = JSON.stringify(data)
    return data
  }],
});

// 实例添加请求拦截器
instance.interceptors.request.use(function (config) {
  console.log('cc',config.method)
  // 在发送请求之前做处理...
  config.headers = Object.assign(config.method === 'get' ? {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8'
  } : {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }, config.headers);

  if (config.method === 'post') {
    const contentType = config.headers['Content-Type'];
    // 根据Content-Type转换data格式
    if (contentType) {
      if (contentType.includes('multipart')) { // 类型 'multipart/form-data;'
        // config.data = data;
      } else if (contentType.includes('json')) { // 类型 'application/json;'
        // 服务器收到的raw body(原始数据) "{name:"nowThen",age:"18"}"（普通字符串）
        config.data = JSON.stringify(config.data);
      } else { // 类型 'application/x-www-form-urlencoded;'
        // 服务器收到的raw body(原始数据) name=nowThen&age=18
        // config.data = Qs.stringify(config.data);
        console.log('1111')
        // config.data = JSON.stringify(config.data);
      }
    }
  }
  return Promise.resolve(config);
}, function (error) {
  // 对请求错误做处理...
  return Promise.reject(error);
});


// 响应拦截器
instance.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      // 根据服务端约定的状态码：5001:非法的token; 5002:其他客户端登录了; 5004:Token 过期了;
      if (res.code === 5001 || res.code === 5002 || res.code === 5004) {
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('LogOut').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          })
      }
      return Promise.reject('error')
    } else { // res.code === 200,正常返回数据
        return response.data
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default instance;

