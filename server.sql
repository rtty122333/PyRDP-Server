drop database if exists pyrdpserver;
create database pyrdpserver;

CREATE TABLE pyrdpserver.role(id  INT PRIMARY KEY auto_increment, roleName varchar(32), createTime varchar(32), lastModifyTime varchar(32),unique(roleName));
INSERT INTO pyrdpserver.role(roleName ,createTime, lastModifyTime) VALUES('admin', '1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.role(roleName ,createTime, lastModifyTime) VALUES('user', '1403507414000.0','1403507414000.0');


CREATE TABLE pyrdpserver.user(id INT PRIMARY KEY auto_increment, userName varchar(32) , password varchar(32),roleId INT, createTime varchar(32), lastModifyTime varchar(32),unique(userName));
INSERT INTO pyrdpserver.user ( userName  , password ,roleId,createTime , lastModifyTime )VALUES('admin','111',1,'1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.user ( userName  , password ,roleId,createTime , lastModifyTime )VALUES('user','111',2,'1403507414000.0','1403507414000.0');


CREATE TABLE pyrdpserver.vm(id  INT PRIMARY KEY auto_increment, vmId varchar(32), userName varchar(32) ,vmName varchar(32),ip varchar(32), createTime varchar(32), lastModifyTime varchar(32),unique(vmId));
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,createTime , lastModifyTime) VALUES('1', 'vm1','vm1','192.168.160.18','1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.vm(vmId ,userName,vmName, ip,createTime , lastModifyTime) VALUES('2', 'vm2','vm2','192.168.160.66','1403507414000.0','1403507414000.0');


CREATE TABLE pyrdpserver.roleVm(id  INT PRIMARY KEY auto_increment, roleId INT, vmId INT, createTime varchar(32), lastModifyTime varchar(32));
INSERT INTO pyrdpserver.roleVm(roleId ,vmId, createTime , lastModifyTime) VALUES(1, 1,'1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.roleVm(roleId ,vmId, createTime , lastModifyTime) VALUES(1, 2,'1403507414000.0','1403507414000.0');
INSERT INTO pyrdpserver.roleVm(roleId ,vmId, createTime , lastModifyTime) VALUES(2, 1,'1403507414000.0','1403507414000.0');

alter table pyrdpserver.user add index(userName);
alter table pyrdpserver.roleVm add index(roleId);
alter table pyrdpserver.roleVm add index(vmId);
ALTER TABLE pyrdpserver.user ADD CONSTRAINT fk_user_role
FOREIGN KEY (roleId) 
REFERENCES pyrdpserver.role(id)
ON UPDATE CASCADE;

ALTER TABLE pyrdpserver.roleVm ADD CONSTRAINT fk_roleVm_role
FOREIGN KEY (roleId) 
REFERENCES pyrdpserver.role(id)
ON UPDATE CASCADE;

ALTER TABLE pyrdpserver.roleVm ADD CONSTRAINT fk_roleVm_vm
FOREIGN KEY (vmId) 
REFERENCES pyrdpserver.vm(id)
ON UPDATE CASCADE;
