import common from 'assets/js/common'
import { instance, serverUrl, nodeServerUrl } from './fetch'

// 登录接口
export const doLogin = params => instance.post('/login', params)

// 退出登录接口
export const doLogout = () => instance.get('/mgr/user/loginout')

// 获取用户全部信息
export const getUserAllInfo = () => instance.get('/mgr/user/showMyDetail')

// 更改用户密码
export const updateUserInfo = params => instance.post('/mgr/user/modifyMyPwd', params)

// 获取应用导航接口
export const getNavList = () => instance.get('/mgr/menu')

// 显示所有门店
export const getStoreList = params => instance.get('/mgr/store/list', {params})

// 添加门店
export const addStoreInfo = params => instance.post('/mgr/store/add', params)

// 查看门店信息
export const getStoreRecord = params => instance.get('/mgr/store/showById', {params})

// 修改门店信息
export const modStoreRecord = params => instance.post('/mgr/store/updateById', params)

// 启用/停用门店
export const stopStore = params => instance.get('/mgr/store/stop', {params})

// 获取门店(部门)列表 select
export const getDeptSelect = () => instance.get('mgr/store/getStoreDict')

// 获取数据字典列表 select
export const getDictSelect = params => instance.get('mgr/dict/getDictIncludeChoose', {params})

// 获取员工列表
export const getStaffInfo = params => instance.get('/mgr/staff/list', {params})

// 新增员工
export const addStaffInfo = params => instance.post('/mgr/staff/add', params)

// 获取通知信息
export const getNoticeRecord = params => instance.get('/mgr/notice/showApplyById', {params})

// 处理申请调入
export const execApplyIn = params => instance.post('/mgr/apply/deal', params)

// 辞退员工
export const fireStaff = params => instance.post('/mgr/storeMgr/fire', params)

// 获取员工信息
export const getStaffRecord = params => instance.get('/mgr/staff/showById', {params})

// 修改员工信息
export const modStaffInfo = params => instance.post('/mgr/staff/updateById', params)

// 处理调出员工
export const execTransferOut = params => instance.post('/mgr/moveOut/out', params)

// 获取不在职员工信息
export const getNoJobStaffInfo = params => instance.get('/mgr/staffNotOnJob/list', {params})

// 获取不在职员工信息
export const getOffJobStaffRecord = params => instance.get('/mgr/staffNotOnJob/showById', {params})

// 恢复员工在职
export const recoverStaffOnJob = params => instance.get('mgr/staffNotOnJob/recovery', {params})

// 获取调入员工列表
export const getStaffInList = params => instance.get('/mgr/moveIn/list', {params})

// 获取员工调入信息
export const getStaffInRecord = params => instance.get('/mgr/moveIn/showById', {params})

// 获取调出员工列表
export const getStaffOutList = params => instance.get('/mgr/moveOut/list', {params})

// 获取调出员工信息
export const getStaffOutRecord = params => instance.get('/mgr/moveOut/showById', {params})

// 撤销调出
export const cancleStaffOut = params => instance.get('/mgr/moveOut/cancelOut', {params})

// 获取绩效考核列表
export const getStaffScoreList = params => instance.get('/mgr/performance/list', {params})

// 获取员工绩效
export const getStaffScoreRecord = params => instance.get('/mgr/performance/showById', {params})

// 修改员工绩效
export const modStaffScoreRecord = params => instance.post('/mgr/performance/updateById', params)

// 删除奖罚
export const delStaffScoreRecord = params => instance.get('/mgr/performance/deleteById', {params})

// 添加惩罚
export const addStaffScoreRecord = params => instance.post('/mgr/performance/add', params)

// 新增分类
export const addTrainClass = params => instance.post('/mgr/train/type/add', params)

// 获取分类列表
export const getTrainClassList = () => instance.get('/mgr/train/type/list')

// 获取分类记录
export const getTrainClass = params => instance.get('/mgr/train/type/showById', {params})

// 修改分类记录
export const modTrainClass = params => instance.post('/mgr/train/type/updateById', params)

