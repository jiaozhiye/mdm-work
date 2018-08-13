/**
 * @Author: Jzy
 * @Date: 2017/12/12
 * @Last Modified by:   jzy
 * @Last Modified time: 2018-02-21 17:52:11
 */
function cloneObj (obj){
    let str, newobj = obj.constructor === Array ? [] : {}
    if (typeof obj !== 'object'){
        return
    } else if (window.JSON){
        str = JSON.stringify(obj) //系列化对象
        newobj = JSON.parse(str)  //还原
    } else {
        for (let i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneObj(obj[i]) : obj[i]
        }
    }
    return newobj
}

function getRandom(a, b){
    return Math.floor(Math.random() * (b - a + 1)) + a
}

function prefixCss(obj, prefixFeature, value){
    let prefix = prefixFeature.slice(0, 1).toUpperCase() + prefixFeature.slice(1)
    let prefixArr = ['webkit' + prefix, 'moz' + prefix, 'ms' + prefix, prefixFeature]
    for (let i = 0; i < prefixArr.length; i++){
        obj.style[prefixArr[i]] = value
    }
}

function getUrlHash(){
    return window.location.hash.slice(1) || ''
}

function recursionTree(arr, callback){
    if (Array.isArray(arr)){
        for (let i = 0; i < arr.length; i++){
            callback && callback(arr[i])
            recursionTree(arr[i].children, callback)
        }
    }
}

// 函数防抖
function debounce(fn, delay){
    return function(...args){
        fn.timer && clearTimeout(fn.timer)
        fn.timer = setTimeout(() => fn.apply(this, args), delay)
    }
}

// 函数节流
function throttle(fn, delay){
    return function (...args){
        let _nowTime = + new Date()
        if (!fn._lastTime || _nowTime - fn._lastTime > delay){
            fn.apply(this, args)
            fn._lastTime = _nowTime
        }
    }
}

// base64 转 blob
function convertBase64UrlToBlob(urlData){
    // 去掉url的头，并转换为byte
    let bytes = window.atob(urlData.split(',')[1])
    // 处理异常，将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++){
        ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab] , { type: 'image/png' })
}

// 追加 style 内部样式
function appendStyleNode(fontName){
    let styleEl = document.createElement('style')
    styleEl.id  = fontName
    styleEl.innerHTML = `@font-face{font-family:"${fontName}";src:url(static/fonts/${fontName}.woff) format("woff")}`
    document.querySelector('head').appendChild(styleEl)
    styleEl = null
}


export {
    cloneObj,
    getRandom,
    prefixCss,
    getUrlHash,
    recursionTree,
    debounce,
    throttle,
    convertBase64UrlToBlob,
    appendStyleNode
}
