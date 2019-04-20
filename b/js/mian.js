function start() {
    this.ele = document.querySelector('#wrap');
    this.btn = document.querySelector('#btn');
    this.mapWidth = 500; //地图尺寸;
    this.mapHeight = 500; //地图尺寸;
    this.size = 20; //当前每个格子大小
    this.px = 'px'; //当前页面使用的长度单位
    this.isplay = false;

}

start.prototype.a = function () {
    this.ele.innerHTML = '';
    this.row = Math.floor(this.mapHeight / (this.size));
    this.col = Math.floor(this.mapWidth / (this.size));
    this.map = []; //储存初始化后的地图数据
    this.x = 0; //虫子初始坐标
    this.y = 0; //虫子初始坐标
    this.bugSize = 3; //初始虫子长度
    this.bughd = new Array(); //保存地图数据
    this.speed = 3; //当前速度，值越大，速度越慢
    this.dir = 39; //默认开始时往右走
    this.ele.style.width = this.mapWidth + this.px;
    this.ele.style.height = this.mapHeight + this.px;
    this.btn.style.width = this.mapWidth + this.px;

    for (let i = 0; i < this.btn.children.length; i++) {
        this.btn.children[i].style.width = (this.mapWidth / 5) + this.px;
        this.btn.children[i].style.height = (this.px == 'px' ? 35 : .35) + this.px;
    }
    document.body.style.fontSize = (this.px == 'px' ? 14 : .24) + this.px;

    //生成地图数据
    for (let i = 0; i < this.row; i++) {
        this.map[i] = new Array();
        var rowbox = document.createElement('div');
        for (let j = 0; j < this.col; j++) {
            var colbox = document.createElement('div');
            colbox.style.width = this.size - (this.px == 'px' ? 2 : 0.02) + this.px;
            colbox.style.height = this.size - (this.px == 'px' ? 2 : 0.02) + this.px;
            rowbox.appendChild(colbox);
            //保存地图数据
            this.map[i][j] = colbox
        }
        this.ele.appendChild(rowbox);
    }
    //初始化虫子
    for (let i = 0; i < this.bugSize; i++) {
        this.x = i;
        this.bughd.unshift(this.map[this.y][this.x]);
        this.map[this.y][this.x].className = 'bug';
    }
}

// 初始化键盘事件
start.prototype.initKeyCode = function () {
    var obj = this;

    // 初始化键盘事件
    this.key = function (e) {
        obj.stop();
        e = e || window.event;
        if (e.keyCode > 40 || e.keyCode < 37) {
            return;
        }
        obj.isDir(e.keyCode);
        obj.keep();
    }
}

// 开始游戏
start.prototype.play = function () {
    this.isplay = true;
    this.a(); //初始化地图数据
    this.initKeyCode(); //初始化键盘事件
    this.keep(); //添加暂停事件
    this.ball(); //初始化圆球数据
}


//暂停游戏
start.prototype.stop = function () {
    //解除键盘绑定
    document.removeEventListener('keydown', this.key);
    //清除自动运行
    clearInterval(this.timer);
}

//继续游戏
start.prototype.keep = function () {
    if (!this.isplay) return;
    this.isplay = true;
    var obj = this;
    //清除上一个定时器，防止未清除而重复调用
    clearInterval(this.timer);
    //绑定键盘事件
    document.addEventListener('keydown', this.key);
    //虫子开始自动移动
    this.timer = setInterval(function () {
        obj.isDir();
    }, this.speed * 100);
}



//随机位置生成小球
start.prototype.ball = function () {
    //X坐标
    this.ax = this.randomNum(0, this.col);
    //Y坐标
    this.ay = this.randomNum(0, this.row);
    // console.log(this.ax, this.ay);
    // console.log(this.x, this.y);
    //生成的小球如果在虫子身体里面，就重新生成
    if (this.bughd.indexOf(this.map[this.ay][this.ax]) == 0) {
        this.ball();
    }
    this.map[this.ay][this.ax].className = 'bug';
}
//结束游戏
start.prototype.gameOver = function () {
    this.stop();
    this.ele.innerHTML = '你共得：' + (this.bugSize - 3) + '分';
    this.isplay = false;
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

    //判断是否撞墙  是否撞到身体
    if ((this.x < 0) || (this.y < 0) || (this.x >= this.col) || (this.y >= this.row) || (this.bughd.indexOf(this.map[this.y][this.x]) > 0)) {
        this.gameOver();
        return;
    }

    //更新虫子路径
    this.bughd.unshift(this.map[this.y][this.x]);
    //设置虫子颜色
    this.bughd[0].className = 'bug';
    this.bughd[1].className = 'buga';
    //清除多余的尾部颜色
    this.bughd[this.bughd.length - 1].removeAttribute('class');
    //清除虫子多余长度
    this.bughd.pop();

    //每次移动都需要判断是否有撞到小球
    if (this.bughd.indexOf(this.map[this.ay][this.ax]) == 0) {
        //撞到小球就添加进身体
        this.bughd.push(this.map[this.ay][this.ay]);
        // 更新虫子长度数据
        this.bugSize = this.bughd.length;
        //更新小球
        this.ball();
    }
    //

}

//生成随机数
start.prototype.randomNum = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}