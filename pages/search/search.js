var arr = wx.getStorageSync("test1") || [];
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		oninput:'',//用户输入的值
		addlist: [],//缓存的搜索历史
		disp:'none',
		hotSearch:[],//热门搜索
	},
	showlaji:function(){
		if(this.data.disp=='none'){
       this.setData({
				 disp:'flex'
			 })
		}else{
			this.setData({
				disp: 'none'
			})
		}
	},
	clearText:function(){
		this.setData({
			oninput:''
		})
	},
	oninput: function (e) {
		// console.log(e);
		this.setData({
			oninput: e.detail.value
		})
	},
	searchBtn: function (e) {
		// console.log("回车搜索")
		var that = this;
		wx.navigateTo({
			url: '../search_list/search_list?keywords=' + that.data.oninput,
		})
		// this.kk();
		arr.unshift(that.data.oninput); //数组头部添加
		wx.setStorageSync("test1", arr);
		that.setData({
			addlist: wx.getStorageSync("test1")
		})
	},
	// 确认删除历史
	clear_his: function () {
		wx.clearStorage();
		this.setData({
			addlist: []
		})
		if (this.data.disp == 'none') {
			this.setData({
				disp: 'flex'
			})
		} else {
			this.setData({
				disp: 'none'
			})
		}
	},
	// 取消删除历史
	deletes: function () {
		if (this.data.disp == 'none') {
			this.setData({
				disp: 'flex'
			})
		} else {
			this.setData({
				disp: 'none'
			})
		}
	},
	// 热门搜索点击内容触发收缩
	goSearch:function(e){
		console.log(e._relatedInfo.anchorTargetText)
		this.setData({
			oninput: e._relatedInfo.anchorTargetText
		})
		this.searchBtn();
	},
	// 热门搜索
	hotSearch:function(){
		var that=this;
		wx.request({
			url: getApp().heads + 'System/getHotSearch',
			data: {
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (e) {
				console.log(e);
				that.setData({
					hotSearch:e.data.data.list
				})
			}
		})
	},
	onLoad: function (options) {
     this.hotSearch();
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