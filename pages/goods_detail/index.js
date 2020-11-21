import { request } from "../../request/index";
// pages/goods_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },

  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options
    console.log(goods_id);
    this.getDetail(goods_id)
  },

  // 获取商品详情数据
  async getDetail(id) {
    let param = {
      url: "/goods/detail",
      data: { goods_id: id }
    }
    const goodsObj = await request(param);
    this.GoodsInfo = goodsObj
    console.log(this.GoodsInfo);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别webp图片格式
        // 1.找后台修改图片格式
        // 2.临时自己修改 ，确保后台存在 jpg格式的图片 ,前端只需将webp替换成jpg（字符串）
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      }
    })
  },

  // 轮播图放大预览图  调用小程序官方的api previewImage
  handlePreviewImage(e) {
    console.log('e', e.currentTarget.dataset.url);
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },

  // 加入购物车
  handleCartAdd() {
    console.log('购物车');
    // 1.获取缓存中的购物车数据 数组
    let cart = wx.getStorageSync("cart") || [];
    // 2. 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id == this.GoodsInfo.goods_id);
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1;
      cart.push(this.GoodsInfo)
    } else {
      // 已经存在购物车数据 执行 num++
      cart[index].num++
    }
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });
  }
})