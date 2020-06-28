import socket from '@/api/socket'
import store from '@/api/store'

//同步用户登录信息到后台
const userOnline = function () {
    let userInfo = store.state.userInfo;
    socket.send("USERLOGIN^" + JSON.stringify(userInfo));
}

//进入场景
const enterScene = function (newScene) {
    let userInfo = store.state.userInfo;
    //添加场景处理函数
    socket.addReceiveHandler(newScene);
    //修改用户信息
    newScene.forEach(item => {
        userInfo.scene = userInfo.scene || []
        if (userInfo.scene.indexOf(item.scene) < 0)
            userInfo.scene.push(item.scene);
    })
    store.commit('update_userInfo', userInfo);
    //将用户信息同步到后台
    socket.send("USERSCENE^" + JSON.stringify({ scene: userInfo.scene }));
}

//退出场景
const leaveScene = function (oldScene) {
    if (!store.state.userInfo) return;
    let userInfo = store.state.userInfo;
    //删除场景处理函数
    socket.delReceiveHandler(oldScene);
    //修改用户信息
    oldScene.forEach(item => {
        let index = userInfo.scene.indexOf(item);
        userInfo.scene.splice(index, 1);
    })
    store.commit('update_userInfo', userInfo);
    //将用户信息同步到后台
    socket.send("USERSCENE^" + JSON.stringify({ scene: userInfo.scene }));
}

export {
    userOnline,
    enterScene,
    leaveScene
}