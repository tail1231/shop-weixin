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
      url: "/home/swiperdata",
    };
    request(params).then((res) => {
      res.forEach(v => {
        v.navigator_url = v.navigator_url.replace("main", "index")
      })
      console.log(res);
      this.setData({
        swiperList: res,
      });
    });
  },
  // 获取导航分类数据
  getCateList() {
    let params = {
      url: "/home/catitems",
    };
    request(params).then((res) => {
      console.log("导航", res);
      this.setData({
        cateList: res,
      });
    });
  },
  // 获取楼层数据
  getFloorList() {
    let params = {
      url: "/home/floordata",
    };
    request(params).then((res) => {
      console.log("楼层", res);
      this.setData({
        floorList: res,
      });
    });
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },
  onPageScroll: function () { },
  //item(index,pagePath,text)
  onTabItemTap: function (item) { },
});
