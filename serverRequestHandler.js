var DBDao = require('./DBDao');



function processMsg(msgObj_, callback_) {
  switch (msgObj_.type) {
    case 'auth':
      {
        authUser(msgObj_['content'], callback_);
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
        rstObj['info'] = 'ok';
        rstObj['auth'] = 'success';
        var userData = {};
        rstObj['content'] = userData;
        userData['userName'] = rst_[0]['userName'];
        userData['userState'] = rst_[0]['state'];
        userData['stateTime'] = rst_[0]['stateTime'];
        getVmsByRoleOrUser(rst_[0]['roleId'],rst_[0]['id'],function(err_,vms_){
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
        DBDao.addUserLog(1,rst_[0]['id'],msgObj_['ip'], function(err_, rst_) {
          if (err_) {
            console.log('login sys log failed '+msgObj_['userName'])
          }
        });
      }
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
        getVmsByRoleOrUser(rst_[0]['roleId'], rst_[0]['id'], function(err_, vms_) {
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
  var userId = msgObj_['userId'];
  switch (userId) {
    case -1:
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
            userData['userId'] = -1;
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
    case 0:
      {
        DBDao.getVmsUndistributed(function(err_, vmRst_) {
          if (err_) {
            rstObj['info'] = 'error';
            rstObj['desc'] = 'get undistributed info error.'
            rstObj['error'] = err_;
            callback_(rstObj);
          } else {
            rstObj['info'] = 'ok';
            userData = {};
            rstObj['content'] = userData;
            userData['userId'] = 0;
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
        DBDao.getUserById(msgObj_['userId'], function(err_, rst_) {
          if (err_) {
            rstObj['info'] = 'error';
            rstObj['desc'] = 'get user info error.'
            rstObj['error'] = err_;
            callback_(rstObj);
          } else {
            if (rst_.length == 0) {
              rstObj['info'] = 'error';
              rstObj['desc'] = 'no such a userid';
              callback_(rstObj);
            } else {
              getVmsByRoleOrUser(rst_[0]['roleId'], rst_[0]['id'], function(err_, vms_) {
                if (err_) {
                  rstObj['info'] = 'error';
                  rstObj['desc'] = 'get vms for user error.';
                  rstObj['error'] = err_;
                  callback_(rstObj);
                } else {
                  rstObj['info'] = 'ok';
                  userData = {};
                  rstObj['content'] = userData;
                  userData['userId'] = rst_[0]['id'];
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

function getVmsByRoleOrUser(roleId_, userId_, callback_) {
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
              vmUserItem['userId'] = 0;
              vmUserItem['userName'] = '未分配';
              vmUserItem['userState'] = 0;
              vmUserItem['stateTime'] = new Date().getTime();
              vmUserItem['vmMap']=[];
              vmUserMap[0] = vmUserItem;
              var vmUserItem = {};
              vmUserItem['userId'] = -1;
              vmUserItem['userName'] = '回收中';
              vmUserItem['userState'] = 0;
              vmUserItem['stateTime'] = new Date().getTime();
              vmUserItem['vmMap']=[];
              vmUserMap[-1] = vmUserItem;
              for (var i = 0; i < userRst_.length; i++) {
                var vmUserItem = {};
                var userItem=userRst_[i];
                vmUserItem['userId'] = userItem['id'];
                vmUserItem['userName'] = userItem['userName'];
                vmUserItem['userState'] = userItem['state'];
                vmUserItem['stateTime'] = userItem['stateTime'];
                vmUserItem['vmMap']=[];
                vmUserMap[userItem['id']] = vmUserItem;
              }
              for (var i = 0; i < vmRst_.length; i++) {
                var vmData = {};
                var item = vmRst_[i];
                vmData['vmId'] = item['vmId'];
                vmData['userName'] = item['userName'];
                vmData['vmName'] = item['vmName'];
                vmData['ip'] = item['ip'];
                vmData['state']=item['state'];
                vmData['stateTime']=item['stateTime'];
                var userId = item['userId'];
                userId = userId == null ? 0 : userId;
                userId=item['state']==4?-1:userId;
                vmUserMap[userId]['vmMap'].push(vmData);
              }
              callback_(null, vmUserMap);
            }
          });
        }else callback_(null,[])
      }
    });
  } else { //normal user: get vms by user id
    var vmMap = [];
    DBDao.getVmsByUserId(userId_, function(err_, vmRst_) {
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
          if (err_) {
            rstObj['info'] = 'error';
            rstObj['desc'] = 'add user error.';
            rstObj['error'] = err_;
            callback_(rstObj);
          } else {
            rstObj['info'] = 'ok';
            var content={};
            content['userId']=rst_['insertId'];
            content['userName']=msgObj_['userName'];
            content['userState']=state_;
            content['stateTime']=time_;
            rstObj['content']=content;
            callback_(rstObj);
          }
        });
      }    
    }
  });
}

function addVm(msgObj_, callback_) {
  var rstObj = {};
  DBDao.addVm(msgObj_['vmId'], msgObj_['userName'], msgObj_['vmName'], msgObj_['ip'], function(err_, rst_,state_,time_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'add vm error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      rstObj['info'] = 'ok';
      var content = {};
      content['id']=rst_['insertId']
      content['vmId'] = msgObj_['vmId'];
      content['userName'] =  msgObj_['userName'];
      content['vmName'] = msgObj_['vmName'];
      content['ip'] = msgObj_['ip'];
      content['state'] = state_;
      content['stateTime'] = time_;
      rstObj['content'] = content;
      callback_(rstObj);
    }
  });
}

function addUserVm(msgObj_, callback_){
  var rstObj = {};
  DBDao.addUserVm(msgObj_['userId'],msgObj_['vmId'],function(err_, rst_,state_,time_) {
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
    }
  });
}
function removeUserVmCb(err_, rst_,state_,time_,callback_) {
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
    if(state_!=null){
      var content = {};
      content['state'] = state_;
      content['stateTime'] = time_;
      rstObj['content'] = content;
    }
    callback_(rstObj);
  }
}

function removeUserVm(msgObj_, callback_){
  if(msgObj_['state']==4){
    DBDao.deleteVm(msgObj_['vmId'],4,function(err_, rst_,state_,time_) {
      removeUserVmCb(err_,rst_,null,null,callback_);    
    });
  }else{
    DBDao.removeUserVm(msgObj_['vmId'],msgObj_['state'],msgObj_['userId'],function(err_, rst_,state_,time_) {
      removeUserVmCb(err_,rst_,state_,time_,callback_);
    });
  } 
}