import React, { useEffect, createRef } from 'react';

import { Typography } from '@material-ui/core';

const CustomModal = (props) => {
    const ref = createRef();

    useEffect(() => {
        try {
            window.top.handleModalChange( ref.current.clientHeight );
        } catch(err) {}
    }, [ref]);

    return (
        <div ref={ref} style={{ paddingTop: 50, position: 'relative' }}>
            <div 
                style={{
                    width: '100%',
                    minHeight: 50,
                    padding: '15px 50px 15px 15px',
                    backgroundColor: '#CC0000',
                    boxSizing: 'border-box',
                    top: 0,
                    left: 0,
                    position: 'fixed',
                    zIndex: 999
                }}
            >
                <Typography align='left' style={{ lineHeight: '20px', fontSize: 20, color: '#fff' }}>
                    {props.title ? props.title : 'Acesso ao Club MAPFRE'}
                </Typography>
            </div>
            <div className='container' style={{ width: props.width ? props.width : 500, padding: 15, textAlign: 'center' }}>
                {props.children}
            </div>
        </div>
    )
}

export default CustomModal;