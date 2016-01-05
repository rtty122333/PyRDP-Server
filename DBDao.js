/**
 * 使用连接池
 */
var mysql = require('mysql');
var SQLSTR = require("./SQLStr.js");
var options = {
  'host': '127.0.0.1',
  'port': '3306',
  'user': 'root',
  'password': 'root',
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
      connection.query(SQLSTR.SAVEUSER, [userName,password,roleId,0,new Date().getTime(),new Date().getTime(), new Date().getTime()], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result,0,new Date().getTime());
        }
      });
    }
  });
}

exports.addVm = function(vmId,userName,vmName,ip,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.SAVEVM, [vmId,userName,vmName,ip,0,new Date().getTime(),null,new Date().getTime(), new Date().getTime()], function(err, result) {
        if (err) {
          connection.rollback(function() {
            console.log('DB-获取数据异常！' + err);
            connection.release();
            callback(err, null);
          });
        } else {
          connection.release();
          callback(false, result,0,new Date().getTime());
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
      connection.query(SQLSTR.ADDUSERVM, [new Date().getTime(),userName,vmId], function(err, result) {
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

exports.removeUserVm = function(vmId,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.REMOVEUSERVM, [new Date().getTime(),vmId], function(err, result) {
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

exports.getUserById = function(userId, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETUSERBYID, userId, function(err, result) {
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

exports.getVmsByUserId = function(userId, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETVMSBYUSERID, userId, function(err, result) {
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
exports.saveRole = function(roleName, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.SAVEROLE, [roleName, new Date().getTime(), new Date().getTime()], function(err, result) {
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


exports.getRoleByUserName=function(userName,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETROLEBYUSER, userName,function(err, result) {
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

exports.addUserLog = function(type,userId,ip,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.SAVEUSERLOG, [type,userId,ip,new Date().getTime()], function(err, result) {
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

exports.addUserConn = function(type, userId,vmId,ip,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.SAVEUSERCONN, [type,userId,vmId,ip,new Date().getTime()], function(err, result) {
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

exports.addUserVmLog = function(type, userId,userVmId,ip,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.SAVEUSERVMLOG, [type, userId,userVmId,ip,new Date().getTime()], function(err, result) {
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

exports.addUserVmAction = function(type, userId,toUserId,vmId,ip,callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.SAVEUSERVMACTION, [type, userId,toUserId,vmId,ip,new Date().getTime()], function(err, result) {
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