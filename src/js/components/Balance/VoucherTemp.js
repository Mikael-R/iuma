import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Paper, Typography, Grid, Button, /*List, ListItem, ListItemSecondaryAction, ListItemText, IconButton,*/ CircularProgress } from "@material-ui/core";
import { getLastUserInfo, /*formatDate*/ } from 'js/library/utils/helpers';
import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';
import { downloadImage } from 'js/library/services/StorageManager.js';
import getAccessToken from "../../library/utils/API/getAccessToken_v1";
import consumeCoupon from "js/library/utils/API/consumeCoupon";


class VoucherTemp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            promo: {},
            thumbnail: placeholderItem,
            vouchers: {},
            promoCode: '',
            promoValid: false,
            loading: false,
            logoMapfre: 'https://club.mapfre.com.br/wp-content/uploads/2019/02/club-mapfre-1.png'
        };
    };

    componentDidMount = () => {
        if (localStorage.getItem('firstAccess')) {
            let userInfo = getLastUserInfo();
            getAccessToken(userInfo.uId, 2).then(token => {
                consumeCoupon(token).then(result => {
                    if (result.success !== undefined) {
                        this.setState({ promoValid: true, loading: false })
                        Object.keys(result.vouchers).map(voucher => {
                            this.setState({ promoCode: voucher })
                            return null;
                        });
                    } else {
                        return this.setState({ loading: false })
                    }
                });
            })
            localStorage.removeItem('firstAccess');
        }
    }

    retornaVoucher = () => {
        return <Grid container style={{ paddingBottom: '20px' }} className="wallet-container background-voucher" >
            <Grid item md={2} sm={1} xs={false}></Grid>

            <Grid item md={8} sm={10} xs={12}>
                <Paper>
                    {/* <Button style={{ cursor: 'default', backgroundColor: '#CB0100' }} disabled fullWidth={true} variant="contained"> */}
                    {/* <span style={{ color: 'white', paddingTop: '5px', paddingBottom: '5px' }} ><Typography variant="h6"><span className="white-font">{this.state.promo.state !== 'finished' && this.state.promo.status !== 'consumido' ? 'Cupom Ativo' : 'Cupom inativo'}</span></Typography></span> */}
                    {/* </Button> */}

                    <div align="center" style={{ paddingTop: '20px' }}>
                        <img width="90%" className="img-radius" src={this.state.thumbnail} onLoad={() => this.downloadThumb()} alt="carteira" />

                        <div style={{ padding: '15px' }}>
                            {/* <Typography variant="subtitle2" color="secondary">{this.state.promo.kind}</Typography> */}

                            <Typography style={{ fontWeight: 'bold' }} variant="h6" color="secondary">Vale 1 pizza Domino's</Typography>

                            <Typography variant="subtitle2" color="secondary">Parabéns, você ganhou uma pizza Domino's!</Typography>

                            <Typography style={{ fontWeight: 'bold', paddingTop: '25px' }} variant="subtitle2" color="secondary">Copie o código abaixo e utilize no checkout do site da Domino's:</Typography>
                            <Typography style={{ fontSize: '12px', paddingTop: '25px' }} variant="subtitle2" color="secondary">Copie o código abaixo e utilize no checkout do site da Domino's:</Typography>
                            <Typography style={{ fontWeight: 'bold', paddingTop: '25px', color: '#CD0000' }} variant="h6" color="secondary">{this.state.promoCode}</Typography>
                        </div>
                    </div>

                    {/* <div style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '10px' }}>
                                <List >
                                    {this.state.vouchers ?
                                        Object.keys(this.state.vouchers).map(function (item, i) {
                                            return (<ListItem divider>
                                                <ListItemText primary={
                                                    <div>
                                                        <Typography variant="subtitle2" style={{ fontWeight: 'bold' }} color="secondary">{Object.keys(this.state.promo.vouchers)[i]}</Typography>
                                                        <Typography variant="subtitle2" color="secondary">{formatDate(this.state.promo.vouchers[item].sentDate)}</Typography>
                                                    </div>
                                                } />
                                                <ListItemSecondaryAction>
                                                    <IconButton aria-label="Comments">
                                                        <Typography style={{ fontWeight: 'bold' }} variant="subtitle1" color="secondary">{this.state.promo.vouchers[item].value}</Typography>
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>)
                                        }, this)
                                        : ''}

                                </List>
                            </div> */}

                    {
                        this.state.promoCode !== ''
                            ? <>
                                <div align="center" style={{ paddingBottom: '20px' }}>
                                    <Button style={{ cursor: 'default', backgroundColor: '#CB0100', color: '#fff', fontWeight: '700' }} onClick={() => { window.open('https://www.dominos.com.br/pages/order/?utm_source=auget&utm_campaign=bbmapfre#!/locations/search/', '_blank').focus(); }} variant="contained">
                                        Pedir agora!
                                    </Button>
                                </div>
                                <div align="center" style={{ paddingBottom: '20px' }}>
                                    <Typography style={{ fontWeight: 'bold' }} variant="h6" color="secondary" component={
                                        props => <Link to={{ pathname: '/minhaconta' }} {...props}
                                            style={{ textDecoration: 'none' }} />}>
                                        Ir para a carteira
                                    </Typography>
                                </div>
                            </>
                            : null
                    }

                </Paper>
            </Grid>

            <Grid item md={2} sm={1} xs={false}></Grid>
        </Grid>
    }

    retornaVazio = () => {
        return <Grid container style={{ paddingBottom: '20px' }} className="wallet-container background-voucher" >
            <Grid item md={2} sm={1} xs={false}></Grid>

            <Grid item md={8} sm={10} xs={12}>
                <img width="90%" className="img-radius" src={this.state.logoMapfre} alt="carteira" />

                <Typography style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }} variant="h6" color="secondary">Ops, todos os vouchers foram consumidos :(</Typography>
                <Typography style={{ fontSize: '20px', paddingTop: '25px', textAlign: 'center' }} variant="subtitle2" color="secondary">A campanha da Domino's foi um sucesso! Entregamos 500 cupons vale pizza para nossos sócios Club MAPFRE. Infelizmente, ela já chegou ao fim. Se você não conseguiu um cupom, não fique triste. Logo teremos novas campanhas para você.</Typography>
            </Grid>
        </Grid>
    }

    downloadThumb = () => {
        downloadImage('testeImg', 'dominos-promo-pizzafree.png').then((img) => {
            this.setState({ thumbnail: img })
        })
    };

    render = () => {

        return (
            <div className="navbar">
                {
                    this.state.loading
                        ? <div align='center' style={{ padding: '30px 0' }}><CircularProgress /></div>
                        : this.state.promoValid
                            ? this.retornaVoucher()
                            : this.retornaVazio()
                }
            </div>
        )
    }
}

export default VoucherTemp;