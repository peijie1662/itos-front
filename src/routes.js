import Login from './views/login.vue'
import Home from './views/home.vue'
import NotFound from './404.vue'
import ManualTaskInput from './views/task/manualTaskInput.vue'
import ManualTaskQuery from './views/task/manualTaskQuery.vue'
import ModelList from './views/taskmodel/modelList.vue'
import SmartTips from './views/settings/smartTips.vue'
import DispatchTaskInput from './views/task/dispatchTaskInput.vue'
import DispatchClient from './views/task/dispatchClient.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/home',
        component: Home,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '任务大厅',
        iconCls: 'el-icon-edit-outline',
        children: [
            {
                path: '/manual_task_input', component: ManualTaskInput, name: '人工任务登记',
                meta: { dis: false }
            },
            {
                path: '/manual_task_query', component: ManualTaskQuery, name: '人工任务查询',
                meta: { dis: false }
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统任务',
        iconCls: 'el-icon-edit-outline',
        children: [
            {
                path: '/dispatch_client', component: DispatchClient, name: '系统执行终端',
                meta: { dis: false }
            },
            {
                path: '/dispatch_task_input', component: DispatchTaskInput, name: '系统任务登记',
                meta: { dis: false }
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统设置',
        iconCls: 'el-icon-edit-outline',
        children: [{
            path: '/model_list', component: ModelList, name: '模版设置',
            meta: { dis: false }
        },
        {
            path: '/smart_tips', component: SmartTips, name: '智能提示',
            meta: { dis: false }
        }
        ]
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }]

export default routes;