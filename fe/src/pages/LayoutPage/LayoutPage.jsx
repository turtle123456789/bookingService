import React from 'react'
import { FooterComponent, HeaderCoponent } from '../../components'
import { Outlet } from 'react-router-dom'

const LayoutPage = () => {
  return (
    <div>
        <HeaderCoponent/>
        <main>
            <Outlet/>
        </main>
        <FooterComponent/>
    </div>
  )
}

export default LayoutPage