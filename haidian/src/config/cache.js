const setCache = (key , value) => {
    return localStorage.setItem(key , JSON.stringify(value))
}
const getCache = (key) => {
    return JSON.parse(localStorage.getItem(key))
}
const delCache = (key) => {
    return localStorage.removeItem(key)
}
const flushCache = ()=> {
    return localStorage.clear()
}

module.exports = {
    setCache , getCache , delCache , flushCache
}