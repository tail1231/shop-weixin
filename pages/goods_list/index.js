import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";

// pages/goods_list/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true,
      },
      {
        id: 1,
        value: "销量",
        isActive: false,
      },
      {
        id: 2,
        value: "价格",
        isActive: false,
      },
    ],
    goodsList: [],
  },

  queryParams: {
    query: "", // 关键字
    cid: "", //商品id
    pagenum: 1,
    pagesize: 10,
  },

  totalPages: 1, //总页数

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.queryParams.cid = options.cid;
    this.getGoodsList();
  },
  // tabs点击事件
  handleTabsItemChange(e) {
    console.log(e);
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    // 2.修改源数据
    let { tabs } = this.data;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    // 3.赋值到data中
    this.setData({
      tabs,
    });
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", ...this.queryParams });
    const total = res.total;
    // 计算总页数 总页数 = Math.ceil(总条数 / 页容量)
    this.totalPages = Math.ceil(res.total / this.queryParams.pagesize);
    console.log(this.totalPages);

    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods],
    });
    // 关闭下拉刷新
    wx.stopPullDownRefresh();
    console.log("商品列表", res);
  },

  // 上拉加载
  onReachBottom() {
    // 首先判断是否还有下一页数据
    if (this.queryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: "没有下一页数据啦",
      });
    } else {
      this.queryParams.pagenum += 1;
      this.getGoodsList();
    }
  },
  onPullDownRefresh: function () {
    console.log("aa");
    // 触发下拉刷新时执行
    //1. 重置数组 ，因为之前有拼接过数据
    this.setData({
      goodsList: [],
    });
    //2. 重置页码
    this.queryParams.pagenum = 1;
    //3. 重新请求数据
    this.getGoodsList();
  },
});
