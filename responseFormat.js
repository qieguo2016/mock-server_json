/**
 * @authors     : qieguo
 * @date        : 2016/11/17
 * @version     : 1.0
 * @description : 格式化响应数据，输入对象，输出JSON字符串
 */

'use strict';

const result = {
	"000000": {"code": "000000", "message": "处理成功"},
	"000001": {"code": "001001", "message": "参数错误"},
	"000002": {"code": "001002", "message": "服务端错误"},
};


function successHandle(data) {
	return JSON.stringify(Object.assign({}, result["000000"], {body: data, time: Date.now(), version: '1.0.0'}));
}

function errorHandle(err) {
	return JSON.stringify(Object.assign({}, result["001001"], {body: err, time: Date.now(), version: '1.0.0'}));
}

function invalidHandle(err) {
	return JSON.stringify(Object.assign({}, result["001002"], {body: err, time: Date.now(), version: '1.0.0'}));
}

module.exports = {
	successHandle: successHandle,
	errorHandle  : errorHandle,
	invalidHandle: invalidHandle
}
