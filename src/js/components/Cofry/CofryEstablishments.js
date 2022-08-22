import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { configJson } from 'js/library/utils/firebaseUtils';

import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';

import { getLastUserInfo, getUrlVariables, trackEventMatomo, trackEventMatomoElementId } from 'js/library/utils/helpers';

import { getStorePlaces_v2 } from "js/library/utils/API/getStorePlaces_v2";
import { getStorePlacesItem_v2 } from "js/library/utils/API/getStorePlacesItem_v2";

import { Grid, Button, Typography, Paper, Modal, TextField, CircularProgress, Hidden } from '@material-ui/core';

const styles = theme => ({
    root: {
    },
    input: {
        fontSize: 30,
        padding: 5,
        cursor: 'pointer',
        textAlign: 'center',
    },
    modal: {
        width: 730,
        maxWidth: '90%',
        maxHeight: '90%',
        padding: 30,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        backgroundColor: 'white',
        overflowX: 'none',
        overflowY: 'scroll',
        outline: 'none',
        "@media (min-width: 600px)": {
            '&::-webkit-scrollbar': {
                width: 5,
                background: 'lightgrey',
            },
        },
    },
    cardContent: {
        paddingRight: '5px'
    },
    cardInfo: {
        maxHeight: '200px',
        overflowY: 'scroll',

        "&::-webkit-scrollbar": {
            width: '4px',
            height: '4px',
        },
        "&::-webkit-scrollbar-thumb": {
            background: '#808080',
            borderRadius: '15px',
        },
        "&::-webkit-scrollbar-thumb:hover": {
            background: '#575757',
        },
        "&::-webkit-scrollbar-track": {
            background: '#ffffff',
            borderRadius: '15px',
        }
    },
    itemPromo: {
        border: '2px solid #eee',
        borderRadius: '8px'
    },
    paperItem: {
        borderRight: '2px solid lightgrey',
        marginBottom: '30px',
        transition: '0.3s',
        "&:nth-child(4n)": {
            borderRight: 'none'
        },
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ffeaea'
        }
    },
    paperItemSmall: {
        border: '1px solid #eee',
        transition: '0.3s',
        '&:hover': {
            backgroundColor: '#ffeaea'
        }
    }
});

class CofryEstablishments extends Component {
    constructor(props) {

        const getVars = getUrlVariables();

        super(props);
        this.state = {
            userInfo: getLastUserInfo(),
            dep: getVars.dep !== undefined ? getVars.dep.replace(/[-]/gi, " ") : '',
            store: getVars.store !== undefined ? getVars.store : '',
            coupons: [],
            couponItem: {},
            stores: [],
            storePlacesItem: {},
            fixedPromotion: '',

            //validadores
            openModal: false,
            department: false,
            storeLoaded: false,
            loadedCoupons: false,
        };


        if (this.state.dep !== '') {
            getStorePlaces_v2(this.state.userInfo.uId, 'establishment', null, null, '', null, '[(endereco.keyword:LIKE:Brasil)]', 0, 200, null, ['Cofry', this.state.dep]).then((dataReceived) => {
                this.setState({ stores: dataReceived.list, department: true });
            });
        }

        else if (this.state.store !== '') {
            getStorePlaces_v2(this.state.userInfo.uId, 'promotion', null, null, '', this.state.store, '[(endereco.keyword:LIKE:Brasil)]', 0, 200, null, null).then((dataReceived) => {

                dataReceived.list.map(item => {
                    item.businessPartner.checkoutCode !== undefined
                        ? this.setState({ coupons: [...this.state.coupons, item] })
                        : getStorePlacesItem_v2(item.id, null, this.state.userInfo.uId, 'cofry').then((itemSingle) => {
                            this.setState({ fixedPromotion: itemSingle.storeItem, storeLoaded: true, loadedCoupons: true })
                        })
                    return;
                });
            });
        }
    }

