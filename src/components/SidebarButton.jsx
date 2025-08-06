import { Button } from '@material-tailwind/react'
import React from 'react'
import { Link } from 'react-router-dom'

const SidebarButton = ({ children, page, activePage, route, hasDropdown = false, onClick = null, subMenu = null, activeSubMenu = null }) => {
  return (
    <>
      {hasDropdown ? <>
        <button
          onClick={onClick}
          className={`flex w-full border-none items-center p-2 rounded-lg lg:hover:bg-blue-100 group lg:hover:text-blue-600 dark:lg:hover:!text-blue-100 text-gray-500 text-xs dark:text-gray-100 lg:dark:hover:bg-blue-700  ${activePage == page ? "bg-blue-100 !text-blue-600 dark:bg-blue-700 dark:!text-blue-100" : ""
            }`}
        >
          {children}
        </button>
      </> : <>
        <Link
          to={route}
          onClick={(e) => {
            e.stopPropagation()
          }}
          className={`flex items-center p-2 rounded-lg  lg:hover:bg-blue-100 group lg:hover:text-blue-600 text-gray-500 text-xs dark:text-gray-100 lg:dark:hover:bg-blue-700 dark:lg:hover:!text-blue-100 ${activePage == page ? "bg-blue-100 !text-blue-600 dark:bg-blue-700 dark:!text-blue-100" : ""
            }
            
            ${subMenu != null && subMenu == activeSubMenu ? "bg-blue-100 !text-blue-600 dark:bg-blue-700 dark:!text-blue-100" : ""
            }
            `}
        >
          {children}
        </Link>

      </>}

    </>
  )
}

export default SidebarButton