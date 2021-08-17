// pages/jiren/groupDetail.js
const { formatTime } = require('../../utils/util.js');
var util = require('../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    
    amITeamInitiator:true,
    title:'破壁者首次文艺汇演来啦！！破壁者首次文艺汇演来啦！！破壁者首次文艺汇演来啦！！',
    dialog:{
      isDialogShow: false,
      content:"爬爬爬爬爬爬爬爬啊啊啊啊啊啊啊啊啊啊啊",
      hasInputBox:true,
      tip:"提示：爬",
      cancelText:"取消",
      okText:"确认",
      tapOkEvent:"",
    },
    dialog2:{
      isDialogShow:false,
      title:"title",
      content:"随便写一点",
      pictures:[],
      botton:"返回"
    },
    teamDetail:{

    },
    isFavourite:false,
    avatarList:[],
    currentUser:[],
    applierList:[
      
    ],
    haveJoinedIn:false,
    haveSignedUp:false,
    timeIsOver:false,
    memberFull:false,
    maxHeight:"auto",
    result:"",
    // reply:"随便写点啥\n看看边界在哪\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n",
    reply:'',
    haveQuestions:true,
    beClosedInAdvance:false,
    beRefused:false,

    dialogForBeingAccrept:false,
    dialogForBeingCloseInAdvance:false,
    tipBox:{
      show:false,
      text:"随便写点什么"
    },
  
    initiatorScrollHeight:'auto',
    targetId:null,
    personalInfoList:{},
    // over:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log(options)
    if(!options.teamId){
      this.setData({teamId:119})
    }else{
      console.log('updateTeamId');
      this.setData({teamId:options.teamId})
    }
    var that=this;
    
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight:res.windowHeight
        })
      }
    });
    // this.initializeResult();

    this.changeTeamDetail();

    // this.changeScrollHeight();

    
    this.changeInitiatorList();

    // console.log(this.data.timeIsOver);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  changeAvatarList:function(){
    let that=this;
    wx.request({
      url: app.globalData.url+'/userTeam/getAllMemberInfoByTeamId/'+that.data.teamId,
      header:{'cookie':wx.getStorageSync('token')},
      success:function(res){
        if(res.statusCode==200){
          console.log(res);
          let list=[];
          let data=res.data.data;
          let personalInfoList=that.data.personalInfoList;
          console.log(data);
          for(let i=0;i<data.length;i++){
            let info={
              'initiator':data[i].initiator,
              'me':data[i].me,
              'avatar':data[i].avatarUrl,
              'id':data[i].id,
              'nickname':data[i].nickName

            }
            list.push(info);
            if(that.data.amITeamInitiator){
              if(i>0&&data[i].answer){
                let answerList=[];
                let answer=JSON.parse(data[i].answer)
                for(let key in answer){
                  answerList.push(answre[key]);
                };
                personalInfoList[data[i].id].answer=answerList;
                personalInfoList[data[i].id].isCheckAnswerButtonShow=true;
                personalInfoList[data[i].id].wxIdPublic=true;
              }
            }
          }
          for(let i=0;i<that.data.teamDetail.due_member-data.length+1;i++){
            list.push({});
          }
          that.setData({
            avatarList:list,
            personalInfoList,
          });
          console.log(that.data.avatarList)
        }
      }
    })

  },

  getContent:function(item){
    return item.content
  },
  getPersonalInfo:function(id){
    if(this.data.personalInfoList[id]){
      return this.data.personalInfoList[id]
    }else{
      let that=this;
      wx.request({
        url: app.globalData.url+'/user/userInfo',
        data:{userId:id},
        success:function(res){
          if(res.statusCode==200){
          let data=res.data.data;
          let info={
            'avatar':data.avatarUrl,
            'id':data.id,
            'nickname':data.nickName,
            'wxId':data.wxId,
            'description':data.description,
            'school':data.school,
            'major':data.major,
            'grade':data.grade,
            'identity':data.identification,

            'schoolPublic':data.schoolPublic,
            'majorPublic':data.majorPublic,
            'gradePublic':data.gradePublic,
            'identityPublic':data.identityPublic,

            'personalLabel':(data.personalLabel?data.personalLabel.map(that.getContent):[]),
            'interestLabel':(data.interestLabel?data.interestLabel.map(that.getContent):[]),
          };
          console.log(info)
          let personalInfoList=that.data.personalInfoList;
          personalInfoList[id]=Object.assign(personalInfoList[id]||{},info);
          that.setData({
            personalInfoList,
          });
          return personalInfoList[id];
          }
        }
      })
    }
  },

