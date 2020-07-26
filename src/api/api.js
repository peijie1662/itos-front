import axios from 'axios'

//后台URL
let base = '/api';
//OFFICE Websocket的URL
export const OFFICE_WS_URL = 'ws://169.169.41.27:7857/ws';
//PRD Websocket的URL
export const PRD_WS_URL = 'ws://169.169.40.107:7857/ws';
//移动App的URL//TODO
export const APP_URL = "http://169.169.41.27:8081/";

//后台URL
//let base = 'http://169.169.41.27:8099/api';
//OFFICE Websocket的URL
//export const OFFICE_WS_URL = 'ws://169.169.41.27:7857/ws';
//PRD Websocket的URL
//export const PRD_WS_URL = 'ws://169.169.40.107:7857/ws';
//移动App的URL//TODO
//export const APP_URL = "http://169.169.41.27:8081/";

//后台URL
//let base = 'http://10.170.59.44:7856';
//OFFICE Websocket的URL
//export const OFFICE_WS_URL = 'ws://10.170.59.44:7857/ws';
//PRD Websocket的URL
//export const PRD_WS_URL = 'ws://169.169.40.107:7857/ws';
//移动App的URL
//export const APP_URL = "http://10.170.59.44:8081/";

export const STATIC_URL = `${base}/itosfile/`
export const UPLOAD_TASK_URL = `${base}/task/uploadfile`
export const UPLOAD_MODEL_URL = `${base}/model/uploadfile`
export const UPLOAD_FACE_URL = `${base}/user/face`
export const UPLOAD_DOCUMENT_URL = `${base}/document/upload`

export const login = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

//------------------------------------------终端管理
//终端列表
export const getClientList = params => { return axios.post(`${base}/dispatchclient/list`, params).then(res => res.data); };
//登记终端
export const addClient = params => { return axios.post(`${base}/dispatchclient/add`, params).then(res => res.data); };
//修改终端
export const updateClient = params => { return axios.post(`${base}/dispatchclient/update`, params).then(res => res.data); };
//删除终端
export const deleteClient = params => { return axios.post(`${base}/dispatchclient/delete`, params).then(res => res.data); };
//通知服务端重载终端
export const serverReloadClient = params => { return axios.post(`${base}/dispatchclient/reload`, params).then(res => res.data); };
//所有终端任务列表
export const getDispatchTaskAll = params => { return axios.post(`${base}/dispatchclient/alltask`, params).then(res => res.data); };
//分页终端任务列表
export const getDispatchTaskPage = params => { return axios.post(`${base}/dispatchclient/pagetask`, params).then(res => res.data); };
//终端任务列表总数
export const getDispatchTaskCount = params => { return axios.post(`${base}/dispatchclient/taskcount`, params).then(res => res.data); };
//查询项-简介
export const getAbsList = params => { return axios.post(`${base}/dispatchclient/abss`, params).then(res => res.data); };

//------------------------------------------模版管理
//任务模版列表
export const getModelList = params => { return axios.post(`${base}/model/list`, params).then(res => res.data); };
//修改任务模版
export const updateModel = params => { return axios.post(`${base}/model/update`, params).then(res => res.data); };
//删除任务模版
export const deleteModel = params => { return axios.post(`${base}/model/delete`, params).then(res => res.data); };
//创建任务模版
export const addModel = params => { return axios.post(`${base}/model/add`, params).then(res => res.data); };
//改变模版状态
export const chgModelStatus = params => { return axios.post(`${base}/model/status`, params).then(res => res.data); };
//组合任务模版
export const getComposeModelList = params => { return axios.post(`${base}/model/composelist`, params).then(res => res.data); };
//非组合任务模版
export const getNotComposeModelList = params => { return axios.post(`${base}/model/notcomposelist`, params).then(res => res.data); };
//添加分组
export const addModelGroup = params => { return axios.post(`${base}/model/addgroup`, params).then(res => res.data); };
//分组列表
export const getGroupList = params => { return axios.post(`${base}/model/grouplist`, params).then(res => res.data); };
//删除分组
export const delModelGroup = params => { return axios.post(`${base}/model/delgroup`, params).then(res => res.data); };
//更新分组
export const updateModelGroup = params => { return axios.post(`${base}/model/updategroup`, params).then(res => res.data); };
//分组排序
export const sortingGroup = params => { return axios.post(`${base}/model/sortgroup`, params).then(res => res.data); };

