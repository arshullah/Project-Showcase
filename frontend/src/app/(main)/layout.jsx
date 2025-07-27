import React from 'react'
import { Navbar } from './Navbar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />
      <main className="relative">
        {children}
      </main>
    </div>
  )
}

export default Layout