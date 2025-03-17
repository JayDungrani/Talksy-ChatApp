import React from 'react'
import CircularProgress from '@mui/joy/CircularProgress';

const Loading = ({ showLoading }) => {
    return (
        <>{showLoading &&
            <div className='absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/20 z-10'>
                <CircularProgress size='lg'/>
            </div>
        }
        </>
    )
}

export default Loading