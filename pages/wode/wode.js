// pages/wode/wode.js
Page({
	data: {
		disp:'none',
		kfnumber:'',//客服号码
		userImg:[],//用户头像
		head:'../image/userm.png',//用户头像 this
		username: '',//用户name this
		is_loginshow:true,
		isviparr:[]  //用户vip信息
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	// 进vio购买页面
	goVIp:function(e){
		// console.log(e)
    if (e.currentTarget.dataset.tip) {//我的会员  ==0
      wx.setStorage({//设置标识辨别是从视频点击开通过去的
        key: "sdn",
        data: 0,
      })
    }
		wx.navigateTo({
			url: '../vip_xufei/vip_xufei?tip=' + e.currentTarget.dataset.tip,
		})
	},
	// 去我的收藏
	goSC:function(){
		if (wx.getStorageSync('nickname') !== '') {
			wx.navigateTo({
				url: '../wodeSC/wodeSC',
			})
		}else{
			wx.showToast({
				title: '请先登录',
			})
		}
		
	},
	// 去我的观看记录
	goGK: function () {
		if (wx.getStorageSync('nickname') !== '') {
			wx.navigateTo({
				url: '../wodeGK/wodeGK',
			})
		} else {
			wx.showToast({
				title: '请先登录',
			})
		}
	},
  // 登录
	goLogin:function(){
		var that=this;
		wx.login({
			success: res => {
				// console.log(res.code)
				if (res.code) {
					wx.request({
						url: getApp().heads + 'Passport/login',
						data: {
							code: res.code,
							type: 1
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						method: 'post',
						success: function (e) {
							// console.log(e);
              wx.getUserInfo({
								success:function(e){
									var ouser = e;//用户信息
									console.log(e.userInfo.avatarUrl)
									//先下载图片
									var temp=''//临时图片地址
									wx.downloadFile({
										url: e.userInfo.avatarUrl, // 仅为示例，并非真实的资源
										success(res) {
											console.log(res.tempFilePath)
											temp = res.tempFilePath

											// 上传图片
											wx.uploadFile({
												url: getApp().heads + 'System/uploadPicture',
												filePath: temp,
												name: 'userImg',
												success: function (e) {
													that.setData({
														userImg: JSON.parse(e.data).data.list[0]
													})

													
													//得到用户信息后在请求登录					
													wx.login({
														success: function (en) {
															console.log(ouser)
															console.log(en.code) //新的code
															wx.request({
																url: getApp().heads + 'Passport/login',
																data: {
																	code: en.code,
																	type: 2,
																	nickname: ouser.userInfo.nickName,
																	head: that.data.userImg.id
																},
																header: {
																	'content-type': 'application/x-www-form-urlencoded'
																},
																method: 'post',
																success: function (e) {
																	// console.log(e.data.data);
																	that.setData({
																		is_loginshow: false,
																		head: e.data.data.head,  //头像
																		username: e.data.data.nickname  //头像
																	})
																	wx.setStorage({
																		key: "m_id",
																		data: e.data.data.m_id,
																	})
																	wx.setStorage({
																		key: "head",
																		data: e.data.data.head,
																	})
																	wx.setStorage({
																		key: "nickname",
																		data: e.data.data.nickname,
																	})
																	// 设置登录为true
																	wx.setStorage({
																		key: "hasLogin",
																		data: 1,
																	})

																	that.p_isvip();
																}
															})
														}
													})

												}
											})
										},
									})
									
								}
							})
							
						}
					})
				}
			}
		})

	},
	// 调用户是否是vip
	p_isvip:function(){
		var that=this;
		wx.request({
			url: getApp().heads + 'Center/getInfo',
			data: {
				m_id: wx.getStorageSync('m_id')
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (e) {
				console.log(e.data.data);
				that.setData({
					isviparr: e.data.data,
					head: e.data.data.head,  //头像
					username: e.data.data.nickname,  //头像
					is_loginshow: false
				})
				wx.setStorage({
					key: "is_vip",
					data: e.data.data.is_vip
				})
			}
		})
	},
	onLoad: function (options) {
		this.getConfig();
		if (options.fh || wx.getStorageSync('nickname') !== ''){
			this.p_isvip();
		}
	},
	// 上传头像
	setuserimg(e){
		var that=this;
    
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				// tempFilePath可以作为img标签的src属性显示图片
				const tempFilePaths = res.tempFilePaths
				wx.uploadFile({
          url: getApp().heads + 'System/uploadPicture',
					filePath: tempFilePaths[0],
					name: 'userImg',
          formData:{
            pictures: tempFilePaths[0]
          },
					success:function(e){
            var oadd = JSON.parse(e.data)
            console.log(oadd)
            console.log(oadd.data.list[0])  //abs_url
            wx.uploadFile({
              url: getApp().heads + 'Center/modifyInfo',
              filePath: tempFilePaths[0],
              name: 'userImg',
              formData: {
                m_id:wx.getStorageSync("m_id"),
                field:'head',
                value: oadd.data.list[0].id
              },
              success: function (e) {
                console.log(e)
                var n_dd=JSON.parse(e.data)
                console.log(n_dd.message)
                wx.showToast({
                  title: n_dd.message,
                  duration:1500
                })
                that.setData({
                  head: oadd.data.list[0].abs_url
                })
                // that.onLoad();
              }
            })

					}
				})
			}
		})
	},
	// 获取客服号码
	getConfig:function(){
		var that=this;
		wx.request({
			url: getApp().heads + 'System/getConfig',
			data: {
				identifier:4
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (e) {
				// console.log(e.data.data.a4);
				that.setData({
					kfnumber:e.data.data.a4
				})
			}
		})
	},
	openlainxi:function(){
    var that=this;
		// that.setData({
		// 	disp:'flex'
		// })
		wx.makePhoneCall({
			phoneNumber: that.data.kfnumber,
		})
	},
	delelainxi: function () {
		var that = this;
		that.setData({
			disp: 'none'
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