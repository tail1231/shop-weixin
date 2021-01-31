// pages/search/index.js
/**
 * 1 输入框绑定 值改变事件 input事件
 *   1 获取到输入框到值
 *   2 合法性判断
 *   3 检验通过 把输入框的值，发送到后台，请求搜索到的数据
 *   4 返回的数据，渲染到页面上
 * 2 防抖(防止抖动) 定时器  节流
 *   0 防抖 一般用于 输入框中 防止重复输入 重复发送请求
 *   1 节流 一般是用于在页面下拉和上拉
 *   1 定义全局的定时器id
 */
import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";

let timeId = -1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    search: [],
    // 取消按钮是否显示
    isFocus: false,
    inputValue: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 输入框的值改变 就会触发的事件
  handleInput(e) {
    // 1 获取输入框的值
    const { value } = e.detail;
    // 2 检测合法性
    if (!value.trim()) {
      // 值不合法
      this.setData({
        isFocus: false,
        search: [],
      });
      return;
    }
    this.setData({
      isFocus: true,
    });
    // s准备发送请求获取数据
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },

  // 取消按钮事件
  handleCancel() {
    this.setData({
      isFocus: false,
      search: [],
      inputValue: "",
    });
  },

  // 获取搜索到的数据
  async qsearch(query) {
    const res = await request({ url: "/goods/search", data: { query } });
    console.log(res);
    this.setData({
      search: res.goods,
    });
  },
});
