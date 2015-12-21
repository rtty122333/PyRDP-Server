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

exports.authUser = function(userName, password, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.AUTHUSER, [userName, password], function(err, result) {
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
exports.getVmsByRoleId = function(roleId, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('DB-获取数据库连接异常！' + err);
      callback(err, null);
    } else {
      connection.query(SQLSTR.GETROLEVMS, roleId, function(err, result) {
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
      connection.query(SQLSTR.GETUSERVMS, userName, function(err, result) {
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
            callback(true, err);
          });
        } else {
          connection.release();
          callback(false, result);
        }
      });
    }
  });
}