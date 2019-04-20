function getEl(id) {
    return document.querySelector(id);
}


//游戏时间
var gameTime = 30;


// 开始游戏
function statr() {
    var eOn = getEl('.on');
    eOn.addEventListener('click', function () {
        this.parentNode.className += ' none';
        isTime();
    })
}

// 开始计时
function isTime() {
    var eTime = getEl('.time');
    var i = gameTime; //这里是倒计时的初始数据
    eTime.innerHTML = i;
    var timer = setInterval(() => {
        i--;
        eTime.innerHTML = i;
        if (i == 0) {
            clearInterval(timer);
            stop(); //游戏结束
            eTime.innerHTML = gameTime //重置时间
            getEl('.fen').innerHTML = 0 //重置积分
        }
    }, 1000);

    fontColor(); //调用设置颜色
}

// 游戏结束
function stop() {
    var a = getEl('.statr');
    a.className = "statr";
    a.children[0].innerHTML = '获得 ' + jifen() + ' 分';
    a.children[1].innerHTML = '在玩一次';
}

// 积分计算
function jifen(a) {
    var num = getEl('.fen').innerHTML;
    fen.innerHTML = a ? num * 1 + 1 : num * 1 - 1;
    fontColor();
    return num;
}

// 分配字体颜色和按钮颜色
function fontColor() {
    var eText = getEl('.text');
    var eBtn = getEl('.btn').children;
    var col = ['red', 'blue', 'yellow', 'green', 'black', "purple"];
    var textCol = ['红', '蓝', '黄', '绿', '黑', '紫'];
    var len = col.length; //获取颜色长度
    var random = randomNum(len); //获取颜色随机数
    var btn = randomNum(eBtn.length);
    for (let i = 0; i < eBtn.length; i++) {
        let a = randomNum(len);

        while (random == a) { //判断生成的随机数  是否跟答案重复,如有重复则重新生成
            a = randomNum(len);
        }

        eBtn[i].innerHTML = textCol[randomNum(len)];
        eBtn[i].style.color = col[a];


    }

    eText.style.color = col[randomNum(len)]; //设置展示文本的颜色
    eText.innerHTML = textCol[random]; //设置展示的文字，
    eBtn[btn].style.color = col[random]; //随机给按钮添加正确答案的颜色
    eBtn[btn].index = random; //设置正确答案，用于判断时候使用

    //判断是否选对
    isTrue(random);
}


function isTrue(a) {
    var btns = getEl('.btn').children;
    for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = function () {
            if (this.index == a) {
                //答对加分
                jifen(true);
            } else {
                //答错扣分
                jifen(false);
            }
        }
    }
}
//生成随机数
function randomNum(number) {
    // console.log(number);
    var random = Math.floor(Math.random() * number);
    return random;
}