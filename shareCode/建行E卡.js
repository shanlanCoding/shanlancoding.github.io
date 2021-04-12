var jhekJkSecond=1;//n秒监控一次 单位秒 请自行修改11点50后请设置为1，平时监控可设置为10

//浏览器打开https://jxjkhd.kerlala.com/a/91/dmRXn63D/index
//建行50e卡提前输入验证码 12点请手动提交
//按F12 复制所有代码到console 按回车
var myAjax = {
    get: function (url, fn) {
        // XMLHttpRequest对象用于在后台与服务器交换数据   
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            // readyState == 4说明请求已完成
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                // 从服务器获得数据 
                fn.call(this, xhr.responseText);
            }
        };
        xhr.send();
    }
}
var myInterval;
var timeflag = 0;

// 点击提交按钮，N毫秒后停止
function ClickSubmitButton() {
    //间隔n毫秒点击一次提交按钮
    let click = setInterval(function () {
        document.getElementsByClassName("user-form")[0].getElementsByClassName("button-submit")[0].click();
    }, 100)
    setTimeout(r => {
        clearInterval(click);
    }, 60 * 1000);
};

//不需要调整
function myGetNum() {
    if (calDate()) {
        ClickSubmitButton();
        if (myInterval) {
            clearInterval(myInterval);
        };
        console.error(new Date().Format("MM-dd HH:mm:ss") + "：0点了，自动提交中！");
    }
    myAjax.get("https://jxjkhd.kerlala.com/activity/fortunesurvey/bangPrizeInfo/91/dmRXn63D", function (ret) {
        let rdata = JSON.parse(ret);
        if (rdata.status == "success") {
            if (rdata.data.num <= 0) {
                console.log(new Date().Format("MM-dd HH:mm:ss") + "：库存为0...");
            } else {
                ClickSubmitButton();
                if (myInterval) {
                    clearInterval(myInterval);
                };
                console.error(new Date().Format("MM-dd HH:mm:ss") + "：有库存了，自动提交中--" + rdata.data.num);

            }
        }
    });
    if (timeflag == 1 && calDate2355()) {
        if (jhekJkSecond == 10) {
            console.warn("当前时间大于23点57将1秒查询一次库存！");
            jhekJkSecond = 1;
            timeflag = 2;
            if (myInterval) {
                clearInterval(myInterval);
            };
            myInterval = setInterval(myGetNum, jhekJkSecond * 1000);
            //n毫秒查询一次库存,单位毫秒 自己根据情况修改
        }

    }
}

function calDate() {
    //判断是否是0点整
    var nowDate = new Date();
    if (nowDate.getHours() == 0 && nowDate.getMinutes() == 0 && (nowDate.getSeconds() < 2)) {
        return true;
    }
    return false;
}

function calDate2355() {
    //判断是否是23点57后
    var nowDate = new Date();
    if (nowDate.getHours() == 23 && nowDate.getMinutes() >= 57) {
        return true;
    }
    return false;
}
//日期格式化
Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() > 8 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
};

function jhStart() {
    if (location.href.indexOf("https://jxjkhd.kerlala.com/a/91/dmRXn63D/index") < 0) {
        alert("当前不在领奖界面点击确定后将自动跳转，请重新执行代码！");
        location.href = "https://jxjkhd.kerlala.com/a/91/dmRXn63D/index";
    }
    document.getElementsByClassName("user-form")[0].parentNode.style.display = "";
    var codeimg = document.createElement("img");
    codeimg.src = "/captcha/flat?_=" + Date.now();
    codeimg.onclick = function () {
        this.src = "/captcha/flat?_=" + Date.now();
    }
    document.getElementsByClassName("user-form")[0].getElementsByClassName("code")[0].appendChild(codeimg);

    if (!jhekJkSecond || jhekJkSecond < 1) {
        jhekJkSecond = 1;
    }
    if (!calDate2355()) {
        //首次执行不在23 55后
        if (jhekJkSecond == 1) {
            console.warn("当前时间小于23点57将10秒查询一次库存,23点57后将自动改为1秒查询一次！");
            jhekJkSecond = 10;
            timeflag = 1;
            //需要改回1
        }
    }
    myGetNum();
    myInterval = setInterval(myGetNum, jhekJkSecond * 1000);
    //n毫秒查询一次库存,单位毫秒 自己根据情况修改
}
jhStart();