//------------------------------------------组合任务
//组合任务模版详细信息
export const saveComposeModelDetail = params => { return axios.post(`${base}/composetask/savecomposedetail`, params).then(res => res.data); };
//组合任务模版详细信息
export const getComposeModelDetail = params => { return axios.post(`${base}/composetask/getcomposedetail`, params).then(res => res.data); };
//读取组合模版的组合任务
export const getComposeTaskByModel = params => { return axios.post(`${base}/composetask/getcomposetaskbymodel`, params).then(res => res.data); };
//启动组合任务
export const startComposeTask = params => { return axios.post(`${base}/composetask/startcomposetask`, params).then(res => res.data); };
//读取组合任务的子任务
export const getTaskInCompose = params => { return axios.post(`${base}/composetask/gettaskincompose`, params).then(res => res.data); };
//删除组合任务
export const deleteComposeTask = params => { return axios.post(`${base}/composetask/deletecomposetask`, params).then(res => res.data); };

//------------------------------------------人工任务
//人工执行任务列表
export const getManualTaskList = params => { return axios.post(`${base}/manualtask/list`, params).then(res => res.data); };
//创建人工任务
export const addManualTask = params => { return axios.post(`${base}/manualtask/add`, params).then(res => res.data); };
//任务状态-SWAP
export const swapTask = params => { return axios.post(`${base}/manualtask/swap`, params).then(res => res.data); };
//新委外记录
export const addDr = params => { return axios.post(`${base}/manualtask/newdr`, params).then(res => res.data); };
//修改委外记录
export const updateDr = params => { return axios.post(`${base}/manualtask/updatedr`, params).then(res => res.data); };
//删除委外记录
export const deleteDr = params => { return axios.post(`${base}/manualtask/deletedr`, params).then(res => res.data); };
//任务委外列表
export const getDrList = params => { return axios.post(`${base}/manualtask/drlist`, params).then(res => res.data); };
//人工执行任务分页
export const getManualTaskPage = params => { return axios.post(`${base}/manualtask/page`, params).then(res => res.data); };
//人工执行任务总数
export const getManualTaskCount = params => { return axios.post(`${base}/manualtask/count`, params).then(res => res.data); };

//------------------------------------------任务通用
//临时任务
export const saveOnceTask = params => { return axios.post(`${base}/task/once`, params).then(res => res.data); };
//在时间周期内生成任务
export const savePeriodTask = params => { return axios.post(`${base}/task/period`, params).then(res => res.data); };
//任务日志
export const getTaskLog = params => { return axios.post(`${base}/task/log`, params).then(res => res.data); };
//任务状态-PROCESSING,DONE,CANCEL
export const updateTaskStatus = params => { return axios.post(`${base}/task/updatestatus`, params).then(res => res.data); };
//任务状态-MODIFY
export const modifyTask = params => { return axios.post(`${base}/task/modify`, params).then(res => res.data); };

//------------------------------------------智能提示
//智能提示列表
export const getSmartTipsList = params => { return axios.post(`${base}/smarttips/list`, params).then(res => res.data); };
//添加智能提示
export const addSmarttips = params => { return axios.post(`${base}/smarttips/add`, params).then(res => res.data); };
//修改智能提示
export const updateSmarttips = params => { return axios.post(`${base}/smarttips/update`, params).then(res => res.data); };
//删除智能提示
export const deleteSmarttips = params => { return axios.post(`${base}/smarttips/delete`, params).then(res => res.data); };

//------------------------------------------用户管理
//用户管理
export const getUserList = params => { return axios.post(`${base}/user/list`, params).then(res => res.data); };
//用户权限
export const updateAuthority = params => { return axios.post(`${base}/user/authority`, params).then(res => res.data); };
//用户信息
export const updateContent = params => { return axios.post(`${base}/user/content`, params).then(res => res.data); };
//删除用户
export const delUser = params => { return axios.post(`${base}/user/delete`, params).then(res => res.data); };
//新用户
export const addUser = params => { return axios.post(`${base}/user/add`, params).then(res => res.data); };
//用户首页
export const updateFirstPage = params => { return axios.post(`${base}/user/firstpage`, params).then(res => res.data); };
//新用户
export const updatePassword = params => { return axios.post(`${base}/user/password`, params).then(res => res.data); };
//在线用户
export const getOnlineUserList = params => { return axios.post(`${base}/user/onlineusers`, params).then(res => res.data); };
//短信订阅
export const smsSubscription = params => { return axios.post(`${base}/user/subscription`, params).then(res => res.data); };

