import { OFFICE_WS_URL, PRD_WS_URL } from '@/api/api'

let socket = null
let prdSocket = null
let officeSocket = null
let recieveHandler = {}//接收数据处理函数

export default {
    //初始化生产网WS
    initPrd() {
        if (typeof WebSocket === "undefined") {
            alert("您的浏览器不支持socket");
        } else {
            // 实例化socket
            prdSocket = new WebSocket(PRD_WS_URL);
            // 监听socket连接
            prdSocket.onopen = this.open;
            // 监听socket错误信息
            prdSocket.onerror = this.error;
            // 监听socket消息
            prdSocket.onmessage = this.getMessage;
            //关闭
            prdSocket.onclose = this.close;
        }
    },
    //初始化办公网WS
    initOffice() {
        if (typeof WebSocket === "undefined") {
            alert("您的浏览器不支持socket");
        } else {
            // 实例化socket
            officeSocket = new WebSocket(OFFICE_WS_URL);
            // 监听socket连接
            officeSocket.onopen = this.open;
            // 监听socket错误信息
            officeSocket.onerror = this.error;
            // 监听socket消息
            officeSocket.onmessage = this.getMessage;
            //关闭
            officeSocket.onclose = this.close;
        }
    },
    inner_addRcvHandler(handlers) {//重置数据接收处理函数
        if (handlers) {
            handlers.forEach(item => {
                recieveHandler[item.scene] = item.sceneFun
            });
        }
    },
    inner_delRcvHandler(scene) {//重置数据接收处理函数
        if (scene) {
            scene.forEach(item => {
                delete recieveHandler[item]
            });
        }
    },
    setReceiveHandler(handlers) {//重置数据接收处理函数(数组)
        recieveHandler = [];
        if (socket) {
            if (socket.readyState == WebSocket.OPEN) {
                this.inner_addRcvHandler(handlers)
            } else if (socket.readyState == WebSocket.CONNECTING) {
                setTimeout(() => {
                    this.inner_addRcvHandler(handlers)
                }, 1000)
            }
        }
    },
    addReceiveHandler(handlers) {//添加数据接收处理函数(数组)
        if (socket) {
            if (socket.readyState == WebSocket.OPEN) {
                this.inner_addRcvHandler(handlers)
            } else if (socket.readyState == WebSocket.CONNECTING) {
                setTimeout(() => {
                    this.inner_addRcvHandler(handlers)
                }, 1000)
            }
        }
    },
    delReceiveHandler(scene) {//删除数据接收处理函数(数组)
        this.inner_delRcvHandler(scene)
    },
    open() {
        socket = this;
        console.log(this.url + "已经连接");
    },
    error() {
        console.log(this.url + "连接错误");
    },
    getMessage(msg) {
        console.log("入口数据：" + msg.data);
        let { header, content } = JSON.parse(msg.data);
        let rcvFun = recieveHandler[header]
        if (rcvFun) {
            rcvFun(content)
        }
    },
    send(msg) {
        if (socket) {
            if (socket.readyState == WebSocket.OPEN) {
                socket.send(msg)
            } else if (socket.readyState == WebSocket.CONNECTING) {
                setTimeout(() => {
                    socket.send(msg)
                }, 1000)
            }
        }
    },
    close() {
        console.log(this.url + "已经关闭");
    }
}