// 以下是和 发起者 initiator 有关的操作事件 ---------start---------------------
  handleCloseTeam: function(){
    let dialog = {
      isDialogShow: true,
      content:"请填写结束招募理由，\n理由将被队内成员看到",
      hasInputBox:true,
      tip:"提示：结束组队招募后，\n将无法查看队友联系方式",
      cancelText:"取消",
      okText:"确认",
      tapOkEvent:"dialogTapOkForCloseTeam"
    };
    this.setData({
      dialog
    })
  },
  dialogTapOkForCloseTeam:function(e){
    let that=this;
    let reason=this.selectComponent("#dialogBox").data.reason;
    if(!reason){
      let dialog=this.data.dialog;
      dialog.tip="请输入原因！\n ";
      this.setData({dialog:dialog});
      return true
    }else{
      wx.request({
        url: app.globalData.url+'/team/terminateTeam',
        method:'GET',
        data:{
          teamId:that.data.teamId,
          reason:reason
        },
        header:{
          'content-type': 'application/x-www-form-urlencoded',
          'cookie':wx.getStorageSync('token')
        },
        success:function(res){
          if(res.statusCode==200){
            that.setData({
              'teamDetail.isTeamClosed':true
            })
          }
        }   
      })
    }
  },
  showAnswers:function(e){
    console.log(e)
    let id=e.currentTarget.dataset.applyerid;
    // let answer=this.getPersonalInfo(id);
    if(this.data.personalInfoList[id]){
      let answer=this.data.personalInfoList[id]
      answer.show=true;
      answer.height='auto';
      this.setData({answer})
    }else{
      let that=this;
      wx.request({
        url: app.globalData.url+'/user/userInfo',
        data:{userId:id},
        success:function(res){
          if(res.statusCode==200){
          let data=res.data.data;
          let info={
            'avatar':data.avatarUrl,
            'id':data.id,
            'nickname':data.nickName,
            'wxId':data.wxId,
            'description':data.description,
            'school':data.school,
            'major':data.major,
            'grade':data.grade,
            'identity':data.identification,

            'schoolPublic':data.schoolPublic,
            'majorPublic':data.majorPublic,
            'gradePublic':data.gradePublic,
            'identityPublic':data.identityPublic,

            'personalLabel':(data.personalLabel?data.personalLabel.map(that.getContent):[]),
            'interestLabel':(data.interestLabel?data.interestLabel.map(that.getContent):[]),

            'detail':true
          };
          let personalInfoList=that.data.personalInfoList;
          personalInfoList[id]=Object.assign(personalInfoList[id]||{},info);
          let answer=that.data.personalInfoList[id]
          answer.show=true;
          answer.height='auto';
          that.setData({
            personalInfoList,
            answer
          });
          }
        }
      })
    }
  },
  showTipBox:function(message){
    let tipBox = {
      show:true,
      text:message
    };
    this.setData({
      tipBox:tipBox
    })
  },
  changeTeamDetail:function(){
    let that=this;
    wx.request({
      url: app.globalData.url+'/team/getTeamAndCheckStatus/'+this.data.teamId,
      header:{
        'cookie':wx.getStorageSync('token'),
      },
      success:function(res){
        if(res.statusCode!=200){return}
        let teamdata=res.data.data;
        console.log(teamdata);
        that.setData({
          amITeamInitiator:teamdata.initializedByMe,
          isFavourite:teamdata.myFavourite
        })
        let initiatorid=teamdata.initiatorId;
        wx.request({
          url: app.globalData.url+'/user/userInfo',
          data:{userId:initiatorid},
          header:{
            'cookie':wx.getStorageSync('token'),
          },
          success:function(res){
            // console.log(res)
            let initiatordata=res.data.data;
            var picList=(teamdata.allPicUrl?teamdata.allPicUrl.split(','):[]);
            let fromTime=util.getDateDiff(teamdata.createTime);
            let dueTime=util.getDateDiff(teamdata.dueTime);
            let teamDetail={
              title:teamdata.title,
              isTeamClosed: (teamdata.status>2?true:false),
              avatar:initiatordata.avatarUrl,
              nickname:initiatordata.nickName,
              fromTime: fromTime,
              dueTime: dueTime,
              content: teamdata.content,
              picturesNum:  picList.length,
              pictures: picList,
              due_member:teamdata.dueMember,
              question:JSON.parse(teamdata.question),
              reason:teamdata.reason
            };
            let questionList=[];
            if(teamdata.question){
              for(let key in teamdata.question){
                questionList.push({question:teamdata.question[key]})
              }
            }
            that.setData({
              teamDetail:teamDetail,
              initiatorId:initiatorid,
              timeIsOver:(teamdata.status>2?true:false),
              questionAnswerList:questionList
            });
            
            that.changeAvatarList();

            if(that.data.amITeamInitiator){
              if(teamdata.status==4){
                that.showTipBox('组队招募已结束')
              }
              that.changeSizeOfInitiatorPage();
            }else{
              if(teamdata.status==2){
                that.setData({memberFull:true})
              }
              console.log(teamdata.applyStatus)
              switch(teamdata.applyStatus){
                case 0:
                  that.setData({haveSignedUp:true})
                  break
                case 1:
                  that.showTipBox('恭喜您已成功入队~可点击发起人头像查看联系方式，快去与ta联系吧！')
                  wx.request({
                    url:app.globalData.url+ '/userTeam/checkApproved',
                    method:"POST",
                    data:{teamId:that.data.teamId}
                  })
                case 2:
                  let personalInfoList=that.data.personalInfoList;
                  if(personalInfoList[that.data.initiatorId]){
                    personalInfoList[that.data.initiatorId].wxIdPublic=true;
                  }
                  that.setData({
                    haveJoinedIn:true,
                    personalInfoList
                  });
                  break;
                case 3:
                  that.showTipBox('很遗憾，本次申请未能通过，但请不要灰心，下一次可能就会组队成功~');
                  wx.request({
                    url:app.globalData.url+ 'userTeam/checkRejected',
                    method:"POST",
                    data:{teamId:that.data.teamId}
                  });
                case 4:
                  that.setData({beRefused:true});
                  break;
                case 5:
                  if(!teamdata.reaon=='该组队招募已截止'){
                    that.setData({beClosedInAdvance:true})
                    that.showTipBox('该组队招募已结束，理由为：\n'+teamdata.reason)
                  }else{
                    that.setData({timeIsOver:true})
                    that.showTipBox('该组队招募已截止')
                  }
                  break;
                case 6:
                  if(teamdata.reaon){
                    that.setData({beClosedInAdvance:true})
                  }else{
                    that.setData({timeIsOver:true})
                  }
                  break;
    
              }
              that.initializeResult();
              // that.changeScrollHeight();
            }
          }
        })
      }
    })
  },


  changeInitiatorList:function(){
    let app=getApp();
    let that=this;
    wx.request({
      url: app.globalData.url+'/userTeam/getApplierInfoByTeamId/'+this.data.teamId,
      success:function(res){
        let data=res.data.data
        console.log(data)
        let list=[];
        let personalInfoList=that.data.personalInfoList;
        for(let i in data){
          list.push({
            'applyTime':util.getDateDiff(data[i].createTime),
            'avatar':data[i].avatarUrl,
            'id':data[i].id,
            'nickname':data[i].nickName,
          });
          if(that.data.amITeamInitiator){
            if(data[i].answer){
              let answerList=[];
                let answer=JSON.parse(data[i].answer)
                for(let key in answer){
                  answerList.push(answre[key]);
                };
                personalInfoList[data[i].id].answer=answerList;
              personalInfoList[data[i].id].isCheckAnswerButtonShow=true;
            }
          }
          
        };
        that.setData({
          applierList:list,
          personalInfoList,
        })
      }
    })
  },
  acceptApplying: function(e){
    console.log(e.currentTarget.dataset);
    let applyer = e.currentTarget.dataset;
    this.setData({ targetId:applyer.applyerid,});
    let dialog = {
      isDialogShow: true,
      content:'确定同意 ' + applyer.applyername  + ' 加入组队？',
      hasInputBox:false,
      tip:"",
      cancelText:"取消",
      okText:"确认",
      tapOkEvent:"dialogTapOkForAcceptApplying"
    };
    this.setData({
      dialog,
    })
  },
  dialogTapOkForAcceptApplying:function(e){
    //  console.log(e);
    let app=getApp();
    let that=this;
    console.log(this.data.targetId);
    wx.request({
      url: app.globalData.url+'/userTeam/approveApplication',
      header:{
        'content-type':'application/json',
        'cookie':wx.getStorageSync('token')
      },
      data:{
        userId:this.data.targetId,
        teamId:this.data.teamId
      },
      method:'POST',
      success:function(){
        let list=that.data.applierList;
        let newList=[];
        for(let i in list){
          if(list[i].id!=that.data.targetId){
            newList.push(list[i]);
          }
        };
        that.setData({
          applierList:newList
        });
        wx.showToast({
          title: '接受id为'+that.data.targetId+'的申请',
        });
        that.changeAvatarList();
        that.changeInitiatorList();
      }
    })

    this.setData({
      haveJoinedIn:true
    })
    this.initializeResult();
    // this.changeScrollHeight();
  },
  refuseApplying: function(e){
    let applyer = e.currentTarget.dataset;
    this.setData({ targetId:applyer.applyerid,});
    // console.log(this.data.targetId);
    let dialog = {
      isDialogShow: true,
      content:'确定拒绝 ' + applyer.applyername  + ' 加入组队？',
      hasInputBox:false,
      tip:"",
      cancelText:"取消",
      okText:"确认",
      tapOkEvent:"dialogTapOkForRefuseApplying"
    };
    this.setData({
      dialog,
    })
  },
  dialogTapOkForRefuseApplying:function(){
    let app=getApp();
    let that=this;
    console.log(this.data.targetId);
    wx.request({
      url: app.globalData.url+'/userTeam/rejectApplication',
      header:{
        'content-type':'application/json',
        'cookie':wx.getStorageSync('token')
      },
      data:{
        userId:this.data.targetId,
        teamId:this.data.teamId
      },
      method:'POST',
      success:function(){
        let list=that.data.applierList;
        let newList=[];
        for(let i in list){
          if(list[i].id!=that.data.targetId){
            newList.push(list[i]);
          }
        };
        that.setData({
          applierList:newList
        });
        wx.showToast({
          title: '拒绝id为'+that.data.targetId+'的申请',
        });
      }
    });
    this.setData({
      beRefused:true
    });
    this.initializeResult();
    this.changeScrollHeight();
  },


  tapAvatar:function(e){
    console.log(e)
    let that=this;
    let id=e.currentTarget.dataset.id;
    // this.setData({personalInfo:this.getPersonalInfo(id)})
    if(this.data.personalInfoList[id]){
      console.log('type original')
      this.setData({personalInfo:this.data.personalInfoList[id]})
    }else{
      console.log('type updated')
      let that=this;
      wx.request({
        url: app.globalData.url+'/user/userInfo',
        data:{userId:id},
        success:function(res){
          if(res.statusCode==200){
          let data=res.data.data;
          let info={
            'avatar':data.avatarUrl,
            'id':data.id,
            'nickname':data.nickName,
            'wxId':data.wxId,
            'description':data.description,
            'school':data.school,
            'major':data.major,
            'grade':data.grade,
            'identity':data.identification,

            'schoolPublic':data.schoolPublic,
            'majorPublic':data.majorPublic,
            'gradePublic':data.gradePublic,
            'identityPublic':data.identityPublic,

            'personalLabel':(data.personalLabel?data.personalLabel.map(that.getContent):[]),
            'interestLabel':(data.interestLabel?data.interestLabel.map(that.getContent):[]),

            'detail':true
          };
          console.log(info)
          let personalInfoList=that.data.personalInfoList;
          personalInfoList[id]=Object.assign(personalInfoList[id]||{},info);
          that.setData({
            personalInfoList,
            personalInfo:personalInfoList[id]
          });
          }
        }
      })
    }
    console.log(e);
    this.selectComponent("#personalAnimation").showModal(this.data.currentUser.userAvatar);
    
  },

  seeDetail:function(e){
    console.log("查看全部");
    let teamDetail=this.data.teamDetail;
    let dialog2={
      isDialogShow:true,
      title:teamDetail.title,
      content:teamDetail.content,
      pictures:teamDetail.pictures,
      button:"返回"
    };
    this.setData({
      dialog2:dialog2
    });
    this.selectComponent('#dialog2').changeSize();
    // this.changeScrollHeight2();
    //@李雨龙
  },
  tapFavourite:function(){
    let app=getApp();
    let that=this;
    if(this.data.isFavourite==false){
      wx.request({
        url: app.globalData.url+'/userFavouriteTeam/addToMyFavouriteTeam/'+this.data.teamId,
        header:{
          'cookie':wx.getStorageSync('token')
        },
        method:'POST',
        success:function(){
          wx.showToast({
            title: '已加入收藏',
            icon: 'success',
            duration: 1000
          })
          that.setData({isFavourite:true});
        }
      })
    }else{
      wx.request({
        url: app.globalData.url+'/userFavouriteTeam/RemoveFromMyFavouriteTeam/'+this.data.teamId,
        header:{
          'cookie':wx.getStorageSync('token')
        },
        method:'DELETE',
        success:function(){
          wx.showToast({
            title: '已取消收藏',
            icon: 'success',
            duration: 1000
          })
          that.setData({isFavourite:false});
        }
      })
    }
    // this.onLoad();
  },

  tapOk:function(e){
    console.log("点击确认之后的业务");
    wx.showToast({
      title: '爬了',
      icon: 'none',
      duration: 1000
    })
    wx.navigateTo({
      url: '/pages/jiren/answerQuestion',
    })
  },
  
  acceptAllButton:function(e){
    let dialog = {
      isDialogShow: true,
      content:'确定自动将最早申请的用户填满空位？',
      hasInputBox:false,
      tip:"",
      cancelText:"取消",
      okText:"确定",
      tapOkEvent:"dialogTapOkForAcceptAllApplications"
    };
    this.setData({
      dialog,
    })
  },

  dialogTapOkForAcceptAllApplications(){
    let that=this;
    wx.request({
      url: app.globalData.url+'/userTeam/autoApproveByTeamId/'+this.data.teamId,
      header:{
        'cookie':wx.getStorageSync('token')
      },
      success:function(){
        that.setData({applierList:[]});
        that.changeAvatarList();
        that.changeInitiatorList();
      }
    })
  },



  // 以下是和 申请者 applicant 有关的操作事件
  applicantInitialize:function(){

  },



  applicantClick:function(e){
    console.log(e);
  },
  initializeResult:function(e){
    let data=this.data;
    if(data.timeIsOver){
      this.setData({
        result:"组队招募已经结束",
        over:true
      })
    }else if(data.memberFull){
      this.setData({
        result:"队伍成员已满",
        over:true,
      })
    }else if(data.beClosedInAdvance){
      this.setData({
        result:"组队招募已经关闭\n发起人关闭的原因如下：",
        reply:this.data.teamDetail.reason,
        over:true
      })
    }else if(data.haveJoinedIn){
      this.setData({
        result:"您已成功入队"
      })
    }else if(data.beRefused){
      this.setData({
        result:'您的申请被拒绝'
      })
    }else if(data.haveSignedUp){
      this.setData({
        result:"您已报名该组队，申请正在处理中~"
      })
    }
    // console.log(this);
    this.changeScrollHeight();
  },


  changeScrollHeight:function(){
    if(this.data.amITeamInitiator){return;}
    console.log('work')
    var that = this;
    var windowHeight;
    //设置scroll-view高度
    wx.getSystemInfo({
      success: function (res) {
          windowHeight= res.windowHeight;
      }
    });
    let query = wx.createSelectorQuery();
    query.select('#scroll-1').boundingClientRect(rect=>{
        let maxHeight = rect.height;
        console.log(maxHeight)
        console.log(windowHeight)
        if(!that.data.result&&!that.data.reply){  
          if(maxHeight>windowHeight*0.65){
            that.setData({
              maxHeight:"65vh"
            });
          }
        }else if(that.data.result&&!that.data.reply){
          if(maxHeight>windowHeight*0.60)  {
            that.setData({
              maxHeight:"60vh"
            })
          }
        }else if(that.data.result&&that.data.reply){
          if(maxHeight>windowHeight*0.5){
            that.setData({
              maxHeight:"50vh"
            })
          }
        }
      }).exec();
      
  },
  applyButton:function(e){
    var that=this;
    if(!this.data.teamDetail.question){
      this.setData({
        result:"您已报名该组队，申请正在处理中~",
        haveSignedUp:true
      });
      wx.showToast({
        title: '申请已提交',
        icon:'success',
        duration:2000
      });
    }else{
      wx.navigateTo({
        url: '/pages/jiren/answerQuestion?teamId='+that.data.teamId,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          getResult: function(data) {
            if(data){
              that.setData({
                haveSignedUp:true,
                result:"您已报名该组队，申请正在处理中~"
              });
              //以下这个函数没有发挥作用，解决办法并不容易。等和后端接口接上后问题自然就解决了，也不需要下面这个函数调用了。
              that.changeScrollHeight();
            }
          }
        }
      })
    };
    console.log("over");
  },
  cancelButton: function(e){
    let dialog = {
      isDialogShow: true,
      content:'确定取消申请？',
      hasInputBox:false,
      tip:"取消申请后无法再次申请",
      cancelText:"取消",
      okText:"确认",
      tapOkEvent:"dialogTapOkForCancelApplication"
    };
    this.setData({
      dialog
    })
  },
  dialogTapOkForCancelApplication:function(e){
    wx.request({
      url: app.globalData.url+'/userTeam/cancelApply',
      header:{'cookie':wx.getStorageSync('token')},
      success:function(res){
        this.setData({
          // haveSignedUp:false,
          beRefused:true,
          result:'已取消申请',
        });
        this.changeScrollHeight();
      }
    })    
  },
  testButton:function(e){
    let tipBox = {
      show:true,
      text:"该组队招募已结束，理由为：\n二十五个字二十五个字二十五个字二十五个字二十五个字"
    };
    this.setData({
      tipBox:tipBox
    })
  },
  tipBoxButton:function(e){
    this.setData({
      tipBox:{show:false}
    })
  },
  changeScrollHeight2(){
    var that=this;
    var windowHeight=this.windowHeight
    
    // console.log(this);
    let query = wx.createSelectorQuery();
    query.select('#scroll').boundingClientRect(rect=>{
      console.log(rect)
        let maxHeight = rect.height;
        if(maxHeight>windowHeight*0.7){
          that.setData({
            maxHeight:"70vh"
          })
        }
      }).exec();
  },
  changeSizeOfInitiatorPage(){
    // var that=this;
    let query = wx.createSelectorQuery();
    query.select('#initiator-scroll').boundingClientRect(rect=>{
      console.log(rect)
        let top = rect.top;
        let height=this.data.windowHeight-top;
        this.setData({
          initiatorScrollHeight:height+'px',
          // initiatorScrollHeight:100+'px',
        });
      }).exec();
  }
})
