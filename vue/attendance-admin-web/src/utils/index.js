import request from './axios'
/**
 * @param url
 * @param config 相关配置，如params等
 */
const GetBuilder = (url, config = {}) => {
  return request.get(url, config)
}

/**
 * @param url 地址最后的.do将统一加上
 * @param data 未传入时置为空对象
 * @param resultCallback 该参数仅为了兼容旧写法，新的api请勿使用
 */
const PostBuilder = (url, data = {}, resultCallback) => {
  if (resultCallback) {
    return request.post(url , data).then(resultCallback.onResult)
  } else {
    return request.post(url, data)
  }
}

// 获取大数据云平台的地址
// Service.GetDatacenterUrl = config => GetBuilder('/datacenter', config)

 export const UserEditService  = (data) => PostBuilder('/check/rest/Overtime/list', data)



