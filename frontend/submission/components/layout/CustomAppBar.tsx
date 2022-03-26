import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import {ReactNode} from 'react'


type AppBarProps = {
  children?: ReactNode
  status?: ReactNode
}

export const CustomAppBar = ({status, children}: AppBarProps) => (
  <AppBar position="static">
    <Toolbar variant={'dense'}>
      <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
        &nbsp;
        {status}
      </Typography>
      {children}
    </Toolbar>
  </AppBar>
)
