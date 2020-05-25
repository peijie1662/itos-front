//光标在字符串中的位置
//ctrl 是dom节点
export const getCursortPosition = function (ctrl) {
  //获取光标位置函数 
  var CaretPos = 0;
  // IE Support
  if (document.selection) {
    ctrl.focus(); // 获取焦点
    var Sel = document.selection.createRange(); // 创建选定区域
    Sel.moveStart('character', -ctrl.value.length); // 移动开始点到最左边位置
    CaretPos = Sel.text.length;                      // 获取当前选定区的文本内容长度
  }
  // Firefox support (非ie)
  else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
    CaretPos = ctrl.selectionStart; // 获取选定区的开始点 
  }
  return CaretPos;
}

//dom到根元素的offsetLeft/offsetTop
export const getElementTop = function (element) {
  var actualTop = element.offsetTop
  var current = element.offsetParent

  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent
  }
  return actualTop
}

export const getElementLeft = function (element) {
  var actualLeft = element.offsetLeft
  var current = element.offsetParent

  while (current !== null) {
    actualLeft += current.offsetLeft
    current = current.offsetParent
  }
  return actualLeft
}

export const insertContent = function (content) {
  if (!content) {
    //如果插入的内容为空则返回
    return;
  }
  let sel = null;
  if (document.selection) {
    //IE9以下
    sel = document.selection;
    sel.createRange().pasteHTML(content);
  } else {
    sel = window.getSelection();
    if (sel.rangeCount > 0) {
      let range = sel.getRangeAt(0); //获取选择范围
      range.deleteContents(); //删除选中的内容
      let el = document.createElement("div"); //创建一个空的div外壳
      el.innerHTML = content; //设置div内容为我们想要插入的内容。
      let frag = document.createDocumentFragment(); //创建一个空白的文档片段，便于之后插入dom树

      let node = el.firstChild;
      let lastNode = frag.appendChild(node);
      range.insertNode(frag); //设置选择范围的内容为插入的内容
      let contentRange = range.cloneRange(); //克隆选区
      contentRange.setStartAfter(lastNode); //设置光标位置为插入内容的末尾
      contentRange.collapse(true); //移动光标位置到末尾
      sel.removeAllRanges(); //移出所有选区
      sel.addRange(contentRange); //添加修改后的选区
    }
  }
}

export const formatDate = function (date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
}

export const localDateToStr = function (local) {
  if (local) {
    return local.year + "-" //
      + String(local.monthValue).padStart(2, "0") + "-" //
      + String(local.dayOfMonth).padStart(2, "0") + " " //
      + String(local.hour).padStart(2, "0") + ":" //
      + String(local.minute).padStart(2, "0") + ":" //
      + String(local.second).padStart(2, "0");
  } else {
    return "";
  }
}

export const localDateToDate = function (local) {
  if (local) {
    return new Date(localDateToStr(local));
  } else {
    return "";
  }
}

export const localDateToInt = function (local) {
  if (local) {
    return new Date(localDateToStr(local)).getTime();
  } else {
    return 0;
  }
}

export const generateUUID = function () {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export const arrDeepCopy = function (source) {
  var sourceCopy = [];
  for (var item in source) sourceCopy[item] = typeof source[item] === 'object' ? arrDeepCopy(source[item]) : source[item];
  return sourceCopy;
}

/**
* 数组元素交换位置
* @param {array} arr 数组
* @param {number} index1 添加项目的位置
* @param {number} index2 删除项目的位置
* index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
*/
function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

//下移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
export const downInArr = function (arr, index) {
  if (index + 1 != arr.length) {
    swapArray(arr, index, index + 1);
  }
}

//上移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
export const upInArr = function (arr, index) {
  if (index != 0) {
    swapArray(arr, index, index - 1);
  }
}

//json格式校验
export const validateJson = function (str) {
  try {
    JSON.parse(str)
    return true
  } catch{
    return false
  }
}