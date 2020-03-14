import { WS_URL } from '@/api/api'

let socket = null
let recieveHandler = {}//接收数据处理函数

export default {
    init() {
        if (typeof WebSocket === "undefined") {
            alert("您的浏览器不支持socket");
        } else {
            // 实例化socket
            socket = new WebSocket(WS_URL);
            // 监听socket连接
            socket.onopen = this.open;
            // 监听socket错误信息
            socket.onerror = this.error;
            // 监听socket消息
            socket.onmessage = this.getMessage;
            //关闭
            socket.onclose = this.close;
        }
    },
    innerSetReceiveHandler(handlers) {//重置数据接收处理函数
        if (handlers) {
            handlers.forEach(item => {
                recieveHandler[item.scene] = item.sceneFun
            });
        }
    },
    setReceiveHandler(handlers) {//重置数据接收处理函数
        recieveHandler = [];
        if (socket.readyState == WebSocket.OPEN) {
            this.innerSetReceiveHandler(handlers)
        } else if (socket.readyState == WebSocket.CONNECTING) {
            setTimeout(() => {
                this.innerSetReceiveHandler(handlers)
            }, 1000)
        }
    },
    addReceiveHandler(handler) {//添加数据接收处理函数
        recieveHandler[handler.scene] = handler.sceneFun
    },
    delReceiveHandler(scene) {//删除数据接收处理函数
        delete recieveHandler[scene]
    },
    open() {
        console.log("socket已经连接");
    },
    error() {
        console.log("连接错误");
    },
    getMessage(msg) {
        console.log(msg.data);
        let { header, content } = JSON.parse(msg.data);
        let rcvFun = recieveHandler[header]
        if (rcvFun) {
            rcvFun(content)
        }
    },
    send(msg) {
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(msg)
        } else if (socket.readyState == WebSocket.CONNECTING) {
            setTimeout(() => {
                socket.send(msg)
            }, 1000)
        }
    },
    close() {
        console.log("socket已经关闭");
    }
}



