var DBDao = require('./DBDao'),
  serverLog=require('./serverLog');

// admin action
// 1:登录
// 2:登出
// 3:连接
// 4:断开
// 5:添加虚拟机
// 6:删除虚拟机
// 7:添加用户
// 8:删除用户
// 9:添加用户虚拟机
// 10:删除用户虚拟机

function processMsg(msgObj_, callback_) {
  switch (msgObj_.type) {
    case 'auth':
      {
        authUser(msgObj_['content'], callback_);
      }
      break;
    case 'logout':
      {
        userLogout(msgObj_['content'], callback_);
      }
      break;

    case 'userConnVm':
      {
        userConnVm(msgObj_['content'], callback_);
      }
      break;
    case 'userDisConnVm':
      {
        userDisConnVm(msgObj_['content'], callback_);
      }
      break;
    case 'queryUser':
      {
        queryUser(msgObj_['content'], callback_);
      }
      break;
    case 'queryUserInfo':
      {
        queryUserInfo(msgObj_['content'], callback_);
      }
      break;
    case 'queryVm':
      {
        queryVm(msgObj_['content'], callback_);
      }
      break;
    case 'queryRole':
      {
        queryRole(callback_);
      }
      break;
    case 'addUser':
      {
        addUser(msgObj_['content'], callback_);
      }
      break;
    case 'addVm':
      {
        addVm(msgObj_['content'], callback_);
      }
      break;
    case 'addUserVm':
      {
        addUserVm(msgObj_['content'], callback_);
      }
      break;
    case 'removeUserVm':
      {
        removeUserVm(msgObj_['content'], callback_);
      }
      break;
    default:
      {
        console.log("this is in default switch on datammmm:" + JSON.stringify(msgObj_));
      }
  }

}
exports.processMsg = processMsg;

function authUser(msgObj_, callback_) {
  var rstObj = {};
  DBDao.authUser(msgObj_['userName'], msgObj_['password'], msgObj_['role'], function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'auth user error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      if (rst_.length === 0) {
        rstObj['info'] = 'ok';
        rstObj['auth'] = 'failed';
        callback_(rstObj);
      } else {
        rstObj['auth'] = 'success';
        var userData = {};
        rstObj['content'] = userData;
        userData['userName'] = rst_[0]['userName'];
        DBDao.userLoginState(msgObj_['userName'],function(err_,result_,state_,time_){
          if(err_||result_['affectedRows']==0){
            console.log('user login stateSet error '+err_);
            rstObj['info'] = 'error';
            rstObj['desc'] = 'login user info update error.';
            rstObj['error'] = err_;
            callback_(rstObj);
          }else {
            rstObj['info'] = 'ok';
            userData['userState'] = state_;
            userData['stateTime'] = time_;
            console.log('user login!')
            getVmsByRoleOrUser(rst_[0]['roleId'],msgObj_['userName'],function(err_,vms_){
              if(err_){
                userData['vmState'] = 'error';
                userData['desc'] = 'get vms for user error.';
                userData['error'] = err_;
                callback_(rstObj);
              }else{
                userData['vmMap'] = vms_;
                callback_(rstObj);
              }
            });
            delete msgObj_['password'];
            DBDao.addUserLog(1,JSON.stringify(msgObj_), function(err_, rst_) {
              if (err_||rst_['affectedRows']==0) {
                console.log('login sys log failed '+msgObj_['userName'])
              }else console.log('login sys log succeed '+msgObj_['userName'])
            });
            serverLog.sendUserLogLog(msgObj_,'login');
          }
        });
      }
    }
  });
}

function userLogout(msgObj_, callback_) {
  var rstObj = {};
  DBDao.userLogoutState(msgObj_['userName'], function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'user logout stateSet error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else if (rst_['affectedRows'] == 0) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'update state for user logout error.';
      rstObj['error'] = 'update state failed';
      callback_(rstObj);
    } else {
      rstObj['info'] = 'ok';
      callback_(rstObj);
      DBDao.addUserLog(2, JSON.stringify(msgObj_), function(err_, rst_) {
        if (err_ || rst_['affectedRows'] == 0) {
          console.log('logout sys log failed ' + msgObj_['userName'])
        } else console.log('logout sys log succeed ' + msgObj_['userName'])
      });
      serverLog.sendUserLogLog(msgObj_,'logout');
    }
  });
}

function userConnVm(msgObj_, callback_){
  var rstObj = {};
  DBDao.userConnVmState(msgObj_['vmId'],function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'user conn stateSet error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else if(rst_['affectedRows']==0){
      rstObj['info'] = 'error';
      rstObj['desc']='update state for user conn vm error.';
      rstObj['error'] = 'update state failed';
      callback_(rstObj);
    }else{
      rstObj['info'] = 'ok';
      callback_(rstObj);
      DBDao.addUserLog(3, JSON.stringify(msgObj_), function(err_, rst_) {
        if (err_ || rst_['affectedRows'] == 0) {
          console.log('user conn log failed ' + msgObj_['userName'])
        } else console.log('user conn log succeed ' + msgObj_['userName'])
      });
      serverLog.sendUserConnLog(msgObj_,'connVm');
    }
  });
}

