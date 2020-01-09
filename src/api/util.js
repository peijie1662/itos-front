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

