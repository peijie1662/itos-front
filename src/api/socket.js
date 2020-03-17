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
        if (socket.readyState == WebSocket.OPEN) {
            this.inner_addRcvHandler(handlers)
        } else if (socket.readyState == WebSocket.CONNECTING) {
            setTimeout(() => {
                this.inner_addRcvHandler(handlers)
            }, 1000)
        }
    },
    addReceiveHandler(handlers) {//添加数据接收处理函数(数组)
        if (socket.readyState == WebSocket.OPEN) {
            this.inner_addRcvHandler(handlers)
        } else if (socket.readyState == WebSocket.CONNECTING) {
            setTimeout(() => {
                this.inner_addRcvHandler(handlers)
            }, 1000)
        }
    },
    delReceiveHandler(scene) {//删除数据接收处理函数(数组)
        this.inner_delRcvHandler(scene)
    },
    open() {
        console.log("socket已经连接");
    },
    error() {
        console.log("连接错误");
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



