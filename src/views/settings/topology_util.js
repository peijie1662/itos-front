const SERVICE_WIDTH = 150;
const SERVICE_HEIGHT = 80;
//
const SERVICE_BORDER_COLOR = "#696969 ";
const SERVICE_FILL_COLOR = "white";
const SERVICE_SEL_FILL_COLOR = "yellow";
const SERVICE_NAME_COLOR = "black";
const SERVICE_IP_COLOR = "black";
const SERVICE_FONTSIZE = 12;
//
const LINE_COLOR = "#FF4500 ";
const ARROW_COLOR = "#FF4500 ";

//拓扑连接-线段
export const drawLine = function (stage, connectors) {
    return connectors.map(con => {
        let s = stage.find(`#${con.sourceId}`)[0];
        let t = stage.find(`#${con.targetId}`)[0];
        if (!s || !t) return;
        //1.起始点(水平模式是右侧中点)
        let sp = {
            x: s.attrs.x + SERVICE_WIDTH,
            y: s.attrs.y + SERVICE_HEIGHT / 2
        };
        //2.结束点(水平模式是左侧中点)
        let tp = {
            x: t.attrs.x,
            y: t.attrs.y + SERVICE_HEIGHT / 2
        };
        //3.中间过度点1
        let mp1 = {
            x: (tp.x - sp.x) / 2 + sp.x,
            y: sp.y
        };
        //4.中间过度点2
        let mp2 = {
            x: (tp.x - sp.x) / 2 + sp.x,
            y: tp.y
        };
        return {
            points: [sp.x, sp.y, mp1.x, mp1.y, mp2.x, mp2.y, tp.x, tp.y],
            stroke: LINE_COLOR,
            strokeWidth: 1
        };
    });
}

//拓扑连接-箭头
export const drawArrow = function (stage, connectors) {
    return connectors.map(con => {
        let t = stage.find(`#${con.targetId}`)[0];
        if (!t) return;
        //1.结束点(水平模式是左侧中点)
        let tp = {
            x: t.attrs.x,
            y: t.attrs.y + SERVICE_HEIGHT / 2
        };
        //2.箭头点1
        let a1 = {
            x: tp.x - 5,
            y: tp.y - 2
        };
        //3.箭头点2
        let a2 = {
            x: tp.x - 5,
            y: tp.y + 2
        };
        return {
            points: [a1.x, a1.y, tp.x, tp.y, a2.x, a2.y],
            stroke: ARROW_COLOR,
            strokeWidth: 1,
            closed: true
        };
    });
}

//拓扑连接-服务
export const drawService = function (item) {
    return {
        id: item.serverName + "@" + item.ip, //group id
        serverName: item.serverName,
        x: item.x ? item.x : 0,
        y: item.y ? item.y : 0,
        draggable: true,
        outer_rect: {
            width: SERVICE_WIDTH,
            height: SERVICE_HEIGHT,
            fill: SERVICE_FILL_COLOR,
            stroke: SERVICE_BORDER_COLOR,
            strokeWidth: 1,
            cornerRadius: 5,
            shadowColor: 'black',
            shadowBlur: 2,
            shadowOffset: { x: 3, y: 3 },
            shadowOpacity: 0.2,
        },
        server_name_text: {
            x: 10,
            y: 10,
            text: item.serverName,
            fontSize: SERVICE_FONTSIZE,
            fontFamily: "Calibri",
            fill: SERVICE_NAME_COLOR
        },
        ip_text: {
            x: 10,
            y: 30,
            text: item.ip,
            fontSize: SERVICE_FONTSIZE,
            fontFamily: "Calibri",
            fill: SERVICE_IP_COLOR
        },
        heartbeat: {
            id: "heartbeat",
            x: 10,
            y: SERVICE_HEIGHT - 10,
            width: 30,
            height: 3,
            fill: "#00FF00"
        }
    };
}

//服务选中
export const drawSelService = function (target) {
    target.attrs.outer_rect.fill = SERVICE_SEL_FILL_COLOR
}

//服务未选中
export const drawNormalService = function (target) {
    target.attrs.outer_rect.fill = SERVICE_FILL_COLOR
}

