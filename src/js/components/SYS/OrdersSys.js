import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { CircularProgress, Container, Grid, Hidden, Button, Modal, Typography, RadioGroup, Radio, FormLabel, FormControlLabel, FormControl, TextField } from '@material-ui/core';
// import { configJson } from 'js/library/utils/firebaseUtils';

import { maskCard, cpfMask, maskDate, getLastUserInfo } from 'js/library/utils/helpers.js';
import getAccessToken_v1 from "../../library/utils/API/getAccessToken_v1.js"
import getSATsTickets from "../../library/utils/API/getSATsTickets";
import getLoginSys_v1 from "../../library/utils/API/getLoginSys_v1.js";
import getAssistancesSys from "../../library/utils/API/getAssistancesSys_v1.js";
import putTicketAssistance from "../../library/utils/API/putTicketAssistance_v1.js";
// import getSATsTicketsById from "../../library/utils/API/getSATsTicketsById.js";


const styles = theme => ({
    heading: {
        fontWeight: 700,
        fontSize: '22px',
        color: '#555'
    },
    grid: {
        flexDirection: 'row',
        alignItems: 'center',
        '&:not(:last-child)': {
            borderBottom: '2px solid #ddd',
        }
    },
    areabtn: {
        textAlign: 'center',
        "@media (max-width: 600px)": {
            marginBottom: 20
        }
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
        overflowY: 'scroll',
        outline: 'none',
        "@media (min-width: 600px)": {
            '&::-webkit-scrollbar': {
                width: 5,
                background: 'lightgrey',
            },
        },
    },
    formControl: {
        minWidth: '100%',
        flexDirection: 'row',
        '&>div>div': {
            borderRadius: '12px !important',
            borderColor: 'black !important',
            '&>div': {
                borderRadius: '12px !important',
                borderColor: 'black !important',
            },
        },
    },
    closeButton: {
        width: 50,
        fontSize: 26,
        color: '#fff',
        cursor: 'pointer',
        top: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        '&::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
        },
        '&>[type="number"]': {
            color: '#000 !important',
            textAlign: 'center !important',
            '-moz-appearance': 'textfield',
        },
    },
    btnInstallmentLeft: {
        minHeight: '100%',
        display: 'flex',
        padding: '0px 7px 0px 7px',
        position: 'absolute',
        alignItems: 'center',
        borderRadius: '10px 0px 0px 10px',
        minWidth: 10,
        zIndex: 1,
        left: 0,
        backgroundColor: '#FFE8E8',
        // backgroundColor: '#fff',
        fontWeight: 700,
        color: '#000',
        '&:hover': {
            color: '#fff',
        }
    },
    btnInstallmentRight: {
        minHeight: '100%',
        display: 'flex',
        padding: '0px 5px 0px 5px',
        position: 'absolute',
        alignItems: 'center',
        borderRadius: '0px 10px 10px 0px',
        minWidth: 10,
        zIndex: 1,
        right: 0,
        backgroundColor: '#FFE8E8',
        fontWeight: 700,
        // backgroundColor: '#fff',
        color: '#000',
        '&:hover': {
            color: '#fff',
        }
    }
})

