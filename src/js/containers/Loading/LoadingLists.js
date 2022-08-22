import React from 'react';
import { CircularProgress } from '@material-ui/core';

export const LoadingLists = () => {
    return  <div align="center" style={{marginTop: 30}}>
                <CircularProgress color="primary" />
            </div>
};
export default LoadingLists;