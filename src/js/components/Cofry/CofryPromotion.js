import React, { Component } from "react";
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/styles';

import { getLastUserInfo, getUrlVariables } from 'js/library/utils/helpers';
import { getStorePlacesItem_v2 } from "js/library/utils/API/getStorePlacesItem_v2";
import { configJson } from 'js/library/utils/firebaseUtils';

import { Grid, Card, CardMedia, Paper, Button, Link, Typography, TextField } from '@material-ui/core';

const styles = theme => ({
    root: {
    },
    
    input: {
        fontSize: 30,
        padding: 5,
        cursor: 'pointer',
        textAlign: 'center',
    },
    tabItem: {
        fontSize: '25px',
        fontWeight: 700,
        padding: '5px 45px 0px 45px',
        borderRadius: '25px 25px 0px 0px'
    }
});

// getStorePlaces

class CofryPromotion extends Component {
    constructor(props) {
        super(props);
        const getVars = getUrlVariables();
        this.state = {
            userInfo: getLastUserInfo(),
            promo: {},
        };

        getStorePlacesItem_v2(getVars.idPromo, null, this.state.userInfo.uId).then((dataReceived) => {
            this.setState({ promo: dataReceived.storeItem });
        });

    }

    copyCoupon = () => {
        var copyText = document.getElementById("cofry-coupon");

        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");

        alert("Seu cupom já foi copiado, siga as regras de uso na descrição para utilizá-lo");
    }

    render() {
        const { classes } = this.props;
        const isSmall = (window.innerWidth < 768) ? true : false;

        // if (window.pathname !== null && this.props.success) {
        //     return <Redirect to={window.pathname} />;
        // } else {
        return (
            <div style={{ minHeight: '88vh', display: 'flex', justifyContent: 'center' }}>
                <Grid container style={{ maxWidth: 1300 }}>
                    <Grid item xs={12}>
                        <div style={{ width: '100%', marginBottom: '20px' }}>
                            <Link href={'/cofryMapfre'}>Voltar para Cofry</Link>
                        </div>
                        <Grid container spacing={isSmall ? 0 : 10}>
                            <Grid item sm={4} xs={12}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        component="img"
                                        alt={this.state.promo.id}
                                        image={configJson.STORAGE_URL + encodeURIComponent('promocao/' + this.state.promo.thumbnail) + '?alt=media'}
                                        title={this.state.promo.establishmentName}
                                    />
                                </Card>
                            </Grid>
                            <Grid item sm={8} xs={12}>
                                <Typography variant="h4" color="secondary" style={{ fontSize: isSmall ? 30 : 35, marginBottom: 60, fontWeight: 700, marginTop: isSmall ? 20 : 0 }}>
                                    {this.state.promo.establishmentName}
                                </Typography>
                                <Paper elevation={3} style={{ padding: 30 }}>
                                    <Grid container style={{ marginBottom: 25 }}>
                                        <Grid item xs={6}>
                                            <Typography id="cashback-value" variant="h4" color="secondary" style={{ fontSize: isSmall ? 30 : 35, fontWeight: 700, color: '#cc0000' }}>
                                                {this.state.promo.title}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} style={{ textAlign: 'right' }}>
                                            <Button id="button-promotion" variant="contained" color="primary" href={'https://'+this.state.promo.url}>
                                                VISITAR LOJA
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', placeContent: 'center', margin: '20px 0px' }}>
                                            <Typography id="cashback-value" variant="h6" color="secondary" style={{ fontWeight: 700, marginRight: 20 }}>
                                                Cupom:
                                            </Typography>
                                            <TextField
                                                id="cofry-coupon"
                                                value={this.state.promo.checkoutCode}
                                                variant="outlined"
                                                InputProps={{
                                                    classes: {
                                                        input: classes.input,
                                                    },
                                                }}
                                                onClick={() => this.copyCoupon()} />
                                        </Grid>
                                    </Grid>
                                    {/* <Grid item xs={12} style={{paddingLeft: 25}}>
                                        <Button id="about-promo" className={classes.tabItem} onClick={this.handleChange('about')} style={ this.state.about ? {backgroundColor: '#cc0000', color: '#fff'} : {backgroundColor: '#fff', color: '#bbb'} }>Sobre</Button>
                                        <Button id="rules-promo" className={classes.tabItem} onClick={this.handleChange('rules')} style={ this.state.about ? {backgroundColor: '#fff', color: '#bbb'} : {backgroundColor: '#cc0000', color: '#fff'} }>Regras</Button>
                                    </Grid> */}
                                    <Grid item xs={12} style={{ padding: 15, border: '2px solid #bbb', borderRadius: 20, minHeight: 300, maxHeight: 300, overflow: 'auto' }}>
                                        {
                                            this.state.promo.description
                                        }
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}


CofryPromotion.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CofryPromotion);