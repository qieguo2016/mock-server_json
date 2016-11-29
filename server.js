/**
 * @authors     : qieguo
 * @date        : 2016/11/17
 * @version     : 1.0
 * @description : 开发服务器, 提供本地mock数据
 */

'use strict';

const http = require('http');
const fs = require('fs');
const logger = require('./logger');
const router = require('./router');		// 根据路由配置返回不同的JSON文件路径
const resFormat = require('./responseFormat');
const PORT = 9090;

http.createServer((req, res) => {

	router(req, res, function (realPathName) {

		logger.info(">>>>  real path: " + realPathName);

		fs.exists(realPathName, (exists) => {
			if (exists) {
				fs.readFile(realPathName, "utf8", function (err, data) {
					if (err) {  // 读取文件出错
						logger.error(err);
						res.writeHead(503, {'Content-Type': 'application/json;charset=utf-8'});
						res.write(resFormat.invalidHandle(err));
					} else {   // 读取文件成功
						logger.info('>>>>  server read file success');
						res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
						data = JSON.parse(data);
						res.write(resFormat.successHandle(data));
					}
					res.end();
				});
			} else {  // 文件不存在
				logger.error('指定路径的文件不存在: ' + realPathName);
				res.writeHead(404, {'Content-Type': 'application/json;charset=utf-8'});
				res.write(resFormat.errorHandle({error: 'Resource Not Found'}));
				res.end();
			}
		});
	});

}).listen(PORT);

logger.info(`dev server running at http://localhost:${PORT}/`);