// async function getTickets(token) {
//     const userInfo = getLastUserInfo();
//     getSATsTickets(token, 'LZUfJtZuDhWp2KSQNLuyl8h7OeA2').then(async (result) => {
//         await result.tickets.map((ticket, i) => {
//             if (ticket.assistanceType !== undefined) {
//                 getSATsTicketsStatuses(token, ticket.id).then((items) => {
//                     // console.log(i, items);
//                     result.tickets[i].statuses = items.statuses
//                 })
//             }
//         })
//         return result;
//     })
// }
class OrdersSys extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            //valores
            valueSys: 0,
            formaPagto: '',
            cardNumber: '',
            cpfNumber: '',
            cardName: '',
            birthDate: '',
            expireData: '',
            cvv: '',
            installment: 1,
            tickets: [],
            stateUsers: [],
            assistancesList: [],
            assistance: {},

            //validadores
            loading: false,
            disableApprove: false,
            disablePay: false,
            openModal: false,
            modalInfos: false,
            modalPayment: false,
            modalCancel: false,
            modalApprove: false,
            assistanceSend: false,
        };
        
        const uidTemp = '2RmaKKWWpQcQoOQHi0TVS55j32i1';

        getAccessToken_v1(uidTemp).then((token) => {
            getLoginSys_v1(token).then((result) => {
                this.setState({ token: result.token })

                getSATsTickets(token, uidTemp).then((result) => {
                    this.setState({ tickets: result.tickets })
                });
            })
        });
    }

    handleChange = name => event => {
        if (name === 'subInstallment') {
            if (this.state.installment <= 1)
                return null

            return this.setState({ installment: (this.state.installment - 1) })
        }
        else if (name === 'addInstallment') {
            if (this.state.installment >= 12)
                return null
            return this.setState({ installment: (this.state.installment + 1) })
        }
        else if (name === 'birthDate')
            return this.setState({ birthDate: maskDate(event.target.value) });
        else if (name === 'assistance')
            return this.setState({ assistance: parseInt(event.target.value, 10) })
        else if (name === 'expireData')
            return this.setState({ expireData: maskDate(event.target.value) });

        return this.setState({ [name]: event.target.value });
    };

    changeModal = (modal, set, ticket) => {
        if (modal === 'payment') {
            return this.setState({ modalPayment: set, openModal: set })
        }
        else if (modal === 'cancelSys') {
            return this.setState({ modalCancel: set, openModal: set })
        }
        else if (modal === 'approveSys') {
            return this.setState({ modalApprove: set, openModal: set })
        }
        else if (modal === 'information') {
            return this.setState({ modalInfos: set, openModal: set })
        }
        else if (modal === 'selectAssistance') {
            this.setState({ openModal: set, ticketId: ticket })
            getAssistancesSys(this.state.token, ticket).then((response) => {
                response.assistances.map((assistanceType) => {
                    if (assistanceType.type === 'postagem') {
                        let assistancesList = assistanceType.providers
                        return this.setState({ modalAssistance: set, openModal: set, assistancesPosting: assistancesList })
                    }
                    if (assistanceType.type === 'visita') {
                        let assistancesList = assistanceType.providers
                        return this.setState({ modalAssistance: set, openModal: set, assistancesVisit: assistancesList })
                    }
                    return null;
                })
            })
            return null
        }
    }

    checkCreateButton = (status, ticket) => {
        const { classes } = this.props;
        if (status.statusName === "aguardando_escolha_assistencia") {
            return <>
                <Grid item xs={6} md={2} className={classes.areabtn}>
                    <Button variant="contained" color="primary" onClick={() => { this.changeModal('selectAssistance', true, ticket) }}>Selecionar</Button>
                </Grid>
            </>
        }
        // if (status.statusName === 1)
        //     return <>
        //         <Grid item xs={6} md={2} className={classes.areabtn}>
        //             <Button variant="contained" color="primary" onClick={() => { this.setState({ os: ticket }); this.changeModal('approveSys', true) }}>Aprovar</Button>
        //         </Grid>
        //         <Grid item xs={6} md={2} className={classes.areabtn}>
        //             <Button variant="contained" color="primary" onClick={() => { this.setState({ os: ticket }); this.changeModal('cancelSys', true) }}>Recusar</Button>
        //         </Grid>
        //     </>
        // else if (statud.code === 2) {
        //     return <Grid item xs={12} md={2} className={classes.areabtn}>
        //         <Button variant="contained" color="primary" onClick={() => { this.setState({ os: ticket }); this.changeModal('payment', true) }}>Pagar</Button>
        //     </Grid>
        // }
        else {
            return null
        }
    }

    modalType = () => {
        const { classes } = this.props;
        if (this.state.modalCancel)
            return <>
                <Grid item xs={12} style={{ backgroundColor: '#cc0000', textAlign: 'center', textTransform: 'uppercase', padding: '10px 0', position: 'relative' }}>
                    <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 26 }}>
                        Atenção!
                    </Typography>
                    <span className={classes.closeButton} onClick={() => { this.changeModal('cancelSys', false) }}>X</span>
                </Grid>
                <Grid item xs={12} style={{ padding: 16, textAlign: 'center' }} className='modalOptIn__content'>
                    <Typography>
                        Você deverá efetuar o pagamento da postagem para que possamos devolver o aparelho
                    </Typography>
                    <Button variant="contained" color="primary" style={{ minHeight: '40px' }}>Concluir</Button>
                </Grid>
            </>
        else if (this.state.assistanceSend)
            return <>
                <Grid item xs={12} style={{ backgroundColor: '#cc0000', textAlign: 'center', textTransform: 'uppercase', padding: '10px 0', position: 'relative' }}>
                    <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 26 }}>
                        Concluído!
                    </Typography>
                    <span className={classes.closeButton} onClick={() => { this.changeModal('cancelSys', false) }}>X</span>
                </Grid>
                <Grid item xs={12} style={{ padding: 16, textAlign: 'center' }} className='modalOptIn__content'>
                    <Typography>
                        Envio realizado com sucesso!
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => { this.changeModal('cancelSys', false) }} style={{ minHeight: '40px' }}>Fechar</Button>
                </Grid>
            </>
        else if (this.state.modalPayment)
            return <>
                <Grid item xs={12} style={{ backgroundColor: '#cc0000', textAlign: 'center', textTransform: 'uppercase', padding: '10px 0', position: 'relative' }}>
                    <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 26 }}>
                        Dados do pagamento
                    </Typography>
                    <span className={classes.closeButton} onClick={() => { this.changeModal('payment', false) }}>X</span>
                </Grid>
                <Grid item xs={12} style={{ padding: 16, textAlign: 'center' }} className='modalOptIn__content'>
                    <Typography>
                        Forma de pagamento
                    </Typography>
                    <RadioGroup aria-label="formaPagto" name="formaPagto" value={this.state.formaPagto} onChange={this.handleChange('formaPagto')}>
                        <Grid container style={{ textAlign: 'center', flexDirection: 'row' }} className='modalOptIn__content'>
                            <Grid item xs={6} style={{ padding: 16, textAlign: 'center' }} className='modalOptIn__content'>
                                <FormControlLabel value='1' control={<Radio />} label="Cartão de crédito" />
                            </Grid>
                            <Grid item xs={6} style={{ padding: 16, textAlign: 'center' }} className='modalOptIn__content'>
                                <FormControlLabel value='2' control={<Radio />} label="Cartão de débito" />
                            </Grid>
                        </Grid>
                    </RadioGroup>
                    <Grid container style={{ textAlign: 'center', flexDirection: 'row' }} className='modalOptIn__content'>
                        <Grid item xs={12} md={6} style={{ padding: 16, textAlign: 'center', flexDirection: 'column' }} className='modalOptIn__content'>
                            <Typography variant="h6" className='modalOptIn__title' style={{ fontSize: 16 }}>Número do cartão</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <TextField
                                    id="cardNumber-payment"
                                    value={this.state.cardNumber === '' ? '' : maskCard(this.state.cardNumber)}
                                    placeholder="0000 0000 0000 0000"
                                    variant="outlined"
                                    name="cardNumber"
                                    fullWidth
                                    onChange={(event) => { this.setState({ cardNumber: event.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} style={{ padding: 16, textAlign: 'center', flexDirection: 'column' }} className='modalOptIn__content'>
                            <Typography variant="h6" className='modalOptIn__title' style={{ fontSize: 16 }}>CPF do titular</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <TextField
                                    id="cpfNumber-payment"
                                    value={this.state.cpfNumber === '' ? '' : cpfMask(this.state.cpfNumber)}
                                    placeholder="000.000.000-00"
                                    variant="outlined"
                                    name="cpfNumber"
                                    fullWidth
                                    onChange={(event) => { this.setState({ cpfNumber: event.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} style={{ padding: 16, textAlign: 'center', flexDirection: 'column' }} className='modalOptIn__content'>
                            <Typography variant="h6" className='modalOptIn__title' style={{ fontSize: 16 }}>Nome igual no cartão</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <TextField
                                    id="cardName-payment"
                                    value={this.state.cardName === '' ? '' : this.state.cardName}
                                    placeholder="EX: JOSÉ M S SANTOS"
                                    variant="outlined"
                                    name="cardName"
                                    fullWidth
                                    onChange={(event) => { this.setState({ cardName: event.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={7} md={4} style={{ padding: 16, textAlign: 'center', flexDirection: 'column' }} className='modalOptIn__content'>
                            <Typography variant="h6" className='modalOptIn__title' style={{ fontSize: 16 }}>Data de nascimento</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <TextField
                                    id="birthDate-payment"
                                    value={this.state.birthDate}
                                    placeholder="00/00/0000"
                                    variant="outlined"
                                    name="birthDate"
                                    fullWidth
                                    onChange={this.handleChange('birthDate')}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={5} md={2} style={{ padding: 16, textAlign: 'center', flexDirection: 'column' }} className='modalOptIn__content'>
                            <Typography variant="h6" className='modalOptIn__title' style={{ fontSize: 16 }}>Parcelas</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <Button className={classes.btnInstallmentLeft} variant="contained" color="primary" onClick={this.handleChange('subInstallment')}>-</Button>
                                <TextField
                                    id="installment-payment"
                                    value={this.state.installment}
                                    type="number"
                                    variant="outlined"
                                    name="installment"
                                    style={{ color: '#000', textAlign: 'center' }}
                                    disabled
                                    InputProps={{ className: classes.input }}
                                />
                                <Button className={classes.btnInstallmentRight} variant="contained" color="primary" onClick={this.handleChange('addInstallment')}>+</Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={7} md={4} style={{ padding: 16, textAlign: 'center', flexDirection: 'column' }} className='modalOptIn__content'>
                            <Typography variant="h6" className='modalOptIn__title' style={{ fontSize: 16 }}>Validade</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <TextField
                                    id="expireData-payment"
                                    value={this.state.expireData}
                                    placeholder="00/00"
                                    variant="outlined"
                                    name="expireData"
                                    inputProps={{ maxLength: 5 }}
                                    fullWidth
                                    onChange={this.handleChange('expireData')}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={5} md={2} style={{ padding: 16, textAlign: 'center', flexDirection: 'column' }} className='modalOptIn__content'>
                            <Typography variant="h6" className='modalOptIn__title' style={{ fontSize: 16 }}>CVV</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <TextField
                                    id="cvv-payment"
                                    value={this.state.cvv}
                                    type="number"
                                    placeholder="000"
                                    variant="outlined"
                                    name="cvv"
                                    fullWidth
                                    InputProps={{ className: classes.input }}
                                    onInput={(e) => {
                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                                    }}
                                    onChange={this.handleChange('cvv')}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} style={{ padding: 16, textAlign: 'center', flexDirection: 'column' }} className='modalOptIn__content'>
                            <Typography variant="h6" className='modalOptIn__title'>{this.state.installment} {this.state.installment === 1 ? 'parcela ' : 'parcelas '}de</Typography>
                            <Typography variant="h5" className='modalOptIn__title' style={{ fontWeight: 700 }}>{(this.state.os.value / this.state.installment).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}</Typography>
                        </Grid>
                        <Grid item xs={12} style={{ padding: 16, textAlign: 'center', flexDirection: 'column' }} className='modalOptIn__content'>
                            <Button variant="contained" color="primary" onClick={() => { console.log('passar pra api pagto') }}>Efetuar pagamento</Button>
                        </Grid>
                    </Grid>
                </Grid >
            </>
        else if (this.state.modalApprove)
            return <>
                <Grid item xs={12} style={{ backgroundColor: '#cc0000', textAlign: 'center', textTransform: 'uppercase', padding: '10px 0', position: 'relative' }}>
                    <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 26 }}>
                        Aprovar Orçamento
                    </Typography>
                    <span className={classes.closeButton} onClick={() => { this.changeModal('approveSys', false) }}>X</span>
                </Grid>
                <Grid item xs={12} style={{ padding: 16, textAlign: 'center' }} className='modalOptIn__content'>
                    <Typography>
                        Você aceita os termos de uso Mapfre Assystências e o valor de {this.state.installment} {this.state.installment === 1 ? 'parcela ' : 'parcelas '}de {(this.state.os.value / this.state.installment).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })} informado?
                    </Typography>
                    <Button variant="contained" color="primary" style={{ minHeight: '40px', margin: 10 }}>Aprovar</Button>
                    <Button variant="contained" color="primary" onClick={() => { this.changeModal('approveSys', false)}} style={{ minHeight: '40px', margin: 10 }}>Cancelar</Button>
                </Grid>
            </>
        else if (this.state.modalAssistance)
            if (this.state.assistancesPosting.length > 0) {
                return <>
                    <Grid item xs={12} style={{ backgroundColor: '#cc0000', textAlign: 'center', textTransform: 'uppercase', padding: '10px 0', position: 'relative' }}>
                        <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 26 }}>
                            Selecionar Assistência
                    </Typography>
                        <span className={classes.closeButton} onClick={() => { this.changeModal('approveSys', false) }}>X</span>
                    </Grid>
                    <Grid item xs={12} style={{ padding: 16, textAlign: 'left' }} className='modalOptIn__content'>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Escolha uma assistência da lista abaixo</FormLabel>
                            <RadioGroup aria-label="assistencias" name="assistencias" value={this.state.assistance} onChange={this.handleChange('assistance')}>
                                {
                                    this.state.assistancesPosting.map((assistance, index) => {
                                        return <div key={assistance.SATTechnicalAssistanceId} style={{ borderBottom: '2px solid lightgrey', padding: '5px' }}>
                                            <FormControlLabel value={index} control={<Radio checked={this.state.assistance === index} />} label={assistance.name} />
                                            <p style={{ fontSize: 9, margin: '1px 0px' }}>{assistance.addressStreet}, {assistance.addressNumber} - {assistance.addressNeighborhood}</p>
                                            <p style={{ fontSize: 9, margin: '1px 0px' }}>{assistance.addressZipcode} - {assistance.addressCity} - {assistance.addressState}</p>
                                        </div>
                                    })
                                }
                            </RadioGroup>
                        </FormControl>

                        <Button variant="contained" color="primary" onClick={this.sendAssistance} className={classes.button}>
                            enviar
                        </Button>
                    </Grid>
                </>
            }
            else if (this.state.modalInfos)
                return <>
                    <Grid item xs={12} style={{ backgroundColor: '#cc0000', textAlign: 'center', textTransform: 'uppercase', padding: '10px 0', position: 'relative' }}>
                        <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 26 }}>
                            Informações gerais
                    </Typography>
                        <span className={classes.closeButton} onClick={() => { this.changeModal('information', false) }}>X</span>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: 'center', padding: 16 }} className='modalOptIn__content'>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            1 - Aguarde 24h para utilizar o código de postagem gerado pelo sistema, e dirija-se a qualquer agência dos correios.
                    </Typography>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            2 - O equipamento será recepcionado pela Assistência técnica para realização do laudo técnico e orçamento.
                    </Typography>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            3 - O endereço selecionado para atendimento pode ser alterado conforme disponibilidade da assistência técnica.
                    </Typography>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            4 - Você pode usar embalagem própria ou retirar uma na agência dos Correios.
                    </Typography>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            5 - Por determinação dos Correios é necessário deixar a Nota Fiscal exposta do lado de fora da embalagem, caso não tenha a Nota Fiscal, deverá substituir pelo formulário de Declaração de Conteúdo.
                    </Typography>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            6 - Deverá encaminhar Junto do equipamento uma carta contendo as informações sobre o defeito apresentado.
                    </Typography>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            7 - Na devolução do seu equipamento o CEP de destino poderá estar temporariamente sem entrega domiciliar pelos Correios. Neste caso a entrega ocorrerá na agencia dos correios indicada no “Aviso de Chegada” que será encaminhado no endereço do destinatário.
                    </Typography>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            8 - O custo do frete (ida e volta) será cobrado mesmo que o orçamento não seja aprovado.
                    </Typography>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            9 - o equipamento será recepcionado pela Assistência Técnica para a realização do laudo técnico e orçamento.
                    </Typography>
                        <Typography style={{ textAlign: 'left', fontSize: 14, marginBottom: 15 }}>
                            10 - A critério dos Correios a entrega poderá ocorrer na agência de correios mais próxima do CEP informado.
                    </Typography>
                        <Button variant="contained" color="primary" onClick={() => { this.changeModal('information', false) }} style={{ minHeight: '40px', margin: 10 }}>Concluir</Button>
                    </Grid>
                </>
        return <div style={{ padding: '100px', textAlign: 'center', width: '100%' }}>
            <CircularProgress style={{ color: '#cd0000' }} />
        </div>
    }

    sendAssistance = () => {
        this.setState({modalApprove: false})
        let assistance = {}
        assistance.assistanceType = 'postagem';
        assistance.technicalAssistanceInfo = this.state.assistancesPosting[this.state.assistance]
        putTicketAssistance(this.state.token, this.state.ticketId, assistance).then((response) => {
            if(response.success) {
                console.log(response)
                this.setState({assistancesPosting: [], assistanceSend: true})
            }
        })
    }

    render() {
        const { classes } = this.props;

        if (window.pathname !== null && this.props.success)
            return <Redirect to={window.pathname} />
        return (
            <div style={{ minHeight: '88vh' }}>
                <Hidden smUp>
                    <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/Mobile-Main-Banner.png" alt="header-sys" style={{ width: '100%', height: '100%' }} />
                </Hidden>
                <Hidden xsDown>
                    <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/Desktop-main-Banner.png" alt="header-sys" style={{ width: '100%', height: '100%' }} />
                </Hidden>
                <Container maxWidth="lg">
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <h2 className={classes.heading}>Meus pedidos</h2>
                        </Grid>
                        {
                            this.state.tickets.length > 0
                                ? this.state.tickets.map((ticket) => {
                                    return <Grid container spacing={0} className={classes.grid} key={ticket.ticketInfo.id}>
                                        <Grid item xs={12} md={8} style={{ marginBottom: 10 }}>
                                            <h3>{ticket.ticketInfo.productBrandName} - {ticket.ticketInfo.productModelName}</h3>
                                            <h6>{new Date(ticket.ticketInfo.creationDate).toLocaleString('pt-BR', { timeZone: 'UTC' })}</h6>
                                        </Grid>
                                        <Grid item xs={6} md={2} style={{ marginBottom: 10 }}>
                                            <Button variant="contained" color="primary" style={{ minHeight: '40px' }} onClick={() => { this.changeModal('information', true) }}>Instruções</Button>
                                        </Grid>
                                        <Grid item xs={6} md={2} style={{ marginBottom: 10 }}>
                                            <Button variant="contained" color="primary" style={{ fontSize: 12, minHeight: '40px' }}>Abrir reclamação</Button>
                                        </Grid>
                                        {
                                            ticket.statuses.map((status, i) => {
                                                let DateSys = (new Date(status.creationDate).toLocaleString('pt-BR', { timeZone: 'UTC' }));
                                                return (
                                                    <Grid container spacing={0} className={classes.grid} key={status.id}>
                                                        <Grid item xs={12} md={8} style={{ flexDirection: 'column' }}>
                                                            <p style={{ color: '#999' }}>{DateSys}</p>
                                                            <p>{status.displayMessage ? status.displayMessage.toString() : 'sem texto'}</p>
                                                        </Grid>
                                                        {
                                                            ticket.statuses.length === (i + 1)
                                                                ? this.checkCreateButton(status, ticket.ticketInfo.id)
                                                                : null
                                                        }
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                })
                                : null
                        }
                    </Grid>
                    <div style={{ height: 80 }}></div>
                </Container>
                <Modal
                    open={this.state.openModal}
                    onClose={() => { this.changeModal('payment', false) }}
                    aria-labelledby="modalPayment-sys"
                    aria-describedby="modalPayment-sys"
                    style={{ zIndex: 999991 }}
                >
                    <div className={classes.modal}>
                        <Grid container>
                            {this.modalType()}
                        </Grid>
                    </div>
                </Modal>
            </div>
        )
    }
}

OrdersSys.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrdersSys);