import Vue from 'vue'
import Vuex from 'vuex'
import { getClientList } from '@/api/api'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        clients: []
    },
    mutations: {
        update_clients(state, clients) {
            state.clients = clients;
        }
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