// 删除分类
export const delTrainClassRecord = params => instance.get('/mgr/train/type/deleteById', {params})

// 获取文章列表
export const getArticleList = params => instance.get('/mgr/train/article/list', {params})

// 删除文章记录
export const delArticleRecord = params => instance.get('/mgr/train/article/deleteById', {params})

// 添加文章
export const addArticleRecord = params => instance.post('/mgr/train/article/add', params)

// 获取分类列表 select
export const getClassifySelect = () => instance.get('mgr/train/type/getTypeDict')

// 查看文章信息
export const getArticleRecord = params => instance.get('/mgr/train/article/showById', {params})

// 修改文章记录
export const modArticleRecord = params => instance.post('/mgr/train/article/updateById', params)

// 获取员工考核列表
export const getAssessList = params => instance.get('/mgr/exam/list', {params})

// 获取考题列表
export const getQuestionList = params => instance.get('/mgr/question/list', {params})

// 删除考题记录
export const delQuestionRecord = params => instance.get('/mgr/question/deleteById', {params})

// 添加考题
export const addQuestionRecord = params => instance.post('/mgr/question/add', params)

// 获取考题记录
export const getQuestionRecord = params => instance.get('/mgr/question/showById', {params})

// 修改考题记录
export const modQuestionRecord = params => instance.post('/mgr/question/updateById', params)

// 获取通知列表
export const getNoticeInfo = params => instance.get('/mgr/notice/list', {params})

// 查看通知 type 1
export const getNoticeApplyById = params => instance.get('/mgr/notice/showApplyById', {params})

// 查看通知 type 2
export const getNoticeMoveInById = params => instance.get('/mgr/notice/showMoveInById', {params})

// 查看通知 type 3
export const getNoticeFireById = params => instance.get('/mgr/notice/showStaffFireById', {params})

// 获取职务列表
export const getJobList = () => instance.get('/mgr/job/list')

// 获取权限树
export const getJobTree = () => instance.get('/mgr/job/showResource')

// 新建职务
export const addJobRecord = params => instance.post('/mgr/job/add', params)

// 获取职务记录
export const getJobRecord = params => instance.get('/mgr/job/showById', {params})

// 修改职务权限
export const modJobRecord = params => instance.post('/mgr/job/updateById', params)

// 删除职务权限
export const delJobRecord = params => instance.get('/mgr/job/deleteById', {params})

// 处理员工调入
export const staffApplyIn = params => instance.post('/mgr/apply/moveIn', params)

// 添加预估营业额
export const addEstimateTurnover = params => instance.post('/mgr/storeForecastTurnoverCtrl/add', params, {
    headers: {
        post: { 'Content-Type': 'application/json' }
    },
    transformRequest: [ data => JSON.stringify(data) ]
})

// 添加可变工时
export const addTimeGuide = params => instance.post('/mgr/variableTimeGuideCtrl/add', params, {
    headers: {
        post: { 'Content-Type': 'application/json' }
    },
    transformRequest: [ data => JSON.stringify(data) ]
})

// 获取排班的表头数据列表
export const getPlanThead = () => instance.get('/mgr/schedulingCtrl/getThead')

// 获取员工排班数据列表
export const getPlanStaffInfo = params => instance.get('/mgr/schedulingCtrl/createSchedulingTable', {params})

// 获取单元格可添加的员工列表
export const getCellStaffInfo = params => instance.get('/mgr/schedulingCtrl/getStaff', {params})

// 保存员工排班数据
export const savePlanStaff = params => instance.post('/mgr/schedulingCtrl/save', params, {
    headers: {
        post: { 'Content-Type': 'application/json' }
    },
    transformRequest: [ data => JSON.stringify(data) ]
})

// 员工添加闲时
export const addFreeTime = params => instance.post('/mgr/staffIdleTimeCtrl/saveTime', params)

// 获取员工闲时
export const getFreeTime = params => instance.get('/mgr/staffIdleTimeCtrl/getStaffIdleTime', {params})

// 获取员工显示
export const getAllFreeTime = params => instance.get('/mgr/staffIdleTimeCtrl/getStaffIdleTimeById', {params})

