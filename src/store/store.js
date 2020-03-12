import Vue from 'vue'
import Vuex from 'vuex'
import { getClientList } from '@/api/api'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        clients: [],//所有终端
        users: []//在线用户
    },
    mutations: {
        update_clients(state, clients) {
            state.clients = clients;
        },
        update_users(state, users) {
            state.users = users;
        }
    },
    getters:{
        clients : (state) => state.clients,
        users : (state) => state.users,
    },
    actions: {
        updateClients(context) {
            getClientList({}).then(res => {
                let { flag, data, errMsg } = res;
                if (!flag) {
                    this.$message({
                        message: errMsg,
                        type: "error"
                    });
                } else {
                    context.commit('update_clients', data)
                }
            });
        }
    }
})

export default store;