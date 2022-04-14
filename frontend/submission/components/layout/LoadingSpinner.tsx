import {Backdrop, BackdropProps, CircularProgress} from '@mui/material'

interface LoadingSpinnerOwnProps {
    loading?: Boolean
}

type LoadingSpinnerProps = LoadingSpinnerOwnProps & Omit<BackdropProps, 'open'>

export const LoadingSpinner = ({loading, ...props}: LoadingSpinnerProps) =>
    (
        <Backdrop
            {...props}
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={!!loading}
        >
            <CircularProgress color="inherit"/>
        </Backdrop>
    )