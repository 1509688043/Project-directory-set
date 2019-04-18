var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
var videoContext = wx.createVideoContext;
var timer;
Page({
	data: {
		src: 'https://flv2.bn.netease.com/videolib3/1803/28/RkuxC2558/SD/RkuxC2558-mobile.mp4',
		xx: [],
		hot: '-1',
		zindex: '',
		disp:'none',
		init:[],
		zk:-1,
		fx:'0', //判断屏幕固定
		p:1,
		goodid:'',//当前选中的视频id
		this_cover: '',//当前分享视频封面图
		this_goods_name:'',//当前分享视频名字
		shikanTime: '',//试看时间 秒
		shouchangimg: [
			'http://aoshang-file.uuudoo.com/Public/img_icon/shouchangW.png',
			'http://aoshang-file.uuudoo.com/Public/img_icon/shouchangY.png'
		], 
		dianzan: [
			'http://aoshang-file.uuudoo.com/Public/img_icon/dianzanW.png',
			'http://aoshang-file.uuudoo.com/Public/img_icon/dianzanY.png'
		], 
		goodList:[],//视频列表
		hisMore: true//是否有更多数据 默认有
	},
	zk:function(e){
		var that=this;

			that.setData({
				zk: e.currentTarget.dataset.index,
			})

	},
	// 首页视频跳转视频详情
	goVxiaongqing:function(e){
    wx.navigateTo({
			url: '../video_xiangqing/video_xiangqing?goods_id='+e.currentTarget.dataset.goods_id,
		})
	},
	//下拉刷新,要将商品列表，页码都改为初始值，否则会出现刷新之后商品的错乱
	onPullDownRefresh: function () {
	},
	// 收藏
	shouchang:function(e){
		var that = this;
		var goods_id = e.currentTarget.dataset.goods_id;
		var collections_status = e.currentTarget.dataset.collections_status;
		if (collections_status==0){
			var collections_status = 1
		}else{
			var collections_status=0
		} 
		// console.log(goods_id, collections_status, wx.getStorageSync('m_id'))
		if (wx.getStorageSync('nickname') !== ''){
			wx.request({
				url: getApp().heads + 'Center/doCollection',
				data: {
					goods_id: goods_id,
					m_id: wx.getStorageSync('m_id'),
					value: collections_status  //0
				},
				method: 'post',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				success: function (res) {
					if (collections_status == 1) {
						wx.showToast({
							title: '已收藏',
							duration: 2000
						})
					} else {
						wx.showToast({
							title: '已取消',
							duration: 2000
						})
					}
					// console.log(res)
					that.getSend();
				}
			})
		}else{
			wx.showToast({
				title: '请先登录',
			})
			setTimeout(function(){
				//跳登录
				wx.switchTab({
					url: '../wode/wode',
				})
			},2000)
			
		}
	},
	// 点赞
	dianzan: function (e) {
		var that = this;
		var goods_id = e.currentTarget.dataset.goods_id;
		var agrees_status = e.currentTarget.dataset.agrees_status;
		if (agrees_status == 0) {
			var agrees_status = 1
		} else {
			var agrees_status = 0
		}
		// console.log(goods_id, agrees_status, wx.getStorageSync('m_id'))
		if (wx.getStorageSync('nickname') !== ''){
			wx.request({
				url: getApp().heads + 'Center/doAgree',
				data: {
					goods_id: goods_id,
					m_id: wx.getStorageSync('m_id'),
					value: agrees_status  //0
				},
				method: 'post',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				success: function (res) {
					if (agrees_status == 1) {
						wx.showToast({
							title: '已点赞',
							duration: 2000
						})
					} else {
						wx.showToast({
							title: '已取消',
							duration: 2000
						})
					}
					that.getSend();
				}
			})
		}else{
			wx.showToast({
				title: '请先登录',
			})
			setTimeout(function () {
				//跳登录
				wx.switchTab({
					url: '../wode/wode',
				})
			}, 2000)
		}
	},
	// 打开分享
	goshare:function(e){
		var that = this;
		if (wx.getStorageSync('nickname') !== ''){
			wx.hideTabBar({ animation: true })
			
			var ev = e;
			wx.request({
				url: getApp().heads + 'Center/doShare',
				data: {
					goods_id: ev.currentTarget.dataset.goods_id,
					m_id: wx.getStorageSync('m_id'),
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				method: 'post',
				success: function (e) {
					// console.log(e);
					that.setData({
						fx: 1,
						goodid: ev.currentTarget.dataset.goods_id
					})

					if (that.data.disp == 'none') {
						that.setData({
							disp: 'flex',
						})
					} else {
						that.setData({
							disp: 'none',
						})
					}

				}
			})
		}else{
			// 显示tabbar
			// wx.showTabBar({ animation: true })

			wx.showToast({
				title: '请先登录！'
			})
			setTimeout(function () {
				wx.switchTab({
					url: '../wode/wode',
				})
			}, 2000)
		}

		that.setData({
			this_cover: e.currentTarget.dataset.cover,
			this_goods_name: e.currentTarget.dataset.goods_name
		})
		// console.log(e.currentTarget.dataset)
		
	},
	// 关闭分享
	GBshare: function () {
		wx.showTabBar({ animation: true})
		var that = this;
		if (that.data.disp == 'none') {
			that.setData({
				disp: 'flex',
				fx: 1
			})
		} else {
			that.setData({
				disp: 'none',
				fx: 0
			})
		}
	},
	//分享海报
	shearHB:function(e){
     var that=this;
			 wx.request({
				 url: getApp().heads + 'Center/sharePoster',
				 data: {
					 goods_id: that.data.goodid,
					 m_id: wx.getStorageSync('m_id'),
				 },
				 header: {
					 'content-type': 'application/x-www-form-urlencoded'
				 },
				 method: 'post',
				 success: function (e) {
					 console.log(e);
					 wx.previewImage({
						 current: e.data.data.url,//当前的这张图
						 urls: [e.data.data.url], //图片数组
					 })

					 if (that.data.disp == 'none') {
						 that.setData({
							 disp: 'flex',
							 fx: 1
						 })
					 } else {
						 that.setData({
							 disp: 'none',
							 fx: 0
						 })
					 }
				 }
			 })
		 
	},
	onShow:function(){
		wx.showTabBar({ animation: true })
	},
	onLoad: function () {
		var that = this;
		var xx = that.data.xx
		for (var i = 0; i < 10; i++) {
			xx.push('');
		}
		that.setData({
			xx: xx
		})
		that.getSend();
		that.getshikanTime();//获取试看时长

		var query = wx.createSelectorQuery();
		query.select('.m_banner').boundingClientRect()
		query.exec(function(res){
			console.log(res)
		});
		
	},
	

	getshikanTime:function(){
		var that=this;
		wx.request({
			url: getApp().heads + 'System/getTryTimes',
			data: {
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (e) {
				// console.log(e.data.data); cover goods_name
        that.setData({
					shikanTime: e.data.data.s
				})
				wx.setStorage({
					key: "shikanTime",
					data: e.data.data.s
				})
			}
		})
	},
	gosearch:function(){
		wx.navigateTo({
			url: '../search/search',
		})
	},
	getSend:function(){
		var that=this;
		wx.request({
			url: getApp().heads +'Video/isBest',
			data: {
				p: that.data.p,
				m_id: wx.getStorageSync('m_id')
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (e) {
				console.log(e.data.data);
				that.setData({
					init:e.data.data,
					goodList: e.data.data.video
				})
			}
		})
	},
	onPullDownRefresh:function(){
		wx.showNavigationBarLoading();
		// 隐藏导航栏加载框
		this.getSend();
		setTimeout(function(){
			// 隐藏导航栏加载框
			wx.hideNavigationBarLoading();
			// 停止下拉动作
			wx.stopPullDownRefresh();
		},1000)
	},
	// 触底分页
	onReachBottom: function () {
		var that = this;
		
		// that.setData({
		// 	p: that.data.p + 1
		// })
		// console.log(that.data.p+"length"+that.data.goodList.length)
		
		wx.request({
			url: getApp().heads + 'Video/isBest',
			header: {
				'content-type': 'application/x-www-form-urlencoded' // 默认值
			},
			data: {
				p: that.data.p+1,
				m_id: wx.getStorageSync('m_id')
			},
			method: 'post',
			success: function (e) {
				console.log(e)
				
				var Oldsong = that.data.goodList;//初始数组
				var Newsong = e.data.data.video;//新数组
				if (Newsong.length !== 0) {
					that.setData({
						goodList: Oldsong.concat(Newsong),
						p: that.data.p + 1,
						hisMore: true //有更多数据
						
					})
					// console.log(that.data.p + "length" + that.data.goodList.length)
				} else {
					that.setData({
						hisMore: false //无更多数据
					})
					wx.showToast({
						title: '暂无更多数据！'
					})
				}
			}
		})
	},
	     /**
       * 规则跳转
       */
	tiaozhuanguize: function (e) {
		var that = this
		var target_rule = e.currentTarget.dataset.target_rule
		var param = e.currentTarget.dataset.param
		var title = e.currentTarget.dataset.title
		console.log(target_rule + param)
		switch (target_rule) {
			case '1':
				// 跳网址
				wx.navigateTo({
					url: '../wangye/wangye?param=' + param,
					
				})
				break;
					// 跳专题列表（不支持带参数这个跳转）
			case '2':
				wx.reLaunch({
					url: '../zhuanti/zhuanti?goods_cate_id=' + param,
				})
				break;
			case '3':
			// 跳视频详情（视频id）
				console.log(3)
				wx.navigateTo({
					url: '../video_xiangqing/video_xiangqing?goods_id='+ param,
				})
				break;
		}
	},
	onReady: function (res) {
		this.videoContext = wx.createVideoContext('myVideo')
	},
  // 播放状态监听
	cateVideo: function (e) {
		var that = this;
		console.log(e)
		var videoContextPrev = wx.createVideoContext(e.target.id)
		timer = setTimeout(function () {
			console.log(e.detail.currentTime);//监听正在播放的视频时长
			var snum = e.detail.currentTime;
			if (snum > that.data.shikanTime) {//如果大于试看时长
				videoContextPrev.pause()
				console.log("超时")
				clearTimeout(timer);
				var uplat = "xx[" + e.currentTarget.dataset.index + "]"
				that.setData({
					[uplat]: '1'
				})
			}
		}, 250)
	},
	// bofang: function (e) {
	// 	var that = this;
	// 	if (that.data.zindex !== e.currentTarget.dataset.index) {
	// 		var videoContextPreva = wx.createVideoContext('myVideo' + that.data.zindex);
	// 		videoContextPreva.pause()
	// 	}
	// 	var videoContextPrev = wx.createVideoContext('myVideo' + e.currentTarget.dataset.index)
	// 	videoContextPrev.play()
	// 	// var uplat = "xx[" + e.currentTarget.dataset.index + "]"
	// 	that.setData({
	// 		hot: e.currentTarget.dataset.index,
	// 		zindex: e.currentTarget.dataset.index//记录当前播放的id
	// 	})

	// }

})
