import { request } from "../../request/index";
// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], //左侧导航菜单
    rightContent: [], //右侧商品数据
    currentIndex: 0, //左侧菜单当前选中
  },

  // 接口返回的数据
  cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCates();
  },

  // 获取分类数据
  getCates() {
    let params = {
      url: "https://api-hmugo-web.itheima.net/api/public/v1/categories",
    };
    request(params).then((res) => {
      console.log("分类", res);
      if (res.statusCode === 200) {
        this.cates = res.data.message;

        //构造左侧导航菜单数据
        let leftMenuList = this.cates.map((v) => v.cat_name);
        //构造右侧商品数据
        let rightContent = this.cates[0].children;
        this.setData({
          leftMenuList,
          rightContent,
        });
        console.log(leftMenuList);
      }
    });
  },
});