// 获取默认的预估营业额
export const getDefaultTurnover = () => instance.get('/mgr/storeForecastTurnoverCtrl/getForecastTurnover')

// 获取默认的可变工时
export const getDefaultTime = () => instance.get('/mgr/variableTimeGuideCtrl/getVariableTimeGuide')

// 获取单店报表列表
export const getStoreReportList = params => instance.get('/mgr/workTimeCtrl/getWorkTime', {params})

// 获取个人报表列表
export const getPersonReportList = params => instance.get('/mgr/workTimeDetailCtrl/getWorkTimeDetail', {params})

// 获取考题分类
export const getQuestionClassify = params => instance.get('/mgr/question/type/list', {params})

// 添加考题分类
export const addQuestionClassify = params => instance.post('/mgr/question/type/add', params)

// 获取考核分类记录
export const getQuestionClassifyRecord = params => instance.get('/mgr/question/type/showById', {params})

// 修改考核分类
export const modQuestionClassify = params => instance.post('/mgr/question/type/updateById', params)

// 删除考核分类记录
export const delQuestionClassifyRecord = params => instance.get('/mgr/question/type/deleteById', {params})

// 获取考题分类 for select
export const getQuestionClaSelect = params => instance.get('/mgr/question/getTypeByKind', {params})

// 获取来源门店
export const getFromDeptSelect = params => instance.get('/mgr/apply/getFromStoreDict', {params})

// 调入通知
export const execApplyInNotice = params => instance.post('/mgr/moveIn/in', params)

// 新增区域
export const addAreaInfo = params => instance.get('/mgr/areaCtrl/add', {params})

// 修改区域
export const modAreaInfo = params => instance.get('/mgr/areaCtrl/update', {params})

// 获取区域记录
export const getAreaRecord = params => instance.get('/mgr/areaCtrl/showById', {params})

// 删除区域记录
export const delAreaRecord = params => instance.get('/mgr/areaCtrl/delete', {params})

// 获取区域列表
export const getAreaList = params => instance.get('/mgr/areaCtrl/list', {params})

// 获取区域员工列表
export const getStoreAreaList = params => instance.get('/mgr/areaCtrl/showAreaStaff', {params})

// 获取区域下员工列表
export const getAreaStaff = params => instance.get('/mgr/areaCtrl/getStaff', {params})

// 保存区域员工
export const addAreaStaff = params => instance.get('/mgr/areaCtrl/edit', {params})

// 培训 pdf 文件上传地址
export const uploadPdfUrl = `${serverUrl}mgr/train/article/uploadPDF`
// export const uploadPdfUrl = `${nodeServerUrl}poster/template`


// nodejs 接口
// 保存海报
export const savePoster = params => instance.post('/poster/save', params, {
    baseURL: nodeServerUrl,
    withCredentials: true,
    headers: {
        post: { 'Content-Type': 'application/json' }
    },
    transformRequest: [ data => JSON.stringify(data) ]
})

// 上传导出的海报图片
export const uploadPoster = params => instance.post('/poster/upload', params, {
    baseURL: nodeServerUrl,
    withCredentials: true,
    headers: {
        post: { 'Content-Type': 'multipart/form-data' }
    },
    transformRequest: [ data => data ] // multipart/form-data 文件上传，data 不做处理
})

// 模版上传
export const uploadUrl = `${nodeServerUrl}poster/template`

// 获取海报信息 by id
export const getPosterInfo = params => instance.get('/poster/getone', {params, baseURL: nodeServerUrl})

// 获取模版列表
export const getPosterList = () => instance.get('/poster/getlist', {baseURL: nodeServerUrl})

// 删除模版记录
export const removeTemplate = params => instance.get('/poster/del_template', {params, baseURL: nodeServerUrl})

// 获取海报列表 - 分页
export const getPosterPageList = params => instance.get('/poster/pagelist', {params, baseURL: nodeServerUrl})

// 删除海报记录
export const removePoster = params => instance.get('/poster/del_poster', {params, baseURL: nodeServerUrl})































