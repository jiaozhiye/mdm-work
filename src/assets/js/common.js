export default (function (env){
	let envObj = {
		env: '请配置工程环境~~~',
		serverUrl: '',
		nodeServerUrl: ''
	}
	if (env == 'production'){
		// 使控制台 console 输出失效
		console.log = console.warn = console.error = console.info = function(){}
		envObj.env = '当前工程环境：production'
		// hrms 接口
		envObj.serverUrl = '/hrms/'
		// 获取七牛云 token 接口
		envObj.qnTokenUrl = 'http://123.57.140.115:8080/'
		// node 接口
		envObj.nodeServerUrl = 'http://59.110.152.54:2080/hrms/'
	} else if (env == 'development'){
		envObj.env = '当前工程环境：development'
		// hrms 接口
		// envObj.serverUrl = 'http://127.0.0.1:2080/hrms/'
		envObj.serverUrl = 'http://192.168.1.104:8081/hrms/'
		// 获取七牛云 token 接口
		envObj.qnTokenUrl = 'http://192.168.1.104:8080/'
		// node 接口
		envObj.nodeServerUrl = 'http://127.0.0.1:2080/hrms/'
	}
	return envObj
})(process.env.NODE_ENV === 'production' ? 'production' : 'development')
