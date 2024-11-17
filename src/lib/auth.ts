export type Role = "faculty" | "event-organizer" | "student";
export type Permission = 
  | "view:events"
  | "add:events"
  | "delete:events"
  | "update:events"
  | "view:teams"
  | "evaluate:team"
  | "register:events"
  | "create:team";


type UserPermissions = {
  [role in Role]: Permission[];
};

const userPermissions: UserPermissions = {
  "event-organizer":[
    "view:events",
    "add:events",
    "delete:events",
    "update:events"
  ],
  faculty:[
    "view:events",
    "view:teams",
    "evaluate:team"
  ],
  student:[
    "view:events",
    "register:events",
    "evaluate:team",
    "create:team"
  ],
}


export function hasPermission(role: Role, action: Permission): boolean {
  return userPermissions[role]?.includes(action) ?? false;
}
  
  