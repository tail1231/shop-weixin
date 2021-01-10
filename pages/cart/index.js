// pages/cart/index.js
// 1. 获取用户到收货地址
//    1. 给按钮绑定点击事件
//    2. 调用小程序官方的api 获取用户的收货地址
//    3. 把获取到的收货地址 存入到 本地存储中去
//
/**
 * 2. 页面加载完完毕
 *    1. 获取本地存储中到地址数据
 *    2. 把数据设置给data中的一个变量
 */
import { chooseAddress } from "../../utils/asyncWx";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {}, // 收货地址
    cart: [], // 购物车数据
    allChecked: false, // 是否全选
  },

  onShow() {
    // 1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1. 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 1. 计算当前购物车商品是否都已被选中
    // 假如空数组调用了every 方法，返回值就为true
    const allChecked = cart.length > 0 && cart.every((v) => v.isCheck);
    // 2. 给data赋值
    this.setData({
      address,
      cart,
      allChecked,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  // 获取收货地址  9.25后开发者可以直接调用wx.chooseAddress该接口，无需用户授权
  // handleGetAddress() {
  //   wx.getSetting({
  //     success: (result) => {
  //       const scopeAddress = result.authSetting["scope.address"];
  //       if (scopeAddress === true || scopeAddress === undefined) {
  //         wx.chooseAddress({
  //           success: (result1) => {
  //             console.log("result1", result1);
  //           },
  //         });
  //       } else {
  //         // 用户拒绝过授予权限，诱导用户打开授权页面
  //         wx.openSetting({
  //           success: (result2) => {
  //             wx.chooseAddress({
  //               success: (result3) => {
  //                 console.log("result3", result3);
  //               },
  //             });
  //           },
  //         });
  //       }
  //     },
  //   });
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

  // 全选购物车商品
  handleCheckAll(e) {
    console.log("object", e);
  },
});
