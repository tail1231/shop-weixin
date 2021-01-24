// pages/auth/index.js
import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
import { login } from "../../utils/asyncWx";

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  // 获取用户信息
  // 个人开发者，无法实现支付功能
  async handleGetUserInfo(e) {
    try {
      // 1 获取用户信息
      console.log(e);
      const { encryptedData, iv, rawData, signature } = e.detail;
      // 2 获取小程序登陆成功后的code
      const { code } = await login();
      // 3 发送请求，获取用户token值
      const loginParams = {
        encryptedData,
        iv,
        rawData,
        signature,
        code,
      };
      const token = await request({
        url: "/users/wxlogin",
        data: loginParams,
        method: "post",
      });
      console.log(token);
      // 4 把token存入到缓存中，同时跳转回到上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1,
      });
    } catch (error) {
      console.log("error", error);
    }
  },
});
