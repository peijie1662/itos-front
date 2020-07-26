const SERVICE_WIDTH = 130;
const SERVICE_HEIGHT = 70;
//
const SERVICE_BORDER_COLOR = "#696969";
const SERVICE_SEL_BORDER_COLOR = "#FF5511";
const SERVICE_FILL_COLOR = "white";
const DB_FILL_COLOR = "#FFFACD";
const NG_FILL_COLOR = "#AFEEEE";
const SERVICE_NAME_COLOR = "black";
const SERVICE_ABS_COLOR = "#808080";
const SERVICE_IP_COLOR = "#808080";
const SERVICE_TYPE_COLOR = "#409EFF";
const SERVICE_DOMIN_COLOR = "#409EFF";
const SERVICE_FONTSIZE = 12;
//
const SERVICE_VALID_COLOR = "#00FF00";
const SERVICE_INVALID_COLOR = "red";
const SERVICE_UNKNOW_COLOR = "yellow";
const SERVICE_ACTIVE_BORDER = "#00FF00";
//
const LINE_COLOR = "#FF5511";
const ARROW_COLOR = "#FF5511";

//拓扑连接-线段
//1.vertical模式
//2.horizontal模式
export const drawLine = function (stage, connectors) {
    return connectors.map(con => {
        let s = stage.find(`#${con.sourceId}`)[0];
        let t = stage.find(`#${con.targetId}`)[0];
        //确定起始点和终点
        if (!s || !t) return;
        //1.RL模式
        if (con.direction == "RL") {
            //起始点(R)
            let sp = {
                x: s.attrs.x + SERVICE_WIDTH,
                y: s.attrs.y + SERVICE_HEIGHT / 2
            };
            //结束点(左侧中点)
            let tp = {
                x: t.attrs.x,
                y: t.attrs.y + SERVICE_HEIGHT / 2
            };
            //中间过度点1
            let mp1 = {
                x: (tp.x - sp.x) / 2 + sp.x,
                y: sp.y
            };
            //中间过度点2
            let mp2 = {
                x: (tp.x - sp.x) / 2 + sp.x,
                y: tp.y
            };
            return {
                points: [sp.x, sp.y, mp1.x, mp1.y, mp2.x, mp2.y, tp.x, tp.y],
                stroke: LINE_COLOR,
                strokeWidth: 1
            };
        }
        //2.BT模式
        if (con.direction == "BT") {
            //起始点(B)
            let sp = {
                x: s.attrs.x + SERVICE_WIDTH / 2,
                y: s.attrs.y + SERVICE_HEIGHT
            };
            //结束点(T)
            let tp = {
                x: t.attrs.x + SERVICE_WIDTH / 2,
                y: t.attrs.y
            };
            //中间过度点1
            let mp1 = {
                x: sp.x,
                y: sp.y + (tp.y - sp.y) / 2
            };
            //中间过度点2
            let mp2 = {
                x: tp.x,
                y: sp.y + (tp.y - sp.y) / 2
            };
            return {
                points: [sp.x, sp.y, mp1.x, mp1.y, mp2.x, mp2.y, tp.x, tp.y],
                stroke: LINE_COLOR,
                strokeWidth: 1
            };
        }
        //3.BL模式
        if (con.direction == "BL") {
            //起始点(B)
            let sp = {
                x: s.attrs.x + SERVICE_WIDTH / 2,
                y: s.attrs.y + SERVICE_HEIGHT
            };
            //结束点(L)
            let tp = {
                x: t.attrs.x,
                y: t.attrs.y + SERVICE_HEIGHT / 2
            };
            //过渡点
            let mp = {
                x: sp.x,
                y: tp.y
            }
            return {
                points: [sp.x, sp.y, mp.x, mp.y, tp.x, tp.y],
                stroke: LINE_COLOR,
                strokeWidth: 1
            };
        }
        //4.RB模式
        if (con.direction == "RB") {
            //起始点(R)
            let sp = {
                x: s.attrs.x + SERVICE_WIDTH,
                y: s.attrs.y + SERVICE_HEIGHT / 2
            };
            //结束点(B)
            let tp = {
                x: t.attrs.x + SERVICE_WIDTH / 2,
                y: t.attrs.y + SERVICE_HEIGHT
            };
            //过渡点
            let mp = {
                x: tp.x,
                y: sp.y
            }
            return {
                points: [sp.x, sp.y, mp.x, mp.y, tp.x, tp.y],
                stroke: LINE_COLOR,
                strokeWidth: 1
            };
        }
        //5.TL模式
        if (con.direction == "TL") {
            //起始点(T)
            let sp = {
                x: s.attrs.x + SERVICE_WIDTH / 2,
                y: s.attrs.y
            };
            //结束点(L)
            let tp = {
                x: t.attrs.x,
                y: t.attrs.y + SERVICE_HEIGHT / 2
            };
            //过渡点
            let mp = {
                x: sp.x,
                y: tp.y
            }
            return {
                points: [sp.x, sp.y, mp.x, mp.y, tp.x, tp.y],
                stroke: LINE_COLOR,
                strokeWidth: 1
            };
        }
        //6.RT模式
        if (con.direction == "RT") {
            //起始点(R)
            let sp = {
                x: s.attrs.x + SERVICE_WIDTH,
                y: s.attrs.y + SERVICE_HEIGHT / 2
            };
            //结束点(T)
            let tp = {
                x: t.attrs.x + SERVICE_WIDTH / 2,
                y: t.attrs.y
            };
            //过渡点
            let mp = {
                x: sp.x,
                y: tp.y
            }
            return {
                points: [sp.x, sp.y, mp.x, mp.y, tp.x, tp.y],
                stroke: LINE_COLOR,
                strokeWidth: 1
            };
        }
    });
}

