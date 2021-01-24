//同时发送多个异步请求
let ajaxTimes = 0;

export const request = (params) => {
  // 判断url中是否带有 /my/ 字符串，有:请求的是私有的路径，需要带上header token
  let header = { ...params.header }; // 这么写，可以接收新的请求头信息，进行合并
  if (params.url.includes("/my/")) {
    // 拼接header，带上token
    header["Authorization"] = wx.getStorageSync("token");
  }

  ajaxTimes++;
  console.log("params", params);
  wx.showLoading({
    title: "加载中",
    mask: true,
  });
  // 定义公共的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      header,
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      },
    });
  });
};
