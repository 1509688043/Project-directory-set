// pages/vip_xufei/vip_xufei.js
Page({

	data: {
		init:[],//vip信息
		tip:'',//判断点过来的是  开通vip 还是  我的vip
		nd:1,
		nickname: '',
		head: '',
    sdn:'-1',//判断是否是视频跳过来的
    dangevip:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	chked:function(e){
		console.log(e)
		this.setData({
			nd: e.currentTarget.dataset.index
		})
	},
	// 打开支付
	openVip:function(e){
    
		var that=this;
    console.log(that.data.nd)
		wx.request({
			url: getApp().heads + 'Center/doPay',
			data: {
				goods_id: wx.getStorageSync('Now_goods_id'), //刚才观看的视频id
				m_id: wx.getStorageSync('m_id'),
				types:that.data.nd
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (e) {
				console.log(e);
				var apirest=e.data.data.sign;
				console.log(apirest)
				// 调支付
				wx.requestPayment({
					timeStamp: apirest.timeStamp.toString(),
					nonceStr: apirest.nonceStr,
					package: apirest.package,
					signType: apirest.signType,
					paySign: apirest.sign,
					success:function(res){
						console.log(res)
						
            if (that.data.nd==4){//证明这次支付的是单个视频 要返回播放详情
            wx.navigateTo({
              url: '../video_xiangqing/video_xiangqing?goods_id=' + wx.getStorageSync('Now_goods_id'),
            })
            }else{//正常购买会员 返回我的会员页
              setTimeout(function () {
                wx.reLaunch({
                  url: '../wode/wode?fh=1'
                })
              }, 1000)
            }
					}
				})
			}
		})
    
	},
	onLoad: function (options) {
    var that=this;
    if (wx.getStorageSync('sdn')==1){//视频跳过来的
       this.setData({
         sdn:1,
         nd:4
       })
       console.log("视频跳过来的")
      wx.request({
        url: getApp().heads + 'Center/videoPrice',
        data: {
          m_id: wx.getStorageSync('m_id'),
          goods_id: wx.getStorageSync('Now_goods_id'),
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        success: function (e) {
          console.log(e.data.data);
          if (e.data.data.price!==0.00){
            that.setData({
              dangevip: e.data.data //单个vip购买数据
            })
          }else{
            wx.setStorage({//视频出现中途变更状态的时候跳回原视频
              key: "sdn",
              data: 0,
            })
            wx.redirectTo({//返回刚才看的视频页
              url: '../video_xiangqing/video_xiangqing?goods_id=' + e.data.data.goods_id,
            })
          }
        }
      })
    }else{
      this.setData({
        sdn: 0
      })
    }
		this.setData({
			tip:options.tip,
			head: wx.getStorageSync('head'),
			nickname: wx.getStorageSync('nickname')
		})
   
     this.goSend();
	},
	goSend:function(){
		var that=this;
		wx.request({
			url: getApp().heads + 'Center/getInfo',
			data: {
				goods_id: wx.getStorageSync('Now_goods_id'), //刚才观看的视频id
				m_id: wx.getStorageSync('m_id'),
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (e) {
				console.log(e.data.data);
				that.setData({
					init: e.data.data
				})
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