//拓扑连接-箭头
export const drawArrow = function (stage, connectors) {
    return connectors.map(con => {
        let t = stage.find(`#${con.targetId}`)[0];
        if (!t) return;
        //右箭头
        if (["RL", "BL", "TL"].indexOf(con.direction) >= 0) {
            //结束点(L)
            let tp = {
                x: t.attrs.x,
                y: t.attrs.y + SERVICE_HEIGHT / 2
            };
            //箭头点1
            let a1 = {
                x: tp.x - 5,
                y: tp.y - 2
            };
            //箭头点2
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
        }
        //下箭头
        if (["BT", "RT"].indexOf(con.direction) >= 0) {
            //结束点(T)
            let tp = {
                x: t.attrs.x + SERVICE_WIDTH / 2,
                y: t.attrs.y
            };
            //箭头点1
            let a1 = {
                x: tp.x - 2,
                y: tp.y - 5
            };
            //箭头点2
            let a2 = {
                x: tp.x + 2,
                y: tp.y - 5
            };
            return {
                points: [a1.x, a1.y, tp.x, tp.y, a2.x, a2.y],
                stroke: ARROW_COLOR,
                strokeWidth: 1,
                closed: true
            };
        }
        //上箭头
        if (["RB"].indexOf(con.direction) >= 0) {
            //结束点(B)
            let tp = {
                x: t.attrs.x + SERVICE_WIDTH / 2,
                y: t.attrs.y + SERVICE_HEIGHT
            };
            //箭头点1
            let a1 = {
                x: tp.x - 2,
                y: tp.y + 5
            };
            //箭头点2
            let a2 = {
                x: tp.x + 2,
                y: tp.y + 5
            };
            return {
                points: [a1.x, a1.y, tp.x, tp.y, a2.x, a2.y],
                stroke: ARROW_COLOR,
                strokeWidth: 1,
                closed: true
            };
        }
    });
}

//拓扑连接-标签
export const drawLabel = function (lab) {
    return {
        id: lab.labId,
        text: lab.text,
        x: lab.x,
        y: lab.y,
        draggable: true,
        fill: "green",
        fontSize: 13
    }
}

function getFillColor(type) {
    let fill_color = SERVICE_FILL_COLOR;
    if (type == "NGINX") {
        fill_color = NG_FILL_COLOR;
    } else if (type == "DATABASE") {
        fill_color = DB_FILL_COLOR;
    }
    return fill_color;
}

//拓扑连接-服务
export const drawService = function (item) {
    let heartbeat_color = SERVICE_UNKNOW_COLOR;
    if (item.actualStatus == "VALID") {
        heartbeat_color = SERVICE_VALID_COLOR
    } else if (item.actualStatus == "INVALID") {
        heartbeat_color = SERVICE_INVALID_COLOR
    }
    return {
        id: item.serviceId, //group id
        serviceName: item.serviceName,
        x: item.x ? item.x : 0,
        y: item.y ? item.y : 0,
        draggable: true,
        outer_rect: {
            width: SERVICE_WIDTH,
            height: SERVICE_HEIGHT,
            fill: getFillColor(item.serviceType),
            stroke: SERVICE_BORDER_COLOR,
            strokeWidth: 1,
            cornerRadius: 5,
            shadowColor: SERVICE_BORDER_COLOR,
            shadowBlur: 3,
            shadowOffset: { x: 3, y: 3 },
            shadowOpacity: 0.2,
        },
        service_name_text: {
            x: 0,
            y: 0,
            text: item.serviceName,
            fontSize: SERVICE_FONTSIZE,
            fontFamily: "Calibri",
            fill: SERVICE_NAME_COLOR,
            padding: 5,
        },
        service_abs_text: {
            x: 0,
            y: 0,
            text: item.serviceAbs,
            fontSize: SERVICE_FONTSIZE,
            fontFamily: "Calibri",
            fill: SERVICE_ABS_COLOR,
            width: SERVICE_WIDTH,
            padding: 5,
            align: 'right',
        },
        ip_text: {
            x: 5,
            y: 25,
            text: item.ip + ":" + item.port,
            fontSize: SERVICE_FONTSIZE,
            fontFamily: "Calibri",
            fill: SERVICE_IP_COLOR
        },
        type_text: {
            x: 5,
            y: 40,
            text: item.serviceType,
            fontSize: SERVICE_FONTSIZE,
            fontFamily: "Calibri",
            fill: SERVICE_TYPE_COLOR
        },
        domain_text: {
            x: 0,
            y: 35,
            text: item.domain,
            fontSize: SERVICE_FONTSIZE,
            fontFamily: "Calibri",
            fill: SERVICE_DOMIN_COLOR,
            width: SERVICE_WIDTH,
            padding: 5,
            align: 'right',
        },
        heartbeat: {
            id: "heartbeat",
            x: 10,
            y: SERVICE_HEIGHT - 10,
            radius: 5,
            fill: heartbeat_color,
            stroke: SERVICE_ACTIVE_BORDER,
            strokeWidth: 1,
        }
    };
}

//服务选中
export const drawSelService = function (target) {
    target.attrs.outer_rect.stroke = SERVICE_SEL_BORDER_COLOR
    target.attrs.outer_rect.strokeWidth = 3
    target.attrs.outer_rect.shadowColor = SERVICE_SEL_BORDER_COLOR
}

//服务未选中
export const drawNormalService = function (target) {
    target.attrs.outer_rect.stroke = SERVICE_BORDER_COLOR
    target.attrs.outer_rect.strokeWidth = 1
    target.attrs.outer_rect.shadowColor = SERVICE_BORDER_COLOR
}

