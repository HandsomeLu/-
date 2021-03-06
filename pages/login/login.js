var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindGetUserInfo: function (event) {
    console.log(event.detail.userInfo)
    var that = this;
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              console.log(res.scope.userInfo)
            }
          })
          wx.login({
            success: function (r) {
              //获取临时凭证
              var code = r.code;
              wx.getUserInfo({
                success: function (res) {
                  console.log({
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    code: code
                  })
                  //调用后端
                  wx.request({
                    url: app.globalData.url+'/WXLogin',

                    data: {
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      code: code,
                    },
                    method: "POST",
                    success: function (result) {
                      console.log(result.data)
                      if (result.data.status == 1) {
                        console.log(result.data.userInfo.openId);
                        app.globalData.userInfo = result.data.userInfo;
                        wx.setStorageSync('logged', true);
                        wx.setStorageSync('openid', result.data.userInfo.openId);
                      } else {
                        console.log('解密失败')
                      }
                      wx.switchTab({
                        url: '../home_page/home_page',
                      })
                    },
                    fail: function () {
                      console.log("系统错误")
                    }
                  })
                }
              })
            }
          })
        }
        if (res.authSetting['scope.userInfo']&&wx.getStorageSync('logged')==false) {
          wx.login({
            success: function (r) {
              //获取临时凭证
              var code = r.code;
              wx.getUserInfo({
                success: function (res) {
                  console.log({
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    code: code
                  })
                  //调用后端
                  wx.request({
                    url: app.globalData.url+'/WXLogin',

                    data: {
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      code: code,
                    },
                    method: "POST",
                    success: function (result) {
                      if (result.data.status == 1) {
                        console.log(result.data.userInfo.openId);
                        app.globalData.userInfo = result.data.userInfo;
                        wx.setStorageSync('logged', true);
                        wx.setStorageSync('openid', result.data.userInfo.openId);
                      } else {
                        console.log('解密失败')
                      }
                      wx.switchTab({
                        url: '../home_page/home_page',
                      })
                    },
                    fail: function () {
                      console.log("系统错误")
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  login: function (e) {
    wx.authorize({
      scope: 'scope.userInfo',
      success(res) {
        console.log(res.scope.userInfo)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("Url:"+app.globalData.url)
    var that=this
    if(wx.getStorageSync('logged')==true){
      that.setData({
        logged:true
      })
      setTimeout(function(){
        wx.switchTab({
          url: '../home_page/home_page',
        })
      },1000)
      
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})