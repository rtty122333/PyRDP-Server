drop database if exists pyrdpserver;
create database pyrdpserver default character set utf8;

#id:1,roleName:管理员；id:2,roleName:普通用户
CREATE TABLE pyrdpserver.role(id  INT PRIMARY KEY auto_increment, roleName varchar(32), createTime varchar(32), lastModifyTime varchar(32),unique(roleName)) default charset=utf8;
INSERT INTO pyrdpserver.role(roleName ,createTime, lastModifyTime) VALUES('admin', '1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.role(roleName ,createTime, lastModifyTime) VALUES('user', '1403507414000.0','1403507414000.0');


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
	##4-取消分配，入待回收站等待删除，userId:vm最后一次所属的用户, stateTime:取消虚拟机所属用户的时间
CREATE TABLE pyrdpserver.vm(id  INT PRIMARY KEY auto_increment, vmId varchar(32), userName varchar(32) ,vmName varchar(32),ip varchar(32), password varchar(32),state INT, stateTime varchar(32),ownerName varchar(32),createTime varchar(32), lastModifyTime varchar(32),unique(vmId)) default charset=utf8;
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,password,state,stateTime,ownerName,createTime , lastModifyTime) VALUES('1', 'fyf','vm1','100.100.100.108','134650',1,1403507414000.0,'user','1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,password,state,stateTime,ownerName,createTime , lastModifyTime) VALUES('2', 'fyf','vm2','192.168.1.107','134650',1,1403507414000.0,'user','1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,password,state,stateTime,ownerName,createTime , lastModifyTime) VALUES('3', 'fyf','vm3','192.168.1.107','134650',0,1403507414000.0,NULL,'1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,password,state,stateTime,ownerName,createTime , lastModifyTime) VALUES('4', 'fyf','vm4','192.168.1.107','134650',1,1403507414000.0,'user2','1403507414000.0','1403507414000.0');


alter table pyrdpserver.role add index(roleName);
alter table pyrdpserver.user add index(userName);
alter table pyrdpserver.vm add index(vmId);
alter table pyrdpserver.vm add index(userName);
ALTER TABLE pyrdpserver.user ADD CONSTRAINT fk_user_role
FOREIGN KEY (roleId) 
REFERENCES pyrdpserver.role(id)
ON UPDATE CASCADE;

ALTER TABLE pyrdpserver.vm ADD CONSTRAINT fk_vm_user
FOREIGN KEY (ownerName) 
REFERENCES pyrdpserver.user(userName)
ON UPDATE CASCADE;

CREATE TABLE pyrdpserver.userLog(id  INT PRIMARY KEY auto_increment, type INT, logInfo varchar(256) ,actionTime varchar(32)) default charset=utf8;