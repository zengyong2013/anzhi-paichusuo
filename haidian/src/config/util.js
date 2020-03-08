import router from "../router/router"

// 判断是否为空 不为空返回数据 为空返回--
export const isNotNull = (data, str) => {
    if (isBlank(str)) {
        str = "--"
    }
    if (data == null || data === 'null' || data === '' || data === undefined || data === 'undefined' || data === 'unknown') {
        return str
    } else {
        return data
    }
}

// 判断是否为空 返回true/false
export const isBlank = (data) => {
    if (data == null || data === 'null' || data === '' || data === undefined || data === 'undefined' || data === 'unknown') {
        return true
    } else {
        return false
    }
}

export const formatTime = (date, fmt = "yyyy-MM-dd hh:mm:ss") => {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    // 返回上一页
export const backPage = () => {
    router.go(-1)
}