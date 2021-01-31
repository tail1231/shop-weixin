// pages/order/index.js
/**
 * 1 页面被打开待时候，onShow
 *   0 onShow 不同于onLoad 无法在形参上接收 options参数
 *   0.5 判断缓存中是否存在token
 *       1 无 直接跳转到授权页面
 *       2 有 直接往下进行
 *   1 获取url上的参数type
 *   2 根据type 发送请求，获取订单数据
 *   3 渲染页面
 * 2 点击不同标题的时候，需要重新发送请求来获取和渲染订单数据
 */

import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true,
      },
      {
        id: 1,
        value: "待付款",
        isActive: false,
      },
      {
        id: 2,
        value: "待发货",
        isActive: false,
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false,
      },
    ],
    orders: [],
  },

  onShow(options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/index",
      });
      return;
    }
    // 1 获取当前小程序的页面栈 - 数组 长度最大10页面
    // 2 数组中索引最大的页面就是当前页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    console.log(currentPage.options);
    // 3 获取url上的type参数
    const { type } = currentPage.options;
    // 激活当前选中的tab
    this.handleTabsItemChange({
      detail: {
        index: type - 1,
      },
    });
    this.getOrders(type);
  },

  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    this.setData({
      orders: res.orders.map((v) => ({
        ...v,
        create_time_cn: new Date(v.create_time * 1000).toLocaleString(),
      })),
    });
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

    // 4 重新发送请求 type = 1 , index =0
    this.getOrders(index + 1);
  },
});