//------------------------------------------关联信息
//设备号关联信息
export const machineNameAssociate = params => { return axios.post(`${base}/associate/machinename`, params).then(res => res.data); };

//------------------------------------------首页信息
//值班表
export const dutyList = params => { return axios.post(`${base}/page/duty/list`, params).then(res => res.data); };
//添加值班
export const addDuty = params => { return axios.post(`${base}/page/duty/add`, params).then(res => res.data); };
//删除值班
export const delDuty = params => { return axios.post(`${base}/page/duty/delete`, params).then(res => res.data); };
//系统日志
export const getItosLog = params => { return axios.post(`${base}/page/itoslog`, params).then(res => res.data); };

//------------------------------------------PDF报表
//组合任务报表
export const composeReport = params => { return axios.post(`${base}/pdf/compose`, params).then(res => res.data); };

//------------------------------------------文档管理
//文档列表
export const documentList = params => { return axios.post(`${base}/document/list`, params).then(res => res.data); };
//删除文档
export const delDocument = params => { return axios.post(`${base}/document/del`, params).then(res => res.data); };
//修改文档
export const updDocument = params => { return axios.post(`${base}/document/update`, params).then(res => res.data); };

//------------------------------------------文件比对
//页端访问列表
export const getCompareList = params => { return axios.post(`${base}/compare/pagecomparelist`, params).then(res => res.data); };
//添加比对项
export const addCompare = params => { return axios.post(`${base}/compare/add`, params).then(res => res.data); };
//修改比对项
export const updCompare = params => { return axios.post(`${base}/compare/update`, params).then(res => res.data); };
//删除比对项
export const delCompare = params => { return axios.post(`${base}/compare/del`, params).then(res => res.data); };

//-------------------------------------------服务拓扑
//添加服务信息
export const addAppInfo = params => { return axios.post(`${base}/appinfo/add`, params).then(res => res.data); };
//修改服务信息
export const updAppInfo = params => { return axios.post(`${base}/appinfo/upd`, params).then(res => res.data); };
//删除服务信息
export const delAppInfo = params => { return axios.post(`${base}/appinfo/del`, params).then(res => res.data); };
//服务信息列表
export const listAppInfo = params => { return axios.post(`${base}/appinfo/list`, params).then(res => res.data); };
//场景添加服务
export const addSceneApp = params => { return axios.post(`${base}/appinfo/addsceneapp`, params).then(res => res.data); };
//场景服务列表
export const listSceneApp = params => { return axios.post(`${base}/appinfo/listsceneapp`, params).then(res => res.data); };
//删除场景服务
export const delSceneApp = params => { return axios.post(`${base}/appinfo/delsceneapp`, params).then(res => res.data); };
//场景连接列表
export const listSceneCon = params => { return axios.post(`${base}/appinfo/listscenecon`, params).then(res => res.data); };
//添加场景连接
export const addSceneCon = params => { return axios.post(`${base}/appinfo/addscenecon`, params).then(res => res.data); };
//删除场景连接
export const delSceneCon = params => { return axios.post(`${base}/appinfo/delscenecon`, params).then(res => res.data); };
//拓扑位置更新
export const updCoordinate = params => { return axios.post(`${base}/appinfo/savecoordinate`, params).then(res => res.data); };
//场景标签列表
export const listSceneLab = params => { return axios.post(`${base}/appinfo/listscenelab`, params).then(res => res.data); };
//添加场景标签
export const addSceneLab = params => { return axios.post(`${base}/appinfo/addscenelab`, params).then(res => res.data); };
//删除场景标签
export const delSceneLab = params => { return axios.post(`${base}/appinfo/delscenelab`, params).then(res => res.data); };
//标签位置更新
export const updLabCoordinate = params => { return axios.post(`${base}/appinfo/savelabcoordinate`, params).then(res => res.data); };

//-------------------------------------------系统代码
//添加代码
export const addSysCode = params => { return axios.post(`${base}/syscode/add`, params).then(res => res.data); };
//修改代码
export const updSysCode = params => { return axios.post(`${base}/syscode/upd`, params).then(res => res.data); };
//删除代码
export const delSysCode = params => { return axios.post(`${base}/syscode/del`, params).then(res => res.data); };
//列表
export const listSysCode = params => { return axios.post(`${base}/syscode/list`, params).then(res => res.data); };