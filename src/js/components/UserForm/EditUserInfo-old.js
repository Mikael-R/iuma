import React, { Component } from "react";
import { connect } from 'react-redux';
import { compose } from "recompose";

import { FormHelperText, FormControl, InputLabel, Select, MenuItem, Grid, Typography, TextField, Paper, Snackbar, CircularProgress, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button, IconButton, FormControlLabel, FormLabel, Checkbox, Radio, Switch } from "@material-ui/core";
import { EditOutlined, SaveOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import { ValidatorForm } from 'react-material-ui-form-validator';
import axios from 'axios';
import { apiGetUserInfo_v1 } from "js/library/utils/API/getUserInfo_v1.js";
import { editUserInfoAction } from 'js/core/actions/editUserInfoActions.js';
import { editUserAdditionalInfo } from 'js/core/actions/editUserAdditionalInfo';
import { getLastUserInfo, findIndexInArray, findValueInArray, confirmDate, maskCEP, maskDate, define, trackEventMatomo } from 'js/library/utils/helpers';
import { formExtra } from 'js/library/utils/formExtraUtils';
import { configJson } from 'js/library/utils/firebaseUtils';

const styles = theme => ({
    specialOutlineOn: {
        borderColor: "#4A4A4A !important",
        borderWidth: 1,
        '&:hover:not($disabled):not($error):not($focused):before': {
            borderWidth: 10,
        },
    },
    specialOutlineOff: {
        borderWidth: 0
    },
    // specialValues: {
    //     transform: 'translateX(-5)',
    //     borderTop: 0,
    //     borderLeft: 0,
    //     borderRight: 0,
    //     borderColor: '#000',
    //     opacity: 0.5,
    //     borderRadius: 0,
    // },
    labelProps: {
        color: 'black !important',
        opacity: 0.6,
        marginTop: '10px'
    },
    editLabel: {
        float: 'right',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // button: {
    //     backgroundColor: '#CC0000',
    //     color: 'white',
    //     '&:hover':{
    //         backgroundColor: '#cc0000',
    //         opacity: 0.7
    //     }
    // },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
});

class EditUserInfo extends Component {
    constructor(props, context) {
        super(props, context);

        const initModel = getLastUserInfo();
        const partnerModel = findValueInArray(initModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre);

        const userInfoGet = {
            "documentList": [{
                "type": "cpf",
                "value": initModel.documentList[findIndexInArray(initModel.documentList, 'type', 'cpf')].value
            }]
        };

        apiGetUserInfo_v1(["getUserInfo"], userInfoGet).then((result) => {

            const model = result.error === null ? result.success.userInfo : initModel;
            const partnerModel = findValueInArray(model.partnerList, 'partnerId', configJson.partnerIdClubMapfre)

            const aliasName = partnerModel.aliasName;
            const email = findIndexInArray(partnerModel.contactList, 'type', 'email') === null ? '' : partnerModel.contactList[findIndexInArray(partnerModel.contactList, 'type', 'email')].value;
            const address = partnerModel.addressList[findIndexInArray(partnerModel.addressList, 'type', 'principal')];

            const tempDate = partnerModel.birthDate !== undefined ? new Date(partnerModel.birthDate) : null;

            const optIn = findIndexInArray(partnerModel.optInList, 'optInId', '-TermoDeUsoClubMapfre-02') === null ? false : true;

            //informações adicionais
            const additionalInfo = define(partnerModel.additionalInfo);

            const maritalStatus = !additionalInfo ? null : define(additionalInfo.maritalStatus);
            const numKids = !additionalInfo ? null : define(additionalInfo.numKids);
            const occupation = !additionalInfo ? null : define(additionalInfo.occupation);
            const scholarity = !additionalInfo ? null : define(additionalInfo.scholarity);
            const teamSupport = !additionalInfo ? null : define(additionalInfo.teamSupport);
            const musicStyle = !additionalInfo ? null : define(additionalInfo.musicStyle);
            const hobbie = !additionalInfo ? null : define(additionalInfo.hobbie);
            const favColor = !additionalInfo ? null : define(additionalInfo.favColor);
            const channel = !additionalInfo ? null : define(additionalInfo.channel);
            const artist = !additionalInfo ? null : define(additionalInfo.artist);
            const hasKids = !additionalInfo ? false : !additionalInfo.hasKids ? false : define(additionalInfo.hasKids);
            const hasPets = !additionalInfo ? false : !additionalInfo.hasPets ? false : define(additionalInfo.hasPets);
            const ageKids = !additionalInfo ? null : !additionalInfo.ageKids ? null : define(additionalInfo.ageKids);
            const namePets = !additionalInfo ? null : !additionalInfo.namePets ? null : define(additionalInfo.namePets);
            const interest = !additionalInfo ? null : !additionalInfo.interest ? null : define(additionalInfo.interest);
            const hasCar = !additionalInfo ? null : !additionalInfo.hasCar ? null : define(additionalInfo.hasCar);
            const contributeSurvey = !additionalInfo ? null : !additionalInfo.contributeSurvey ? null : define(additionalInfo.contributeSurvey);

            this.setState({
                //campos de exibição
                aliasName,
                email,
                gender: String(parseInt(partnerModel.gender, 10) - 1),
                birthDate: tempDate === null ? '' : (tempDate.getDate() >= 10 ? tempDate.getDate() : '0' + tempDate.getDate()) + '/' + (tempDate.getMonth() + 1 >= 10 ? tempDate.getMonth() + 1 : '0' + (tempDate.getMonth() + 1)) + '/' + tempDate.getFullYear(),
                address,
                optInList: partnerModel.optInList === undefined ? null : partnerModel.optInList,
                optIn,

                //campos editaveis
                newAliasName: aliasName,
                newEmail: email,
                newGender: String(parseInt(partnerModel.gender, 10) - 1),
                newBirthDate: tempDate === null ? '' : (tempDate.getDate() >= 10 ? tempDate.getDate() : '0' + tempDate.getDate()) + '/' + (tempDate.getMonth() + 1 >= 10 ? tempDate.getMonth() + 1 : '0' + (tempDate.getMonth() + 1)) + '/' + tempDate.getFullYear(),
                newAddressExtra: address.extra,
                newAddressCEP: address.zipCode,
                newAddressNumber: address.number,
                newFullAddress: address,
                newOptInList: partnerModel.optInList === undefined ? null : partnerModel.optInList,
                newOptin: optIn,

                maritalStatus,
                hasKids,
                numKids,
                ageKids,
                hasPets,
                namePets,
                occupation,
                scholarity,
                teamSupport,
                musicStyle,
                hobbie,
                channel,
                interest,
                hasCar,
                contributeSurvey,

                newMaritalStatus: maritalStatus,
                newNumKids: numKids,
                newOccupation: occupation,
                newScholarity: scholarity,
                newTeamSupport: teamSupport,
                newMusicStyle: musicStyle,
                newHobbie: hobbie,
                newFavColor: favColor,
                newChannel: channel,
                newArtist: artist,
                newHasKids: hasKids,
                newAgeKids: ageKids,
                newHasPets: hasPets,
                newNamePets: namePets,
                newInterest: interest,
                newHasCar: hasCar,
                newContributeSurvey: contributeSurvey,

                //validação
                userInfo: model,
                loaded: true,
                loaded2: true
            })
        });

        this.state = {
            uId: initModel.uId,
            userInfo: null,

            //dados exibição
            cpf: partnerModel.documentList[findIndexInArray(partnerModel.documentList, 'type', 'cpf')].value,
            cellPhone: findValueInArray(initModel.contactList, 'type', 'cellPhone') === null ? '' : findValueInArray(initModel.contactList, 'type', 'cellPhone').value,
            name: partnerModel.fullName,
            aliasName: null,
            email: null,
            birthDate: null,
            address: null,
            optIn: false,
            optInList: null,

            //dados cadastro
            newAliasName: '',
            newEmail: '',
            newOptin: false,
            newOptInList: null,
            newAddressCEP: null,
            newFullAddress: null,
            newAddressExtra: '',
            newAddressNumber: null,
            newBirthDate: '',
            newGender: '0',

            //cadastro extra
            newMaritalStatus: null,
            newNumKids: null,
            newOccupation: null,
            newScholarity: null,
            newTeamSupport: null,
            newMusicStyle: null,
            newHobbie: null,
            newFavColor: null,
            nweChannel: null,
            newArtist: null,
            newHasKids: false,
            newHasPets: false,
            newAgeKids: null,
            newNamePets: null,
            newInterest: null,
            newHasCar: null,
            newContributeSurvey: false,

            maritalStatus: null,
            numKids: null,
            occupation: null,
            scholarity: null,
            teamSupport: null,
            musicStyle: null,
            hobbie: null,
            favColor: null,
            channel: null,
            artist: null,

            hasKids: false,
            hasPets: false,
            ageKids: null,
            namePets: null,
            interest: null,
            hasCar: null,
            contributeSurvey: false,

            //verificações
            openSnackbar: false,
            editUser: false,
            editUser2: false,
            loaded: false,
            loaded2: false,
            lastInfo: true,
            editDialog: false,
            open: false,
            errorLabelAdditionalInfo: false
        };

    }

    handleSubmit = () => {
        if (this.state.newAddressCEP.length !== 9) {
            this.setState({ openSnackbar: true, messageSnackbar: 'CEP inválido.' })
        }
        else if (confirmDate(this.state.newBirthDate) === false) {
            this.setState({ openSnackbar: true, messageSnackbar: 'Data de nascimento inválida!' });
        }
        else {
            if (!this.state.newOptin) localStorage.setItem('optinObj', null);
            this.props.editUserInfoComponent(
                this.state.uId,
                this.state.newAliasName,
                this.state.newEmail,
                this.state.newOptInList,
                this.state.newFullAddress,
                this.state.newAddressExtra,
                this.state.newAddressNumber,
                this.state.newBirthDate,
                this.state.newGender,
                this.state.userInfo
            );

            this.setState({ open: true, loaded: false, lastInfo: false });
        }
    };

    handleClose = (param) => {
        this.setState({ open: param });
    };

    handleSubmitAditionalInfo = async () => {
        this.setState({ loaded2: false });
        await editUserAdditionalInfo(this.state.newMaritalStatus, this.state.newNumKids, this.state.newOccupation, this.state.newScholarity, this.state.newTeamSupport, this.state.newMusicStyle, this.state.newHobbie, this.state.newFavColor, this.state.newChannel, this.state.newArtist, this.state.hasCar, this.state.contributeSurvey);
        this.setState({ open: true, loaded2: true, editUser2: false, maritalStatus: this.state.newMaritalStatus, numKids: this.state.newNumKids, occupation: this.state.newOccupation, scholarity: this.state.newScholarity, teamSupport: this.state.newTeamSupport, musicStyle: this.state.newMusicStyle, hobbie: this.state.newHobbie, favColor: this.state.newFavColor, channel: this.state.newChannel, artist: this.state.newArtist, hasCar: this.state.newHasCar, contributeSurvey: this.state.newContributeSurvey });
    }

    handleChange = name => event => {
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
        } else if (name === 'newOptin') {
            trackEventMatomo('Meus dados', 'click', 'botao', 'Aceitar receber SMS')
            let newOptInList = this.state.newOptInList;

            if (event.target.checked === false) {
                const index = findIndexInArray(newOptInList, 'optInId', '-TermoDeUsoClubMapfre-02');

                if (index !== null) {
                    newOptInList.splice(index, 1);
                }
            }
            else {
                newOptInList = newOptInList === null ? [] : newOptInList;

                newOptInList.push(
                    {
                        'accept': true,
                        'dateAcceptance': new Date().getTime(),
                        'optInId': "-TermoDeUsoClubMapfre-02",
                        'type': "Termos de Uso - Club Mapfre",
                        'version': 1,
                    })
            }

            this.setState({
                [name]: event.target.checked, newOptInList
            });
        }
        else if (name === 'newAddressCEP') {
            this.setState({ 'newAddressCEP': maskCEP(event.target.value) });

            if (event.target.value.length === 9) {

                const cep = event.target.value.replace('-', '');

                axios.get('https://viacep.com.br/ws/' + cep + '/json/').then((result) => {
                    if (result.data.erro !== undefined) {
                        this.setState({ openSnackbar: true, messageSnackbar: "CEP não encontrado.", cep: null })
                    }
                    else {
                        const newFullAddress = {
                            "type": "principal",
                            "googleAddr": result.data.logradouro + ' - ' + result.data.bairro + ', ' + result.data.localidade + ' - ' + result.data.uf + ', ' + result.data.cep + ', Brasil',
                            "latitude": 0,
                            "longitude": 0,
                            "streetAve": result.data.logradouro,
                            "number": null,
                            "state": result.data.uf,
                            "city": result.data.localidade,
                            "neighborhood": result.data.bairro,
                            "country": 'Brasil',
                            "zipCode": result.data.cep
                        }

                        this.setState({ newFullAddress, openSnackbar: false })
                    }
                });
            }
            else if (event.target.value.length < 9) {
                this.setState({ newFullAddress: null })
            }
        }
        else if (name === 'newBirthDate') {
            this.setState({
                [name]: maskDate(event.target.value)
            });
        }
        else {
            this.setState({
                [name]: event.target.value,
                editUser2: true,
            });
        }
    };

    openEdition = () => {

        trackEventMatomo('Meus dados', 'click', 'botao', `${this.state.editUser ? 'Cancelar' : 'Editar'}`);

        if (this.state.editUser) {
            if (this.state.newAliasName === this.state.aliasName && this.state.newEmail === this.state.email && this.state.newBirthDate === this.state.birthDate && this.state.newAddressCEP === this.state.address.zipCode && this.state.newAddressNumber === this.state.address.number && this.state.newAddressExtra === this.state.address.extra && this.state.newGender === this.state.gender) {
                this.setState({ editUser: false })
            }
            else {
                this.setState({ editDialog: true })
            }
        }
        else {
            this.setState({ editUser: true })
        }
    };

    updateInfo = () => {
        this.setState({ aliasName: this.state.newAliasName, email: this.state.newEmail, birthDate: this.state.newBirthDate, address: this.state.newFullAddress, optin: this.state.newOptin, optInList: this.state.newOptInList, lastInfo: true, loaded: true, editUser: false });

        localStorage.setItem('aliasName', this.state.newAliasName);
    };

    render = () => {
        const { classes } = this.props;

        if (this.props.success && !this.state.lastInfo) this.updateInfo();

        return (
            <div className='container' style={{ paddingBottom: 100 }}>
                <Typography style={{ fontWeight: 'bold', paddingTop: '40px' }} align='center' color="secondary" variant="h5">
                    Meus dados
                </Typography>

                <Typography className="description" color="secondary" variant="subtitle2" align="center" style={{ paddingBottom: '50px', paddingTop: '20px' }}>Mantenha seus dados sempre atualizados para aproveitar ainda mais o Club MAPFRE.</Typography>

                <Paper>
                    {this.state.loaded === false
                        ? <div align='center'>
                            <CircularProgress style={{ padding: '150px 20px', boxSizing: 'content-box' }} />
                        </div>
                        : <ValidatorForm onSubmit={this.handleSubmit}>
                            <div align="right" style={{ padding: '15px' }}>
                                {this.state.editUser
                                    ? <IconButton onClick={() => trackEventMatomo('Meus dados', 'click', 'botao', 'Salvar')} type="submit" size="small"><Typography style={{ fontSize: '12px', color: '#333' }}>Salvar</Typography><SaveOutlined style={{ cursor: 'pointer' }} color="secondary" /></IconButton>
                                    : null
                                }

                                <IconButton onClick={() => this.openEdition()}>
                                    {this.state.editUser
                                        ? <Typography style={{ fontSize: '12px', color: '#333' }}>Cancelar</Typography>
                                        : <Typography style={{ fontSize: '12px', color: '#333' }}>Editar</Typography>
                                    }
                                    <EditOutlined style={{ cursor: 'pointer' }} color={this.state.editUser ? "primary" : "secondary"} />
                                </IconButton>
                            </div>

                            <Grid container className='meusDados__container' spacing={0}>
                                <Grid item sm={5} xs={12}>
                                    <TextField id="name" label="Nome" variant="outlined" disabled
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={this.state.name}
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />

                                    <TextField id="cpf" label="CPF" variant="outlined" disabled
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={this.state.cpf === null ? '' : this.state.cpf.substr(0, 3) + '.' + this.state.cpf.substr(3, 3) + '.' + this.state.cpf.substr(6, 3) + '-' + this.state.cpf.substr(9, 2)}
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />

                                    <TextField id="cellPhone" label="Celular" variant="outlined" disabled
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={'(' + this.state.cellPhone.substr(3, 2) + ') ' + this.state.cellPhone.substr(5, 5) + '-' + this.state.cellPhone.substr(10, 4)}
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />

                                    <TextField id="aliasName" label="Apelido" variant="outlined"
                                        disabled={!this.state.editUser}
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: this.state.editUser ? classes.specialOutlineOn : classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={this.state.editUser ? this.state.newAliasName : this.state.aliasName
                                        }
                                        onChange={this.handleChange("newAliasName")}
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />

                                    <TextField id="birthDate" label="Nascimento" variant="outlined"
                                        disabled={!this.state.editUser}
                                        fullWidth
                                        required
                                        InputProps={{
                                            classes: { notchedOutline: this.state.editUser ? classes.specialOutlineOn : classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={this.state.editUser ? this.state.newBirthDate : this.state.birthDate
                                        }
                                        onChange={this.handleChange("newBirthDate")}
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />

                                    <TextField id="email" label="E-mail" variant="outlined" disabled={!this.state.editUser}
                                        fullWidth
                                        required
                                        InputProps={{
                                            classes: { notchedOutline: this.state.editUser ? classes.specialOutlineOn : classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={this.state.editUser ? this.state.newEmail : this.state.email
                                        }
                                        onChange={this.handleChange("newEmail")}
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />

                                    <div style={{ display: 'inline-block', textAlign: 'left' }}>
                                        <FormLabel style={{ color: 'black', fontSize: '14px', paddingLeft: '12px' }}>Gênero</FormLabel>
                                        <br />
                                        <span >
                                            <Radio
                                                disabled={!this.state.editUser}
                                                checked={this.state.newGender === '0'}
                                                onChange={this.handleChange('newGender')}
                                                value="0"
                                                name="radio-button-demo"
                                            />Masculino
                                        </span>
                                        <span style={{ whiteSpace: 'nowrap' }}>
                                            <Radio
                                                disabled={!this.state.editUser}
                                                checked={this.state.newGender === '1'}
                                                onChange={this.handleChange('newGender')}
                                                value="1"
                                                name="radio-button-demo"
                                            />Feminino
                                        </span>
                                    </div>

                                </Grid>
                                <Grid item sm={2} xs={false}>
                                    <div style={{ width: 2, height: '100%', margin: '0 auto', backgroundColor: '#CB0000', display: 'block' }}></div>
                                </Grid>

                                <Grid item sm={5} xs={12}>

                                    <TextField id="streetAve" label="Rua" variant="outlined" disabled
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={
                                            this.state.editUser ? this.state.newFullAddress === null ? '' : this.state.newFullAddress.streetAve : this.state.address === null ? '' : this.state.address.streetAve
                                        }
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />


                                    <TextField id="neighborhood" label="Bairro" variant="outlined" disabled
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={
                                            this.state.editUser ? this.state.newFullAddress === null ? '' : this.state.newFullAddress.neighborhood : this.state.address === null ? '' : this.state.address.neighborhood
                                        }
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />


                                    <TextField id="city" variant="outlined" label="Cidade" disabled
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={
                                            this.state.editUser ? this.state.newFullAddress === null ? '' : this.state.newFullAddress.city : this.state.address === null ? '' : this.state.address.city
                                        }
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />


                                    <TextField id="state" variant="outlined" label="Estado" disabled
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={
                                            this.state.editUser ? this.state.newFullAddress === null ? '' : this.state.newFullAddress.state : this.state.address === null ? '' : this.state.address.state
                                        }
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />

                                    <TextField id="zipCode" variant="outlined" label="CEP" disabled={!this.state.editUser}
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: this.state.editUser ? classes.specialOutlineOn : classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={this.state.editUser ? this.state.newAddressCEP : this.state.address.zipCode}
                                        onChange={this.handleChange("newAddressCEP")}
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />

                                    <TextField id="newAddressNumber" label="Número" variant="outlined" disabled={!this.state.editUser}
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: this.state.editUser ? classes.specialOutlineOn : classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={this.state.editUser ? this.state.newAddressNumber : this.state.newAddressNumber
                                        }
                                        type="number"
                                        onChange={this.handleChange("newAddressNumber")}
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />


                                    <TextField id="newAddressExtra" label="Complemento" variant="outlined" disabled={!this.state.editUser}
                                        fullWidth
                                        InputProps={{
                                            classes: { notchedOutline: this.state.editUser ? classes.specialOutlineOn : classes.specialOutlineOff },
                                            className: classes.labelProps
                                        }}
                                        value={this.state.editUser ? this.state.newAddressExtra : this.state.newAddressExtra
                                        }
                                        onChange={this.handleChange("newAddressExtra")}
                                        InputLabelProps={{ className: classes.labelProps }}
                                    />

                                </Grid>
                            </Grid>

                            <div align="center" style={{ padding: '0 15px' }}>
                                <FormControlLabel style={{ marginBottom: '10px' }}
                                    control={
                                        <Checkbox
                                            disabled={!this.state.editUser}
                                            checked={this.state.newOptin}
                                            onChange={this.handleChange('newOptin')}
                                            value="newOptin"
                                        />
                                    }
                                    label="Aceito receber SMS, e-mails e mensagens via Whatsapp"
                                />
                            </div>
                        </ValidatorForm>
                    }
                </Paper>

                <Typography align='center' color="primary" variant="subtitle2">
                    * Esta operação não substitui os dados de suas apólices.
                </Typography>

                {/* <Divider style={{ margin: '50px 0px' }} /> */}

                <Typography style={{ fontWeight: 'bold', paddingTop: '80px' }} align='center' color="secondary" variant="h5">
                    Informações complementares
                </Typography>
                <Typography className="description" color="secondary" variant="subtitle2" align="center" style={{ paddingBottom: '20px', paddingTop: '20px' }}>Queremos conhecer mais você para oferecer campanhas, promoções e descontos que te agradem!</Typography>

                <Paper>
                    {this.state.loaded2 === false
                        ? <div align='center'>
                            <CircularProgress style={{ padding: '150px 20px', boxSizing: 'content-box' }} />
                        </div>
                        : <ValidatorForm onSubmit={this.handleSubmitAditionalInfo}>

                            <Grid container style={{ margin: '20px 15px' }} className='meusDados__container2' spacing={0}>
                                <Grid item sm={5} xs={12}>

                                    <FormControl error={this.state.errorLabelAditionalInfo && this.state.newHasCar === null} style={{ paddingBottom: '20px' }} fullWidth >
                                        <InputLabel id="hasCar-label">Possui Veículo?</InputLabel>
                                        <Select
                                            labelId="hasCar-label"
                                            value={this.state.editUser2 ? this.state.newHasCar : this.state.hasCar}
                                            onChange={this.handleChange("newHasCar")}
                                            color='secondary' style={{ fontSize: 12 }}
                                        >
                                            <MenuItem value="n/a">Não se Aplica</MenuItem>
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
                                            onChange={this.handleChange("newMaritalStatus")}
                                            color='secondary' style={{ fontSize: 12 }}
                                        >
                                            <MenuItem value="n/a">Não se Aplica</MenuItem>
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
                                            onChange={this.handleChange("newChannel")}
                                            color='secondary' style={{ fontSize: 12 }}
                                        >
                                            <MenuItem value="n/a">Não se Aplica</MenuItem>
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
                                            onChange={this.handleChange("newScholarity")}
                                            color='secondary' style={{ fontSize: 12 }}
                                        >
                                            <MenuItem value="n/a">Não se Aplica</MenuItem>

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
                                            onChange={this.handleChange("newTeamSupport")}
                                            color='secondary' style={{ fontSize: 12 }}
                                        >
                                            <MenuItem value="n/a">Não se Aplica</MenuItem>
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
                                                    onChange={this.handleChange('newHasPets')}
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
                                            onChange={this.handleChange('newNamePets')}
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
                                            onChange={this.handleChange("newMusicStyle")}
                                            color='secondary' style={{ fontSize: 12 }}
                                        >
                                            <MenuItem value="n/a">Não se Aplica</MenuItem>

                                            {
                                                formExtra.musicStyle.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
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
                                            onChange={this.handleChange("newHobbie")}
                                            color='secondary' style={{ fontSize: 12 }}
                                        >
                                            <MenuItem value="n/a">Não se Aplica</MenuItem>
                                            {
                                                formExtra.hobbie.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
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
                                            onChange={this.handleChange("newOccupation")}
                                            color='secondary' style={{ fontSize: 12 }}
                                        >
                                            <MenuItem value="n/a">Não se Aplica</MenuItem>
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
                                            onChange={this.handleChange("newInterest")}
                                            color='secondary' style={{ fontSize: 12 }}
                                        >
                                            <MenuItem value="n/a">Não se Aplica</MenuItem>

                                            {
                                                formExtra.interest.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                    return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                })
                                            }
                                        </Select>
                                        <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newMusicStyle === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                    </FormControl>

                                    <div>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.editUser2 ? this.state.newHasKids : this.state.hasKids}
                                                    style={{
                                                        '&.Mui-checked': {
                                                            color: 'green'
                                                        }
                                                    }}
                                                    onChange={this.handleChange('newHasKids')}
                                                    name="hasKids"
                                                />
                                            }
                                            label="Possui filhos?"
                                        />
                                        <TextField
                                            id="ageKids"
                                            label="Faixa etária"
                                            type="number" style={{ paddingBottom: '20px' }}
                                            fullWidth
                                            disabled={!this.state.newHasKids}
                                            value={this.state.editUser2 ? this.state.newAgeKids : this.state.ageKids}
                                            onChange={this.handleChange('newAgeKids')}
                                        />
                                    </div>

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.editUser2 ? this.state.newContributeSurvey : this.state.contributeSurvey}
                                                style={{
                                                    '&.Mui-checked': {
                                                        color: 'green'
                                                    }
                                                }}
                                                onChange={this.handleChange('newContributeSurvey')}
                                                name="contributeSurvey"
                                            />
                                        }
                                        label="Você gostaria de contribuir respondendo pesquisas?"
                                    />

                                </Grid>

                                {this.state.editUser2
                                    ?
                                    <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <div>
                                            <Button
                                                onClick={() => trackEventMatomo('Meus dados', 'click', 'botao', 'Salvar')}
                                                variant="contained"
                                                size="large"
                                                type="submit"
                                                color="primary"
                                                className={classes.button}
                                                style={{ margin: '0px 5px' }}
                                                startIcon={<SaveOutlined />}
                                            >
                                                Salvar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                type="submit"
                                                color="secondary"
                                                onClick={() => { this.setState({ editUser2: !this.state.editUser2 }); trackEventMatomo('Meus dados', 'click', 'botao', 'Cancelar') }}
                                                className={classes.button}
                                                style={{ margin: '0px 5px' }}
                                                startIcon={<EditOutlined />}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </Grid>
                                    //   <IconButton  size="large" align="center"><Typography style={{ fontSize: '24px', color: '#333' }}>Salvar</Typography><SaveOutlined style={{ cursor: 'pointer' }} color="secondary" /></IconButton>
                                    : null
                                }


                            </Grid>



                        </ValidatorForm>
                    }
                </Paper>

                {/* DIALOGO PARA CANCELAR EDIÇÃO */}
                <Dialog open={this.state.editDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                    <DialogTitle id="alert-dialog-title">{"Deseja cancelar a edição do perfil?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Caso decida cancelar, os dados alterados não serão salvos.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ editDialog: false })} color="primary">
                            Contiuar Edição
                        </Button>
                        <Button onClick={() => this.setState({ editDialog: false, editUser: false })} color="primary" autoFocus>
                            Cancelar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* DIALOGO PARA SALVAR EDIÇÃO */}
                <Dialog open={this.state.open} aria-describedby="alert-dialog-description" >

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Seus dados foram salvos com sucesso!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false })} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}

                    onClose={() => this.setState({ openSnackbar: false })}
                    ContentProps={{ 'aria-describedby': 'message-id' }}
                    message={<span id="message-id">{this.state.messageSnackbar}</span>}
                />

                {/* <Modal
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.open}
                    onClose={ () => this.setState({ open: false }) }
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={this.state.open}>
                    <div className={classes.paper}>
                        <p style={{display: 'flex', cursor: 'pointer', width: '100%', flexDirection: 'row-reverse'}} onClick={ () => this.setState({ open: false }) }>X</p>
                        <h2 id="transition-modal-description">salvo com sucesso!</h2>
                    </div>
                    </Fade>
                </Modal> */}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.editUserInfoComponent.loading,
        success: state.editUserInfoComponent.success,
        error: state.editUserInfoComponent.error,
    };
}

//envia as props para as Actions
const mapDispatchToProps = dispatch => ({
    editUserInfoComponent: (uId, newAliasName, newEmail, newOptInList, newFullAddress, newAddressExtra, newAddressNumber, newBirthDate, newGender, userInfo) => editUserInfoAction(dispatch, uId, newAliasName, newEmail, newOptInList, newFullAddress, newAddressExtra, newAddressNumber, newBirthDate, newGender, userInfo)
})

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(EditUserInfo);