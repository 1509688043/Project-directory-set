//index.js
//获取应用实例
const app = getApp()
var videoContext = wx.createVideoContext;
var timer;
Page({ 
	data: {
		src: 'https://flv2.bn.netease.com/videolib3/1803/28/RkuxC2558/SD/RkuxC2558-mobile.mp4',
		hot:false,
		disp: 'none',
		openshow:true,
		isvip:0,//判断用户是否是会员 默认不是
		fx: '0', //判断屏幕固定
		nowgoods_id:'',//当前的视频id
		shikanTime:'',//试看时间
		this_cover: '',//当前分享视频封面图
		this_goods_name: '',//当前分享视频名字
		shouchangimg: [
			'http://aoshang-file.uuudoo.com/Public/img_icon/shouchangW.png',
			'http://aoshang-file.uuudoo.com/Public/img_icon/shouchangY.png'
		],
		dianzan: [
			'http://aoshang-file.uuudoo.com/Public/img_icon/dianzanW.png',
			'http://aoshang-file.uuudoo.com/Public/img_icon/dianzanY.png'
		],
		goods_id:'',//视频id
		Videolist:[],//视频信息
		xiangguanvideoList:[],//相关视频
	},
	//分享海报
	shearHB: function (e) {
		var that = this;
		wx.request({
			url: getApp().heads + 'Center/sharePoster',
			data: {
				goods_id: that.data.nowgoods_id,
				m_id: wx.getStorageSync('m_id'),
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (e) {
				console.log(e.data.data);
				wx.previewImage({
					current: e.data.data,//当前的这张图
					urls: [e.data.data], //图片数组
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

	},
	// 收藏
	shouchang: function (e) {
		var that = this;
		var goods_id = e.currentTarget.dataset.goods_id;
		var collections_status = e.currentTarget.dataset.collections_status;
		if (collections_status == 0) {
			var collections_status = 1
		} else {
			var collections_status = 0
		}
		// console.log(goods_id, collections_status, wx.getStorageSync('m_id'))
		if (wx.getStorageSync('m_id') !== ''){
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
					that.goSend();
				}
			})
		}else{
			//跳登录
			wx.switchTab({
				url: '../wode/wode',
			})
			wx.showTabBar({
				title: '请先登录',
			})
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
		if (wx.getStorageSync('m_id')!==''){//如果用户未登录则不能操作分享收藏
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
					that.goSend();
				}
			})
		}else{
			//跳登录
			wx.switchTab({
				url: '../wode/wode',
			})
       wx.showTabBar({
				 title: '请先登录',
			 })
		}
	},
	// 打开分享
	goshare: function (e) {
		// wx.hideTabBar({})
		var that = this;
		var ev = e.currentTarget.dataset.goods_id
		wx.request({
			url: getApp().heads + 'Center/doShare',
			data: {
				goods_id: e.currentTarget.dataset.goods_id,
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
					nowgoods_id: ev
				})
			}
		})

		that.setData({
			this_cover: e.currentTarget.dataset.cover,
			this_goods_name: e.currentTarget.dataset.goods_name
		})
		// console.log(e.currentTarget.dataset)
		if (that.data.disp == 'none') {
			that.setData({
				disp: 'flex',
			})
		} else {
			that.setData({
				disp: 'none',
			})
		}
	},
	// 关闭分享
	GBshare: function () {
		// wx.showTabBar({})
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
	// 相关视频点击跳
	goVxiangqing:function(e){
			wx.navigateTo({
				url: '../video_xiangqing/video_xiangqing?goods_id=' + e.currentTarget.dataset.goods_id,
			})
	},
	goSend:function(){
		var that=this;
		wx.request({
			url: getApp().heads + 'Video/detail',
			data: {
				goods_id: that.data.goods_id,
				m_id: wx.getStorageSync('m_id')
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (e) {
				console.log(e.data.data);
				that.setData({
					Videolist: e.data.data,
					isvip: e.data.data.views_status, //1是会员  0不是 
					// this_cover: e.data.data.poster,  //当前食品图片
					// this_goods_name: e.data.data.goods_name, //当前视频名字
					xiangguanvideoList: e.data.data.video
				})
			}
		})
	},
	onLoad: function (e) {
		var that = this;

		// options 中的scene需要使用decodeURIComponent才能获取到生成二维码时传入的scene
		// var scene = decodeURIComponent(e.scene)//参数二维码传递过来的参数
		// var query = e.query.dentistId // 参数二维码传递过来的场景参数
		// console.log(scene+'---'+query)

		console.log(e)
		that.setData({
			goods_id:e.goods_id,
			shikanTime:wx.getStorageSync('shikanTime')
		})
		// 设置当前的视频id给缓存
		wx.setStorage({
			key: "Now_goods_id",
			data: e.goods_id,
		})
		that.goSend();
	},
	// 试看结束后点击购买开通vip
	kaitongvip:function(){
		var that=this;
		console.log(wx.getStorageSync('m_id'))
		// if (wx.getStorageSync('m_id')!=='') {//用户登录了
		// 	wx.navigateTo({
		// 		url: '../vip_xufei/vip_xufei',
		// 	})
		// }else{//用户没登录
		// 	wx.navigateTo({
		// 		url: '../wode/wode',
		// 	})
		// }
		wx.switchTab({
			url: '../wode/wode',
		})
	},
	onReady: function (res) {
		this.videoContext = wx.createVideoContext('myVideo')
	},

	cateVideo: function (e) {
		var that = this;
		console.log(e)
		var videoContextPrev = wx.createVideoContext(e.target.id)
		timer = setTimeout(function () {
			console.log(e.detail.currentTime);//监听正在播放的视频时长
			var snum = e.detail.currentTime;
			var isvip=that.data.isvip; //用户是否会员身份
			if (isvip == 0) {//用户不是会员则计时
				if (snum > wx.getStorageSync('shikanTime')) {
					videoContextPrev.pause()
					console.log("超时")
					clearTimeout(timer);
					that.setData({
						openshow: false
					})
				}
			}else{
				//用户是会员
			}
		}, 250)
	},
	bofang: function (e) {
		var that = this;
		var videoContextPrev = wx.createVideoContext('myVideo')
		videoContextPrev.play()
    that.setData({
			hot:true
		})
	}

})
