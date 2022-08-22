import React from 'react';
import loading from "styles/assets/loading/loading_triibo.gif";

export const Loading = () => {
    return  <div align="center" style={{width: '100vw', height: '100vh', display: 'block', margin: 'auto', backgroundColor: '#4b4b4b'}}>
                <img alt = "Thumb do Estabelecimento" width="350px" style={{paddingTop: '25vh'}} src = { loading }/>
            </div>
};
export default Loading;