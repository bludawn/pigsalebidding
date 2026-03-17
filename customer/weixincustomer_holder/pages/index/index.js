// index.js
Page({
  data: {
    h5Url: 'http://192.168.2.90:3000/' // 请替换为你的H5页面地址
  },

  onLoad() {
    // 可以从参数或其他配置获取H5地址
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;

    if (options.url) {
      this.setData({
        h5Url: decodeURIComponent(options.url)
      });
    }
  }
})
