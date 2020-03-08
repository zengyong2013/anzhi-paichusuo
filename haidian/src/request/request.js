const { fetchBase } = require('./base.js')
/**发起一个get请求 */
const reqGet = (url , params = {}) =>{
    return fetchBase(url , params ,'get')
}
/**发起一个post请求 */
const reqPost = (url , params = {}) => {
    return fetchBase(url , params , 'post')
}
/**发起一个put请求 */
const reqPut = (url , params = {}) => {
    return fetchBase(url , params , 'put')
}
/**发起一个delete请求 */
const reqDelete = (url , params = {}) => {
    return fetchBase(url , params , 'delete')
}
const reqUploadFile = (url , formData) => {
    return fetchBase(url , formData , 'post')
}
export {
    reqGet,
    reqPost,
    reqPut,
    reqDelete,
    reqUploadFile
}
