/**
 * 使用连接池
 */
var mysql = require('mysql');
var SQLSTR = require("./SQLStr.js");
var config=require('./config')
var options = {
  'host': '127.0.0.1',
  'port': '3306',
  'user': config.sqlConfig['userName'],
  'password': config.sqlConfig['password'],
  'database': 'pyrdpserver',
  'charset': 'utf8',
  'connectionLimit': 32000,
  'supportBigNumbers': true,
  'acquireTimeout': 30000,
  'connectTimeout': 30000,
  'bigNumberStrings': true,
  'queueLimit': 0,
  'waitForConnections': true,
  'reAddAfterErrorSeconds': true
};
var pool = mysql.createPool(options);


exports.addUser = function(userName,password,roleId,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      var time=new Date().getTime();
      connection.query(SQLSTR.SAVEUSER, [userName,password,roleId,0,time,time, time], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result,0,time);
        }
      });
    }
  });
}

exports.addVm = function(vmId,userName,vmName,ip,pwd,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      var time=new Date().getTime();
      connection.query(SQLSTR.SAVEVM, [vmId,userName,vmName,ip,pwd,0,time,null,time, time], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result,0,time);
        }
      });
    }
  });
}

exports.addUserVm = function(userName,vmId,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      var time=new Date().getTime();
      connection.query(SQLSTR.ADDUSERVM, [time,userName,vmId], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result,1,time);
        }
      });
    }
  });
}

exports.removeUserVm = function(vmId,fromState,userName,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      var time=new Date().getTime();
      connection.query(SQLSTR.REMOVEUSERVM, [time,vmId,userName,fromState], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result,4,time);
        }
      });
    }
  });
}

exports.deleteVm = function(vmId,fromState,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.REMOVEVM, [vmId,fromState], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result);
        }
      });
    }
  });
}

exports.authUser = function(userName, password, roleName,callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.AUTHUSERROLE, [userName, password,roleName], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(null, result);
        }
      });
    }
  });
}

exports.userLoginState = function(userName,callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      var time=new Date().getTime();
      connection.query(SQLSTR.USERLOGIN, [time,userName], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null,1,time);
          });
        } else {
          connection.release();
          callback(null, result);
        }
      });
    }
  });
}

exports.userLogoutState = function(userName,callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.USERLOGOUT, [new Date().getTime(),userName], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(null, result);
        }
      });
    }
  });
}

exports.userConnVmState = function(vmId,callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.USERVMCONN, [new Date().getTime(),vmId], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(null, result);
        }
      });
    }
  });
}

exports.userDisConnVmState = function(vmId,callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.USERVMDISCONN, [new Date().getTime(),vmId], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(null, result);
        }
      });
    }
  });
}

exports.getVmsByUserName = function(userName, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETVMSBYUSERNAME, userName, function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(null, result);
        }
      });
    }
  });
}
exports.getVmByVmId = function(vmId, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETVM, vmId, function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(null, result);
        }
      });
    }
  });
}

exports.getRoles=function(callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETALLROLES, function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result);
        }
      });
    }
  });
}

exports.getUserByUserName=function(userName,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETUSERBYNAME, userName,function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result);
        }
      });
    }
  });
}

exports.getAllVms=function(callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETVMSFORADMIN, function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result);
        }
      });
    }
  });
}

exports.getRoleByRoleName=function(roleName,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETROLEBYROLENAME,roleName, function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result);
        }
      });
    }
  });
}

exports.addUserLog = function(type,logInfo,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.SAVEUSERLOG, [type,logInfo,new Date().getTime()], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result);
        }
      });
    }
  });
}

exports.getNormalUsers=function(callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETNORMALUSERS, function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result);
        }
      });
    }
  });
}

exports.getVmsByState=function(state,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETVMSBYSTATE,state, function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result);
        }
      });
    }
  });
}
