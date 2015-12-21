//add
exports.SAVEROLE="insert into role(roleName,createTime,lastModifyTime) values (?,?,?)";
exports.SAVEUSER="insert into user(userName,password,roleId,createTime,lastModifyTime) values (?,?,?,?,?)";
exports.SAVEVM="insert into vm(vmId,userName,vmName,ip,createTime,lastModifyTime) values (?,?,?,?,?,?)";
exports.ADDVMFORROLE="insert into roleVm(roleId,roleId,createTime,lastModifyTime) values (?,?,?,?)";

//remove
exports.REMOVEUSER="delete from user where userName=?";
exports.REMOVEROLE="delete from role where roleName=?";
exports.REMOVEVMBYID="delete from vm where vmId=?";
//exports.DELETEVMFORROLE="delete from roleVm where vmId=? and roleId=(select roleId from user where userName=?)";
exports.DELETEVMFORROLE="delete from roleVm where vmId=? and roleId=(select id from role where roleName=?)";

//select
exports.AUTHUSER="select * from user where userName=? and password=?";
exports.GETUSERROLE="select roleName from role,user where user.roleId=role.id and user.userName=?";
exports.GETUSERVMS="select vm.vmId,vmName,ip,vm.createTime,vm.lastModifyTime from vm,user,roleVm where user.username=? and user.roleId=roleVm.roleId and vm.id=roleVm.vmId";
exports.GETROLEVMS="select vm.vmId,vmName,ip,vm.createTime,vm.lastModifyTime from vm,roleVm where roleVm.roleId=? and roleVm.roleId=vm.id";
exports.GETVM="select * from vm where vmId=?"