function userDisConnVm(msgObj_, callback_){
  var rstObj = {};
  DBDao.userDisConnVmState(msgObj_['vmId'],function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'user disconn stateSet error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else if(rst_['affectedRows']==0){
      rstObj['info'] = 'error';
      rstObj['desc']='update state for user disconn vm error.';
      callback_(rstObj);
    }else{
      rstObj['info'] = 'ok';
      callback_(rstObj);
      DBDao.addUserLog(4, JSON.stringify(msgObj_), function(err_, rst_) {
        if (err_ || rst_['affectedRows'] == 0) {
          console.log('user disconn log failed ' + msgObj_['userName'])
        } else console.log('user disconn log succeed ' + msgObj_['userName'])
      });
      serverLog.sendUserConnLog(msgObj_,'disConnVm');
    }
  });
}

function queryUser(msgObj_, callback_) {
  var rstObj = {};
  DBDao.getUserByUserName(msgObj_['userName'], function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'get user info error.'
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      if(rst_.length==0){
        rstObj['info'] = 'error';
        rstObj['desc'] = 'no such a user';
        callback_(rstObj);
      }else{
        getVmsByRoleOrUser(rst_[0]['roleId'], msgObj_['userName'], function(err_, vms_) {
          if (err_) {
            rstObj['info'] = 'error';
            rstObj['desc'] = 'get vms for user error.';
            rstObj['error'] = err_;
            callback_(rstObj);
          } else {
            rstObj['info'] = 'ok';
            userData = {};
            rstObj['content'] = userData;
            userData['userName'] = msgObj_['userName'];
            userData['userState'] = rst_[0]['state'];
            userData['stateTime'] = rst_[0]['stateTime'];
            userData['vmMap'] = vms_;
            callback_(rstObj);
          }
        });
      }
    }
  });
}

function queryUserInfo(msgObj_, callback_) {
  var rstObj = {};
  var userName = msgObj_['userName'];
  switch (userName) {
    case '-1':
      {
        DBDao.getVmsByState(4, function(err_, vmRst_) {
          if (err_) {
            rstObj['info'] = 'error';
            rstObj['desc'] = 'get recovery info error.'
            rstObj['error'] = err_;
            callback_(rstObj);
          } else {
            rstObj['info'] = 'ok';
            userData = {};
            rstObj['content'] = userData;
            userData['userName'] = '回收中';
            userData['userState'] = 0;
            userData['stateTime'] = new Date().getTime();
            vmMap = [];
            for (var i = 0; i < vmRst_.length; i++) {
              var vmData = {};
              var item = vmRst_[i];
              vmData['vmId'] = item['vmId'];
              vmData['userName'] = item['userName'];
              vmData['vmName'] = item['vmName'];
              vmData['ip'] = item['ip'];
              vmData['password'] = item['password'];
              vmData['state'] = item['state'];
              vmData['stateTime'] = item['stateTime'];
              vmMap.push(vmData);
            }
            userData['vmMap'] = vmMap;
            callback_(rstObj);
          }
        });
      }
      break;
    case '0':
      {
        DBDao.getVmsByState(0,function(err_, vmRst_) {
          if (err_) {
            rstObj['info'] = 'error';
            rstObj['desc'] = 'get undistributed info error.'
            rstObj['error'] = err_;
            callback_(rstObj);
          } else {
            rstObj['info'] = 'ok';
            userData = {};
            rstObj['content'] = userData;
            userData['userName'] = '未分配';
            userData['userState'] = 0;
            userData['stateTime'] = new Date().getTime();
            vmMap = [];
            for (var i = 0; i < vmRst_.length; i++) {
              var vmData = {};
              var item = vmRst_[i];
              vmData['vmId'] = item['vmId'];
              vmData['userName'] = item['userName'];
              vmData['vmName'] = item['vmName'];
              vmData['ip'] = item['ip'];
              vmData['password'] = item['password'];
              vmData['state'] = item['state'];
              vmData['stateTime'] = item['stateTime'];
              vmMap.push(vmData);
            }
            userData['vmMap'] = vmMap;
            callback_(rstObj);
          }
        });
      }
      break;
    default:
      {
        DBDao.getUserByUserName(userName, function(err_, rst_) {
          if (err_) {
            rstObj['info'] = 'error';
            rstObj['desc'] = 'get user info error.'
            rstObj['error'] = err_;
            callback_(rstObj);
          } else {
            if (rst_.length == 0) {
              rstObj['info'] = 'error';
              rstObj['desc'] = 'no such a user name';
              callback_(rstObj);
            } else {
              getVmsByRoleOrUser(rst_[0]['roleId'], userName, function(err_, vms_) {
                if (err_) {
                  rstObj['info'] = 'error';
                  rstObj['desc'] = 'get vms for user error.';
                  rstObj['error'] = err_;
                  callback_(rstObj);
                } else {
                  rstObj['info'] = 'ok';
                  userData = {};
                  rstObj['content'] = userData;
                  userData['userName'] = rst_[0]['userName'];
                  userData['userState'] = rst_[0]['state'];
                  userData['stateTime'] = rst_[0]['stateTime'];
                  userData['vmMap'] = vms_;
                  callback_(rstObj);
                }
              });
            }
          }
        });
      }
  }
}

