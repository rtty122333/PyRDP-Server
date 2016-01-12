//add
exports.SAVEROLE="insert into role(roleName,createTime,lastModifyTime) values (?,?,?)";
exports.SAVEUSER="insert into user(userName,password,roleId,state,stateTime,createTime,lastModifyTime) values (?,?,?,?,?,?,?)";
exports.SAVEVM="insert into vm(vmId,userName,vmName,ip,password,state,stateTime,ownerName,createTime,lastModifyTime) values (?,?,?,?,?,?,?,?,?,?)";
exports.SAVEUSERLOG="insert into userLog(type,logInfo,actionTime) values (?,?,?)";
//update
// vm
// state: 
// 	0-未分配，ownerName:null, stateTime:添加虚拟机的时间
// 	1-已分配，未连接，ownerName:vm所属的用户, stateTime:分配虚拟机的时间
// 	2-已分配，正在连接，ownerName:vm所属的用户, stateTime:连接虚拟机的时间
// 	3-已分配，断开连接，ownerName:vm所属的用户, stateTime:断开连接虚拟机的时间
//  4-取消分配，入待重新分配，ownerName:vm最后一次所属的用户, stateTime:取消虚拟机所属用户的时间
exports.ADDUSERVM="update vm set state=1,stateTime=?,ownerName=? where vmId=?";
exports.REMOVEUSERVM="update vm set state=4,stateTime=? where vmId=? and ownerName=? and state=?";
exports.USERVMCONN="update vm set state=2,stateTime=? where vmId=?";
exports.USERVMDISCONN="update vm set state=3,stateTime=? where vmId=?";
exports.RECOVERYVM="update vm set state=0,stateTime=?,ownerName=null where vmId=? and state=?";

//user
// state:
//	0-注册，stateTime:注册时间
//  1-在线，stateTime:上线时间
//  2-下线，stateTime:下线时间
exports.USERLOGIN="update user set state=1,stateTime=? where userName=?";
exports.USERLOGOUT="update user set state=2,stateTime=? where userName=?";

//remove
exports.REMOVEUSER="delete from user where userName=?";
exports.REMOVEROLE="delete from role where roleName=?";
exports.REMOVEVMBYID="delete from vm where vmId=?";
exports.REMOVEVM="delete from vm where vmId=? and state=?"


//select
exports.GETNORMALUSERS="select * from user where roleId=2 order by id";
exports.AUTHUSERROLE="select * from user where userName=? and password=? and roleId =(select id from role where roleName=?)";
exports.GETUSERBYNAME="select * from user where userName=?";
exports.GETVMSBYUSERNAME="select * from vm where ownerName=?";
exports.GETVM="select * from vm where vmId=?"
exports.GETALLROLES="select roleName from role";
exports.GETVMSFORADMIN="select * from vm order by ownerName"
exports.GETROLEBYROLENAME="select * from role where roleName=?"
exports.GETVMSBYSTATE="select * from vm where state=?"