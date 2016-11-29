/**
 * @authors     : qieguo
 * @date        : 2016/11/17
 * @version     : 1.0
 * @description : 开发服务器的日志系统
 */

'use strict';

const log4js = require('log4js');

log4js.configure({
	appenders     : [
		{type: 'console'},
		{type: 'file', filename: 'logs/access.log', category: 'access'}
	],
	replaceConsole: true
});

let logger = log4js.getLogger('access');
logger.setLevel('DEBUG');

module.exports = logger;