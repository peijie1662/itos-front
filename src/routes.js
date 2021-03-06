import Login from './views/login.vue'
import Home from './views/home.vue'
import NotFound from './404.vue'
import ManualTaskInput from './views/task/manualTaskInput.vue'
import ModelList from './views/taskmodel/modelList.vue'
import SmartTips from './views/settings/smartTips.vue'
import DispatchTaskInput from './views/task/dispatchTaskInput.vue'
import DispatchClient from './views/client/dispatchClient.vue'
import ComposeDetail from './views/task/composeDetail.vue'
import ComposeControlCenter from './views/task/composeControlCenter.vue'
import UserManager from './views/settings/userManager.vue'
import firstPage from './views/settings/firstPage.vue'
import reportModel from './views/report/reportModel.vue'
import documentManage from './views/report/documentManage.vue'
import documentBrowsing from './views/report/documentBrowsing.vue'
import compare from './views/settings/compare.vue'
import topology from './views/appinfo/topology.vue'
import appInfo from './views/appinfo/appInfo.vue'
import checkInOnDuty from "./views/settings/checkInOnDuty.vue"

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
        name: '',
        iconCls: 'el-icon-view',
        leaf: true,
        children: [
            {
                path: '/first_page', component: firstPage, name: '运维动态',
                meta: { funId: '0001', dis: true }
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '人工任务',
        funId: '1000',
        iconCls: 'el-icon-edit-outline',
        children: [
            {
                path: '/check_in_on_duty', component: checkInOnDuty, name: '值班签到',
                meta: { funId: '1003', dis: true }
            },
            {
                path: '/manual_task_input', component: ManualTaskInput, name: '任务登记',
                meta: { funId: '1001', dis: true }
            },
            {
                path: '/smart_tips', component: SmartTips, name: '智能提示',
                meta: { funId: '4003', dis: true }
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统任务',
        funId: '2000',
        iconCls: 'el-icon-monitor',
        children: [
            {
                path: '/dispatch_client', component: DispatchClient, name: '执行终端',
                meta: { funId: '2001', dis: true }
            },
            {
                path: '/dispatch_task_input', component: DispatchTaskInput, name: '任务查看',
                meta: { funId: '2002', dis: true }
            },
            {
                path: '/dispatch_compare', component: compare, name: '文件比对',
                meta: { funId: '2003', dis: true }
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '组合任务',
        funId: '3000',
        iconCls: 'el-icon-document-copy',
        children: [
            {
                path: '/compose_detail', component: ComposeDetail, name: '组合模版',
                meta: { funId: '3001', dis: true }
            },
            {
                path: '/compose_control_center', component: ComposeControlCenter, name: '控制中心',
                meta: { funId: '3002', dis: true }
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '文档中心',
        funId: '5000',
        iconCls: 'el-icon-document-copy',
        children: [
            {
                path: '/report_model', component: reportModel, name: '报告定制',
                meta: { funId: '5001', dis: true }
            },
            {
                path: '/document_manage', component: documentManage, name: '文档管理',
                meta: { funId: '5002', dis: true }
            },
            {
                path: '/document_browsing', component: documentBrowsing, name: '文档浏览',
                meta: { funId: '5003', dis: true }
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '服务监控',
        funId: '6000',
        iconCls: 'el-icon-document-copy',
        children: [
            {
                path: '/appinfo', component: appInfo, name: '定义服务',
                meta: { funId: '6001', dis: true }
            },
            {
                path: '/topology', component: topology, name: '服务拓扑',
                meta: { funId: '6002', dis: true }
            }]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-setting',
        leaf: true,
        children: [{
            path: '/model_list', component: ModelList, name: '模版设置',
            meta: { funId: '4001', dis: true }
        }]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-user',
        leaf: true,
        children: [{
            path: '/user_manager', component: UserManager, name: '用户管理',
            meta: { funId: '4002', dis: true }
        }]
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