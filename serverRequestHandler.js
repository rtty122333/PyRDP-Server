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
        rstObj['user'] = userData;
        userData['userName'] = rst_[0]['userName'];
        userData['userState'] = rst_[0]['state'];
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
            rstObj['user'] = userData;
            userData['userName'] = msgObj_['userName'];
            userData['userState'] = rst_[0]['state'];
            userData['vmMap'] = vms_;
            callback_(rstObj);
          }
        });
      }
    }
  });
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
              vmUserItem['vmMap']=[];
              vmUserMap[0] = vmUserItem;
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
                vmData['state']=item['state']
                vmData['stateTime']=item['stateTime']
                var userId = item['userId'];
                userId = userId == null ? 0 : userId;
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
      }
      rstObj['vm'] = vmData;
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
      rstObj['roles'] = roleData;
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
        DBDao.addUser(msgObj_['userName'],msgObj_['password'],rst_[0]['id'],function(err_, rst_,state,time) {
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
            content['userState']=state;
            content['stateTime']=time;
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
  DBDao.addVm(msgObj_['vmId'], msgObj_['userName'], msgObj_['vmName'], msgObj_['ip'], function(err_, rst_,state,time) {
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
      content['state'] = state;
      content['stateTime'] = time;
      rstObj['content'] = content;
      callback_(rstObj);
    }
  });
}

function addUserVm(msgObj_, callback_){
  var rstObj = {};
  DBDao.addUserVm(msgObj_['userName'],msgObj_['vmId'],function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'add vm for user error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      rstObj['info'] = 'ok';
      callback_(rstObj);
    }
  });
}

function removeUserVm(msgObj_, callback_){
  var rstObj = {};
  DBDao.removeUserVm(msgObj_['vmId'],function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = 'remove vm for user error.';
      rstObj['error'] = err_;
      callback_(rstObj);
    } else {
      rstObj['info'] = 'ok';
      callback_(rstObj);
    }
  });
}