import Login from './views/login.vue'
import Home from './views/home.vue'
import NotFound from './404.vue'
import TaskInput from './views/task/taskInput.vue'
import TaskQuery from './views/task/taskQuery.vue'
import ModelList from './views/taskmodel/modelList.vue'
import SmartTips from './views/settings/smartTips.vue'
import DispatchTask from './views/task/dispatchTask.vue'

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
                path: '/task_input', component: TaskInput, name: '任务登记',
                meta: { dis: false }
            },
            {
                path: '/task_query', component: TaskQuery, name: '任务查询',
                meta: { dis: false }
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '自动任务',
        iconCls: 'el-icon-edit-outline',
        children: [
            {
                path: '/task_client', component: DispatchTask, name: '在线终端',
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