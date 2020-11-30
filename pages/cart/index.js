// pages/cart/index.js
// 1. 获取用户到收货地址
//    1. 给按钮绑定点击事件
//    2. 调用小程序官方的api 获取用户的收货地址
import { chooseAddress } from "../../utils/asyncWx";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {},

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
    const res = await chooseAddress();
    console.log("res", res);
  },
});
