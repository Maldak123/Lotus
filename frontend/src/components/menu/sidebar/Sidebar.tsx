import React from 'react'
import SidebarHeader from './SidebarHeader'
import FilesUploaded from './files/FilesUploaded'

const Sidebar = () => {
  return (
    <div className='flex flex-col gap-4 h-full'>
      <SidebarHeader />

      <FilesUploaded />
    </div>
  )
}

export default Sidebar