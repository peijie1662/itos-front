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
    },
    mutations: {
        update_clientList: (state, clientList) => state.clientList = clientList,
        update_userList: (state, userList) => state.userList = userList,
        update_userInfo: (state, userInfo) => state.userInfo = userInfo,
        update_sysLog: (state, log) => state.sysLog.unshift(log)
    },
    getters: {
        userInfo: (state) => { return state.userInfo },
        sysLog: (state) => { return state.sysLog }
    },
    actions: {
        updateClientList(context) {
            getClientList({}).then(res => {
                let { flag, data, errMsg } = res;
                if (!flag) {
                    this.$message({
                        message: errMsg,
                        type: "error"
                    });
                } else {
                    context.commit('update_clientList', data)
                }
            });
        }
    }
})

export default store;