// pages/pay/index.js

/**
 * 1. 页面加载的时候
 *    1.从缓存中获取到购物车数据，渲染到页面中，isCheck必须为true
 *
 */

import { chooseAddress, showModal, showToast } from "../../utils/asyncWx";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {}, // 收货地址
    cart: [], // 购物车数据
    allChecked: false, // 是否全选
    totalPrice: 0, // 总价格
    totalNum: 0, // 总数量
  },

  onShow() {
    // 1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1. 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 1. 计算当前购物车商品是否都已被选中
    // 假如空数组调用了every 方法，返回值就为true
    // const allChecked = cart.length > 0 && cart.every((v) => v.isCheck);

    // 过滤后的购物车数组
    cart = cart.filter((v) => v.isCheck);

    // 1. 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true; // 是否全选
    cart.forEach((v) => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    });
    // 2. 给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  async handleGetAddress() {
    try {
      const address = await chooseAddress();
      address.allStr =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.countyName +
        address.detailInfo;
      // 存入到缓存中去
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
});
