import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], //左侧导航菜单
    rightContent: [], //右侧商品数据
    currentIndex: 0, //左侧菜单当前选中
    scrollTop: 0, //右侧内容的滚动条距离顶部的距离
  },

  // 接口返回的数据
  cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * web中的本地存储和小程序中的本地存储的区别：
     *    （1）代码不一样了
     *        web: localStorage.setItem("key","value") --存  / localStorage.getItem("key") -- 取
     *        小程序: wx.setStorageSync("key", "value"); --存 / wx.getStorageSync("key") -- 取
     *     (2)存储的时候是否有做类型转换
     *        web: 不管存入的是什么类型的数据，最终都会调用toString()，将数据转换为字符串类型后再存入进去
     *        小程序: 不存在类型转换这个操作，存什么类型的数据，获取的时候就是什么类型
     */

    /**
     * 1. 先判断本地存储中是否有旧数据
     * 2. 如果没有，则发送请求，请求新的数据
     * 3. 如果有，再判断旧数据是否过期，如果过期，则重新发送请求，请求新的数据
     * 4. 如果有，并且旧数据没有过期，则使用本地存储的旧数据即可
     */
    const cates = wx.getStorageSync("cates");
    const { currentIndex } = this.data;
    if (!cates) {
      // 不存在，发送请求，获取数据
      this.getCates(currentIndex);
    } else {
      // 有旧的数据  定义一个过期时间 10s   验证完成后，改为5分钟
      if (Date.now() - cates.time > 5 * 60 * 1000) {
        // 数据过期需要重新发送请求
        this.getCates(currentIndex);
      } else {
        // 可以使用旧数据
        console.log("可以使用旧数据");
        this.cates = cates.data;
        //构造左侧导航菜单数据
        let leftMenuList = this.cates.map((v) => v.cat_name);
        //构造右侧商品数据
        let rightContent = this.cates[currentIndex].children;
        this.setData({
          leftMenuList,
          rightContent,
        });
      }
    }
  },

  // 获取分类数据
  async getCates(i) {
    let params = {
      url: "/categories",
    };
    // request(params).then((res) => {
    //   console.log("分类", res);
    //   if (res.statusCode === 200) {
    //     this.cates = res.data.message;
    //     // 把接口数据，存储到本地存储中去
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.cates });
    //     //构造左侧导航菜单数据
    //     let leftMenuList = this.cates.map((v) => v.cat_name);
    //     //构造右侧商品数据
    //     let rightContent = this.cates[i].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent,
    //     });
    //     console.log(leftMenuList);
    //   }
    // });
    // 1.使用es7的async await来发送请求
    const res = await request(params);
    this.cates = res;
    // 把接口数据，存储到本地存储中去
    wx.setStorageSync("cates", { time: Date.now(), data: this.cates });
    //构造左侧导航菜单数据
    let leftMenuList = this.cates.map((v) => v.cat_name);
    //构造右侧商品数据
    let rightContent = this.cates[i].children;
    this.setData({
      leftMenuList,
      rightContent,
    });
  },
  // 左侧
  handleItemTap(e) {
    console.log("菜单", e.target.dataset.index);
    // 1. 通过data-的方式，将索引传递过来
    // 2. 通过点击每个菜单项获取当前索引
    // 3. 最后将当前点击的索引存到data变量中去
    const {
      target: {
        dataset: { index },
      },
    } = e;
    this.setData(
      {
        currentIndex: index,
        scrollTop: 0,
      },
      () => {
        this.getCates(this.data.currentIndex);
      }
    );
  },
});
