//index.js
//获取应用实例
const app = getApp()
var videoContext = wx.createVideoContext;
var timer;
Page({ 
	data: {
		Vsrc: '', //当前视频地址
		hot:false,
		disp: 'none',
		openshow:true,
    isQP: false,//是否全屏
		vSrcnote:false, //判断视频是否存在
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
  jinquanping: function (e) {
    // console.log(e.detail.fullScreen)是否全屏
    this.setData({
      isQP: e.detail.fullScreen
    })
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
					current: e.data.data.url,//当前的这张图
					urls: [e.data.data.url], //图片数组
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
              title: 'ཉར་ཟིན།',
							duration: 2000
						})
					} else {
						wx.showToast({
              title: 'དོར་ཟིན།',
							duration: 2000
						})
					}
					// console.log(res)
					that.goSend();
				}
			})
		}else{
			//跳登录
			wx.showToast({
				title: '请先登录！'
			})
			setTimeout(function () {
				wx.switchTab({
					url: '../wode/wode',
				})
			}, 1000)
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
		if (wx.getStorageSync('nickname') !== ''){//如果用户未登录则不能操作分享收藏
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
              title: ' བསྟོད།',
							duration: 2000
						})
					} else {
						wx.showToast({
              title: 'དོར་ཟིན།',
							duration: 2000
						})
					}
					that.goSend();
				}
			})
		}else{
			//跳登录
			wx.showToast({
        title: 'ཐོ་འགོད་རོགས། ！'
			})
			setTimeout(function () {
				wx.switchTab({
					url: '../wode/wode',
				})
			}, 1000)
		}
	},
	// 打开分享
	goshare: function (e) {
		// wx.hideTabBar({})
		var that = this;
		var ev = e.currentTarget.dataset.goods_id
		if (wx.getStorageSync('nickname') !== ''){
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
				console.log(e);
				var osrc = e.data.data.file_url;
				// var ossfile = osrc.replace(/amp;/g, '')
				// var ossfile = osrc.split('&')[0] + osrc.split(';')[1]
				// console.log(ossfile)
				console.log(e.data.data)
				that.setData({
					Videolist: e.data.data,
          Vsrc:osrc,  //ossfile, //转化后的当前视频连接
					isvip: e.data.data.views_status, //播放状态 0-限制播放 1-无限播放
					// this_cover: e.data.data.poster,  //当前食品图片
					// this_goods_name: e.data.data.goods_name, //当前视频名字
					xiangguanvideoList: e.data.data.video
				})
				wx.setNavigationBarTitle({
					title: e.data.data.goods_name
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
    wx.setStorage({//设置标识辨别是从视频点击开通过去的
      key: "sdn",
      data: 1,
    })
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
		// 登录了
    if (wx.getStorageSync('nickname') !== ''){
      wx.navigateTo({
        url: '../vip_xufei/vip_xufei',
      })
    }else{//未登录
      wx.switchTab({
        url: '../wode/wode',
      })
    }
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
			var isvip=that.data.isvip; //视频是否会员身份
			var userisvip = wx.getStorageSync('is_vip');//用户是否是vip 0 1
			console.log(isvip, userisvip)
      if (isvip == 0 && wx.getStorageSync('is_vip') == 0) {//视频是会员则计时 播放状态 0-限制播放 1-无限播放
				// if (wx.getStorageSync('is_vip')==0){//用户不是会员
        // that.data.Videolist.times.s
        if (snum > wx.getStorageSync('shikanTime')) {// wx.getStorageSync('shikanTime')
						videoContextPrev.pause()
						console.log("超时")
						clearTimeout(timer);
						that.setData({
							openshow: false
						})
            if (that.data.isQP) {
              // var videoContextPrev = wx.createVideoContext('myVideo' + that.data.hot)
              videoContextPrev.exitFullScreen()
              // that.setData({
              //   // coverQP:1//显示出遮罩层
              //   V_direction:0
              // })
            }
					}
				// } else {
				// 	console.log('用户是会员')
				// }
			}else{
				//
				console.log('无限播放')
			}
		}, 250)
	},
	bofang: function (e) {
		var that = this;
		var videoContextPrev = wx.createVideoContext('myVideo')
		if (that.data.Vsrc == ''){
       that.setData({
				 vSrcnote:true,
				 hot: true
			 })
		}else{
			videoContextPrev.play()
			that.setData({
				hot: true
			})
		}
	},
	onShow:function(){
		var that=this;
		// if (that.data.Vsrc==''){
		// 	  var pages = getCurrentPages();
    //     var prevPage = pages[pages.length - 2]; //上一个页面
    //     wx.showToast({
		// 			title: '该视频不存在',
		// 			success:function(){
		// 				setTimeout(function(){
		// 					prevPage.onLoad()
		// 					wx.navigateBack({
		// 					})
		// 				},2000)
		// 			}
		// 		})
		// }else{

		// }
	}

})
