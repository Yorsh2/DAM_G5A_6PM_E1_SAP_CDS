using {sec.AuditDetail} from './common';

namespace sec;

entity Roles {
    key ROLEID      : String(50);
        ROLENAME    : String(100);
        DESCRIPTION : String(200);
        
        DETAIL_ROW  : Composition of one AuditDetail;
}

entity RolePrivileges {
    key ROLEID     : Association to Roles;
    key PROCESSID  : String(50);
        PRIVILEGEID: String(50); // Association se define donde esté Privileges
}

entity UserRoles {
    key USERID : String(20);
    key ROLEID : Association to Roles;
}