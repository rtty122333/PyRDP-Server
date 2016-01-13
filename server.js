var net = require('net');
var fs = require('fs');
var DBDao = require('./DBDao');
var serverRequetHandler = require('./serverRequestHandler');
var crypto = require('crypto');
var aesKey = 'rdpServer';


function startServer() {
    var server = net.createServer(function(c) {
        console.log('server connnected');
        c.on('end', function() {
            console.log('server disconntected');
        });

        c.on('data', function(data) {
            decryData(data, function(err_, msgObj_) {
                if (err_) {
                    console.log('decry data error ' + err_);
                    return;
                } else {
                    if (isInvalid(msgObj_)) {
                        console.log('LEAVE exit');
                        return;
                    }
                    serverRequetHandler.processMsg(msgObj_, function(rstObj_) {
                        sendMsg(c, rstObj_);
                    });
                }

            });
        });
        c.on('error', function(e) {
            console.log('something goes wrong! ' + e.message);
        });
    });
    server.listen(8894, function() {
        var address = server.address();
        console.log('server bound on %j ', address);
    });
}
exports.startServer = startServer;

function sendMsg(c_, rstObj_) {
    var msg = '';
    encryData(rstObj_,function (err_,msg_) {
        if(err_){
            console.log('encry data error '+err_);
            return;
        }else{
            // console.log('reply:'+msg_)
            c_.write(msg_+'|');
        }
    });
}

function encryData(data_, callback_) {
    try {
        // var cipher = crypto.createCipher('aes-256-cbc', aesKey)
        // var crypted = cipher.update(JSON.stringify(data_), 'utf8', 'hex')
        // crypted += cipher.final('hex')
        // cipher = crypto.createCipher('aes-256-cbc', aesKey)
        // crypted = cipher.update(crypted, 'utf8', 'hex')
        // crypted += cipher.final('hex')
        // callback_(null, crypted);
        callback_(null, JSON.stringify(data_));
    } catch (e) {
        callback_(e, null);
    }

}

function decryData(data_, callback_) {
    try {
        // var decipher = crypto.createDecipher('aes-256-cbc', aesKey);
        // var dec = decipher.update(data_, 'hex', 'utf8');
        // dec += decipher.final('utf8');
        // decipher = crypto.createDecipher('aes-256-cbc', aesKey);
        // dec = decipher.update(dec, 'hex', 'utf8');
        // dec += decipher.final('utf8');
        // var msgObj = JSON.parse(dec);
        // callback_(null, msgObj);
        // console.log('request--'+data_)
        var msgObj = JSON.parse(data_);
        callback_(null, msgObj);
    } catch (e) {
        callback_(e, null);
    }

}

function isInvalid(msgObj_) {
    if (msgObj_.type === undefined || msgObj_.content === undefined) {
        console.log('invalid true');
        return true;
    } else
        return false;
}