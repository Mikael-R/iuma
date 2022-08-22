import React, { Component } from 'react';

import { Header } from 'js/containers/Header/Header.js'
import { Grid, Paper, Hidden } from "@material-ui/core";
import backgroundPic from "styles/assets/CarRepair/loginBackground.jpg"

class LoginRepair extends Component {
    constructor(props, context) {
        super(props, context);

        window.scrollTo(0, 0);

        this.state = {
            cellPhone: ''
        }
    }

    render = () => {
        return (
            <>
                <Header />
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '88vh', backgroundImage: `url(${backgroundPic})`, margin: '0 auto', backgroundPosition: window.innerWidth < 768 ? 'bottom' : 'right center', backgroundSize: 'cover' }}>
                    <Grid container style={{ marginTop: 20, maxWidth: 1300 }}>
                        <Hidden smDown>
                            <Grid item sm={7}></Grid>
                        </Hidden>
                        <Grid item xs={12} sm={5} style={{ alignSelf: 'center' }}>
                            <Paper elevation={3} style={{ padding: 30, textAlign: 'center' }}>
                                {/* <img src={logoRed} alt="loogo-clubmapfre" style={{ marginBottom: 20 }} /> */}
                                <iframe src="/login-telefone" style={{ border: 'none', width: '100%', minHeight: 200 }} />
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </>
        )
    }
}

export default LoginRepair;