/*******************************************************
 * Athena 埋点统一上报封装
 * 1. 调用initAthenaAsync(appId, 'test', 'v1.1')初始化埋点并注册app
 * 
 * 2. 调用如下方法上报事件
 * athenaEventTracking('h5egatee_common_click', {
 *   distinguish_id: "xxx", // 埋点事件唯一标识
 *   session_id: "123435346o3uo3i",
 *   page: "Home Page",
 *   member_id: "123",
 *  // ...更多自定义参数
 * }, 'beacon')
 ******************************************************/

/**
 * 异步初始化Athena H5 SDK
 * @param {number|string} appId 埋点平台注册的appId
 * @param {'test'|'prod'} env 环境
 * @param {string} openEtm 是否开启埋点 注意隐私政策，支持后置开启。
 * @param {*} appVn app/网站版本号
 * @param {*} loc 服务器配置
 * @param {*} comParam // 自定义参数设置 {"key": "value"}
 * @returns 
 */
function initAthenaAsync(appId, env = 'prod', appVn = '1.0', openEtm = 'open', loc = 'aws-eur', comParam = {}) {
    return (function(win, doc, sc, url, evt, elem, dd) {
        // 初始化app和环境信息
        win['etm_setting'] = {
            appid: appId,
            openEtm: openEtm,
            app_vn: appVn,
            env:   env,
            loc: loc,
            comParam
        }
        win.sendTrackerName = evt;
        win[evt] = win[evt] || function(...args) { 
            console.log(`[AthenaSdk][${evt}]`, ...args);
            (win[evt].queue = win[evt].queue || []).push(args)
        };
        win[evt].start = +new Date();
        win['ath_elpv'] = win['ath_elpv'] || function(...args){
            (win['ath_elpv'].queue = win['ath_elpv'].queue || []).push(args)
        };
        elem = doc.createElement(sc);
        dd = doc.getElementsByTagName(sc)[0];
        elem.async = 1;
        elem.src = url; (doc.body || doc.documentElement).appendChild(elem);

        console.log('[AthenaSDK][初始化]::', win['etm_setting'])
    })(window, document, 'script', 'https://h5.eagllwin.com/bigdata-sdk/athena-etm.js?v=' + Math.round(new Date().getTime() / 1000 / 300), 'ath_send');
}

/**
 * 获取指定格式时间字符串
 * @param {*} date 
 * @param {*} fmt 
 * @returns 
 */
const formatTimeStamp = (date=new Date(), fmt='yyyy-MM-dd hh:mm:ss')=> {  
    var o = {
        "M+" : date.getMonth() + 1, //月份   
        "d+" : date.getDate(), //日   
        "h+" : date.getHours(), //小时   
        "m+" : date.getMinutes(), //分   
        "s+" : date.getSeconds(), //秒   
        "q+" : Math.floor((date.getMonth() + 3) / 3), //季度   
        "S" : date.getMilliseconds()//毫秒   
    };
    // if (arguments.length == 1) {
    //     fmt = 'yyyy-MM-dd hh:mm:ss';
    // }
    if (/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for ( var k in o){
        if (new RegExp("(" + k + ")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]): (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 埋点公共字段
 * @returns 
 */
const getCommonFields = () => {
    let commonFields = {
        create_time: formatTimeStamp()
    }
    return commonFields
}

/**
 * 定义埋点敏感字段
 */
const etmSensitiveFields = [] //['phone', 'member_id']

/**
 * 上报数据过滤敏感字段
 * @param {{}} data 上报数据
 * @param {[string]} removeFields 过滤字段 不区分大小写
 * @param {string} rule 字段匹配规则 contain(包含)|equal(全匹配)
 * 
 * @returns {{}}
 */
const trackingDataFilter = (data, removeFields, rule = 'contain') => {
    if (!data || typeof data !== 'object' || !removeFields || !Array.isArray(removeFields)) {
        return data || {}
    }
    let tempData = {}
    try {
        tempData = Object.assign({}, data)
        const keys = Object.keys(data).map(k => k.toLowerCase());
        removeFields.map(field => {
            if (rule === "equal") {
                if (Object.hasOwnProperty.call(data, field) || keys.includes(field.toLowerCase())) {
                    delete tempData[field]
                }
            } else {
                keys.forEach(key => {
                    if (key.includes(field.toLowerCase())) {
                        delete tempData[key]
                    }
                })
            }
        })
    } catch (error) {
        console.error(error)
        // throw error
    }
    console.log('tempData=',tempData, ", data=",data)
    return tempData
}

/**
 * 定义队列缓存初始化
 */
const event_queue = [];
/**
 * 埋点上报方法
 * @param {string} event 埋点事件类型
 * @param {{} | string} params 埋点上报参数 必须是js对象 or JSON字符串
 * @param {'img'|'beacon'} type 埋点上报类型，开启sendbeacon方式上报
 */
function athenaEventTracking(event, params, type = "img") {
    if(!event || !['string', 'object'].includes(typeof params)) {
        console.error('[athenaEventTracking][Params Error]::The parameter format is incorrect. ', ' event->', event, '. params->', params)
        return ;
    }
    console.log('[athenaEventTracking][params]::', event, params, type)
    // 解析JSON
    let _data = params;
    if(params && typeof params === 'string') {
        try {
            _data = JSON.parse(params)
        } catch (error) {
            console.error('[athenaEventTracking][Params Error]::', error)
            return;
        }
    }

    // 处理上报参数
    const _params = Object.assign(getCommonFields(), trackingDataFilter(_data || {}, etmSensitiveFields))

    if(!window['ath_send']) {
        console.log("[Tracking][event_queue][push]::", event, _params, type)
        event_queue.push({event, params: _params, type})
    } else {
        console.log('[Tracking][send]::', event, _params, type)
        window.ath_send(event, _params, type)

        // 递归清空缓存队列
        if(event_queue.length > 0) {
            const item = event_queue.shift()
            console.log("[Tracking][event_queue][shift]::", item.event, item.params, item.type)
            athenaEventTracking(item.event, item.params, item.type)
        }
    }
}