function getVmsByRoleOrUser(roleId_, userName_, callback_) {
  if (roleId_ == 1) { //admin: get all vms
    DBDao.getAllVms(function(err_, vmRst_) {
      if (err_) {
        callback_(err_);
      } else {
        if (vmRst_.length > 0) {
          DBDao.getNormalUsers(function(err_, userRst_) {
            if (err_) {
              callback_(err_);
            } else {
              var vmUserMap = {};
              var vmUserItem = {};
              vmUserItem['userName'] = '未分配';
              vmUserItem['userState'] = 0;
              vmUserItem['stateTime'] = new Date().getTime();
              vmUserItem['vmMap']=[];
              vmUserMap[0] = vmUserItem;
              var vmUserItem = {};
              vmUserItem['userName'] = '回收中';
              vmUserItem['userState'] = 0;
              vmUserItem['stateTime'] = new Date().getTime();
              vmUserItem['vmMap']=[];
              vmUserMap[-1] = vmUserItem;
              for (var i = 0; i < userRst_.length; i++) {
                var vmUserItem = {};
                var userItem=userRst_[i];
                vmUserItem['userName'] = userItem['userName'];
                vmUserItem['userState'] = userItem['state'];
                vmUserItem['stateTime'] = userItem['stateTime'];
                vmUserItem['vmMap']=[];
                vmUserMap[userItem['userName']] = vmUserItem;
              }
              for (var i = 0; i < vmRst_.length; i++) {
                var vmData = {};
                var item = vmRst_[i];
                vmData['vmId'] = item['vmId'];
                vmData['userName'] = item['userName'];
                vmData['vmName'] = item['vmName'];
                vmData['ip'] = item['ip'];
                vmData['password'] = item['password'];
                vmData['state']=item['state'];
                vmData['stateTime']=item['stateTime'];
                var userName = item['ownerName'];
                userName = userName == null ? 0 : userName;
                userName=item['state']==4?-1:userName;
                vmUserMap[userName]['vmMap'].push(vmData);
              }
              callback_(null, vmUserMap);
            }
          });
        }else callback_(null,[])
      }
    });
  } else { //normal user: get vms by user name
    var vmMap = [];
    DBDao.getVmsByUserName(userName_, function(err_, vmRst_) {
      if (err_) {
        callback_(err_);
      } else {
        for (var i = 0; i < vmRst_.length; i++) {
          var vmData = {};
          var item = vmRst_[i];
          vmData['vmId'] = item['vmId'];
          vmData['userName'] = item['userName'];
          vmData['vmName'] = item['vmName'];
          vmData['ip'] = item['ip'];
          vmData['password'] = item['password'];
          vmData['state']=item['state']
          vmData['stateTime']=item['stateTime']
          vmMap.push(vmData);
        }
        callback_(null, vmMap);
      }
    });
  }
}

function queryVm(msgObj_, callback_) {
  var rstObj = {};
  DBDao.getVmByVmId(msgObj_['vmId'], function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'get vm info error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      rstObj['info'] = 'ok';
      var vmData = {};
      if (rst_.length == 1) {
        vmData['vmId'] = rst_[0]['vmId'];
        vmData['userName'] = rst_[0]['userName'];
        vmData['vmName'] = rst_[0]['vmName'];
        vmData['ip'] = rst_[0]['ip'];
        vmData['password'] = rst_[0]['password'];
        vmData['state'] = rst_[0]['state'];
        vmData['stateTime'] = rst_[0]['stateTime'];
      }
      rstObj['content'] = vmData;
      callback_(rstObj);
    }
  });
}

function queryRole(callback_) {
  var rstObj = {};
  DBDao.getRoles(function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'get roles error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      rstObj['info'] = 'ok';
      var roleData = [];
      for(var i =0;i<rst_.length;i++){
        roleData.push(rst_[i]['roleName']);
      }
      rstObj['content'] = roleData;
      callback_(rstObj);
    }
  });
}

