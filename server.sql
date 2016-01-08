drop database if exists pyrdpserver;
create database pyrdpserver default character set utf8;

#id:1,roleName:管理员；id:2,roleName:普通用户
CREATE TABLE pyrdpserver.role(id  INT PRIMARY KEY auto_increment, roleName varchar(32), createTime varchar(32), lastModifyTime varchar(32),unique(roleName)) default charset=utf8;
INSERT INTO pyrdpserver.role(roleName ,createTime, lastModifyTime) VALUES('管理员', '1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.role(roleName ,createTime, lastModifyTime) VALUES('普通用户', '1403507414000.0','1403507414000.0');


##state: 0-注册，1-在线，2-不在线; stateTime:对应上下线时间
CREATE TABLE pyrdpserver.user(id INT PRIMARY KEY auto_increment, userName varchar(32) , password varchar(32),roleId INT, state INT, stateTime varchar(32), createTime varchar(32), lastModifyTime varchar(32),unique(userName)) default charset=utf8;
INSERT INTO pyrdpserver.user ( userName, password ,roleId,state,stateTime,createTime , lastModifyTime )VALUES('admin','111',1,0,'1403507414000.0','1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.user ( userName, password ,roleId,state,stateTime,createTime , lastModifyTime )VALUES('user','111',2,0,'1403507414000.0','1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.user ( userName, password ,roleId,state,stateTime,createTime , lastModifyTime )VALUES('user2','111',2,0,'1403507414000.0','1403507414000.0','1403507414000.0');

##state: 
	##0-未分配，userId:null, stateTime:添加虚拟机的时间
	##1-已分配，未连接，userId:vm所属的用户, stateTime:分配虚拟机的时间
	##2-已分配，正在连接，userId:vm所属的用户, stateTime:连接虚拟机的时间
	##3-已分配，断开连接，userId:vm所属的用户, stateTime:断开连接虚拟机的时间
	##4-取消分配，入待重新分配，userId:vm最后一次所属的用户, stateTime:取消虚拟机所属用户的时间
CREATE TABLE pyrdpserver.vm(id  INT PRIMARY KEY auto_increment, vmId varchar(32), userName varchar(32) ,vmName varchar(32),ip varchar(32), state INT, stateTime varchar(32),userId INT,createTime varchar(32), lastModifyTime varchar(32),unique(vmId)) default charset=utf8;
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,state,stateTime,userId,createTime , lastModifyTime) VALUES('1', 'vm1','vm1','192.168.1.107',1,1403507414000.0,2,'1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,state,stateTime,userId,createTime , lastModifyTime) VALUES('2', 'vm2','vm2','192.168.1.107',1,1403507414000.0,2,'1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,state,stateTime,userId,createTime , lastModifyTime) VALUES('3', 'vm3','vm3','192.168.1.107',0,1403507414000.0,NULL,'1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,state,stateTime,userId,createTime , lastModifyTime) VALUES('4', 'vm4','vm4','192.168.1.107',1,1403507414000.0,3,'1403507414000.0','1403507414000.0');


alter table pyrdpserver.role add index(roleName);
alter table pyrdpserver.user add index(userName);
alter table pyrdpserver.vm add index(vmId);
alter table pyrdpserver.vm add index(userId);
ALTER TABLE pyrdpserver.user ADD CONSTRAINT fk_user_role
FOREIGN KEY (roleId) 
REFERENCES pyrdpserver.role(id)
ON UPDATE CASCADE;

ALTER TABLE pyrdpserver.vm ADD CONSTRAINT fk_vm_user
FOREIGN KEY (userId) 
REFERENCES pyrdpserver.user(id)
ON UPDATE CASCADE;

CREATE TABLE pyrdpserver.actionType(id  INT PRIMARY KEY auto_increment, type INT, actionName varchar(32) ) default charset=utf8;
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(1, '登录');
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(2, '登出');
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(3, '连接');
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(4, '断开');
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(5, '添加虚拟机');
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(6, '删除虚拟机');
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(7, '添加用户');
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(8, '删除用户');
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(9, '添加用户虚拟机');
INSERT INTO pyrdpserver.actionType(type, actionName) VALUES(10, '删除用户虚拟机');

#actionId:1/2
CREATE TABLE pyrdpserver.userLog(id  INT PRIMARY KEY auto_increment, type INT, userId INT ,ip varchar(32),actionTime varchar(32)) default charset=utf8;
INSERT INTO pyrdpserver.userLog(type, userId,ip,actionTime) VALUES(1, 1,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userLog(type, userId,ip,actionTime) VALUES(1, 2,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userLog(type, userId,ip,actionTime) VALUES(2, 2,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userLog(type, userId,ip,actionTime) VALUES(1, 2,'192.168.1.101','1403507414000.0');

#actionId:3/4
CREATE TABLE pyrdpserver.userConn(id  INT PRIMARY KEY auto_increment, type INT, userId INT ,vmId INT ,ip varchar(32),actionTime varchar(32)) default charset=utf8;
INSERT INTO pyrdpserver.userConn(type, userId,vmId,ip,actionTime) VALUES(3, 1,1,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userConn(type, userId,vmId,ip,actionTime) VALUES(3, 2,1,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userConn(type, userId,vmId,ip,actionTime) VALUES(4, 1,1,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userConn(type, userId,vmId,ip,actionTime) VALUES(4, 2,1,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userConn(type, userId,vmId,ip,actionTime) VALUES(4, 2,2,'192.168.1.101','1403507414000.0');

#actionId:5/6/7/8
CREATE TABLE pyrdpserver.userVmLog(id  INT PRIMARY KEY auto_increment, type INT, userId INT ,userVmId INT,ip varchar(32),actionTime varchar(32)) default charset=utf8;
INSERT INTO pyrdpserver.userVmLog(type, userId,userVmId,ip,actionTime) VALUES(5, 1,1,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userVmLog(type, userId,userVmId,ip,actionTime) VALUES(5, 1,2,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userVmLog(type, userId,userVmId,ip,actionTime) VALUES(5, 1,3,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userVmLog(type, userId,userVmId,ip,actionTime) VALUES(5, 1,4,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userVmLog(type, userId,userVmId,ip,actionTime) VALUES(7, 1,2,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userVmLog(type, userId,userVmId,ip,actionTime) VALUES(7, 1,3,'192.168.1.101','1403507414000.0');

#actionId:9/10
CREATE TABLE pyrdpserver.userVmAction(id  INT PRIMARY KEY auto_increment, type INT, userId INT ,toUserId INT,vmId INT ,ip varchar(32),actionTime varchar(32)) default charset=utf8;
INSERT INTO pyrdpserver.userVmAction(type, userId,toUserId,vmId,ip,actionTime) VALUES(9, 1,2,1,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userVmAction(type, userId,toUserId,vmId,ip,actionTime) VALUES(9, 1,2,2,'192.168.1.101','1403507414000.0');
INSERT INTO pyrdpserver.userVmAction(type, userId,toUserId,vmId,ip,actionTime) VALUES(9, 1,3,4,'192.168.1.101','1403507414000.0');