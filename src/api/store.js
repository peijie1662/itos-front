import Vue from 'vue'
import Vuex from 'vuex'
import { getClientList } from '@/api/api'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userInfo: "",//用户信息
        clientList: [],//所有终端
        userList: [],//在线用户列表
        sysLog: [], //系统日志
        showIM: false,//显示消息窗口
        attentionIM: "",//消息窗口关注词
    },
    mutations: {
        update_clientList: (state, clientList) => state.clientList = clientList,
        update_userList: (state, userList) => state.userList = userList,
        update_userInfo: (state, userInfo) => state.userInfo = userInfo,
        update_sysLog: (state, log) => state.sysLog.unshift(log),
        clear_sysLog: (state) => state.sysLog = [],
        update_showIM: (state, showIM) => state.showIM = showIM,
        update_attentionIM: (state, attentionIM) => state.attentionIM = attentionIM,
    },
    getters: {
        userInfo: (state) => { return state.userInfo },
        sysLog: (state) => { return state.sysLog },
        showIM: (state) => { return state.showIM },
        attentionIM: (state) => { return state.attentionIM },
    },
    actions: {
        updateClientList(context) {
            getClientList({}).then(res => {
                let { flag, data, errMsg } = res;
                if (!flag) {
                    this.$message.error(errMsg);
                } else {
                    context.commit('update_clientList', data)
                }
            });
        }
    }
})

export default store;