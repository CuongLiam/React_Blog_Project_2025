import React from 'react'
import { UserRole, UserStatus, type User } from './realUser'

export default function test() {
    let user: User = {
        id: "1",
        username: "Liam Josh",
        password: "123",
        role: UserRole.MASTER,

        displayName: "Liam J",
        email: "liam123@gmail.com",
        avatar: "",

        status: UserStatus.ACTIVE,
        banReason: "",
    }

  return (
    <div>test</div>
  )
}
