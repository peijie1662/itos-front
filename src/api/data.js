import { STATIC_URL } from "@/api/api"
import { formatDate, localDateToInt } from "@/api/util"

//日期范围选择
export const pickerOptions = {
  shortcuts: [
    {
      text: "今天",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      }
    }
  ]
}

//任务类别
export const CATEGORYS = [
  {
    value: "COMMON",
    label: "普通提醒任务",
    color: "#67C23A"
  },
  {
    value: "CMD",
    label: "命令行任务",
    color: "#E6A23C"
  },
  {
    value: "PROCEDURE",
    label: "调用存储过程任务",
    color: "#E6A23C"
  },
  {
    value: "APPSERVER",
    label: "调用其它服务执行任务",
    color: "#E6A23C"
  },
  {
    value: "CUSTOM",
    label: "自定义任务",
    color: "#b848ff"
  },
  {
    value: "COMPOSE",
    label: "组合任务",
    color: "#F56C6C"
  },
]

//执行周期
export const CYCLES = [
  {
    value: "PERDAY",
    label: "每日任务",
    comment: "'HHMM',如'1530'表示'15:30'"
  },
  {
    value: "PERWEEK",
    label: "每周任务",
    comment: "'D,HHMM',如'1,1530'表示'周一15:30'"
  },
  {
    value: "PERMONTH",
    label: "每月任务",
    comment: "'W,D,HHMM',如'2,3,1530'表示'第二周周一15:30'"
  },
  {
    value: "CIRCULAR",
    label: "循环任务",
    comment: "单位秒,如'600'表示'下一次任务在10分钟后'"
  },
  {
    value: "NONE",
    label: "无任务周期",
    comment: ""
  }
]

export const EXPIREDCALLBACKS = [
  {
    value: "DONE",
    label: "超时转为完成"
  },
  {
    value: "FAIL",
    label: "超时转为失败"
  },  
  {
    value: "CANCEL",
    label: "超时转为取消"
  },
  {
    value: "NONE",
    label: "超时不作任何处理"
  }
]

export const EXPIREDNOTIFIES = [
  {
    value: "SMS",
    label: "短信"
  },
  {
    value: "ITOSMES",
    label: "ITOS消息"
  },
  {
    value: "BIGHORN",
    label: "大喇叭"
  }
]

//任务对象标记，此标记与类别无关，只与内容有关。
export const TASKICONS = [
  {
    id: "LMD",
    label: "龙门吊",
    match: ["龙", "lmd"],
    icon: "iconfont icon-icons-rtg_crane icon",
    iconclass: { background: "#e9ebec", color: "#F56C6C" }
  },
  {
    id: "QD",
    label: "桥吊",
    match: ["桥", "qd"],
    icon: "iconfont icon-icons-sts_crane icon",
    iconclass: { background: "#e9ebec", color: "#F56C6C" }
  },
  {
    id: "DGJ",
    label: "堆高机",
    match: ["堆高", "dgj"],
    icon: "iconfont .icon-Containertruck_alar icon",
    iconclass: { background: "#e9ebec", color: "#F56C6C" }
  },
  {
    id: "TRUCK",
    label: "集卡",
    match: ["集卡", "by\\d{1,}"],
    icon: "iconfont icon-truck1 icon",
    iconclass: { background: "#e9ebec", color: "#F56C6C" }
  },
  {
    id: "COMPUTER",
    label: "电脑",
    match: ["主机", "h\\d{3,}"],
    icon: "iconfont icon-picker-computer icon",
    iconclass: { background: "#e9ebec", color: "#F56C6C" }
  },
  {
    id: "NETWORK",
    label: "网络",
    match: ["网", "不通", "光"],
    icon: "iconfont icon-network icon",
    iconclass: { background: "#e9ebec", color: "#F56C6C" }
  },
  {
    id: "OTHER",
    label: "其它",
    match: [],
    icon: "iconfont icon-note2 icon",
    iconclass: { background: "#e9ebec", color: "#F56C6C" }
  },
  {
    id: "AUTO",
    label: "系统任务",
    match: [],
    icon: "iconfont icon-robot2 icon",
    iconclass: { background: "#e9ebec", color: "#F56C6C" }
  },
]

