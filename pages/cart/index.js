// pages/cart/index.js
// 1. 获取用户到收货地址
//    1. 给按钮绑定点击事件
//    2. 调用小程序官方的api 获取用户的收货地址
//    3. 把获取到的收货地址 存入到 本地存储中去
// 2. 总价格和总数量
//    1. 商品都需要被选中后，才去计算
//    2. 获取到购物车数组
//    3. 遍历
//    4. 判断商品是否被选中
//    5. 总价格 = 商品单价 * 商品数量
//    6. 总数量 += 商品数量
//    7. 把总价格和总数量更新到data中
// 3. 商品的选中功能
//    1. 给复选框绑定change事件
//    2. 获取被修改的商品对象
//    3. 商品对象的选中状态 取反
//    4. 重新更新到data中以及缓存中
//    5. 重新计算全选、总价格及总数量
// 4. 底部工具栏的全选和反选功能
//    1. 给全选复选框绑定onChange事件
//    2. 获取data中 全选变量 allChecked
//    3. 直接取反 allChecked = !allChecked
//    4. 遍历购物车数组，让每个商品的isCheck 跟随allChecked改变
//    5. 购物车数组 和 allChecked 重新更新到data中 和缓存中
// 5. 商品数量的编辑
//    1. "+","-"，绑定同一个点击事件 区分加减的关键 自定义属性
//       "+1","-1"
//    2. 传递被点击的商品id goods_id
//    3. 获取到data中的购物车数组，根据商品id获取需要被修改的商品对象
//    4. 当购物车数量 = 1 同时用户继续点击 "-"
//       弹窗提示，询问用户是否要商品该商品，确定就删除，取消不作任何操作
//    4. 修改商品对象的数量属性
//    5. 修改完毕，重新更新到data 和 缓存中去  this.setCart
// 6. 点击结算
//    1. 判断有没有地址信息
//    2. 判断用户有没有选购商品
//    3. 通过以上条件，跳转到支付页面
//
/**
 * 2. 页面加载完完毕
 *    1. 获取本地存储中到地址数据
 *    2. 把数据设置给data中的一个变量
 */
import { chooseAddress, showModal, showToast } from "../../utils/asyncWx";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {}, // 收货地址
    cart: [], // 购物车数据
    allChecked: false, // 是否全选
    totalPrice: 0, // 总价格
    totalNum: 0, // 总数量
  },

  onShow() {
    // 1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1. 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 1. 计算当前购物车商品是否都已被选中
    // 假如空数组调用了every 方法，返回值就为true
    // const allChecked = cart.length > 0 && cart.every((v) => v.isCheck);

    this.handleSetCart(cart);

    // 2. 给data赋值
    this.setData({
      address,
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
    // 1 获取data中的数据
    let { cart, allChecked } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组中的isCheck值
    cart.forEach((v) => (v.isCheck = allChecked));
    // 4 把修改后的值， 更新到data中和缓存中
    this.handleSetCart(cart);
  },

  // 单个商品勾选
  handleCheckChange(e) {
    // 获取到当前选中商品的id
    const {
      currentTarget: {
        dataset: { id },
      },
    } = e;
    console.log("goods_id", id);
    // 获取购物车数组
    const { cart } = this.data;
    // 找到被修改的商品对象
    let i = cart.findIndex((v) => v.goods_id === id);
    // 选中状态取反
    cart[i].isCheck = !cart[i].isCheck;
    this.handleSetCart(cart);
  },

  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到需要修改商品的索引
    const index = cart.findIndex((v) => v.goods_id === id);
    // 判断是否要删除商品
    if (cart[index].num === 1 && operation === -1) {
      let params = { title: "温馨提示", content: "您是否要删除" };
      const res = await showModal({ ...params });
      console.log("res", res);
      if (res.confirm) {
        cart.splice(index, 1);
        this.handleSetCart(cart);
      }
    } else {
      // 进行修改数量
      cart[index].num += operation;
      // 更新至data和缓存中
      this.handleSetCart(cart);
    }
  },

  // 结算
  async handlePay() {
    // 从data中获取地址信息
    const { address, totalNum } = this.data;
    // 判断收货地址
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 判断用户是否已经选购商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: "/pages/pay/index",
    });
  },
  // 设置购物车状态，重新计算底部工具栏数据
  handleSetCart(cart) {
    // 1. 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true; // 是否全选
    cart.forEach((v) => {
      if (v.isCheck) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = !cart.length ? false : allChecked;
    // 把购物车数据重新更新到data中和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
    });
    wx.setStorageSync("cart", cart);
  },
});
