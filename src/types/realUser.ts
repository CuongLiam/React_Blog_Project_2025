
enum UserRole{
    USER = "USER",
    MASTER = "MASTER",
    ADMIN = "ADMIN",
}

enum UserStatus{
    ACTIVE = "ACTIVE", // cua nguoi dung
    INACTIVE = "INACTIVE", // cua nguoi dung
    BAN = "BAN" // ban by admin or master
}
/* user tính cả admin và user gộp vào ko tách ra */
export interface User{
    id: string;
    username: string;
    password: string;
    role: UserRole;

    displayName: string;
    email: string;
    avatar?: string; // avatar

    status: UserStatus;
    banReason?: string;
}