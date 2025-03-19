'use client'
import React from 'react'



function NavBar({}) {
  return (
    <div className="flex justify-between items-center w-screen h-16 px-10 border-b">
      <div className="brand">
        <h2 className='text-xl font-bold text-slate-200'>GoSpinName</h2>
      </div>
      <div className="menu flex justify-center items-center">
      </div>
    </div>
  )
}

export default NavBar