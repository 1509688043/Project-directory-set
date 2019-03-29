//app.js
App({
	heads:'http://aoshang-api.uuudoo.com/',
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
				// console.log(res.code)
				if (res.code){
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
							wx.setStorage({
								key: "m_id",
								data: e.data.data.m_id,
							})
						}
					})
				}
      }
    })
  },
})