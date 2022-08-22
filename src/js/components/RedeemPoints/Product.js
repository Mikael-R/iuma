import React, { Component } from 'react';

import { withStyles } from '@material-ui/styles';

import { getLastUserInfo, getUrlVariables, findValueInArray } from 'js/library/utils/helpers';
import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';

import { configJson } from 'js/library/utils/firebaseUtils';

import { getStorePlacesItem_v2 } from "../../library/utils/API/getStorePlacesItem_v2";
import { getStorePlaces_v2 } from "../../library/utils/API/getStorePlaces_v2";
import { apiOrder } from 'js/library/utils/API/apiOrder';

import OwlCarousel from "react-owl-carousel2";

import { Grid, Card, CardMedia, Modal, Button, Typography, CircularProgress } from '@material-ui/core';
import { getBalance_v1 } from '../../library/utils/API/getBalance_v1';

const styles = theme => ({
    root: {
    },
    modal: {
        width: 730,
        maxWidth: '90%',
        maxHeight: '90%',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        backgroundColor: 'white',
        overflowX: 'none',
        overflowY: 'none',
        outline: 'none',
        borderRadius: '5px',
    },
    titleModal: {
        backgroundColor: '#cc0000',
        padding: '10px 20px',
        display: 'flex'
    },
    closeButton: {
        color: '#fff',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

class Product extends Component {
    constructor(props) {

        super(props);

        const isSmall = (window.innerWidth < 768) ? true : false;
        const getVars = getUrlVariables();

        this.state = {
            settingsGeral: {
                items: isSmall ? 1 : 4,
                nav: true,
                loop: false,
                autoplay: false,
                dots: false,
                rewind: true,
                navText: ['<', '>']
            },
            userInfo: getLastUserInfo(),
            productsPoints: null,
            product: null,

            //validators
            loadingOrder: true,
            orderReply: false,
            openModal: false
        }

        getStorePlacesItem_v2(getVars.id, null, this.state.userInfo.uId).then((dataReceived) => {
            this.setState({ product: dataReceived.storeItem });
            getBalance_v1(this.state.userInfo.uId, this.state.userInfo.triiboId, findValueInArray(this.state.userInfo.documentList, 'type', 'cpf').value).then(response => {
                this.setState({ balance: response.balance.consolidateBalance.total, loadingOrder: false })
            })
        });

        getStorePlaces_v2(this.state.userInfo.uId, 'product', null, null, '', null, "[(description:LIKE:triibo_trocapontos)]", 0, 200, null).then((dataReceived) => {
            if (dataReceived.list.length > 0) {
                this.setState({ productsPoints: dataReceived.list })
            }
        });


    }

    orderStore = () => {
        this.setState({ loadingOrder: true });
        navigator.geolocation.getCurrentPosition((position) => {
            apiOrder(this.state.product.templateId, this.state.userInfo.triiboId, position.coords.latitude, position.coords.longitude, this.state.userInfo.triiboId).then(() => {
                this.setState({ loadingOrder: false, orderReply: true });
            }).catch(() => {
                this.setState({ loadingOrder: false, orderReply: false });
            })
        })
    }

    modalChange = (val) => {
        if (val) {
            this.setState({ openModal: true })
        } else {
            this.setState({ openModal: false })
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div style={{ minHeight: '88vh', display: 'flex', justifyContent: 'center', marginTop: 30 }} >
                <Grid container style={{ maxWidth: 1300 }}>
                    <Grid item xs={12}>
                        <Grid container spacing={(window.innerWidth < 768) ? 0 : 5}>
                            <Grid item sm={5} xs={12}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        component="img"
                                        alt={this.state.product !== null ? this.state.product.id : null}
                                        image={this.state.product !== null ? configJson.STORAGE_URL + encodeURIComponent(this.state.product.thumbnail) + '?alt=media' : placeholderItem}
                                        title={this.state.product !== null ? this.state.product.title : null}
                                    />
                                </Card>
                            </Grid>
                            <Grid item sm={7} xs={12} style={{ padding: (window.innerWidth < 768) ? 10 : null }}>
                                <Typography variant="h2" color="secondary" style={{ fontSize: 25, fontWeight: 700, color: '#cb0000' }}>
                                    {this.state.product !== null ? this.state.product.title : null}
                                </Typography>
                                <Typography variant="h3" color="secondary" style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid lightgrey', padding: '10px 0px 20px 0px' }}>
                                    Pontos: {this.state.product !== null ? this.state.product.cost : null}
                                </Typography>
                                <div style={{ padding: '20px 0px 40px 0px', alignItems: 'center' }}>
                                    <Typography color="secondary" style={{ fontSize: 12, whiteSpace: 'break-spaces' }}>
                                        {this.state.product !== null ? this.state.product.description : null}
                                    </Typography>
                                    {
                                        this.state.product !== null
                                            ? (<Button color="primary" variant="contained" onClick={() => { this.modalChange(true); }} style={{ margin: '25px 0px 0px 0px' }}>Resgatar produto</Button>)
                                            : null
                                    }
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    {
                        this.state.productsPoints !== null ?
                            (
                                <Grid container className={'slide_ofertas slide_ofertas--PONTOS'} style={{ textAlign: 'center' }}>
                                    <Grid item sm={2} xs={12} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                                        <div className="slide_ofertas__title">Outros produtos</div>
                                        {/* <a href={"/estabelecimentosCofry/?dep=" + 'pontos'} style={{ marginTop: 'auto', height: 'auto' }}>ver mais</a> */}
                                    </Grid>
                                    <Grid item sm={10} xs={12} style={{ textAlign: 'center' }}>
                                        <OwlCarousel className={"slide_ofertas__carousel owl-carousel owl-theme"} options={this.state.settingsGeral} >
                                            {
                                                this.state.productsPoints.map((item, k) => {
                                                    return (
                                                        <div title={item.product.title} className="item" key={k}>
                                                            <a id="nameId" title={item.product.title} href={'/produto-pontos/?id=' + item.product.id}>
                                                                <div title={"imageDiv" + item.product.id} className="slide_ofertas__thumb">
                                                                    <img alt={"imageDiv" + item.product.id} src={configJson.STORAGE_URL + encodeURIComponent(item.product.thumbnail) + '?alt=media'} title={'img' + item.product.id} />
                                                                </div>
                                                                <span title="nameId">{item.product.title + ' - ' + item.product.cost + ' pontos'}</span>
                                                            </a>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </OwlCarousel>
                                    </Grid>
                                </Grid>
                            ) : <CircularProgress />
                    }
                </Grid>
                <Modal
                    open={this.state.openModal}
                    onClose={() => { this.setState({ openModal: false }) }}
                    aria-labelledby="confirmModal-points"
                    aria-describedby="confirmModal-points"
                    style={{ zIndex: 999991 }}
                >
                    <div className={classes.modal}>
                        <Grid container>
                            {this.state.loadingOrder
                                ? <CircularProgress />
                                : this.state.balance > this.state.product.cost
                                    ? this.state.orderReply
                                        ? (<>
                                            <Grid item xs={12} className={classes.titleModal}>
                                                <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 20, width: '100%' }}>
                                                    Confirmado!
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} style={{ padding: 16, textAlign: 'center' }} className='modalOptIn__content'>
                                                <Typography>
                                                    Pedido confirmado! Em breve você receberá um e-mail com os dados do seu pedido.
                                                </Typography>
                                                <Button variant="contained" color="primary" onClick={() => { window.location.reload(); return false; }} style={{ margin: '0px 10px' }} >Fechar</Button>
                                            </Grid>
                                        </>)
                                        : (<>
                                            <Grid item xs={12} className={classes.titleModal}>
                                                <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 20, width: '100%' }}>
                                                    Confirmar pedido
                                                </Typography>
                                                <span className={classes.closeButton} onClick={() => { this.modalChange(false); }}>X</span>
                                            </Grid>
                                            <Grid item xs={12} style={{ padding: 16 }} className='modalOptIn__content'>
                                                <Grid container style={{ borderBottom: '1px solid lightgrey', padding: '10px 0px' }}>
                                                    <Grid item xs={9}>
                                                        <Typography variant="body1" color="secondary">seus pontos:</Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography variant="h6" color="secondary" style={{textAlign: 'right'}}>{this.state.balance}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container style={{ padding: '10px 0px' }}>
                                                    <Grid item xs={9}>
                                                        <Typography variant="body1" color="secondary">{this.state.product.title} </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography variant="h6" color="secondary" style={{textAlign: 'right'}}>Valor: {this.state.product.cost}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container style={{ padding: '10px 0px' }}>
                                                    <Grid item xs={9}>
                                                        <Typography variant="body1" color="secondary">Saldo após a compra: </Typography>
                                                    </Grid>
                                                    <Grid item xs={3} style={{borderTop: '2px dashed #cc0000'}}>
                                                        <Typography variant="h6" color="secondary" style={{textAlign: 'right'}}>{this.state.balance - this.state.product.cost}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container style={{ textAlign: 'center' }}>
                                                    <Grid item xs={12}>
                                                        <Typography style={{ margin: '15px 0px' }}>
                                                            Você gostaria de confirmar seu pedido?
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={2}></Grid>
                                                    <Grid item xs={4}>
                                                        <Button variant="contained" color="primary" onClick={() => { this.modalChange(false); }} style={{ opacity: 0.8, margin: '0px 10px' }} >Cancelar</Button>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Button variant="contained" color="primary" onClick={() => { this.orderStore() }} style={{ margin: '0px 10px' }} >Concluir</Button>
                                                    </Grid>
                                                    <Grid item xs={2}></Grid>
                                                </Grid>
                                            </Grid>
                                        </>)
                                    : (<>
                                        <Grid item xs={12} className={classes.titleModal}>
                                            <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 20, width: '100%' }}>
                                                Oops!
                                            </Typography>
                                            <span className={classes.closeButton} onClick={() => { this.modalChange(false); }}>X</span>
                                        </Grid>
                                        <Grid item xs={12} style={{ padding: 16, textAlign: 'center' }} className='modalOptIn__content'>
                                            <Typography>
                                                Seus pontos não são suficientes para resgatar o produto desejado.
                                            </Typography>
                                            <Button variant="contained" color="primary" onClick={() => { this.modalChange(false); }} style={{ margin: '15px 0px' }} >Fechar</Button>
                                        </Grid>
                                    </>)
                            }
                        </Grid>
                    </div>
                </Modal >
            </div >
        )
    }
}

export default withStyles(styles)(Product);