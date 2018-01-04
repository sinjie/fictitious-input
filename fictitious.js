/**
 * Created by 星尐 on 2017/12/29.
 */
/**
 * 待开发功能：
 * 键盘弹出时，输入框的定位
 * 点击空白处隐藏键盘，失去光标
 */
function FictitiousNumber(ele, option) {
    this.value = '' //数据，最终需要的数据
    
    this.ele = ele  //输入框
    this.option = option || {}  //配置
    this.cursorColor = this.option.cursorColor || '#00a0e9' //光标颜色
    this.hasPoint = this.option.hasPoint == undefined? true: this.option.hasPoint //是否可以输入小数点
    this.deleteAll = this.option.deleteAll == undefined? false: this.option.deleteAll //点击删除是否删除全部
    this.placeholder = this.option.placeholder
    
    // 默认值
    this.createPlaceholder()
    
    // 创建虚拟键盘
    let keyBoard = this.createKeyBoard()
    document.body.appendChild(keyBoard)
    
    // 创建光标
    let cursorI = this.createCursor()
    
    // 获取焦点事件
    this.ele.onclick = (e) => {
        if (this.ele.getElementsByTagName('placeholderEle') && this.value.length == 0) this.ele.innerHTML = ''
        let cursor = this.ele.getElementsByClassName('fictitious-cursor')[0]
        if (cursor) this.ele.removeChild(cursor)
        if (e.target.nodeName == 'DIV'){
            this.ele.appendChild(cursorI)
        }else if (e.target.nodeName == 'SPAN'){
            this.ele.insertBefore(cursorI, e.target)
        }
        keyBoard.className = 'show-animation'
    }
    
    //输入
    keyBoard.onclick = (e) => {
        if(e.target.nodeName == 'P'){
            this.hideKeyBoard(keyBoard)
        }else{
            let num = this.keyDown(e.target)
            
            if (num == 'UNINPUT') return
            
            if (num == '.') {
                if (this.hasPoint === false) return
                if (this.value.length ==0) {
                    let newNumber = document.createElement('span')
                    newNumber.innerHTML = '0'
                    this.ele.insertBefore(newNumber, cursorI)
                }
            }
            
            if (num == 'DELETE') {
                if (this.deleteAll === true) {
                    this.ele.innerHTML = ''
                    this.ele.appendChild(cursorI)
                }else {
                    let deleteNumber = cursorI.previousElementSibling
                    if (deleteNumber){
                        this.ele.removeChild(deleteNumber)
                    }
                }
                this.getNumber()
                return
            }
            
            if (this.value.length >= 16) return
            
            let newNumber = document.createElement('span')
            newNumber.innerHTML = num
            this.ele.insertBefore(newNumber, cursorI)
            this.getNumber()
        }
    }
}
FictitiousNumber.prototype = {
    createPlaceholder () {
        if (this.placeholder && this.placeholder != '') {
            let placeholderEle = document.createElement('div')
            placeholderEle.innerHTML = this.placeholder
            placeholderEle.id = 'placeholderEle'
            placeholderEle.style.color = '#bbb'
            this.ele.appendChild(placeholderEle)
        }
    },
    createKeyBoard () {
        let keyBoard = document.createElement('div')
        keyBoard.id = 'fictitious-keyboard'
        keyBoard.innerHTML = '<p>﹀</p><span>7</span><span class="middle">8</span><span>9</span><span>4</span><span class="middle">5</span><span>6</span><span>1</span><span class="middle">2</span><span>3</span><span class="ot">.</span><span class="middle">0</span><span class="ot">×</span>'
        return keyBoard
    },
    createCursor () {
        let cursorI = document.createElement('i')
        cursorI.className = 'fictitious-cursor'
        return cursorI
    },
    keyDown (target) {
        if (target.textContent == '.' && this.value.indexOf('.') > 0 ) return 'UNINPUT'
        if (target.textContent == '×') return 'DELETE'
        return target.textContent
    },
    hideKeyBoard (keyBoard) {
        let cursor = this.ele.getElementsByClassName('fictitious-cursor')[0]
        this.ele.removeChild(cursor)
        keyBoard.className = ''
        if (this.value.length == 0) this.createPlaceholder()
    },
    getNumber () {
        this.value = ''
        let numbers = this.ele.getElementsByTagName('span')
        for (let i = 0; i < numbers.length; i++) {
            this.value += numbers[i].textContent
        }
    }
}