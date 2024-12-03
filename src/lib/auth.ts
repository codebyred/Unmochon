import { User } from "@clerk/nextjs/server";

export type Role = "faculty" | "event-organizer" | "student" | "other";
export type Permission = 
  | "view:events"
  | "add:events"
  | "delete:events"
  | "update:events"
  | "view:allteams"
  | "view:ownteams"
  | "evaluate:team"
  | "register:events"
  | "create:team"
  | "view:evaluationboard"



type UserPermissions = {
  [role in Role]: Permission[];
};

const userPermissions: UserPermissions = {
  "event-organizer":[
    "view:events",
    "add:events",
    "delete:events",
    "update:events",
    "view:allteams",
    "view:evaluationboard"
  ],
  faculty:[
    "view:events",
    "view:allteams",
    "evaluate:team"
  ],
  student:[
    "view:events",
    "register:events",
    "view:ownteams",
    "create:team"
  ],
  other:[]
}


export function hasPermission(user: User, action: Permission): boolean {


  let role: Role = "other";
  if(isStudent(user)){
    role = "student";
  }
  if(isFaculty(user)){
    role = "faculty"
  }
  if(isEventOrganizer(user)) {
    role = "event-organizer"
  }

  return userPermissions[role]?.includes(action) ?? false;
}
  
export function isStudent(user: User): boolean {
  const students = ["abdul@gmail.com", "mredoan191127@bscse.uiu.ac.bd"];
  return students.includes(user.emailAddresses.at(0)?.emailAddress as string)
}

export function isFaculty(user: User): boolean {
  const faculties = ["nazmulhaqueredoan@gmail.com"];
  return faculties.includes(user.emailAddresses.at(0)?.emailAddress as string);
}

export function isEventOrganizer(user: User): boolean {
  const eventOrganizer = ["nazmulhaqueredoan@gmail.com"];
  return eventOrganizer.includes(user.emailAddresses.at(0)?.emailAddress as string);
}
  