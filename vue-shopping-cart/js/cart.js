// import api from 'src/js/api.js'

// 全局过滤器一定要定义在vue实例之前
Vue.filter("money", function (price, suffix) {
    return "￥" + price.toFixed(2) + suffix;
});


new Vue({
    el: "#app",
    data: {
        msg: "你好 Vue",
        productList: [], // 商品列表
        totalMoney: 0, // 服务器获取的总价
        checkAll: false, // 是否全选
        totalPrice: 0, //选择的商品总价
        isDelete: false, //是否删除
        curProduct: '', // 需要删除的商品
    },
    filters: {
        formatMoney: function (v) {
            // alert(v);
            return "￥" + v.toFixed(2);
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.testView();
        });
        // const {data: {code, data}} = await api.post('/api/comment/post', {title: 'title'})
        // if (code === 200) {
        //     console.log(data)
        // }
        // const {data: {code, data}} = await api.get('baidu.com', {page: 1})
        // if (code === 200) {
        //     console.log(data)
        // }
    },

    methods: {
        // 加载商品列表
        testView: function () {
            this.$http.get("data/cartData.json").then(r => {
                this.productList = r.data.result.list;
                this.totalMoney = r.data.result.totalMoney;
            });
        },
        // 通过加减按钮，修改商品数量
        changeMoney: function (item, num) {
            // alert(this.msg)
            if (num > 0) {
                // productQuantity：商品的数量
                item.productQuantity++;
            } else {
                item.productQuantity--;
                if (item.productQuantity < 1) {
                    item.productQuantity = 1;
                }
            }
            // 计算价格
            this.calcTotalPrice();
        },
        // 选择商品
        selectedProduct: function (i) {
            if (typeof i.checked == "undefined") {
                // 当变量checked不存在
                Vue.set(i, "checked", true);
                // this.$set(item, "checked", true);
            } else {
                i.checked = !i.checked;
            }
            // 计算价格
            this.calcTotalPrice();
        },
        checkAllFun: function (Flag) { //全选/反选
            this.checkAll = Flag;
            // 遍历商品列表
            this.productList.forEach((item, index) => {
                // console.log(JSON.stringify(item), index);
                // 判断商品是否有checked，没有的话就注册
                if (typeof item.checked == 'undefined') {
                    // 注册全局对象的属性
                    this.$set(item, "checked", this.checkAll);
                }
                // 无论如何，最后是需要赋值flag给商品的属性
                item.checked = Flag;
            });
            // console.log(Flag ? "全选" : "取消");
            // 计算价格
            this.calcTotalPrice();
        },
        // 计算商品总价
        calcTotalPrice: function () {
            // 清空总价
            this.totalPrice = 0;
            this.productList.forEach((item, index) => {
                if (item.checked) {
                    // 总价 = 商品的单价 * 商品的数量
                    this.totalPrice += item.productPrice * item.productQuantity;
                }
            });
        },
        // 记录当前需要删除的商品
        deletConfirm: function (item) {
            this.isDelete = true;
            this.curProduct = item;
        },
        // 删除商品
        deletProduct: function (item) {
            /*
            * 思路：商品是存储在数组中的。而商品的页面列表是从数组productList中加载的
            * 所以，我们只需要删除productList数组中的元素即可。
            * 利用indexof，找到当前需要删除商品元素的索引
            * 利用splice，从索引的位置开始删除，但是删除的数量只需要1即可
            * 删除数组内的元素以后，vue它会自动渲染页面的视图效果。从而达到页面的DOM元素也被删除。
            * */
            // 1.找到商品的索引
            var index = this.productList.indexOf(this.curProduct);
            // 2. 从index索引开始删除，删除1个元素
            this.productList.splice(index, 1);
            // 3. 关闭弹窗和遮罩
            this.isDelete = false;
        },

    }
});
















