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
      rstObj['desc'] = err_;
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
        userData['userState'] = 1;
        DBDao.getVmsByRoleId(rst_[0]['roleId'], function(err_, vmRst_) {
          if (err_) {
            userData['vmState'] = err_;
            callback_(rstObj);
          } else {
            var vmMap = [];
            for (var i = 0; i < vmRst_.length; i++) {
              var vmData = {};
              var item = vmRst_[i];
              vmData['vmId'] = item['vmId'];
              vmData['userName'] = item['userName'];
              vmData['vmName'] = item['vmName'];
              vmData['ip'] = item['ip'];
              vmMap.push(vmData);
            }
            userData['vmMap'] = vmMap;
            callback_(rstObj);
          }
        });
      }
    }
  });
}

function queryUser(msgObj_, callback_) {
  var rstObj = {};
  DBDao.getVmsByUserName(msgObj_['userName'], function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = err_;
      callback_(rstObj);
    } else {
      rstObj['info'] = 'ok';
      userData = {};
      rstObj['user'] = userData;
      userData['userName'] = msgObj_['userName'];
      userData['userState'] = 1;
      var vmMap = [];
      for (var i = 0; i < rst_.length; i++) {
        var vmData = {};
        var item = rst_[i];
        vmData['vmId'] = item['vmId'];
        vmData['userName'] = item['userName'];
        vmData['vmName'] = item['vmName'];
        vmData['ip'] = item['ip'];
        vmMap.push(vmData);
      }
      userData['vmMap'] = vmMap;
      callback_(rstObj);
    }
  });
}

function queryVm(msgObj_, callback_) {
  var rstObj = {};
  DBDao.getVmByVmId(msgObj_['vmId'], function(err_, rst_) {
    if (err_) {
      rstObj['info'] = 'error';
      rstObj['desc'] = err_;
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
      rstObj['desc'] = err_;
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