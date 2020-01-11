import axios from 'axios'

let base = 'http://10.170.59.44:7856';

export const WS_URL = "ws://10.170.59.44:7857/ws";

export const login = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

//任务模版列表
export const getModelList = params => { return axios.post(`${base}/modellist`, params).then(res => res.data); };
//修改任务模版
export const updateModel = params => { return axios.post(`${base}/modelupdate`, params).then(res => res.data); };
//删除任务模版
export const deleteModel = params => { return axios.post(`${base}/modeldelete`, params).then(res => res.data); };
//创建任务模版
export const addModel = params => { return axios.post(`${base}/modeladd`, params).then(res => res.data); };

//下发终端任务列表
export const getDispatchTaskList = params => { return axios.post(`${base}/dispatchtasklist`, params).then(res => res.data); };
//人工执行任务列表
export const getManualTaskList = params => { return axios.post(`${base}/manualtasklist`, params).then(res => res.data); };
//创建人工任务
export const addManualTask = params => { return axios.post(`${base}/addManualtask`, params).then(res => res.data); };
//任务日志
export const getTaskLog = params => { return axios.post(`${base}/tasklog`, params).then(res => res.data); };
//任务状态-PROCESSING,DONE,CANCEL
export const updateTaskStatus = params => { return axios.post(`${base}/updatetaskstatus`, params).then(res => res.data); };
//任务状态-MODIFY
export const modifyTask = params => { return axios.post(`${base}/modifytask`, params).then(res => res.data); };
//任务状态-SWAP
export const swapTask = params => { return axios.post(`${base}/swaptask`, params).then(res => res.data); };

//智能提示列表
export const getSmartTipsList = params => { return axios.post(`${base}/smarttipslist`, params).then(res => res.data); };
//添加智能提示
export const addSmarttips = params => { return axios.post(`${base}/addSmarttips`, params).then(res => res.data); };
//修改智能提示
export const updateSmarttips = params => { return axios.post(`${base}/updateSmarttips`, params).then(res => res.data); };
//删除智能提示
export const deleteSmarttips = params => { return axios.post(`${base}/deleteSmarttips`, params).then(res => res.data); };