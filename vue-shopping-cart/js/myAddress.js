new Vue({
    el: ".container",
    data: {
        addressList: [],//地址列表
        limitNumber: 3,//需要显示的地址数量
        currentIndex: 0,//当前选中的地址
        shippingMethod: 1,//配送方式，1标准配送
        showDeleteAddress: false,//显示删除地址栏
        curAddress: '',//当前选中的地址
    },
    mounted: function () {
        this.$nextTick(function () {
            this.getAddressList();
        });
    },
    computed: {
        // 截取地址列表数组，达到显示几个数量的地址。该方法返回一个新的截取后的数组
        filerAddress() {
            return this.addressList.slice(0, this.limitNumber);
        }
    },
    methods: {
        // 加载地址列表
        getAddressList: function () {
            this.$http.get("data/address.json").then((r) => {
                // console.log(r);
                var res = r.data;
                // 判断数据内的状态码
                if (res.status == '0') {
                    this.addressList = res.result;
                    // this.addressList = [];
                }
            });
        },
        // 显示更多地址
        loadMoreAddress: function () {
            this.limitNumber = this.addressList.length;
        },
        // 显示更多地址
        setDefault: function (addressId) {
            this.addressList.forEach((address, index) => {
                // 遍历所有地址，通过传入的地址id进行比对
                if (address.addressId == addressId) {
                    address.isDefault = true;
                } else {
                    address.isDefault = false;
                }
            });
        },
        // 显示删除弹窗
        deleteAddressConfirm: function (item) {
            // 赋值true，表示要删除和显示弹窗、遮罩层
            this.showDeleteAddress = true;
            // 记录需要删除的address
            this.curAddress = item;
        },
        // 在弹窗里删除地址
        deleteAddress: function (item) {
            // 1.从地址列表，找到当前地址的索引
            var index = this.addressList.indexOf(this.curAddress);
            // 2.从地址列表里删除
            this.addressList.splice(index, 1);
            // 3.给showDeleteAddress赋值false，等同于关闭弹窗
            this.showDeleteAddress = false;
        },


    }
});