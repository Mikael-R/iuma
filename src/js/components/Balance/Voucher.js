import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Paper, Typography, Grid, Button, List, ListItem, ListItemSecondaryAction, ListItemText, IconButton, TextField } from "@material-ui/core";
import QRCode from 'qrcode.react';
import { formatDate, trackEventMatomo } from 'js/library/utils/helpers';
import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';
import { downloadImage } from 'js/library/services/StorageManager.js';

class Voucher extends Component {

    constructor(props) {
        super(props);

        this.state = {
            promo: props.location.state,
            thumbnail: placeholderItem,
            vouchers: props.location.state.vouchers,
            message: false
        };
    };

    downloadThumb = () => {
        if (this.state.promo.thumbnail !== undefined) {
            downloadImage('voucher', this.state.promo.photo).then((img) => {
                this.setState({ thumbnail: img })
            })
        }
    };

    copyCoupon = () => {
        var copyText = document.getElementById("voucherCoupon");

        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");

        this.setState({ message: true});
    }

    render = () => {

        return (
            <div className="navbar">
                <Grid container style={{ paddingBottom: '20px' }} className="wallet-container background-voucher" >
                    <Grid item md={2} sm={1} xs={false}></Grid>

                    <Grid item md={8} sm={10} xs={12}>
                        <Paper>
                            <Button style={{ cursor: 'default', backgroundColor: '#CB0100' }} disabled fullWidth={true} variant="contained">
                                <span style={{ color: 'white', paddingTop: '5px', paddingBottom: '5px' }} ><Typography variant="h6"><span className="white-font">{this.state.promo.state !== 'finished' && this.state.promo.status !== 'consumido' ? 'Cupom Ativo' : 'Cupom inativo'}</span></Typography></span>
                            </Button>

                            <div align="center" style={{ paddingTop: '20px' }}>
                                <img width="90%" className="img-radius" src={this.state.thumbnail} onLoad={() => this.downloadThumb()} alt="carteira" />

                                <div style={{ padding: '15px' }}>
                                    <Typography variant="subtitle2" color="secondary">{this.state.promo.kind}</Typography>

                                    <Typography style={{ fontWeight: 'bold' }} variant="h6" color="secondary">
                                        {this.state.promo.detailsTitle}
                                    </Typography>

                                    <Typography variant="subtitle2" color="secondary">{this.state.promo.detailsDescription}</Typography>

                                    {this.state.promo.score ?
                                        <Typography style={{ fontWeight: 'bold', paddingTop: '25px' }} variant="subtitle2" color="secondary">Você possui {this.state.promo.score} cupons</Typography>
                                        : null
                                    }

                                    {this.state.promo.consumptionType === 'externalConsumption'
                                        ? <div style={{ margin: '20px 0px 0px 0px' }}>
                                            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', placeContent: 'center', margin: '20px 0px' }}>
                                                <Typography id="cashback-value" variant="h6" color="secondary" style={{ fontWeight: 700, marginRight: 20 }}>
                                                    Cupom:
                                                </Typography>
                                                <TextField
                                                    id="voucherCoupon"
                                                    value={this.state.promo.key}
                                                    variant="outlined"
                                                    InputProps={{
                                                        style: {
                                                            fontSize: 30,
                                                            padding: 5,
                                                            cursor: 'pointer',
                                                            textAlign: 'center',
                                                        }
                                                    }}
                                                    onClick={() => this.copyCoupon()} />
                                            </Grid>
                                            {/* <Typography variant="h6" color="primary" style={{ padding: 10, border: '1px solid lightgrey', cursor: 'pointer' }} onClick={() => this.copyCoupon()}>{this.state.promo.key}</Typography> */}
                                            <Typography variant="body1" color="secondary">{this.state.promo.rulesConsumption}</Typography>
                                            {
                                                this.state.message
                                                    ? <Typography variant="body1" color="primary" style={{padding: 5}}>Código do cupom copiado!</Typography>
                                                    : null
                                            }
                                            <Button style={{ cursor: 'pointer', backgroundColor: '#CC0000', color: 'white', fontWeight: 700, marginTop: 20 }} fullWidth={true} variant="contained" target="_blank" href={this.state.promo.urlConsumption}>Ir para o site</Button>
                                        </div>
                                        : this.state.promo.type === 'store'
                                            ? <div style={{ marginTop: '30px' }}>
                                                <QRCode
                                                    id="QRCode"
                                                    value={this.state.promo.key}
                                                    size={140}
                                                    bgColor={"#ffffff"}
                                                    fgColor={"#000000"}
                                                    level={"M"}
                                                />
                                                <Typography variant="body1" color="secondary">{this.state.promo.key}</Typography>

                                                <Typography variant="caption" color="secondary">Para consumir seu cupom, informe o código acima ou use o QR Code</Typography>

                                            </div>
                                            : null
                                    }
                                </div>
                            </div>

                            <div style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '10px' }}>
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
                            </div>

                            <div align="center" style={{ paddingBottom: '20px' }}>
                                <Typography style={{ fontWeight: 'bold' }} variant="h6" color="secondary" component={
                                    props => <Link to={{ pathname: '/minhaconta' }} {...props}
                                        onClick={() => trackEventMatomo('Voucher', 'click', 'botao', 'Voltar para a carteira')}
                                        style={{ textDecoration: 'none' }} />}>
                                    Voltar para a carteira
                                </Typography>
                            </div>

                        </Paper>
                    </Grid>

                    <Grid item md={2} sm={1} xs={false}></Grid>
                </Grid>
            </div>
        )
    }
}

export default Voucher;