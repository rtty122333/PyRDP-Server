//add
exports.SAVEROLE="insert into role(roleName,createTime,lastModifyTime) values (?,?,?)";
exports.SAVEUSER="insert into user(userName,password,roleId,state,stateTime,createTime,lastModifyTime) values (?,?,?,?,?,?,?)";
exports.SAVEVM="insert into vm(vmId,userName,vmName,ip,state,stateTime,userId,createTime,lastModifyTime) values (?,?,?,?,?,?,?,?,?)";
exports.SAVEUSERLOG="insert into userLog(type, userId,ip,actionTime) values (?,?,?,?)";
exports.SAVEUSERCONN="insert into userConn(type, userId,vmId,ip,actionTime) values (?,?,?,?,?)";
exports.SAVEUSERVMLOG="insert into userVmLog(type, userId,userVmId,ip,actionTime) values (?,?,?,?,?)";
exports.SAVEUSERVMACTION="insert into userVmAction(type, userId,toUserId,vmId,ip,actionTime) values (?,?,?,?,?,?)";

//update
// vm
// state: 
// 	0-未分配，userId:null, stateTime:添加虚拟机的时间
// 	1-已分配，未连接，userId:vm所属的用户, stateTime:分配虚拟机的时间
// 	2-已分配，正在连接，userId:vm所属的用户, stateTime:连接虚拟机的时间
// 	3-已分配，断开连接，userId:vm所属的用户, stateTime:断开连接虚拟机的时间
//  4-取消分配，入待重新分配，userId:vm最后一次所属的用户, stateTime:取消虚拟机所属用户的时间
exports.ADDUSERVM="update vm set state=1,stateTime=?,userId=(select id from user where userName=?) where vmId=?";
exports.REMOVEUSERVM="update vm set state=4,stateTime=? where vmId=?";
exports.ADDUSERVMCONN="update vm set state=2,stateTime=? where vmId=?";
exports.REMOVEUSERVMCONN="update vm set state=3,stateTime=? where vmId=?";

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


//select
exports.GETNORMALUSERS="select * from user where roleId=2 order by id";
exports.AUTHUSER="select * from user where userName=? and password=?";
exports.AUTHUSERROLE="select * from user where userName=? and password=? and roleId =(select id from role where roleName=?)";
exports.GETUSERBYNAME="select * from user where userName=?";
exports.GETUSERBYID="select * from user where id=?";
exports.GETUSERROLE="select roleName from role,user where user.roleId=role.id and user.userName=?";
exports.GETVMSBYUSERNAME="select vm.vmId,vm.userName,vmName,ip,vm.state,vm.stateTime,vm.createTime,vm.lastModifyTime from vm,user where user.username=? and user.id=vm.userId";
exports.GETVMSBYUSERID="select vmId,userName,vmName,ip,state,stateTime,createTime,lastModifyTime from vm where userId=?";
exports.GETVM="select * from vm where vmId=?"
exports.GETALLROLES="select roleName from role";
exports.GETALLVMS="select * from vm";
exports.GETVMSFORADMIN="select * from vm order by userId"
exports.GETROLEBYUSER="select role.id,role.roleName,user.state from role,user where user.roleId=role.id and user.userName=?"
exports.GETROLEBYROLENAME="select * from role where roleName=?"