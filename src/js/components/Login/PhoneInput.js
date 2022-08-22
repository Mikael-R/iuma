import React, { Component } from "react";
import { connect } from "react-redux";

import { Input, Button, Typography, CircularProgress, Snackbar, Grid, MenuItem, FormHelperText, TextField, FormControlLabel, Switch, Select, InputLabel, FormControl } from '@material-ui/core';
import { EditOutlined, SaveOutlined } from '@material-ui/icons';
import { cellPhoneMask } from 'js/library/utils/helpers';

import { authSMS_v1 } from 'js/library/utils/API/authSMS_v1';
import { validateSMS_v1 } from 'js/library/utils/API/validateSMS_v1';
import setAdditionalInfo from 'js/library/utils/API/setAdditionalInfo';
import getAccessToken from 'js/library/utils/API/getAccessToken_v1';
import { formExtra } from 'js/library/utils/formExtraUtils';

import getUserInfo_v1WithCellphone from "js/library/utils/API/getUserInfo_v1WithCellphone";
import { phoneInputAction } from 'js/core/actions/phoneInputActions';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { findIndexInArray, findValueInArray, trackEventMatomo, getLastUserInfo } from "js/library/utils/helpers";
import { configJson } from 'js/library/utils/firebaseUtils';
import { Link } from 'react-router-dom';
import { store } from 'js/core/configureStore';

import CustomModal from 'js/components/UI/CustomModal/CustomModal';
import LoadingBar from 'js/components/UI/LoadingBar/LoadingBar'

class PhoneInput extends Component {

