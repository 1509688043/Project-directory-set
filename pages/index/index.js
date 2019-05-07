// var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
var videoContext = wx.createVideoContext;
var timer;
Page({
	data: {
		src: 'https://flv2.bn.netease.com/videolib3/1803/28/RkuxC2558/SD/RkuxC2558-mobile.mp4',
    v_src:'',//当前视频地址
		xx: [],
		hot: '-1',
		zindex: '',
		disp:'none',
		init:[],
    views_status:'',
    now_spidx:'',//记录播放时间备用ios
    systemInfo:'',//系统设备
		zk:-1,
    // V_direction:90,//视频旋转0 90
    isvip:'',//当前视频是否是会员视频
    isQP:false,//是否全屏
    coverQP:0,//遮罩层
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
              title: 'ཉར་ཟིན།',
              // icon: 'none',
							duration: 2000
						})
					} else {
						wx.showToast({
              title: 'དོར་ཟིན།',
              icon: 'none',
							duration: 2000
						})
					}
					// console.log(res)
					that.getSend();
				}
			})
		}else{
			wx.showToast({
        icon: 'none',
        title: 'ཐོ་འགོད་རོགས།',
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
              title: 'བསྟོད།',
              // icon: 'none',   
							duration: 2000
						})
					} else {
						wx.showToast({
              title: 'དོར་ཟིན།',
              icon: 'none',
							duration: 2000
						})
					}
					that.getSend();
				}
			})
		}else{
			wx.showToast({
        icon: 'none',
        title: 'ཐོ་འགོད་རོགས།',
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
        icon: 'none',
        title: 'ཐོ་འགོད་རོགས།！'
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
  onLoad: function (options) {
    console.log(options)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res.platform,// devtools ios android
        })
      }
    })
    // var number="18725779988"
    // var mphone = number.substring(0, 3) + '****' + number.substring(7);
    // console.log(mphone)
    var scene = decodeURIComponent(options.scene);  //扫描二维码进来的参数
    // console.log(scene)
		
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

    // wx.loadFontFace({
    //   family: 'Bitstream',
    //   source: 'url("http://aoshang-file.uuudoo.com/Uploads/fonts/qomolangma-uchensarchen.ttf")',
    //   success(res) {
    //     console.log(res.status)
    //   },
    //   fail: function (res) {
    //     console.log(res.status)
    //   },
    // });
		
	},
  kaitongvip: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.goods_id)
    // 设置当前的视频id给缓存
    wx.setStorage({
      key: "Now_goods_id",
      data: e.currentTarget.dataset.goods_id,
    })
    wx.setStorage({//设置标识辨别是从视频点击开通过去的
      key: "sdn",
      data: 1,
    })
    console.log(wx.getStorageSync('m_id'))
    // 登录了
    if (wx.getStorageSync('nickname') !== '') {
      wx.navigateTo({
        url: '../vip_xufei/vip_xufei',
      })
    } else {//未登录
      wx.switchTab({
        url: '../wode/wode',
      })
    }
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
          var xx = that.data.xx
          for (var i = 0; i < that.data.goodList.length; i++) {
            xx.push('');
          }
          that.setData({
            xx: xx
          })
					// console.log(that.data.p + "length" + that.data.goodList.length)
				} else {
					that.setData({
						hisMore: false //无更多数据
					})
					wx.showToast({
            icon:'none',
            title: 'རྙེད་མ་སོང་།！'
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

  cateVideo: function (e) {
    var that = this;
    // that.setData({
    //   now_spidx: e.detail.currentTime  //记录播放时间备用ios
    // })
    // if (that.data.systemInfo =='android'){//安卓
      // console.log('安卓')
      var videoContextPrev = wx.createVideoContext(e.target.id)
      var timer = setTimeout(function () {
        console.log(e.detail.currentTime);//监听正在播放的视频时长
        var snum = e.detail.currentTime;
        var isvip = that.data.isvip; //视频是否会员身份
        var userisvip = wx.getStorageSync('is_vip');//用户是否是vip 0 1
        console.log(isvip, userisvip)
        // if (isvip == 1 && wx.getStorageSync('is_vip') == 0) {//视频是会员则计时 播放状态 0-限制播放 1-无限播放
        if (that.data.views_status == 0) {
          // if (wx.getStorageSync('is_vip') == 0) {//用户不是会员 views_status
          if (snum > wx.getStorageSync('shikanTime')) {// wx.getStorageSync('shikanTime')
            videoContextPrev.pause()
            console.log("超时")
            clearTimeout(timer);
            var uplat = "xx[" + e.currentTarget.dataset.index + "]"
            that.setData({
              [uplat]: '1'
            })
            if(that.data.isQP){
              console.log("退全屏")
              // var videoContextPrev = wx.createVideoContext('myVideo' + that.data.hot)
              videoContextPrev.exitFullScreen()  //退出全屏
              // that.setData({
              //   coverQP:1//显示出遮罩层
              //   // V_direction:0
              // })
            }
            // else{
            //   that.setData({
            //     coverQP: 0//（竖屏状态下）不显示出横屏遮罩层
            //   })
            // }
          }
          // } else {
          //   console.log('用户是会员')
          // }
        } else {
          //
          console.log('无限播放用户是会员（或者视频免费）')
        }
      }, 250)
    // }
  },
  jinquanping:function(e){
    this.setData({
      isQP: e.detail.fullScreen//是否全屏
    })
  },
  //进度条变化监听(针对ios)
  // progressdd:function(e){
  //   var that=this;
  //   var oe=e;
  //   console.log(e.target.id)
  //   if (that.data.systemInfo == 'ios'){//苹果
  //     console.log('苹果')
  //     var videoContextPrev = wx.createVideoContext(oe.target.id);
  //     videoContextPrev.play();
  //     var timer = setTimeout(function () {
  //       console.log(that.data.now_spidx);//监听正在播放的视频时长（问题点！！！）
  //       var snum = that.data.now_spidx;
  //       var isvip = that.data.isvip; //视频是否会员身份
  //       var userisvip = wx.getStorageSync('is_vip');//用户是否是vip 0 1
  //       console.log(isvip, userisvip)
  //       if (isvip == 1 && wx.getStorageSync('is_vip') == 0) {
  //         if (snum > 10) {// wx.getStorageSync('shikanTime')
  //           console.log("进入限制")
  //           videoContextPrev.pause()
  //           clearTimeout(timer);
  //           var uplat = "xx[" + e.currentTarget.dataset.index + "]"
  //           that.setData({
  //             [uplat]: '1'
  //           })
  //         }
  //       } else {
  //         console.log('无限播放用户是会员（或者视频免费）')
  //       }
  //     }, 250)  
  //   }
    
  // },
	bofang: function (e) {
    console.log('myVideo' + e.currentTarget.dataset.index)
		var that = this;
		if (that.data.zindex !== e.currentTarget.dataset.index) {
			var videoContextPreva = wx.createVideoContext('myVideo' + that.data.zindex);
			videoContextPreva.pause();
		}
      var videoContextPreved = wx.createVideoContext('myVideo' + e.currentTarget.dataset.index)
       videoContextPreved.play();
       
		// var uplat = "xx[" + e.currentTarget.dataset.index + "]"
		that.setData({
      views_status: e.currentTarget.dataset.views_status,//播放状态视频  当前这个的 是否限制
      v_src: e.currentTarget.dataset.v_src,
      isvip: e.currentTarget.dataset.is_vip,
			hot: e.currentTarget.dataset.index,
			zindex: e.currentTarget.dataset.index//记录当前播放的id
		})
    //ios延时一秒调播放
    setTimeout(function(){
      videoContextPreved.play();
    },100)


	}

})
