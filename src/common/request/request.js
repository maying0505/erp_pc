import _ from 'lodash'
import {hashHistory} from 'react-router'
import {message} from 'antd'
import {local, session} from 'common/util/storage.js'

// const apiUrl = 'http://39.104.178.102/lhb-manage/a/rest'; //请求接口ip
const apiUrl = 'http://sys.dezhierp.com/lhb-manage/a/rest'
// const apiUrl = '/lhb-manage/a/rest'; //打包请求接口ip
// const apiUrl = 'http://24wfe2.natappfree.cc/lhb-manage/a/rest' //lzy请求接口ip
// const apiUrl = 'http://192.168.2.135:8080/lhb-manage/a/rest' //yyj请求接口ip
// const apiUrl = 'http://192.168.2.96/lhb-manage/a/rest'   //hc请求接口ip

// const apiUrl = 'http://ta37c4.natappfree.cc';   // hxj接口

function request(url, data, type, token, timeout) {

    let opt = {}

    // 需要完善这个处理
    opt.url = apiUrl + url
    opt.data = data
    opt.type = type
    opt.timeout = timeout
    opt.headers = {
        'token': token
    }
    let hasProtocol = /(http|https)\:\/\//i.test(opt.url)

    if (opt.url && !hasProtocol && process.env.NODE_ENV === 'development') {
        opt.url = '/api' + opt.url
    }
    // 设置默认 timeout 时间
    if (!opt.timeout) {
        opt.timeout = 1000 * 7.777
    }
    opt.dataType = 'json'
    console.log('opt:', opt)
    return Promise
        .resolve($.ajax.call($, opt))
        .then(res => {
            // 此处可以根据返回值做权限控制
            console.log(res)

            if (res.code === '401') {
                session.set('isLogin', false)
                hashHistory.push('/login')
            }
            if (res.code === 666) {
                message.error('请重新登录')
                session.set('isLogin', false)
                hashHistory.push('/login')
            }

            if (res.code === '403') {
                message.error('没有权限')
            }

            return res
        })
        .catch(function (error) {
            if (error.status === 666) {
                message.error('请重新登录')
                session.set('isLogin', false)
                hashHistory.push('/login')
            } else {
                message.error(error.statusText)
            }
            console.log('global handle ajax error:', error)
            return error
        })
}

export default {request, apiUrl}
