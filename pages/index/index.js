//Page Object
import { request } from "../../request/index";
Page({
  data: {
    swiperList: [], //轮播图
    cateList: [], //导航数组
    floorList: [], //楼层数据
  },
  //options(Object)
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    let params = {
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
    };
    request(params).then((res) => {
      console.log("轮播图", res);
      if (res.statusCode === 200) {
        this.setData({
          swiperList: res.data.message,
        });
      }
    });
  },
  // 获取导航分类数据
  getCateList() {
    let params = {
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems",
    };
    request(params).then((res) => {
      console.log("导航", res);
      if (res.statusCode === 200) {
        this.setData({
          cateList: res.data.message,
        });
      }
    });
  },
  // 获取楼层数据
  getFloorList() {
    let params = {
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/floordata",
    };
    request(params).then((res) => {
      console.log("楼层", res);
      if (res.statusCode === 200) {
        this.setData({
          floorList: res.data.message,
        });
      }
    });
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});