    handleClick = (val) => {

        this.setState({ openModal: true })

        getStorePlacesItem_v2(val, null, this.state.userInfo.uId, 'cofry').then(async (itemSingle) => {
            await this.setState({ couponItem: itemSingle })

            this.copyCoupon()
        });

    }

    copyCoupon = () => {
        var copyText = document.getElementById("cofry-coupon");

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999);

        document.execCommand("copy");
    }

    changeModal = (type, set) => {
        if (type === 'modal') {
            return this.setState({ verificaChamada: false, openModal: set })
        }
    }


    render() {

        const isSmall = (window.innerWidth < 768) ? true : false;
        const { classes } = this.props;

        return (
            <div style={{ minHeight: '88vh', display: 'flex', justifyContent: 'center', margin: '40px 0px' }}>
                <Grid container style={{ maxWidth: 1300 }}>
                    <Grid item xs={12}>
                        <Grid container spacing={isSmall ? 0 : 10}>
                            <Grid item sm={3} xs={12}>
                                <Hidden only="xs">
                                    <a href="https://mapfre-troqme.azurewebsites.net/" target="_blank" onClick={() => trackEventMatomoElementId('Cofry Promoções e Estabelecimentos', 'click', 'banner', 'troqme')}>
                                        <img alt="banner-troqme" src='/wp-content/uploads/2019/02/banner_lateral2.png' width="100%" style={{ margin: '15px 0px', boxShadow: '0px 0px 4px 2px rgb(0 0 0 / 20%)' }} />
                                    </a>
                                </Hidden>
                                {
                                    this.state.store !== ''
                                        ? this.state.fixedPromotion !== ''
                                            ? <img alt="thumb-promotion" src={configJson.STORAGE_URL + encodeURIComponent('promocao/' + this.state.fixedPromotion.thumbnail) + '?alt=media'} width="100%" />
                                            : <img alt="loading" src={placeholderItem} width="100%" />
                                        : <img alt="thumb-department" src={configJson.STORAGE_URL + encodeURIComponent('departamentos/' + this.state.dep.replace(/[ ]/gi, "-")) + '.png?alt=media'} width="100%" />
                                }

                                <Hidden only="xs">
                                    <a href="/ofertas/?objectType=establishment&query=[(description:LIKE:club_auto)]" onClick={() => trackEventMatomoElementId('Cofry Promoções e Estabelecimentos', 'click', 'banner', 'Banner club_auto')}>
                                        <img alt="banner-autos" src='/wp-content/uploads/2019/02/AUTOS-v2.png' width="100%" style={{ marginTop: 15 }} />
                                    </a>
                                </Hidden>
                            </Grid>
                            <Grid item sm={9} xs={12}>
                                <Typography variant="h4" color="secondary" style={{ fontSize: isSmall ? 30 : 35, marginBottom: '20px', fontWeight: 700, marginTop: isSmall ? 20 : 0 }}>
                                    {this.state.dep !== '' ? this.state.dep : this.state.fixedPromotion !== '' ? this.state.fixedPromotion.establishmentName : ''}
                                </Typography>
                                {
                                    this.state.department || this.state.coupons.length > 0
                                        ? <>
                                            <Typography variant="h6" color="secondary" style={{ marginBottom: '20px' }}>
                                                <img alt="icon-shout" src={"https://club.mapfre.com.br/wp-content/uploads/2019/02/shout.svg"} style={{ height: "20px", marginRight: "10px" }} />
                                                {this.state.dep !== '' ? this.state.stores.length + (this.state.stores.length > 1 ? ' Lojas' : ' Loja') : this.state.coupons.length + (this.state.coupons.length > 1 ? ' Cupons' : ' Cupom')}
                                            </Typography>
                                            <Paper elevation={3}>
                                                <Grid container spacing={0} className={classes.paperRow} style={{ padding: isSmall ? 0 : 30 }}>
                                                    {
                                                        this.state.department
                                                            //CARREGA OS ESTABELECIMENTOS DO DEPARTAMENTO
                                                            ? this.state.stores.map((itemCofry, i) => {
                                                                return (
                                                                    <Grid item sm={6} xs={12} style={{ padding: "15px" }} key={i}>
                                                                        <Grid container spacing={2} className={classes.itemPromo}>
                                                                            <Grid item xs={4} style={{ alignSelf: 'center' }}>
                                                                                <img alt='promo-img' src={configJson.STORAGE_URL + encodeURIComponent('estabelecimento/' + itemCofry.establishment.fotoThumb) + '?alt=media'} width="100%" />
                                                                            </Grid>
                                                                            <Grid item xs={8} style={{ alignSelf: 'center' }}>
                                                                                <Typography variant="subtitle2" color="secondary" style={{ marginBottom: '20px', fontSize: 12, fontWeight: '500' }}>
                                                                                    {itemCofry.establishment.descricao.slice(0, 140) + (itemCofry.establishment.descricao.length > 140 ? '...' : null)}
                                                                                </Typography>
                                                                                <Button variant="contained" color="primary" href={"/estabelecimentosCofry/?store=" + itemCofry.id} onClick={() => trackEventMatomoElementId('Estabelecimentos Cofry', 'click', 'botao', 'store: '+itemCofry.id) }>Ver Cashback</Button>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    // <Grid item sm={3} xs={4} className={isSmall ? classes.paperItemSmall : classes.paperItem} style={{ padding: "15px" }} key={i}>
                                                                    //     <a href={"/estabelecimentosCofry/?store=" + itemCofry.id}>
                                                                    //         <img alt='promo-img' src={configJson.STORAGE_URL + encodeURIComponent('estabelecimento/' + itemCofry.establishment.fotoThumb) + '?alt=media'} width="100%" />
                                                                    //         <Typography variant="subtitle2" color="secondary" style={{ marginBottom: '20px', fontSize: 9, fontWeight: '700' }}>
                                                                    //             {itemCofry.establishment.nome}
                                                                    //         </Typography>
                                                                    //     </a>
                                                                    // </Grid>
                                                                )
                                                            })
                                                            //CARREGA OS CUPONS DE DESCONTO DO ESTABELECIMENTO
                                                            : this.state.coupons.map((itemCofry, i) => {
                                                                return (
                                                                    <Grid item sm={6} xs={12} style={{ padding: "15px" }} key={i}>
                                                                        <Grid container spacing={2} className={classes.itemPromo}>
                                                                            <Grid item xs={4} style={{ alignSelf: 'center' }}>
                                                                                <img alt='promo-img' src={configJson.STORAGE_URL + encodeURIComponent('promocao/' + itemCofry.businessPartner.thumbnail) + '?alt=media'} width="100%" />
                                                                            </Grid>
                                                                            <Grid item xs={8} style={{ alignSelf: 'center' }}>
                                                                                <Typography variant="subtitle2" color="secondary" style={{ fontSize: 15, fontWeight: '500' }}>
                                                                                    {itemCofry.businessPartner.description}
                                                                                </Typography>
                                                                                <Typography variant="subtitle2" color="secondary" style={{ marginBottom: 10, fontSize: 15, fontWeight: '700' }}>
                                                                                    {itemCofry.businessPartner.title}
                                                                                </Typography>
                                                                                <Button variant="contained" color="primary" onClick={() => { this.handleClick(itemCofry.id); trackEventMatomoElementId('Cupom Cofry', 'click', 'botao', 'cupom: '+itemCofry.id) }}>Pegar Cupom</Button>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                )
                                                            })
                                                    }
                                                </Grid>
                                            </Paper>
                                        </>
                                        : this.state.loadedCoupons
                                            ? null
                                            : <Grid container style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', placeContent: 'center' }}>
                                                <CircularProgress />
                                            </Grid>
                                }
                                {
                                    this.state.storeLoaded
                                        ? <Paper elevation={3} style={{ padding: 30, marginTop: 30 }}>
                                            <Grid container style={{ marginBottom: 25, alignItems: 'center' }}>
                                                <Grid item sm={9} xs={6}>
                                                    <Typography id="cashback-value" variant="h5" color="secondary" style={{ fontSize: isSmall ? 20 : 35, fontWeight: 700, color: '#cc0000' }}>
                                                        {this.state.fixedPromotion.title}
                                                    </Typography>
                                                </Grid>
                                                <Grid item sm={3} xs={6} style={{ textAlign: 'right' }}>
                                                    <Button id="button-promotion" variant="contained" color="primary" target="_blank" href={this.state.fixedPromotion.url} onClick={() => trackEventMatomoElementId('Estabelecimento Cofry', 'click', 'botao', 'direcionamento loja '+this.state.fixedPromotion.url)}>
                                                        VISITAR LOJA
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} style={{ whiteSpace: 'pre-line', padding: 15, border: '2px solid #bbb', borderRadius: 20, maxHeight: '50vh', overflow: 'auto' }}>
                                                {
                                                    this.state.fixedPromotion.detailsDescription
                                                }
                                                <br />
                                            </Grid>
                                        </Paper>
                                        : null
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* MODAL DO CUPOM DE DESCONTO*/}
                <Modal
                    open={this.state.openModal}
                    onClose={() => { this.changeModal('modal', false) }}
                    aria-labelledby="modal"
                    aria-describedby="modal"
                    style={{ zIndex: 999991 }}
                >
                    {Object.keys(this.state.couponItem).length > 0
                        ? <div className={classes.modal}>
                            <Button variant="contained" color="primary" style={{ float: 'right', marginBottom: 15 }} onClick={() => { this.changeModal('modal', false); trackEventMatomo('Estabelecimento Cofry', 'click', 'botao', 'fechar modal') }}>X</Button>
                            <Grid container style={{ textAlign: 'center' }}>
                                <Grid item xs={12}>
                                    <Typography id="cashback-value" variant="h6" color="secondary" style={{ fontWeight: 700, color: '#cc0000' }}>
                                        {this.state.couponItem.storeItem.description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', placeContent: 'center', marginBottom: 15 }}>
                                    <Typography id="cashback-value" variant="h6" color="secondary" style={{ fontWeight: 700, marginRight: 20 }}>
                                        Cupom:
                                    </Typography>
                                    <TextField
                                        id="cofry-coupon"
                                        value={this.state.couponItem.storeItem.checkoutCode}
                                        variant="outlined"
                                        InputProps={{
                                            classes: {
                                                input: classes.input,
                                            },
                                        }}
                                        onClick={() => {this.copyCoupon(); trackEventMatomoElementId('Estabelecimento Cofry', 'click', 'button', 'copiar cupom: '+this.state.couponItem.storeItem.checkoutCode) }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography id="cashback-value" color="primary" style={{ fontWeight: 700, marginBottom: 20 }}>
                                        Seu cupom já foi copiado, siga as regras de uso descritas abaixo para utilizá-lo
                                    </Typography>
                                    <Grid item xs={12} style={{ padding: 15, border: '2px solid #bbb', borderRadius: 20, maxHeight: 300, overflow: 'auto' }}>
                                        {this.state.couponItem.storeItem.detailsDescription}
                                    </Grid>
                                    <Button id="button-promotion" variant="contained" color="primary" target="_blank" href={this.state.couponItem.storeItem.url} style={{ marginTop: 30 }} onClick={() => trackEventMatomoElementId('Estabelecimento Cofry', 'click', 'botao', 'direcionamento loja '+this.state.couponItem.storeItem.url)}>
                                        VISITAR LOJA
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                        : <CircularProgress />
                    }
                </Modal>
            </div>
        )
    }
}

CofryEstablishments.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CofryEstablishments);