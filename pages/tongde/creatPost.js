// pages/tongde/creatPost.js
import {request} from "../../request/request.js";
const FormData = require('../../lib/wx-formdata-master/formData.js'); //实现文件上传
function mergePathThenUploadImage(imagePath) {
  /* 上传图片的请求封装
  根据图片的本地路径获取的二进制数据,打包为formData形式,之后上传多张图片
  参数：imagePath: 传入图片路径,数组
  返回：promise对象
  */
  var imageData = new FormData();
  for (let i in imagePath) {
    imageData.appendFile("files",imagePath[i])
  }
  var data = imageData.getData();
  var promise = request({
    url : '/team/jirenUploadPhotos',
    method: 'POST',
    header: {
      'content-type': data.contentType,
      'cookie':wx.getStorageSync("token")
    },
    data : data.buffer
  });
  return promise;
};
function createPostRequest(formValue) {
  /*  发布失物招领的请求封装
  参数：失物招领所需表单数据,对象{'key':'value'}
    data: {
      "allPicUrl": "https://oss.url/pic1.png,https://oss.url/pic2.jpg",
      "firstPicUrl": "https://oss.url/pic1.png",
      "contactType": 36,
      "contact": "783592285@qq.com",
      "content": "失物招领描述",
      "location": "测试地点",
      "name": "测试物品名称",
      "type": 0
      }
  返回： 发布失物招领的Promise对象 
  */
  var promise = request({
    url: '/lostfound/initializeLostFound', 
    header: {
      'content-type': 'application/json',
      'cookie':wx.getStorageSync("token")
    },
    method : 'POST',
    data: formValue
  });
  return promise;
};
function addLabelRequest(lostFoundId, labelId) {
  /* 给帖子添加标签的请求封装
  参数: lostFoundId-失物招领主键id  labelId-标签id
  返回: 添加标签请求的promise对象
  */
  var promise = request({
    url: '/lostfound/editMyLostFoundLabel/' + lostFoundId,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      "id": labelId,
    }
  });
  return promise;
};
function initContactTypes() {
  // 初始化联系方式种类，QQ，微信，手机号，从数据库获取数据，修改页面数据
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 所有类型标签列表
    labelList: [
      {
        "id": 26,
        "createTime": "2021-08-20 00:13:57",
        "updateTime": "2021-08-20 00:13:57",
        "content": "水杯",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 27,
        "createTime": "2021-08-20 00:16:04",
        "updateTime": "2021-08-20 00:16:04",
        "content": "雨伞",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 28,
        "createTime": "2021-08-20 00:16:04",
        "updateTime": "2021-08-20 00:16:04",
        "content": "证件",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 29,
        "createTime": "2021-08-20 00:16:05",
        "updateTime": "2021-08-20 00:16:05",
        "content": "耳机",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 30,
        "createTime": "2021-08-20 00:16:05",
        "updateTime": "2021-08-20 00:16:05",
        "content": "钥匙",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 31,
        "createTime": "2021-08-20 00:16:05",
        "updateTime": "2021-08-20 00:16:05",
        "content": "钱包",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 32,
        "createTime": "2021-08-20 00:16:05",
        "updateTime": "2021-08-20 00:16:05",
        "content": "数码",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 33,
        "createTime": "2021-08-20 00:16:05",
        "updateTime": "2021-08-20 00:16:05",
        "content": "衣服",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 34,
        "createTime": "2021-08-20 00:16:05",
        "updateTime": "2021-08-20 00:16:05",
        "content": "眼镜",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 35,
        "createTime": "2021-08-20 00:16:05",
        "updateTime": "2021-08-20 00:16:05",
        "content": "文具",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 36,
        "createTime": "2021-08-20 00:16:05",
        "updateTime": "2021-08-20 00:16:05",
        "content": "书籍",
        "type": "tongde",
        "deleted": false,
        "selected": null
      },
      {
        "id": 37,
        "createTime": "2021-08-20 00:16:05",
        "updateTime": "2021-08-20 00:16:05",
        "content": "其他",
        "type": "tongde",
        "deleted": false,
        "selected": null
      }
    ],
    // 选中标签列表
    selectedLabelList: [],
    connactTypes:['QQ','微信','手机','邮箱','其他'].map(item=>{
      return {content:item}
    }),
    connactType:{content:'QQ'},
    height:'auto',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    this.changeScrollHeight();
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

  submitForm: function(e) {
    let formValue = e.detail.value; // 用户填写的表单数据

    // 上传本地图片,拿到oss图片url
    let imagePromise= mergePathThenUploadImage(formValue.allPicPaths);
    wx.showLoading({
      title: '图片上传中',
      mask: true
    });
    imagePromise.then(res => { //上传图片成功的回调
      wx.hideLoading(); //图片上传成功后隐藏加载框z
      if(res.statusCode >=200 && res.statusCode <=300) {
        // 拿到上传后的图片ossURL
        let imageURL = res.data.data;
        // 分割字符串获得头图，如果firstImgURL包含多个http链接，济人首页图片无法正常加载
        let firstImgURL = imageURL.split(',',1)[0];
        console.log("图片路径",imageURL, firstImgURL);
        // 添加至payload，同时修改对象的属性名以对接接口命名
        formValue.allPicUrl = imageURL;
        formValue.firstPicUrl = firstImgURL;
        return createPostRequest(formValue);
      }
    }).then(res => {
      let data = res.data.data;
      // let lostFoundId = data.id; // 获取失物招领主键id, 之后添加标签
      console.log("发布失物招领响应数据", data);
      return addLabelRequest(lostFoundId, labelId)
    }).then(res => {
      let data = res.data.data;
      console.log("添加标签的响应数据", data);
    });
    console.log("form的数据", formValue);
  },
  clickToChooseTag:function(){
    let selector = this.selectComponent('#dialog-label-selector');
    selector.openClose(); //不用全局变量,即可弹出关闭dailog筛选标签
    selector.setLabelsSelected();
  },
  labelChanged: function(e) {
    console.log(e);
    let selectedLabelList = e.detail;
    this.setData({selectedLabelList})
  },
/*   clickTag:function(e){
    console.log(e)
    let tagList=this.data.tagList;
    tagList[e.currentTarget.dataset.index].choosen=!tagList[e.currentTarget.dataset.index].choosen;
    this.setData({tagList})
  },
  clickYesOfTagBox:function(){
    let list=[];
    let tagList=this.data.tagList;
    for(let key in tagList){
      if( tagList[key].choosen){
        list.push(tagList[key].name)
      }
    };
    this.setData({
      tagChoosenList:list,
      tagboxShow:false
    })
  },
  clickNoOfTagBox:function(){
    this.setData({tagboxShow:false})
  }, */
  changeScrollHeight:function(){
    let windowHeight;
    //设置scroll-view高度
    wx.getSystemInfo({
      success: function (res) {
          windowHeight= res.windowHeight;
          console.log("windows",windowHeight);
      }
    });
    let query = wx.createSelectorQuery();
    query.select('#scroll').boundingClientRect(rect=>{
      console.log(rect)
        let top = rect.top;
        console.log(top);
        let height=windowHeight-top;
        this.setData({
          height:height+'px',
        });
      }).exec();
      
  },
})