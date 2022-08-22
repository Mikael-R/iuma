import React, { Component } from "react";
import { TextField, Typography, Grid, Paper, Button, Dialog, DialogTitle, CircularProgress } from "@material-ui/core";
import { ValidatorForm } from 'react-material-ui-form-validator';
import backgroundPic from "styles/assets/CarRepair/formBackground.png"
import setOminous from "../../library/utils/API/setOminous";
import getUser_Oficinas from "js/library/utils/API/getUser_Oficinas.js";
import getAccessToken from "js/library/utils/API/getAccessToken_v1.js";
import { cpfMask, validateCPF, confirmDate, findValueInArray } from "js/library/utils/helpers.js";
import { mask } from 'remask'
import { Header } from 'js/containers/Header/Header.js'

class NewEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cpfNumber: '',
            carPlate: '',
            exitDate: '',
            userInfo: {},

            dialogMessage: '',

            //validadores e loading
            openDialog: false,
            loading: true
        }

        if (localStorage.getItem('oficinaMapfre')) {
            let userInfo = JSON.parse(localStorage.getItem('userInfoOficina'))

            getAccessToken(null, 2).then(token => {
                getUser_Oficinas(token, findValueInArray(userInfo.contactList, 'type', 'cellPhone').value.replace(/\D/g, "")).then(data => {
                    if (!data.status) {
                        window.location = document.location.origin + '/oficinas';
                    } else {
                        this.setState({ userInfo: data.userInfo, loading: false })
                    }
                });
            });
        } else {
            window.location = document.location.origin + '/oficinas';
        }
    }

    handleChange = name => event => {
        if (name === 'cpfNumber') {
            this.setState({ cpfNumber: cpfMask(event.target.value) });
        } else if (name === 'carPlate') {
            this.setState({ carPlate: mask(event.target.value, 'AAA-9S99') });
        } else if (name === 'exitDate') {
            this.setState({ exitDate: mask(event.target.value, '99/99/9999') });
        }
    }

    handleSubmit = () => {

        this.setState({ loading: true })
        let dateSliced = this.state.exitDate.split('/');
        let dateExit = new Date(dateSliced[2] + '-' + dateSliced[1] + '-' + dateSliced[0]);
        if (!validateCPF(this.state.cpfNumber.replace(/\D/g, ""))) {
            this.setState({ openDialog: true, dialogMessage: 'CPF inválido.', loading: false });
        } else if (!confirmDate(this.state.exitDate)) {
            this.setState({ openDialog: true, dialogMessage: 'Data inválida.', loading: false });
        } else if (this.state.carPlate.length <= 7) {
            this.setState({ openDialog: true, dialogMessage: 'Placa inválida.', loading: false });
        } else {
            getAccessToken(this.state.userInfo.uId, 2).then(token => {
                setOminous(token, this.state.cpfNumber.replace(/\D/g, ""), this.state.carPlate.toUpperCase(), dateExit.getTime()).then(result => {
                    this.setState({ openDialog: true, dialogMessage: 'Registo adicionado com sucesso! Acesse a aba “Histórico” se você precisar pesquisar os formulários já preenchidos.', loading: false, cpfNumber: '', exitDate: '', carPlate: '' });
                }).catch(e => {
                    console.log(e)
                })
            })
        }
    }

    render = () => {
        return (
            <>
                <Header />
                <div style={{ background: 'black', minHeight: '88vh', display: 'flex', backgroundImage: `url(${backgroundPic})`, backgroundSize: 'cover', backgroundPosition: window.innerWidth < 768 ? -380 : null }}>
                    <Grid container style={{ maxWidth: 1300, margin: '0 auto', alignItems: 'center' }}>
                        {
                            this.state.loading
                                ? <Grid item xs={12} style={{
                                    height: '100vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'}}>
                                    <CircularProgress />
                                </Grid>
                                :
                                <>
                                    <Grid item className="entryes-instructions" style={{ padding: '20px !important', color: 'white !important', display: 'flex !important', flexDirection: ' column !important' }} xs={12} sm={7}>
                                        <div style={{ display: 'flex !important', alignItems: 'center !important', margin: '20px 0px !important' }}>
                                            <Typography variant="h6" style={{ color: 'white', paddingLeft: '70px !important', fontWeight: '700 !important', fontSize: '25px !important' }}>Instruções</Typography>
                                        </div>
                                        <div style={{ display: 'flex !important', alignItems: 'center !important', margin: '20px 0px !important' }}>
                                            <span style={{ fontWeight: '400 !important', padding: '0px 17px !important', backgroundColor: 'white !important', textAlign: 'center', color: '#000 !important', borderRadius: '50% !important', marginRight: '10px !important' }}>
                                                <p style={{ margin: '0px !important', fontSize: '50px !important', width: '30px !important', height: '65px !important' }}>1</p>
                                            </span>
                                            <Typography variant="body1">Por favor, preencha o formulário a seguir para registrar as informações de entrega de veículos reparados.</Typography>
                                        </div>
                                        <div style={{ display: 'flex !important', alignItems: 'center !important', margin: '20px 0px !important' }}>
                                            <span style={{ fontWeight: '400 !important', padding: '0px 17px !important', backgroundColor: 'white !important', textAlign: 'center', color: '#000 !important', borderRadius: '50% !important', marginRight: '10px !important' }}>
                                                <p style={{ margin: '0px !important', fontSize: '50px !important', width: '30px !important', height: '65px !important' }}>2</p>
                                            </span>
                                            <Typography variant="body1">Essas informações serão utilizadas para validar nosso fluxo de atendimento.</Typography>
                                        </div>
                                        <div style={{ display: 'flex !important', alignItems: 'center !important', margin: '20px 0px !important' }}>
                                            <span style={{ fontWeight: '400 !important', padding: '0px 17px !important', backgroundColor: 'white !important', textAlign: 'center', color: '#000 !important', borderRadius: '50% !important', marginRight: '10px !important' }}>
                                                <p style={{ margin: '0px !important', fontSize: '50px !important', width: '30px !important', height: '65px !important' }}>3</p>
                                            </span>
                                            <Typography variant="body1">Caso tenha alguma dificuldade, entre em contato conosco através do email: <b>oficinas@mapfre.com.br</b>.</Typography>
                                        </div>
                                    </Grid>
                                    <Grid item className="entryes-form" style={{ padding: '20px !important', color: 'white !important', display: 'flex !important', flexDirection: ' column !important' }} xs={12} sm={5}>
                                        <Paper elevation={3} style={{ padding: 20 }}>
                                            <ValidatorForm onSubmit={() => this.handleSubmit()}>
                                                <Grid container>
                                                    <Grid item xs={12} style={{ margin: '10px 0px', padding: '0px 5px' }}>
                                                        <Typography variant="h6">Preencha as informações</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} style={{ margin: '10px 0px', padding: '0px 5px' }}>
                                                        <span style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}><Typography variant="body2" style={{ fontSize: 14, fontWeight: 700 }}>CPF do segurado</Typography></span>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            size="small"
                                                            type="cel"
                                                            variant="outlined"
                                                            placeholder="000.000.000-00"
                                                            value={this.state.cpfNumber}
                                                            onChange={this.handleChange('cpfNumber')}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={5} style={{ margin: '10px 0px', padding: '0px 5px' }}>
                                                        <span style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}><Typography variant="body2" style={{ fontSize: 14, fontWeight: 700 }}>Placa do veículo</Typography></span>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            size="small"
                                                            type="a"
                                                            variant="outlined"
                                                            placeholder="ABC-1A23"
                                                            value={this.state.carPlate}
                                                            onChange={this.handleChange('carPlate')}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={7} style={{ margin: '10px 0px', padding: '0px 5px' }}>
                                                        <span style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}><Typography variant="body2" style={{ fontSize: 14, fontWeight: 700 }}>Data da retirada do veículo na oficina</Typography></span>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            size="small"
                                                            type="cel"
                                                            variant="outlined"
                                                            placeholder="00/00/0000"
                                                            value={this.state.exitDate}
                                                            onChange={this.handleChange('exitDate')}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2} style={{ margin: '10px 0px', padding: '0px 5px' }}></Grid>
                                                    <Grid item xs={8} style={{ margin: '10px 0px', padding: '0px 5px' }}>
                                                        <Button
                                                            fullWidth
                                                            type="submit"
                                                            variant="contained"
                                                            color="primary"
                                                        >
                                                            Salvar
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={2} style={{ margin: '10px 0px', padding: '0px 5px' }}></Grid>
                                                </Grid>
                                            </ValidatorForm>
                                        </Paper>
                                    </Grid>
                                </>
                        }
                    </Grid>
                    <Dialog
                        open={this.state.openDialog}
                        keepMounted
                        onClose={() => this.setState({ openDialog: false })}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <div style={{ minWidth: 400, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <span style={{ padding: '10px 15px', background: '#c00', color: 'white', fontSize: 25, fontWeight: 700 }} onClick={() => this.setState({ openDialog: false, dialogMessage: '' })}>X</span>
                            </div>
                            <DialogTitle id="alert-dialog-slide-title" style={{ textAlign: 'center', padding: 30 }}>{this.state.dialogMessage}</DialogTitle>
                        </div>
                    </Dialog>
                </div >
            </>
        )
    }
}

export default NewEntry;