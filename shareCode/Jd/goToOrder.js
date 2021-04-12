// ==UserScript==
// @name         京东页面添加按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://item.m.jd.com/product/*
// @match        https://item.jd.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';



    //移动端
    if (window.location.host.indexOf("item.m.jd.com") > -1) {
        //父级元素
        let parentElement = document.querySelectorAll(".de_span.btn_group .de_row")[0];

        // 开始创建按钮 - start
        let div = document.createElement("div");
        div.id = "confirmOrder1";
        div.className = "btn";
        let span = document.createElement("span");
        span.innerText = "提交1";
        span.className = "text";
        div.appendChild(span);
        // 按钮创建完毕 - end

        // 按钮绑定给父元素
        parentElement.appendChild(div);
        // 给按钮绑定事件
        div.addEventListener("click", function () {
            goToOrder();
        });
    }

    //PC端
    if (window.location.host.indexOf("item.jd.com") > -1) {
        //父级元素
        let parentElement = document.querySelector("#choose-btns");
        // 创建按钮
        let child = document.createElement("a");
        child.className = "btn-special1 btn-lg";
        child.innerText = '提交1'
        //         child.onclick = window.goToOrder();
        // 按钮绑定给父元素
        parentElement.appendChild(child);
        // 给按钮绑定事件
        child.addEventListener("click", function () {
            goToOrder();
        });
    }
    //跳转到订单；tyep：有2中；1是普通提交订单；2是微信提交订单页面；默认为1；
    window.goToOrder = (type = 1) => {
        let orderUrl;
        let id = getId();
        switch (type) {
            case 2:
                orderUrl = `https://wq.jd.com/deal/confirmorder/main?sceneval=2&bid=&wdref=https%3A%2F%2Fitem.m.jd.com%2Fproduct%2F${id}.html%3Fjxsid%3D16041647512054085196&scene=jd&isCanEdit=1&EncryptInfo=&Token=&commlist=${id},,1,${id},1,0,0&locationid=17-1441-1447&type=0&lg=0&supm=0`;
                window.location.href = orderUrl;
                break;
            default:
                orderUrl = `https://wqdeal.jd.com/deal/confirmorder/main?commlist=${id},,1,,1,0,0`;
                window.location.href = orderUrl;
                break;
        }
    };

    //截取网址内的商品ID
    window.getId = () => {
        //截取规则：.html后，/前
        let url2 = window.location.href.split(".html")[0];
        let newUrlArr = url2.split('/');
        return newUrlArr[newUrlArr.length - 1];
    }

    //提交订单1，普通提交
    //事件绑定
    var tjdd1 = document.querySelector("#tjdd1");
    //获取当前sku
    //拼接提交订单页面的URL
    //打开该URL
})();