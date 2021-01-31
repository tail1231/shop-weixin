// pages/feedback/index.js
/**
 * 1 点击 + 按钮的时候，触发点击事件
 *   1 调用小程序内置的选择图片的api
 *   2 获取到图片的路径 数组格式
 *   3 把图片路径都存到data的变量中
 *   4 页面就可以根据图片数组进行循环渲染显示了（自定义组件）
 * 2 点击自定义图片 组件
 *   1 获取被点击的图片的索引
 *   2 获取data中的图片数组
 *   3 根据索引 删除数组中对应的元素
 *   4 更新后的数组重新存入data中去
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false,
      },
    ],
    chooseImgs: [], // 被选中的图片数组
  },

  // 点击 + 选择图片事件
  handleChooseImg() {
    // 2 调用小程序内置的选择图片 api
    wx.chooseImage({
      // 同时选中图片的数量
      count: 9,
      // 图片的格式  原图 / 压缩
      sizeType: ["original", "compressed"],
      // 图片的来源 相册 / 相机
      sourceType: ["album", "camera"],
      success: (result) => {
        console.log(result);
        this.setData({
          // 防止用户多次选择图片，所以需要拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths],
        });
      },
      fail: () => {},
      complete: () => {},
    });
  },

  // 点击自定义图片组件的删除按钮
  handleDelImg(e) {
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除选中元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs,
    });
  },

  // tabs点击事件
  handleTabsItemChange(e) {
    console.log(e);
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    // 2.修改源数据
    let { tabs } = this.data;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    // 3.赋值到data中
    this.setData({
      tabs,
    });
  },
});
