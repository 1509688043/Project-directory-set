// pages/fenye/fenye.js
Page({

  data: {
    p:1,//分页 默认1
    arrSong:[], //数据
    nume:'双节棍',
    hisMore:true//是否有更多数据 默认有
  },

  onLoad: function (options) {
     this.goSeng()
  },
  goSeng:function(){
    var that=this;
    wx.request({
      url: 'https://api.bzqll.com/music/tencent/search?key=579621905&s='+that.data.nume+'&limit=20&type=song',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data:{
        offset:that.data.p  //分页
      },
      method: 'get',
      success: function (e) {
        console.log(e.data.data)
        that.setData({
          arrSong: e.data.data,
          p:that.data.p+1
        })
      }
    })
  },
  // 触底分页
  onReachBottom:function(){
     
    var that = this;
    console.log(that.data.p)
    wx.request({
      url: 'https://api.bzqll.com/music/tencent/search?key=579621905&s=' + that.data.nume + '&limit=20&type=song',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        offset: that.data.p  //分页
      },
      method: 'get',
      success: function (e) {
        console.log(e.data.data)    
        var Oldsong = that.data.arrSong;//初始数组
        var Newsong = e.data.data;//新数组
        if (Newsong.length!==0){
          // var KD = [];
          // if (Newsong.length < Oldsong.length) {
          //   that.setData({
          //     arrSong: Oldsong.concat(Newsong),
          //     hisMore: false //无更多数据
          //   })
          // } else {
          //   that.setData({
          //     arrSong: Oldsong.concat(Newsong),
          //     p: that.data.p + 1,
          //     hisMore: true //有更多数据
          //   })
          // }
          that.setData({
            arrSong: Oldsong.concat(Newsong),
            p: that.data.p + 1,
            hisMore: true //有更多数据
          })
        }else{
          that.setData({
            hisMore: false //无更多数据
          })
          wx.showToast({
            title: '暂无更多数据！'
          })
        }

        // that.setData({
        //   arrSong: e.data.data
        // })
      }
    })
  }

})