// pages/pay/index.js

/**
 * 1. 页面加载的时候
 *    1.从缓存中获取到购物车数据，渲染到页面中，isCheck必须为true
 * 2. 微信支付
 *    1.哪些人 哪些账号 可以实现微信支付
 *       1.企业账号
 *       2.企业账号的小程序后台中 必须给开发者 添加到白名单中
 *         1.一个appId可以同时绑定多个开发者
 *         2.这些开发者就可以共用这个appId 和 它的开发权限
 * 3. 支付按钮
 *    1.先判断缓存中是否存在token
 *    2.没有则必须先授权，获取到token
 *    3.有token
 *    4.创建订单 获取订单编号
 *    5.已经完成微信支付
 *    6.需要手动删除缓存中已经被选中的商品
 *    7.重新把删除后的购物车数据，更新至缓存中去
 *    8.再跳转页面
 */

import { request } from "../../request/index";
import { chooseAddress, requestPayment, showToast } from "../../utils/asyncWx";
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

  // 支付
  async handlePay() {
    try {
      // 1.判断缓存中是否存在token
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: "/pages/auth/index",
        });
        return;
      }
      // 2.创建订单
      // 3.1 准备请求头参数
      // const header = { Authorization: token };
      // 3.2 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach((v) => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.goods_number,
          goods_price: v.goods_price,
        });
      });
      const orderParams = {
        order_price,
        consignee_addr,
        goods,
      };
      // 4.发送请求，创建订单，获取订单编号
      const { order_number } = await request({
        url: "/my/orders/create",
        method: "POST",
        data: orderParams,
        // header,
      });
      // 5.准备发起预支付的接口
      const pay = await request({
        url: "/my/orders/req_unifiedorder",
        data: {
          order_number,
        },
        method: "POST",
        // header,
      });
      // 6.发起支付
      await requestPayment(pay);
      // 7.查询后台，核实订单状态是否成功ss
      const res = await request({
        url: "/my/orders/chkOrder",
        method: "POST",
        data: {
          order_number,
        },
        // header,
      });
      await showToast({ title: "支付成功" });
      console.log(res); // 支付成功
      // 8.需要手动删除缓存中已经被选中的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter((v) => !v.isCheck);
      wx.setStorageSync("cart", newCart);
      // 8.支付成功跳转到订单页
      wx.navigateTo({
        url: "/pages/order/index",
      });
    } catch (error) {
      await showToast({ title: "支付失败" });
    }
  },
});
