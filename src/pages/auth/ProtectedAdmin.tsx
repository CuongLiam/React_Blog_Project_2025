import React, { type ReactNode } from 'react'

export default function ProtectedAdmin({
    children
} :{
    children: ReactNode
}) {

    let isAdmin = false;


    if(isAdmin){
        return (
            <>
            {children}
            </>
        )
    }


  return (
    <div>
        ProtectedAdmin
    </div>
  )
}
