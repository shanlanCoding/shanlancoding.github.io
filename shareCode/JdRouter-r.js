(function () {
    'use strict';
    /*
    查询设备总积分：https://router-app-api.jdcloud.com/v1/regions/cn-north-1/todayPointDetail?sortField=today_point&sortDirection=DESC&pageSize=15&currentPage=1
    */

    // mac地址
    let mac_arr = [];
    //使用说明 使用说明 使用说明 使用说明 使用说明 使用说明 使用说明
    //1.填写上面的mac_arr，这里有几台设备就填入几个mac地址
    //2.通过抓包京东云路由器App，拿到wskey。在header内，链接是：https://router-app-api.jdcloud.com/v1/开头的链接
    //3.填写抓取好的wskey到上方
    //4.打开链接：https://router-app-api.jdcloud.com/v1/regions/cn-north-1/pointOperateRecords:show
    //5.页面会显示最终结果

    // wskey秘钥，必填！抓包的时候在App里查看积分明细，wskey、sign、appkey在header里
    let wskey = localStorage.getItem('wskey');
    let jdmt_sign = localStorage.getItem('jdmt_sign');
    let jdmt_appkey = localStorage.getItem('jdmt_appkey');



    //===================================================
    let bodyStr = "";

    //全部兑换积分
    window.allExchangePoint = r => {
        console.log("全部兑换");
        document.querySelectorAll(".exchangeButton").forEach(o => {
            o.click();
        })
        //         document.boyd.click();
        r.setAttribute("disabled", "");
        console.log("this", this);
    }

    //兑换积分函数
    window.exchangePoint = function (obj, mac, point) {
        //先让用户输入一次
        point = window.prompt("请输入需要兑换的积分", point)
        //初次判断兑换的积分
        if (point <= 0) {
            point = window.prompt("请输入需要兑换的积分", point)
            //             console.log("判断兑换的积分 exchangePoint",obj,mac,point ,);
        }

        //兜底判断point是否为0或者空。预防prompt输入的数字为0的情况
        if (point === null) {
            console.log("取消兑换");
            return;
        } else if (point <= 0) {
            console.log("exchangePoint", obj, mac, !point);
            alert("失败！你兑换的积分必须要大于0，目前是：" + point);
            return;
        } else if (!point) {
            return;
        }

        //构造请求体
        const pointExchangeBody = {
            "pointExchangeReqVo": {
                "deviceId": mac,
                "pointAmount": point,
                "source": 3
            },
            "regionId": "cn-north-1"
        };

        fetch("https://router-app-api.jdcloud.com/v1/regions/cn-north-1/point:exchange", {
                "headers": {
                    "content-type": "application/json",
                    "wskey": wskey,
                    "User-Agent": "",
                },
                "body": JSON.stringify(pointExchangeBody),
                "method": "POST",
                "mode": "cors"
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                if (data.code === 200) {
                    //                 alert("兑换成功！");
                    window.location.reload();
                } else {
                    alert("失败！请截图给开发者：" + data.error.message + "\nMAC:" + mac);
                    console.error(data);
                }
            });
    }

    //备注功能
    window.markName = (obj, mac) => {
        //         console.log(obj,mac,point);
        let name = window.prompt("请输入备注名", "")
        if (!name) return;
        localStorage.setItem(mac, name);
        window.location.reload();
    };

    //今日所有设备总积分
    fetch(`https://router-app-api.jdcloud.com/v1/regions/cn-north-1/todayPointDetail?sortField=today_point&sortDirection=DESC&pageSize=15&currentPage=1`, {
            "credentials": "omit",
            "headers": {
                "content-type": "application/json",
                "jdmt-rx-appkey": jdmt_appkey,
                "jdmt-rx-sign": jdmt_sign,
                "wskey": wskey,
                "jdmt-rx-time": new Date().getTime(),
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.136 Mobile Safari/537.36 (JBOX-APP; Android/2.0.4/8)",
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors"
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            //         console.log(`今日总积分：`,data);
            let pointInfos = data.result.pointInfos;

            //遍历所有设备
            for (let i = 0; i < pointInfos.length; i++) {
                let mac = pointInfos[i].mac;
                //保存mac备用
                mac_arr.push(mac);
                //获取备注名；默认mac地址
                let name = localStorage.getItem(mac) ? localStorage.getItem(mac) : mac;

                // 所有的值以mac为id前缀，后面再添加不同值的名字。如：未兑换的积分id为：mac_amount，这样就会让id变得唯一且容易修改dom
                bodyStr += `<tr>
<td>备注：${name}</td>
<td style="display:none" name="${mac}">MAC：${mac}</td>
<td style="color: #03A9F4;" >${data.result.todayDate} 日积分：${pointInfos[i].todayPointIncome}</td>
<td>未兑换：<span id='${mac}_amount'></span></td>
<td>总积分：${pointInfos[i].allPointIncome}</td>
<td><button id='${mac}_exchangeButton' class="exchangeButton" onClick="exchangePoint(this,'${mac}',${mac})">兑换</button></td>
<td><button onClick="markName(this,'${mac}')">备注</button></td>`;
            }
            document.querySelector("body").innerHTML = "";
            document.querySelector("body").innerHTML = `<table cellpadding="10"> <tr> ${bodyStr} <td><button onClick="allExchangePoint(this)">全部兑换</button></td> </tr></table>`;

            //显示未兑换的积分
            //查询所有账户信息和积分
            mac_arr.map(
                mac => {
                    let routerAccountInfo_url = `https://router-app-api.jdcloud.com/v1/regions/cn-north-1/routerAccountInfo?mac=${mac}`;
                    fetch(routerAccountInfo_url, {
                            "headers": {
                                "content-type": "application/json",
                                "jdmt-rx-appkey": jdmt_appkey,
                                "jdmt-rx-sign": jdmt_sign,
                                "wskey": wskey,
                                "Referer": "http://guanli.luyou.360.cn/new_index.htm"
                            },
                            "referrerPolicy": "no-referrer-when-downgrade",
                            "body": null,
                            "method": "get",
                            "mode": "cors"
                        })
                        .then(res => {
                            return res.json();
                        }).then(data => {
                            document.getElementById(`${mac}_amount`).textContent = data.result.accountInfo.amount;
                            document.getElementById(`${mac}_exchangeButton`).attributes.onclick.value = `exchangePoint(this,'${mac}',${data.result.accountInfo.amount})`;
                        });
                }
            );
        });

})();