//任务的
//1.通用状态
//CHECKIN(登记)->PROCESSING(处理中)->DONE(完成)/FAIL(失败)
//2.特殊状态
//SWAP(换人)-可以在任一阶段
//MODIFY(内容修改)-可以在任一阶段
//CANCEL(取消)-可以在任一阶段,终点
//FOLLOWUP(灌水)-可以在任一阶段
export const TASKSTATUS = [
  {
    id: "CHECKIN",
    desc: "登记",
    icon: "iconfont icon-dengji icon",
    size: "large",//图标大小(timeline中使用) 
    iconclass: { background: "#e9ebec", color: "#7ab900" },
    hoverclass: { background: "#7ab900", color: "white" },
    next: ["PROCESSING", "DONE","FAIL", "SWAP", "MODIFY", "CANCEL","DELIVERREPAIR"],
    scope: ["MANUAL","AUTO"]
  },
  {
    id: "PROCESSING",
    desc: "处理中",
    icon: "iconfont icon-jinhangzhong1 icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#67C23A" },
    hoverclass: { background: "#67C23A", color: "white" },
    next: ["PROCESSING", "DONE", "FAIL","SWAP", "MODIFY", "CANCEL","DELIVERREPAIR"],
    scope: ["MANUAL","AUTO"]
  },
  {
    id: "DONE",
    desc: "完成",
    icon: "iconfont icon-wancheng3 icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#3b99ff" },
    hoverclass: { background: "#3b99ff", color: "white" },
    next: ["TERMINAL"],
    scope: ["MANUAL","AUTO"]
  },
  {
    id: "FAIL",
    desc: "失败",
    icon: "iconfont icon-quxiao2 icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#F56C6C" },
    hoverclass: { background: "#F56C6C", color: "white" },
    next: ["TERMINAL"],
    scope: ["AUTO"]
  },  
  {
    id: "CANCEL",
    desc: "取消",
    icon: "iconfont icon-cancel icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#E6A23C" },
    hoverclass: { background: "#E6A23C", color: "white" },
    next: ["TERMINAL"],
    scope: ["MANUAL","AUTO"]
  },
  {
    id: "MODIFY",
    desc: "内容修改",
    icon: "iconfont icon-note3 icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#f68a1e" },
    hoverclass: { background: "#f68a1e", color: "white" },
    next: ["INHERIT"],  
    scope: ["MANUAL"]
  },
  {
    id: "SWAP",
    desc: "换人",
    icon: "iconfont icon-icon-test icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#b848ff" },
    hoverclass: { background: "#b848ff", color: "white" },
    next: ["INHERIT"],
    scope: ["MANUAL"]
  },
  {
    id: "DELIVERREPAIR",
    desc: "委外修理",
    icon: "iconfont icon-weihu icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#616bdd" },
    hoverclass: { background: "#616bdd", color: "white" },
    next: ["INHERIT"],
    scope: ["MANUAL"]
  }
]

//根据content匹配出TaskIcon
export const getTaskIconInContent = function (content) {
  let icon = null;
  for (let i = 0; i < TASKICONS.length; i++) {
    TASKICONS[i].match.forEach(m => {
      let reg = RegExp(m, "i");
      if (reg.test(content)) {
        icon = TASKICONS[i];
      }
    });
  }
  if (icon == null) {
    icon = getTaskIconById('OTHER');
  }
  return icon;
}

//根据ID寻找对应TASK
export const getTaskStatusById = function (id) {
  let status = "";
  for (let i = 0; i < TASKSTATUS.length; i++) {
    if (TASKSTATUS[i].id == id) {
      status = TASKSTATUS[i];
    }
  }
  return status;
}

//根据ID寻找对应CATEGOTY的color
export const getCategoryColor = function (val) {
  let defaultColor = "#909399";
  let category = null;
  for (let i = 0; i < CATEGORYS.length; i++) {
    if (CATEGORYS[i].value == val) {
      category = CATEGORYS[i];
    }
  }
  return category ? category.color : defaultColor;
}

//根据ID寻找TaskIcon
export const getTaskIconById = function (id) {
  let icon = "";
  for (let i = 0; i < TASKICONS.length; i++) {
    if (TASKICONS[i].id == id) {
      icon = TASKICONS[i];
    }
  }
  return icon;
}

export const valueToLabel = (data, value) => {
  let result = "";
  data.forEach(item => {
    if (item.value == value) {
      result = item.label;
    }
  });
  return result;
}

export const valueToComment = (data, value) => {
  let result = "";
  data.forEach(item => {
    if (item.value == value) {
      result = item.comment;
    }
  });
  return result;
}

export const labelToValue = (data, label) => {
  let result = "";
  data.forEach(item => {
    if (item.label == label) {
      result = item.value;
    }
  });
  return result;
}

export const listIsEmpty = function (list) {
  if (list.length == 0) {
    return true;
  } else if (list.length == 1 && list[0] == "") {
    return true;
  }
  return false;
}

export const modelUploadDom = function (file, id) {
  let url =
    STATIC_URL +
    "model_file" +
    "/" +
    id +
    "/" +
    file.name;
  if (file.raw.type.startsWith("image/")) {
    return `<img src=${url}>`;
  } else {
    return `<a href=${url}>${file.name}</a>`;
  }
}

export const taskUploadDom = function (file, id) {
  let url =
    STATIC_URL +
    "task_file" +
    "/" +
    id +
    "/" +
    file.name;
  if (file.raw.type.startsWith("image/")) {
    return `<img src=${url}>`;
  } else {
    return `<a href=${url}>${file.name}</a>`;
  }
}

//组合任务报表
export const composeReportUrl = function (id) {
  return STATIC_URL + "pdf/compose/" + id + ".pdf" + "?" + Math.random(100);
}

//统计每层的开始结束时间
export const countStepTime = function (step) {
  step.bgDt = "";
  step.edDt = "";
  step.tasks.forEach(item => {
    if (step.bgDt) {
      step.bgDt = Math.min(
        step.bgDt,
        localDateToInt(item.task.bgDt)
      );
    } else if (item.task && item.task.bgDt) {
      step.bgDt = localDateToInt(item.task.bgDt);
    }
    if (step.edDt) {
      step.edDt = Math.max(
        step.edDt,
        localDateToInt(item.task.edDt)
      );
    } else if (item.task && item.task.edDt) {
      step.edDt = localDateToInt(item.task.edDt);
    }
  });
  step.bgDt = step.bgDt ? formatDate(new Date(step.bgDt), "yyyy-MM-dd hh:mm:ss") : "";
  step.edDt = step.edDt ? formatDate(new Date(step.edDt), "yyyy-MM-dd hh:mm:ss") : "";
}