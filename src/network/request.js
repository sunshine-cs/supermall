import axios from 'axios'


export function request(config) {
const instance =axios.create({
  //baseURL:'http://123.207.32.32:8000',
  baseURL:'http://106.54.54.237:8000/api/v1',
  timeout:5000
})
  //axios的拦截器
  //需要请求拦截的情况：1.比如config中的一些信息不符合服务器的要求；2.比如每次发送网络请求时，都希望在界面中显示一个请求的图标；3.
  //某些网络请求，必须携带一些特殊的信息
  instance.interceptors.request.use(config =>{
     console.log(config);
    return config
  },err => {
     console.log(err)
  });
//拦截响应
  instance.interceptors.response.use(res =>{
     console.log(res)
    return res.data
  },err =>{
     console.log(err)
  });
  //instance(config.baseConfig).then(res =>{config.success(res)}).catch(err =>{config.failure(err)})
  //也可直接return 一个Promise
  return instance(config)
}


