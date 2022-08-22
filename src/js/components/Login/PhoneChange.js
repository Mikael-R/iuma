import React, { Component } from "react";

import { Input, Button, Typography, CircularProgress } from '@material-ui/core';
import { cellPhoneMask } from 'js/library/utils/helpers';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { findValueInArray } from "js/library/utils/helpers";
import { store } from 'js/core/configureStore';

import CustomModal from 'js/components/UI/CustomModal/CustomModal';

import sendEmailPhoneChange from 'js/library/utils/API/apiSendEmailPhoneChange';
import apiSendChangeEmail from 'js/library/utils/API/apiSendChangeEmail'
import apiSendHelpEmail from 'js/library/utils/API/apiSendHelpEmail';
import requestPhoneChange from 'js/library/utils/API/requestPhoneChange';
import getUserInfo_v1WithCellphone from 'js/library/utils/API/getUserInfo_v1WithCellphone';
import { mailChangeCellphone } from 'js/library/utils/API/sendEmail';
class PhoneChange extends Component {
    constructor() {
        super();

        const partnerList = findValueInArray(store.getState().mapfreQueryModel.partnerList, 'channelSource', 'triibo-clubmapfre');

        this.state = {
            uId: store.getState().mapfreQueryModel.isMapfreV3 ? store.getState().mapfreQueryModel.uId : '',
            name: store.getState().mapfreQueryModel.isMapfreV3 ? store.getState().mapfreQueryModel.name : '',
            aliasName: store.getState().mapfreQueryModel.isMapfreV3 ? store.getState().mapfreQueryModel.aliasName : '',
            email: findValueInArray(partnerList.contactList, 'type', 'email').value,
            newCellPhone: '',
            cellPhone: findValueInArray(store.getState().mapfreQueryModel.contactList, 'type', 'cellPhone').value,
            cpf: store.getState().mapfreQueryModel.isMapfreV3 ? findValueInArray(partnerList.documentList, 'type', 'cpf').value : '',
            step: 1,
            loading: false,
            sendingEmail: false,
            errorMessage: ''
        };
    }

    handleChange = name => event => {
        this.setState({ [name]: cellPhoneMask(event.target.value) })
    };

    sendEmail() {
        this.setState({ loading: true, errorMessage: '' });

        const newCellPhone = '+55' + this.state.newCellPhone.replace(/\+55/g).replace(/\D/g, '');
        const cellPhone = '+55' + this.state.cellPhone.replace(/\+55/g).replace(/\D/g, '');

        if (newCellPhone === cellPhone) {
            this.setState({ loading: false, errorMessage: 'Por favor, informe um número diferente do número atual.' });
            return;
        }

        const userInfoRequestCellPhone = {
            "contactList": [{
                "type": "cellPhone",
                "value": newCellPhone
            }]
        };

        getUserInfo_v1WithCellphone(userInfoRequestCellPhone).then(reply => {
            if (reply !== null) {
                this.setState({ loading: false, step: 4 });
                return;
            }

            requestPhoneChange(this.state.uId, 'clubMAPFRE-login', cellPhone, newCellPhone).then((result) => {
                if (result.success === undefined || !result.success) {
                    this.setState({ loading: false, errorMessage: 'Erro ao enviar solicitação. Tente novamente mais tarde' });
                    return;
                }

                const requestID = result.requestData.requestID;
                const requestDate = result.requestData.date;

                mailChangeCellphone(requestID, requestDate, this.state.uId, this.state.name, newCellPhone, this.state.email).then(response => {
                    console.log(result);
                    if (result.success !== undefined && result.success) {
                        this.setState({ step: 2 });
                    } else {
                        this.setState({ loading: false, errorMessage: 'Erro ao enviar e-mail. Tente novamente mais tarde' });
                    }
                })
            });
        });
    };

    sendChangeEmail = () => {
        this.setState({ sendingEmail: true });

        apiSendChangeEmail(this.state.name, this.state.cellPhone, this.state.newCellPhone, this.state.email).then(result => {
            if (result.success === undefined || !result.success) {
                this.setState({ step: 1, sendingEmail: false, errorMessage: 'Erro ao enviar solicitação. Tente novamente mais tarde' });
                return;
            }

            this.setState({ sendingEmail: false, step: 3 });
        });;
    }

