import { Breadcrumbs, Link, Typography } from '@mui/material'
import React from 'react'

const MyBreadcrums = ({ items }) => {
  return (
    <Breadcrumbs separator="›">
        {
            items.map((item, index) => (
                item.active ? 
                    <Typography 
                        key={index} 
                        sx={{ fontSize: 13 }}
                        className='text-primary'>
                            {item.label}
                    </Typography> 
                    : 
                    <Link 
                        key={index} 
                        href={item.path} 
                        sx={{ textDecoration: 'none', fontSize: 13 }} 
                        color="text.primary">
                            {item.label}
                    </Link>
            ))
        }
    </Breadcrumbs>
  )
}

export default MyBreadcrums
