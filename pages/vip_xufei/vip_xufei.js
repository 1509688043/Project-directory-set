// pages/vip_xufei/vip_xufei.js
Page({

	data: {
		init:[],//vip信息
		tip:'',//判断点过来的是  开通vip 还是  我的vip
		nd:1,
		nickname: '',
		head: ''
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
				console.log(wx.getStorageSync('Now_goods_id') + '=' + wx.getStorageSync('m_id') + '=' + that.data.nd)
				console.log(e);
			}
		})
    
	},
	onLoad: function (options) {
		console.log(options.tip)
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