    sendHelpEmail = () => {
        this.setState({ sendingEmail: true });

        apiSendHelpEmail(this.state.uId, this.state.cpf, this.state.name, this.state.cellPhone, this.state.newCellPhone, this.state.email).then(result => {
            if (result.success === undefined || !result.success) {
                this.setState({ step: 1, sendingEmail: false, errorMessage: 'Erro ao enviar solicitação. Tente novamente mais tarde' });
                return;
            }

            this.setState({ sendingEmail: false, step: 5 });
        });
    }

    render() {
        const email = this.state.email[0] + this.state.email.split('@')[0].substr(1, (this.state.email.split('@')[0].length
            - 1)).replace(/\D/g, "*").replace(/[0-9]/g, "") + '@' + this.state.email.split('@')[1];

        return (
            <CustomModal title='Solicitar alteração de número de celular' width={700}>
                {this.state.sendingEmail ?
                    <div align="center" style={{ padding: '50px 0' }}>
                        <CircularProgress />
                    </div>
                    : this.state.step === 1 ?
                        <ValidatorForm onSubmit={() => this.sendEmail()} style={{ padding: '0 16px' }}>
                            <div style={{ paddingBottom: 15 }}>
                                <Typography variant="h6" align='center'>Informe o novo número de celular</Typography>
                                <Input type='tel' fullWidth
                                    value={this.state.newCellPhone}
                                    placeholder='(00) 00000-0000'
                                    onChange={this.handleChange('newCellPhone')}
                                ></Input>
                                <Typography variant='body1' style={{ fontSize: 15 }}>
                                    Este novo número será utilizado para seu acesso ao Club MAPFRE e comunicações.
                                </Typography>
                            </div>
                            {this.state.errorMessage ?
                                <Typography variant="caption" color="primary" style={{ display: 'block' }}>{this.state.errorMessage}</Typography>
                                : null
                            }
                            <Button className='login_button' disabled={(this.state.email.length <= 5 || this.state.newCellPhone.length !== 19 || this.state.loading)} style={{ margin: '0 5px', textTransform: 'none', color: '#fff', backgroundColor: '#CC0000' }} type='submit' variant='contained' size="large">
                                {this.state.loading
                                    ? <CircularProgress style={{ color: '#fff' }} />
                                    : 'Próximo'
                                }

                            </Button>
                        </ValidatorForm>
                        : this.state.step === 2
                            ? <div style={{ padding: '30px 0' }}>
                                <Typography variant="h6" style={{ paddingBottom: 50 }}>
                                    Por favor, confirme a sua solicitação clicando no link<br />
                                    enviado para o e-mail: {email}.
                                </Typography>

                                <Typography onClick={() => this.sendChangeEmail()} variant='h6' style={{ paddingTop: '15px', color: '#0062FF', cursor: 'pointer', fontSize: 17 }}>
                                    <u>Não tem mais acesso a esse e-mail? Clique aqui e solicite ajuda.</u>
                                </Typography>
                            </div>
                            : this.state.step === 3
                                ? <div style={{ padding: '30px 0' }}>
                                    <Typography variant="h6" style={{ paddingBottom: 50 }}>
                                        Sua solicitação foi enviada. <br />
                                        Nossa equipe entrará em contato com você.
                                    </Typography>
                                </div>
                                : this.state.step === 4
                                    ? <div style={{ padding: '30px 0' }}>
                                        <Typography variant="h6">
                                            Este número de telefone já está sendo utilizado por outra conta.
                                        </Typography>
                                        <Typography onClick={() => this.sendHelpEmail()} variant='h6' style={{ paddingTop: '15px', color: '#0062FF', cursor: 'pointer' }}>
                                            <u>Clique aqui e solicite ajuda.</u>
                                        </Typography>
                                    </div>
                                    : <div style={{ padding: '30px 0' }}>
                                        <Typography variant="h6" style={{ paddingBottom: 50 }}>
                                            Sua solicitação foi enviada. <br />
                                            Nossa equipe entrará em contato com você.
                                        </Typography>
                                    </div>
                }
            </CustomModal>
        );
    }
}

export default PhoneChange;