    constructor() {
        super();

        const partnerList = findValueInArray(store.getState().mapfreQueryModel.partnerList, 'channelSource', 'triibo-clubmapfre');

        this.state = {
            cellPhone: store.getState().mapfreQueryModel.isMapfreV3 ? store.getState().mapfreQueryModel.triiboId.split('@')[0] : '',
            code: '',
            transactionId: null,
            user: null,
            email: store.getState().mapfreQueryModel.isMapfreV3 ? findValueInArray(partnerList.contactList, 'type', 'email').value : '',
            emailCodify: 'a',

            isMapfre: store.getState().mapfreQueryModel.isMapfreV3,
            step: store.getState().mapfreQueryModel.isMapfreV3 ? 2 : 1,
            loading: false,
            openLabel: false,
            errorLabel: '',
            resendSMS: false,
            errorTimeout: false,
            errorMessage: "",

            userInfo: {},
            maritalStatus: null,
            hasKids: false,
            numKids: null,
            hasPets: false,
            namePets: null,
            occupation: null,
            scholarity: null,
            teamSupport: null,
            musicStyle: null,
            hobbie: null,
            channel: null,
            hasCar: null,
            contributeSurvey: true,
            grownUpChildren: false,
            smallChildren: false,

            newMaritalStatus: null,
            newHasKids: false,
            newNumKids: null,
            newHasPets: false,
            newNamePets: null,
            newOccupation: null,
            newScholarity: null,
            newTeamSupport: null,
            newMusicStyle: null,
            newHobbie: null,
            newChannel: null,
            newHasCar: null,
            newContributeSurvey: true,
            newGrownUpChildren: false,
            newSmallChildren: false,

            loaded2: false
        };

        //enviando sms de autenticação, caso o usuário já tenha cadastro
        if (store.getState().mapfreQueryModel.isMapfreV3) {
            let emailSep = this.state.email.split("@");
            let starCount = '';
            for (var i = 0; i <= emailSep[0].length - 3; i++) starCount = starCount + '*';
            let emailCodify = emailSep[0].slice(0, 2) + starCount + '@' + emailSep[1]

            this.state.emailCodify = emailCodify;

            this.handleResendSMSTimeout();

            authSMS_v1(this.state.cellPhone).then((resultSendSMS) => {
                if (resultSendSMS.error === null) {
                    this.setState({ transactionId: resultSendSMS.success.transactionId })
                }
                else {
                    console.log(resultSendSMS.error.errorCode);
                    if (resultSendSMS.error.errorCode === 1005 || resultSendSMS.error.errorCode === '1005') {
                        this.setState({ loading: false, errorTimeout: true, openLabel: true, errorLabel: 'Número de solicitações excedida. Aguarde 15 minutos para tentar novamente.' })
                    } else {
                        this.setState({ loading: false, errorTimeout: true, openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
                    }
                }
            });
        };

        window.pathname = null;
    }

    sendSMS = () => {
        this.setState({ loading: true, openLabel: false });
        this.handleResendSMSTimeout();

        const userInfoRequestCellPhone = {
            "contactList": [
                {
                    "type": "cellPhone",
                    "value": '+' + this.state.cellPhone.replace(/\D/g, '')
                }
            ]
        };
        trackEventMatomo('Modal login', 'click', 'botao', 'Próximo');

        //verificar se o celular utulizado já não está atribuido a alguma conta existente
        getUserInfo_v1WithCellphone(userInfoRequestCellPhone).then((reply) => {
            this.setState({ user: reply })
            if (reply === null) {
                //usuario não existe por celular
                authSMS_v1(this.state.cellPhone).then((resultSendSMS) => {
                    if (resultSendSMS.error === null) {
                        this.setState({ loading: false, step: 2, transactionId: resultSendSMS.success.transactionId })
                    }
                    else {
                        console.log(resultSendSMS.error.errorCode);
                        if (resultSendSMS.error.errorCode === 1005 || resultSendSMS.error.errorCode === '1005') {
                            this.setState({ loading: false, errorTimeout: true, openLabel: true, errorLabel: 'Número de solicitações excedida. Aguarde 15 minutos para tentar novamente.' })
                        } else {
                            this.setState({ loading: false, errorTimeout: true, openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
                        }
                    }
                });
            }
            else {
                //usuario existe

                //verificar se existe partner mapfre
                const isMapfre = findIndexInArray(reply.partnerList, 'partnerId', configJson.partnerIdClubMapfre);

                let cpfReply = findValueInArray(reply.documentList, 'type', 'cpf');
                cpfReply = cpfReply === null ? null : cpfReply.value;
                let cpfMapfreQuery = findValueInArray(store.getState().mapfreQueryModel.documentList, 'type', 'cpf');
                cpfMapfreQuery = cpfMapfreQuery === null ? null : cpfMapfreQuery.value;

                if (isMapfre === null && (cpfReply === null || (cpfReply !== null && cpfReply === cpfMapfreQuery))) {
                    authSMS_v1(this.state.cellPhone).then((resultSendSMS) => {
                        if (resultSendSMS.error === null) {
                            this.setState({ loading: false, step: 2, transactionId: resultSendSMS.success.transactionId })
                        }
                        else {
                            console.log(resultSendSMS.error.errorCode);
                            if (resultSendSMS.error.errorCode === 1005 || resultSendSMS.error.errorCode === '1005') {
                                this.setState({ loading: false, errorTimeout: true, openLabel: true, errorLabel: 'Número de solicitações excedida. Aguarde 15 minutos para tentar novamente.' })
                            } else {
                                this.setState({ loading: false, errorTimeout: true, openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
                            }
                        }
                    });
                }
                else {
                    this.setState({ openSnackbar: true, messageSnackbar: 'Este telefone celular já foi utilizado por outro CPF. Utilize outro número ou envie um e-mail com seus dados para relacionamento@mapfre.com.br para que possamos completar seu cadastro.', loading: false });
                }
            }
        });
    }

    validateSMS = () => {
        this.setState({ loading: true, openLabel: false });
        validateSMS_v1(this.state.code, this.state.cellPhone, this.state.transactionId).then((resultValidateSMS) => {
            if (resultValidateSMS.error === null) {
                this.props.phoneInputComponent(this.state.user, this.state.cellPhone);
            }
            else {
                //tratar erro
                this.setState({ loading: false, openLabel: true, errorLabel: 'Código inválido.' })
            }
        })
    };

    handleChange = name => event => {
        if (name === 'cellPhone') {
            this.setState({ [name]: cellPhoneMask(event.target.value) })
        }
        else if (event.target.value.length < 7) {
            this.setState({ [name]: event.target.value })
        }
        else if (this.state.step === 3) {
            this.setState({ [name]: event.target.value, editUser2: true, })
        }
    };

    handleAddInfo = name => event => {
        if (name === "newHasPets") {
            this.setState({
                [name]: !this.state.newHasPets,
                editUser2: true,
            });
        } else if (name === "newHasKids") {
            this.setState({
                [name]: !this.state.newHasKids,
                editUser2: true,
            });
            if (!this.state.newHasKids === false) {
                this.setState({ newGrownUpChildren: false, newSmallChildren: false })
            }
        } else if (name === "newGrownUpChildren") {
            this.setState({
                [name]: !this.state.newGrownUpChildren,
                editUser2: true,
            });
        } else if (name === "newSmallChildren") {
            this.setState({
                [name]: !this.state.newSmallChildren,
                editUser2: true,
            });
        } else if (name === "newContributeSurvey") {
            this.setState({
                [name]: !this.state.newContributeSurvey,
                editUser2: true,
            });
        }
    }


    handleSubmitAditionalInfo = () => {
        this.setState({ loaded2: true })
        let userInfo = getLastUserInfo();
        let data = {
            maritalStatus: this.state.newMaritalStatus,
            hasKids: this.state.newHasKids,
            ageKids: this.state.ageNumKids.toString(),
            hasPets: this.state.newHasPets,
            namePets: this.state.newNamePets,
            occupation: this.state.newOccupation,
            scholarity: this.state.newScholarity,
            teamSupport: this.state.newTeamSupport,
            interest: this.state.newInterest,
            musicStyle: this.state.newMusicStyle,
            hobbie: this.state.newHobbie,
            channel: this.state.newChannel,
            hasCar: this.state.newHasCar,
            contributeSurvey: this.state.newContributeSurvey,
            grownUpChildren: this.state.newGrownUpChildren,
            smallChildren: this.state.newSmallChildren,
        }
        getAccessToken(userInfo.uId, 2).then(token => {
            setAdditionalInfo(token, 'Mapfre', data).then(response => {
                if (response.data.success) {
                    localStorage.setItem('additionalInfoOk', true);
                    window.top.location = document.location.origin + '/home-clubmapfre';
                } else {
                    this.setState({ loaded2: false, errorMessage: response.error })
                }
            })
        })
    }

    getNewCode = () => {
        this.handleResendSMSTimeout();
        trackEventMatomo('Modal login', 'click', 'botao', 'Solicitar novamente');

        this.setState({ errorLabel: '' });

        authSMS_v1(this.state.cellPhone).then((resultSendSMS) => {
            if (resultSendSMS.error === null) {
                this.setState({ transactionId: resultSendSMS.success.transactionId })
            }
            else {
                console.log(resultSendSMS.error.errorCode);
                if (resultSendSMS.error.errorCode === 1005 || resultSendSMS.error.errorCode === '1005') {
                    this.setState({ loading: false, errorTimeout: true, openLabel: true, errorLabel: 'Número de solicitações excedida. Aguarde 15 minutos para tentar novamente.' })
                } else {
                    this.setState({ loading: false, errorTimeout: true, openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
                }
            }
        });
    };


    handleSuccess = () => {
        let userInfo = getLastUserInfo();
        userInfo = userInfo.partnerList[findIndexInArray(userInfo.partnerList, 'partnerId', configJson.partnerIdClubMapfre)]

        if (this.state.step !== 3 && localStorage.getItem('firstAccess')) {
            this.setState({ step: 3 })
        } else if (this.state.step !== 3 && !localStorage.getItem('firstAccess')) {
            window.top.location = document.location.origin + '/home-clubmapfre';
        }
    }

    handleResendSMSTimeout = () => {
        this.setState({ resendSMS: false });

        const timer = setTimeout(() => {
            this.setState({ resendSMS: true });
            clearTimeout(timer);
        }, 30000);
    }

    componentDidUpdate = () => {
        if (this.props.success && window.pathname !== null) {
            this.handleSuccess();
        }
    }

    render() {
        if (this.state.step === 1 || this.state.step === 2)
            return (
                <CustomModal width={700}>
                    <ValidatorForm onSubmit={this.state.step === 1 ? () => this.sendSMS() : () => this.validateSMS()}>
                        <Grid container>
                            <Grid item sm={2} xs={12}></Grid>
                            <Grid item sm={8} xs={12}>
                                <div style={this.state.step === 1 ? null : { display: 'none' }}>
                                    <Typography variant='h6' style={this.state.step !== 1 ? { color: '#4A4A4A40' } : { color: '#000000' }}>Precisamos de seu celular para enviar um código de autenticação.</Typography>

                                    <Input color='secondary' type='tel' disabled={this.state.step !== 1} value={this.state.cellPhone} onChange={this.handleChange('cellPhone')} placeholder='+55 (00) 00000-0000' autoFocus={this.state.step === 1} fullWidth={true} style={{ paddingTop: '15px' }}></Input>
                                </div>

                                <div style={this.state.step === 2 ? null : { display: 'none' }}>
                                    <Typography variant='h6' style={this.state.step === 1 ? { color: '#4A4A4A40', paddingTop: '25px' } : { color: '#000000', paddingTop: '30px' }}>
                                        Digite abaixo o código que enviamos por SMS para o número: (**) *****-{this.state.cellPhone.replace(/\D/g, "").substr(9, 4)} {!store.getState().mapfreQueryModel.isMapfreV3 ? '.' : 'e para seu email ' + this.state.emailCodify}
                                    </Typography>

                                    <Input color='secondary' type='tel' style={{ paddingTop: '15px' }} fullWidth={true} onChange={this.handleChange('code')} value={this.state.code} placeholder="000000" autoFocus={this.state.step === 2} disabled={this.state.step === 1}></Input>
                                </div>
                            </Grid>
                        </Grid>

                        {this.state.openLabel
                            ? <Typography variant="caption" color="primary" >{this.state.errorLabel}</Typography>
                            : null
                        }
                        <br />

                        <div style={{ paddingBottom: 30 }}>
                            {this.state.step === 2
                                ? !this.state.errorTimeout
                                    ? !this.state.resendSMS
                                        ? <LoadingBar />
                                        : <Grid container>
                                            {
                                                store.getState().mapfreQueryModel.isMapfreV3 ?
                                                    <Grid item xs={12} style={{ paddingBottom: 5, marginBottom: 5, borderBottom: '1px solid lightgrey' }}>
                                                        <Typography variant='body2' style={{ color: '#000000' }}>Não recebeu o SMS?</Typography>
                                                        <Typography variant='body2' style={{ color: '#000000' }}>verifique em seu email {this.state.emailCodify}</Typography>
                                                    </Grid>
                                                    : null
                                            }
                                            <Grid item xs={12}>
                                                <Typography variant='body2' style={{ color: '#000000' }}>{store.getState().mapfreQueryModel.isMapfreV3 ? 'Ainda assim não localizou o código?' : 'Ainda não recebeu o código?'}</Typography>
                                                <Typography variant='body2' style={{ color: '#0000FF' }}>
                                                    <u onClick={() => this.getNewCode()} style={{ cursor: 'pointer', display: 'block' }}>
                                                        Solicite novamente
                                                    </u>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    : null
                                : null
                            }
                        </div>

                        <Grid container>
                            <Grid item sm={5} xs={12} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                {
                                    this.state.step === 2 && store.getState().mapfreQueryModel.isMapfreV3
                                        ? <Typography variant='body2' style={{ color: '#0000FF' }}>
                                            <Link onClick={() => trackEventMatomo('Modal login', 'click', 'botao', 'Dificuldades no acesso')} to='/dificuldadeAcesso-clubmapfre' style={{ fontSize: 12, cursor: 'pointer', display: 'block' }}>
                                                Dificuldades no acesso? <br />
                                                Clique aqui para informar.
                                            </Link>
                                        </Typography>
                                        : null
                                }
                            </Grid>
                            <Grid item sm={2} xs={12} style={{ margin: '10px 0', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                <Button
                                    className='login_button' disabled={(this.state.step === 1 && this.state.cellPhone.length !== 19) || (this.state.step === 2 && this.state.code.length !== 6) || this.state.loading} type='submit' variant='contained' style={{ textTransform: 'none', color: '#fff', backgroundColor: '#CC0000', paddingTop: '10px' }} size="large">
                                    {this.state.loading
                                        ? <CircularProgress style={{ color: '#fff' }} />
                                        : <Typography variant='h6'>{this.state.step === 1 ? 'Próximo' : 'Entrar'}</Typography>
                                    }
                                </Button>
                            </Grid>
                            <Grid item sm={5} xs={12} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                {
                                    this.state.step === 2 && store.getState().mapfreQueryModel.isMapfreV3
                                        ? <Typography variant='body2' style={{ color: '#0000FF' }}>
                                            <Link onClick={() => trackEventMatomo('Modal login', 'click', 'botao', ' Deseja alterar o número de celular cadastrado')} to='/mudarCelular-clubmapfre' style={{ fontSize: 12, cursor: 'pointer', display: 'block' }}>
                                                Deseja alterar o número de celular cadastrado? <br />
                                                Clique aqui e solicite a alteração.
                                            </Link>
                                        </Typography>
                                        : null
                                }
                            </Grid>
                        </Grid>

                        {/* {this.state.step === 2 && store.getState().mapfreQueryModel.isMapfreV3 ?
                        <Typography variant='body2' style={{ marginTop: 30, color: '#0000FF' }}><Link to='/mudarCelular-clubmapfre'>Mudou de número? Clique aqui e solicite a alteração</Link></Typography>
                        : null
                    } */}

                    </ValidatorForm>

                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={this.state.openSnackbar}
                        onClose={() => this.setState({ openSnackbar: false })}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{this.state.messageSnackbar}</span>}
                    />
                </CustomModal>
            );
        else if (this.state.step === 3)
            return (
                <CustomModal width={800}>
                    <Typography variant='body2'>Olá, tudo bem? queremos conhecer mais você para oferecer campanhas, promoções e descontos que te agradem!</Typography>
                    {
                        this.state.loaded2 === true
                            ? <div align='center'>
                                <CircularProgress style={{ padding: '150px 20px', boxSizing: 'content-box' }} />
                            </div>
                            : <ValidatorForm onSubmit={this.handleSubmitAditionalInfo}>

                                <Grid container spacing={0}>
                                    <Grid item sm={5} xs={12}>

                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newHasCar === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="hasCar-label">Possui Veículo?</InputLabel>
                                            <Select
                                                labelId="hasCar-label"
                                                value={this.state.editUser2 ? this.state.newHasCar : this.state.hasCar}
                                                onChange={this.handleAddInfo("newHasCar")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                
                                                {
                                                    formExtra.hasCar.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newMaritalStatus === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                        </FormControl>

                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newMaritalStatus === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="maritalStatus-label">Status de relacionamento</InputLabel>
                                            <Select
                                                labelId="maritalStatus-label"
                                                value={this.state.editUser2 ? this.state.newMaritalStatus : this.state.maritalStatus}
                                                onChange={this.handleAddInfo("newMaritalStatus")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                
                                                {
                                                    formExtra.maritalStatus.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newMaritalStatus === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                        </FormControl>

                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newChannel === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="channel-label">Canal de comunicação preferencial</InputLabel>
                                            <Select
                                                labelId="channel-label"
                                                value={this.state.editUser2 ? this.state.newChannel : this.state.channel}
                                                onChange={this.handleAddInfo("newChannel")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                
                                                {
                                                    formExtra.channel.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>

                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newScholarity === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="scholarity-label">Nível de escolaridade</InputLabel>
                                            <Select
                                                labelId="scholarity-label"
                                                value={this.state.editUser2 ? this.state.newScholarity : this.state.scholarity}
                                                onChange={this.handleAddInfo("newScholarity")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                

                                                {
                                                    formExtra.scholarity.map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newScholarity === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                        </FormControl>

                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newTeamSupport === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="teamSupport-label">Time que torce</InputLabel>
                                            <Select
                                                labelId="teamSupport-label"
                                                value={this.state.editUser2 ? this.state.newTeamSupport : this.state.teamSupport}
                                                onChange={this.handleAddInfo("newTeamSupport")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                
                                                {
                                                    formExtra.teamSupport.sort((a, b) => {
                                                        if (a.name === 'Outro') {
                                                            return 999
                                                        }
                                                        else if (a.name > b.name) {
                                                            return 1
                                                        } else {
                                                            return -1
                                                        }
                                                    }).map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newTeamSupport === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                        </FormControl>


                                        <div>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={this.state.editUser2 ? this.state.newHasPets : this.state.hasPets}
                                                        onChange={this.handleAddInfo('newHasPets')}
                                                        name="hasPets"
                                                    />
                                                }
                                                label="Possui Pets?"
                                            />
                                            <TextField
                                                id="namePets"
                                                label="nome(s) do(s) pet(s)"
                                                type="text" style={{ paddingBottom: '20px' }}
                                                disabled={!this.state.newHasPets}
                                                fullWidth
                                                value={this.state.editUser2 ? this.state.newNamePets : this.state.namePets}
                                                onChange={this.handleAddInfo('newNamePets')}
                                            />
                                        </div>

                                    </Grid>

                                    <Grid item sm={2} xs={false}>
                                        <div style={{ width: 2, height: '100%', margin: '0 auto', backgroundColor: '#CB0000', display: 'block' }}></div>
                                    </Grid>

                                    <Grid item sm={5} xs={12}>

                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newMusicStyle === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="musicStyle-label">Estilo musical</InputLabel>
                                            <Select
                                                labelId="musicStyle-label"
                                                value={this.state.editUser2 ? this.state.newMusicStyle : this.state.musicStyle}
                                                onChange={this.handleAddInfo("newMusicStyle")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                

                                                {
                                                    formExtra.musicStyle.sort((a, b) => (a.name === 'Outro')? 999 : (a.value > b.value) ? 1 : -1).map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newMusicStyle === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                        </FormControl>

                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newHobbie === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="hobbie-label">Principal hobbie</InputLabel>
                                            <Select
                                                labelId="hobbie-label"
                                                value={this.state.editUser2 ? this.state.newHobbie : this.state.hobbie}
                                                onChange={this.handleAddInfo("newHobbie")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                
                                                {
                                                    formExtra.hobbie.sort((a, b) => (a.name === 'Outro')? 999 : (a.value > b.value) ? 1 : -1).map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newHobbie === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                        </FormControl>

                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newOccupation === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="occupation-label">Profissão</InputLabel>
                                            <Select
                                                labelId="occupation-label"
                                                value={this.state.editUser2 ? this.state.newOccupation : this.state.occupation}
                                                onChange={this.handleAddInfo("newOccupation")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                
                                                {
                                                    formExtra.occupation.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{this.state.errorLabelAditionalInfo && this.state.newOccupation === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                        </FormControl>

                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newInterest === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="interests-label">Quais temas você gostaria de receber?</InputLabel>
                                            <Select
                                                labelId="interests-label"
                                                value={this.state.editUser2 ? this.state.newInterest : this.state.interest}
                                                onChange={this.handleAddInfo("newInterest")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                

                                                {
                                                    formExtra.interest.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newMusicStyle === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                        </FormControl>

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.editUser2 ? this.state.newHasKids : this.state.hasKids}
                                                    onChange={this.handleAddInfo('newHasKids')}
                                                    name="hasKids"
                                                />
                                            }
                                            label="Possui filho(s)?"
                                        />
                                        <div style={{ display: 'flex' }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        disabled={!this.state.newHasKids}
                                                        checked={this.state.editUser2 ? this.state.newGrownUpChildren : this.state.grownUpChildren}
                                                        onChange={this.handleAddInfo('newGrownUpChildren')}
                                                        name="grownUpChildren"
                                                    />
                                                }
                                                label="Adulto(s)?"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        disabled={!this.state.newHasKids}
                                                        checked={this.state.editUser2 ? this.state.newSmallChildren : this.state.smallChildren}
                                                        onChange={this.handleAddInfo('newSmallChildren')}
                                                        name="smallChildren"
                                                    />
                                                }
                                                label="Criança(s)?"
                                            />
                                        </div>
                                        <FormControl error={this.state.errorLabelAditionalInfo && this.state.newInterest === null} style={{ paddingBottom: '20px' }} fullWidth >
                                            <InputLabel id="ageKids-label">Qual a faixa etária das crianças?</InputLabel>
                                            <Select
                                                disabled={!this.state.newSmallChildren}
                                                labelId="ageKids-label"
                                                value={this.state.editUser2 ? this.state.newAgeKids : this.state.ageKids}
                                                onChange={this.handleAddInfo("newAgeKids")}
                                                color='secondary' style={{ fontSize: 12 }}
                                            >
                                                
                                                {
                                                    formExtra.ageKids.map(item => {
                                                        return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newAgeKids === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                        </FormControl>

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.editUser2 ? this.state.newContributeSurvey : this.state.contributeSurvey}
                                                    style={{
                                                        '&.Mui-checked': {
                                                            color: 'green'
                                                        }
                                                    }}
                                                    onChange={this.handleAddInfo('newContributeSurvey')}
                                                    name="contributeSurvey"
                                                />
                                            }
                                            label="Gostaria de contribuir respondendo pesquisas."
                                        />

                                    </Grid>

                                    <Typography variant="body1" style={{ display: this.state.errorMessage !== "" ? 'block' : 'none' }}>{this.state.errorMessage}</Typography>

                                    <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <div>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                type="submit"
                                                color="primary"
                                                style={{ margin: '0px 5px' }}
                                                disabled={!this.state.editUser2}
                                                startIcon={<SaveOutlined />}
                                            >
                                                Salvar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                type="submit"
                                                color="secondary"
                                                onClick={() => { window.top.location = document.location.origin + '/home-clubmapfre' }}
                                                style={{ margin: '0px 5px' }}
                                                startIcon={<EditOutlined />}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                    }
                </CustomModal>
            )
    }
}

function mapStateToProps(state) {
    return {
        loading: state.phoneInputComponent.loading,
        success: state.phoneInputComponent.success,
        error: state.phoneInputComponent.error,
    };
}

//envia as props para as Actions
const mapDispatchToProps = dispatch => ({
    phoneInputComponent: (user, cellPhone) => phoneInputAction(dispatch, user, cellPhone)
})

export default connect(mapStateToProps, mapDispatchToProps)(PhoneInput);