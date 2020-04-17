import axios from 'axios'

//后台URL
//let base = 'http://169.169.41.26:7856';
//Websocket的URL
//export const WS_URL = 'ws://169.169.41.26:7857/ws';
//移动App的URL
//export const APP_URL = "http://169.169.41.26:8081/";

//后台URL
let base = 'http://10.170.59.44:7856';
//Websocket的URL
export const WS_URL = 'ws://10.170.59.44:7857/ws';
//移动App的URL
export const APP_URL = "http://10.170.59.44:8081/";

export const STATIC_URL = `${base}/itosfile/`
export const UPLOAD_TASK_URL = `${base}/task/uploadfile`
export const UPLOAD_MODEL_URL = `${base}/model/uploadfile`
export const UPLOAD_FACE_URL = `${base}/user/face`

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

//------------------------------------------人工任务
//人工执行任务列表
export const getManualTaskList = params => { return axios.post(`${base}/manualtask/list`, params).then(res => res.data); };
//创建人工任务
export const addManualTask = params => { return axios.post(`${base}/manualtask/add`, params).then(res => res.data); };
//任务状态-SWAP
export const swapTask = params => { return axios.post(`${base}/manualtask/swap`, params).then(res => res.data); };

//------------------------------------------任务通用
//临时任务
export const saveOnceTask = params => { return axios.post(`${base}/task/once`, params).then(res => res.data); };
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

//------------------------------------------PDF报表
//组合任务报表
export const composeReport = params => { return axios.post(`${base}/pdf/compose`, params).then(res => res.data); };