function addUser(msgObj_, callback_){
  var rstObj = {};
  DBDao.getRoleByRoleName(msgObj_['role'],function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'get role for user error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      if(rst_.length==0){
        rstObj['info'] = 'error';
        rstObj['desc'] = 'no such a role';
        callback_(rstObj);
      }else{
        DBDao.addUser(msgObj_['userName'],msgObj_['password'],rst_[0]['id'],function(err_, rst_,state_,time_) {
          if (err_||rst_['affectedRows']==0) {
            rstObj['info'] = 'error';
            rstObj['desc'] = 'add user error.';
            rstObj['error'] = err_;
            callback_(rstObj);
          } else {
            rstObj['info'] = 'ok';
            var content={};
            content['userName']=msgObj_['userName'];
            content['userState']=state_;
            content['stateTime']=time_;
            content['vmMap']=[];
            rstObj['content']=content;
            callback_(rstObj);
            delete msgObj_['password'];
            DBDao.addUserLog(7, JSON.stringify(msgObj_), function(err_, rst_) {
              if (err_ || rst_['affectedRows'] == 0) {
                console.log('add user log failed ')
              } else console.log('add user log succeed ')
            });
          }
        });
      }    
    }
  });
}

function addVm(msgObj_, callback_) {
  var rstObj = {};
  DBDao.addVm(msgObj_['vmId'], msgObj_['userName'], msgObj_['vmName'], msgObj_['ip'],msgObj_['password'], function(err_, rst_,state_,time_) {
    if (err_||rst_['affectedRows']==0) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'add vm error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      rstObj['info'] = 'ok';
      var content = {};
      content['vmId'] = msgObj_['vmId'];
      content['userName'] =  msgObj_['userName'];
      content['vmName'] = msgObj_['vmName'];
      content['ip'] = msgObj_['ip'];
      content['password'] = msgObj_['password'];
      content['state'] = state_;
      content['stateTime'] = time_;
      rstObj['content'] = content;
      callback_(rstObj);
      delete msgObj_['password']
      DBDao.addUserLog(5, JSON.stringify(msgObj_), function(err_, rst_) {
        if (err_ || rst_['affectedRows'] == 0) {
          console.log('add vm log failed ')
        } else console.log('add vm log succeed ')
      });
    }
  });
}

function addUserVm(msgObj_, callback_) {
  var rstObj = {};
  DBDao.addUserVm(msgObj_['userName'], msgObj_['vmId'], function(err_, rst_, state_, time_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'add vm for user error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      rstObj['info'] = 'ok';
      var content = {};
      content['state'] = state_;
      content['stateTime'] = time_;
      rstObj['content'] = content;
      callback_(rstObj);
      DBDao.addUserLog(9, JSON.stringify(msgObj_), function(err_, rst_) {
        if (err_ || rst_['affectedRows'] == 0) {
          console.log('add uservm log failed ')
        } else console.log('add uservm log succeed ')
      });
    }
  });
}

function removeUserVmCb(err_, rst_,state_,time_,msgObj_,callback_) {
  var rstObj = {};
  if (err_) {
    rstObj['info'] = 'error';
    rstObj['desc'] = 'remove vm for user error.';
    rstObj['error'] = err_;
    callback_(rstObj);
  } else if (rst_['affectedRows'] == 0) {
    rstObj['info'] = 'error';
    rstObj['desc'] = '移除失败，请刷新后重试.';
    callback_(rstObj);
  } else {
    rstObj['info'] = 'ok';
    if(state_==null){
      callback_(rstObj);
      DBDao.addUserLog(6, JSON.stringify(msgObj_), function(err_, rst_) {
        if (err_ || rst_['affectedRows'] == 0) {
          console.log('delete vm log failed ')
        } else console.log('delete vm log succeed ')
      });
    }else{
      var content = {};
      content['state'] = state_;
      content['stateTime'] = time_;
      rstObj['content'] = content;
      callback_(rstObj);
      DBDao.addUserLog(10, JSON.stringify(msgObj_), function(err_, rst_) {
        if (err_ || rst_['affectedRows'] == 0) {
          console.log('remove uservm log failed ')
        } else console.log('remove uservm log succeed ')
      });
    }
  }
}

function removeUserVm(msgObj_, callback_) {
  if (msgObj_['state'] == 4) {
    DBDao.deleteVm(msgObj_['vmId'], 4, function(err_, rst_, state_, time_) {
      removeUserVmCb(err_, rst_, null, null, msgObj_, callback_);
    });
  } else {
    DBDao.removeUserVm(msgObj_['vmId'], msgObj_['state'], msgObj_['userName'], function(err_, rst_, state_, time_) {
      removeUserVmCb(err_, rst_, state_, time_, msgObj_, callback_);
    });
  }
}