function start() {
    this.ele = document.querySelector('#wrap');
    this.btn = document.querySelector('#btn')
}

start.prototype.a = function () {
    this.ele.innerHTML = '';
    this.mapSize = 6.4; //地图尺寸;
    this.size = .2; //当前每个格子大小
    this.map = []; //储存初始化后的地图数据
    this.px = 'rem'; //当前页面使用的长度单位
    this.x = 0; //虫子初始坐标
    this.y = 0; //虫子初始坐标
    this.bugSize = 3; //初始虫子长度
    this.bughd = new Array(); //保存地图数据
    this.speed = 3; //当前速度，值越大，速度越慢
    this.dir = 39; //默认开始时往右走
    this.ele.style.width = this.mapSize + this.px;
    this.ele.style.height = this.mapSize + this.px;
    this.btn.style.width = this.mapSize + this.px;
    document.body.style.fontSize = (this.px == 'px' ? 14 : .24) + this.px;


    //生成地图数据
    for (let i = 0; i < this.mapSize / (this.size); i++) {
        this.map[i] = new Array();
        var rowbox = document.createElement('div');
        for (let j = 0; j < this.mapSize / (this.size); j++) {
            var colbox = document.createElement('div');
            colbox.style.width = this.size - (this.px == 'px' ? 2 : 0.02) + this.px;
            colbox.style.height = this.size - (this.px == 'px' ? 2 : 0.02) + this.px;
            rowbox.appendChild(colbox);

            //保存地图数据
            this.map[i][j] = colbox
        }
        this.ele.appendChild(rowbox);
    }
}

//初始化
start.prototype.init = function () {
    var obj = this;

    //初始化虫子
    for (let i = 0; i < this.bugSize; i++) {
        this.x = i;
        this.bughd.unshift(this.map[this.y][this.x]);
        this.map[this.y][this.x].className = 'bug';
    }

    // 初始化键盘事件
    this.key = function (e) {
        e = e || window.event;
        if (e.keyCode > 40 || e.keyCode < 37) {
            return;
        }
        obj.isDir(e.keyCode);
    }
}

// 开始游戏
start.prototype.play = function () {
    // console.log('a')
    this.a(); //初始化地图数据
    this.init(); //初始化事件
    this.keep(); //添加暂停事件
    this.ball(); //初始化圆球数据
}

//继续游戏
start.prototype.keep = function () {
    var obj = this;
    this.timer = setInterval(function () {
        // console.log('timer', obj.timer)
        obj.isDir();
    }, this.speed * 100);
    document.addEventListener('keydown', this.key);
}

//暂停游戏
start.prototype.stop = function () {
    // console.log('stop', this.timer)
    clearInterval(this.timer);
    document.removeEventListener('keydown', this.key);
}

//随机位置生成小球
start.prototype.ball = function () {
    this.ax = this.randomNum();
    this.ay = this.randomNum();
    this.map[this.ay][this.ax].className = 'bug';
}
//结束游戏
start.prototype.gameOver = function () {
    this.stop();
    alert('下次继续努力哈')
}

//控制移动方向
start.prototype.isDir = function (keyCode) {

    if (keyCode) {
        //判断当前按键是否为反方向，如果是不执行任何操作
        if (this.dir == 37 && keyCode == 39) return;
        if (this.dir == 38 && keyCode == 40) return;
        if (this.dir == 39 && keyCode == 37) return;
        if (this.dir == 40 && keyCode == 38) return;

        //更新虫子移动方向
        this.dir = [37, 38, 39, 40][keyCode - 37];
    }
    //根据方向是否继续移动
    if (this.dir == 37) this.x += -1;;
    if (this.dir == 39) this.x += 1;
    if (this.dir == 38) this.y += -1;
    if (this.dir == 40) this.y += 1;
    //调用虫子移动
    this.bug();
    return 1;

}

//虫子移动
start.prototype.bug = function () {

    //判断虫子是否存在
    if (this.bughd.length <= 0) return;

    //判断是否撞墙
    if ((this.x >= this.mapSize / this.size || this.x < 0) || (this.y >= this.mapSize / this.size || this.y < 0)) {
        this.gameOver();
        return;
    }

    //判断当前是否撞到身体
    if (this.bughd.indexOf(this.map[this.y][this.x]) > 0) {
        this.gameOver();
    }

    //更新虫子路径
    this.bughd.unshift(this.map[this.y][this.x]);
    //设置虫子颜色
    this.bughd[0].className = 'bug';

    //清除多余的尾部颜色
    this.bughd[this.bughd.length - 1].removeAttribute('class');
    //清除虫子多余长度
    this.bughd.pop();

    //每次移动都需要判断是否有撞到小球
    if (this.map[this.ay][this.ax] == this.bughd[0]) {
        //撞到小球就添加进身体
        this.bughd.push(this.map[this.ay][this.ay]);
        // 更新虫子长度数据
        this.bugSize = this.bughd;
        //更新小球
        this.ball();
    }
    //

}

//生成随机数
start.prototype.randomNum = function () {
    return Math.floor(Math.random() * (this.mapSize / this.size));
}

//页面开始调用的
function a() {
    var b = new start();
    b.a();
    var eBtns = document.querySelector('#btn').children;
    var eDir = document.querySelector('#dir').querySelectorAll('button');
    eBtns[0].addEventListener('click', function () {
        b.play();
    });
    eBtns[1].addEventListener('click', function () {
        b.stop();
    })
    eBtns[2].addEventListener('click', function () {
        b.keep();
    })
    eBtns[3].addEventListener('click', function () {
        b.gameOver();
    })

    //移动端方向控制键
    eDir[0].addEventListener('click', function () {
        b.isDir(37)
    })
    eDir[1].addEventListener('click', function () {
        b.isDir(38)
    })
    eDir[2].addEventListener('click', function () {
        b.isDir(40)
    })
    eDir[3].addEventListener('click', function () {
        b.isDir(39)
    })

}

a();