import {SvgIconComponent} from '@mui/icons-material'
import {Box, Paper, Typography} from '@mui/material'
import {grey} from '@mui/material/colors'
import React, { FunctionComponent } from 'react'

interface OwnProps {
    title: string,
    description: string,
    children: React.ReactChild | React.ReactChildren
    icon: SvgIconComponent
    color?: string
}

type Props = OwnProps;

const AlertBox: FunctionComponent<Props> = ({icon: Icon, title, description,  children,color}) => {

  return <Box
        style={{minHeight: '50vh'}}
        display='flex'
        flexDirection='column'
        alignContent={'space-around'}
        justifyContent={'center'}
    >
        <Paper elevation={3} sx={{backgroundColor: grey[100]}}>
            <Box display={'flex'} flexDirection={'row'} justifyContent='center'>
                <Box textAlign='center'
                     sx={() => ({backgroundColor: color, width: '100%', padding: '1em'})}>
                    <Icon  sx={{fontSize: '4rem', color: 'white'}} />
                </Box>
            </Box>
            <Box textAlign='center' sx={{padding: '1em'}}>
                <Typography variant='h4'>{title}</Typography>
                <Typography variant='body1'>{description}</Typography>
            </Box>
            <Box textAlign='center' sx={{padding: '1em'}}>
                {children}
            </Box>

        </Paper>
    </Box>
}

export default AlertBox
