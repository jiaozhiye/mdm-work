export default (function (env){
	let envObj = {
		env: '请配置工程环境~~~',
		serverUrl: ''
	}
	if (env == 'production'){
		// 使控制台 console 输出失效
		console.log = console.warn = console.error = console.info = function(){}
		envObj.env = '当前工程环境：production'
		// envObj.serverUrl = 'http://127.0.0.1:2080/hrms/'
		envObj.serverUrl = '/hrms/'
	} else if (env == 'development'){
		envObj.env = '当前工程环境：development'
		envObj.serverUrl = 'http://127.0.0.1:2080/hrms/'
		// envObj.serverUrl = 'http://192.168.1.105:8080/hrms/'
	}
	return envObj
})(process.env.NODE_ENV === 'production' ? 'production' : 'development')