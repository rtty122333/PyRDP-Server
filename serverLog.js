var http = require('http'),
  logConfig = require('./config').logConfig;

function postLog(msg, options) {
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      // console.log('BODY: ' + chunk);
    });
  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  req.write(msg);
  req.end();
}

function initData() {
  var data = {
    'method': "requestInsertDB",
    'param': {
      // 'subject': 'user',
      // 'tenant_name': "user",
      "level": "info",
      // "operation": "login",
      "source": "thinclient",
      "type_": "user",
      "object_": "test",
      "result": "access",
      // "client_ip": "192.168.1.30(7c:e9:d3:bd:31:f3)"
    }
  }
  var options = {
    hostname: logConfig.IP,
    port: logConfig.PORT,
    path: '/' + logConfig.logObj,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': 0
    }
  };
  return [data, options];
}

function sendUserLogLog(msgObj, action) {
  var msgOptions = initData();
  var msg = msgOptions[0];
  var options = msgOptions[1];
  msg['param']['subject'] = msgObj['userName'];
  msg['param']['tenant_name'] = msgObj['role'];
  msg['param']['operation'] = action;
  msg['param']['client_ip'] = msgObj['ip'] + '(' + msgObj['mac']+')';
  options['headers']['Content-Length'] = JSON.stringify(msg).length;
  postLog(JSON.stringify(msg), options);
}
exports.sendUserLogLog = sendUserLogLog;

function sendUserConnLog(msgObj, action) {
  var msgOptions = initData();
  var msg = msgOptions[0];
  var options = msgOptions[1];
  msg['param']['subject'] = msgObj['userName'];
  msg['param']['tenant_name'] = msgObj['vmId'] + '(' + msgObj['vmName']+')';
  msg['param']['operation'] = action;
  msg['param']['client_ip'] = msgObj['ip'] + '(' + msgObj['mac']+')';
  options['headers']['Content-Length'] = JSON.stringify(msg).length;
  postLog(JSON.stringify(msg), options);
}
exports.sendUserConnLog = sendUserConnLog;