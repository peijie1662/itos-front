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
    color: "#F56C6C"
  }
]

//执行周期
export const CYCLES = [
  {
    value: "PERDAY",
    label: "每日任务"
  },
  {
    value: "PERWEEK",
    label: "每周任务"
  },
  {
    value: "PERMONTH",
    label: "每月任务"
  }
]

export const TASKHANDLERS = [
  {
    value: 'XZL',
    label: '徐梓磊'
  },
  {
    value: 'HMH',
    label: '黄鸣皓'
  },
  {
    value: 'LSH',
    label: '李绍红'
  },
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
//CHECKIN(登记)->PROCESSING(处理中)->DONE(完成)
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
    next: ["PROCESSING", "DONE", "SWAP", "MODIFY", "CANCEL"]
  },
  {
    id: "PROCESSING",
    desc: "处理中",
    icon: "iconfont icon-jinhangzhong1 icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#67C23A" },
    hoverclass: { background: "#67C23A", color: "white" },
    next: ["PROCESSING", "DONE", "SWAP", "MODIFY", "CANCEL"]
  },
  {
    id: "DONE",
    desc: "完成",
    icon: "iconfont icon-wancheng2 icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#3b99ff" },
    hoverclass: { background: "#3b99ff", color: "white" },
    next: ["TERMINAL"]
  },
  {
    id: "CANCEL",
    desc: "取消",
    icon: "iconfont icon-quxiao2 icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#F56C6C" },
    hoverclass: { background: "#F56C6C", color: "white" },
    next: ["TERMINAL"]
  },
  {
    id: "MODIFY",
    desc: "内容修改",
    icon: "iconfont icon-note3 icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#E6A23C" },
    hoverclass: { background: "#E6A23C", color: "white" },
    next: ["INHERIT"] //继承上一状态的链节点
  },
  {
    id: "SWAP",
    desc: "换人",
    icon: "iconfont icon-icon-test icon",
    size: "large",
    iconclass: { background: "#e9ebec", color: "#b848ff" },
    hoverclass: { background: "#b848ff", color: "#b848ff" },
    next: ["INHERIT"] //继承上一状态的链节点
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
  let category = "";
  for (let i = 0; i < CATEGORYS.length; i++) {
    if (CATEGORYS[i].value == val) {
      category = CATEGORYS[i];
    }
  }
  return category.color;
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

//根据ID寻找姓名
export const getUserNameById = function (id) {
  return valueToLabel(TASKHANDLERS, id);
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