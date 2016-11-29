/**
 * @authors     : qieguo
 * @date        : 2016/11/29
 * @version     : 1.0
 * @description : 简单路由，根据请求参数输出对应的json文件路径
 */

'use strict';

const path = require('path');
const url = require('url');
const logger = require('./logger');
const MOCKPATH = path.join(__dirname, './mock');

const router = function (req, res, next) {

	const reqUrl = url.parse(req.url, true);
	const pathname = reqUrl.pathname;
	logger.info(">>>>  Got Request: " + pathname + "\r\n");

	let realPathName = '';
	let postBody = '';     // 用于暂存post的body

	// node默认不解析post请求体，所以要通过req的data事件监听，每当接受到请求体的数据，就累加到postbody变量中
	req.on('data', function (chunk) {
		postBody += chunk;
	});

	// 在end事件触发后，通过JSON.parse将postbody解析为真正的POST请求体对象
	req.on('end', function () {

		postBody = postBody ? JSON.parse(postBody) : '';

		logger.debug(">>>> request.query: ", reqUrl.query);
		logger.debug(">>>> request.body: \r\n", postBody);

		let body = "";  // 这里因为数据放在post的body里面的body字段，而且body字段多做了一次json.stringfy，所以这里要多转一次,正常情况下是不需要的。

		/**
		 * pathname路由匹配规则，自行定义，可以字符串匹配，可以正则匹配
		 * 匹配到路由路径之后，根据请求的method、query、body等返回不同的文件路径
		 * pathname: <String>  url.parse(req.url, true).pathname
		 * method: <String> req.method {POST、GET、HEAD...}
		 * query: <Object> url.parse(req.url, true).query
		 * body: <Object> JSON.parse(postBody), post特有的
		 * */
		switch (true) {

			// 根据method来匹配
			case (req.method === 'GET'):
				// 根据query来匹配
				let query = reqUrl.query;
				if (query.a === "123") {
					realPathName = path.join(MOCKPATH, pathname + '.json');
				} else {
					realPathName = path.join(MOCKPATH, pathname + '.json');
				}
				break;

			// 根据pathname的字符串比对来匹配
			case ('/abs/asset/resp/list' === pathname):
				// 根据postBody来匹配
				body = JSON.parse(postBody.body);
				if (typeof body.pageIndex !== 'undefined') {
					realPathName = path.join(MOCKPATH, pathname + '_' + body.pageIndex + '.json');
				} else {
					realPathName = path.join(MOCKPATH, pathname + '.json');
				}
				break;

			// 根据pathname的正则来匹配
			case (/\/abs\/asset\/resp\/detail\/\w+/.test(pathname)):
				// 根据postBody来匹配
				body = JSON.parse(postBody.body);
				if (typeof body.pageIndex !== 'undefined') {
					realPathName = path.join(MOCKPATH, pathname + '_' + body.pageIndex + '.json');
				} else {
					realPathName = path.join(MOCKPATH, pathname + '.json');
				}
				break;

			// 默认返回pathname对应的json文件
			default:
				realPathName = path.join(MOCKPATH, pathname + '.json');
		}

		next && next(realPathName);

	});
};


module.exports = router;