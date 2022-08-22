import React, { Component } from "react";
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Typography, Button, Input, CircularProgress } from "@material-ui/core";
import { login } from "js/library/utils/API/login";
import { loginUser } from 'js/library/services/AuthenticationManager.js';

import { cellPhoneMask, findValueInArray } from "js/library/utils/helpers";
import getUser_Oficinas from "js/library/utils/API/getUser_Oficinas.js";
import getAccessToken from "js/library/utils/API/getAccessToken_v1.js";
import { authSMS_v1 } from "js/library/utils/API/authSMS_v1.js";
import { validateSMS_v1 } from "js/library/utils/API/validateSMS_v1.js";

class PhoneLogin extends Component {
	constructor() {
		super();

		this.state = {
			cellPhone: '',
			code: '',
			transactionId: '',
			userInfo: {},

			//verificações e validações
			loading: true,
			step: 1,
			errorLabel: ''
		};
	};

	componentDidMount = () => {
		if (localStorage.getItem('oficinaMapfre')) {
			let userInfo = JSON.parse(localStorage.getItem('userInfoOficina'))

			this.setState({ loading: true })

			getAccessToken(null, 2).then(token => {
				getUser_Oficinas(token, findValueInArray(userInfo.contactList, 'type', 'cellPhone').value.replace(/\D/g, "")).then(data => {
					if (data.status) {
						window.top.location = document.location.origin + '/nova-saida';
					} else {
						this.setState({ loading: false })
					}
				});
			});
		} else {
			this.setState({ loading: false })
		}
	}

	//altera os states conforme escrevemos no formulário
	handleChange = name => event => {
		if (name === 'cellPhone') {
			this.setState({ cellPhone: cellPhoneMask(event.target.value) });
		} else {
			this.setState({ [name]: event.target.value });
		}
	};

	handleSubmitCellphone = () => {
		this.setState({ loading: true, errorLabel: '' });
		getAccessToken(null, 2).then(token => {
			getUser_Oficinas(token, this.state.cellPhone.replace(/\D/g, "")).then(data => {
				if (data.status) {
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
					this.setState({ userInfo: data.userInfo });
				} else {
					this.setState({ loading: false, errorLabel: 'Você não tem permissão para acessar essa área. Entre em contato com nosso suporte.' })
				}
			})
		})
	};

	handleSubmitCode = () => {
		this.setState({ loading: true });

		validateSMS_v1(this.state.code, this.state.cellPhone, this.state.transactionId).then((result) => {
			if (!result.error) {
				this.loginUserOficina();
			}
			else {
				this.setState({ loading: false });

				if (result.data.error.errorCode === 1006) {
					this.setState({ openSnackbar: true, messageSnackbar: 'Código inválido.' });
				}
				else {
					this.setState({ openSnackbar: true, messageSnackbar: 'Ocorreu um erro. Por favor, tente novamente.' });
				}
			}
		}).catch((e) => {
			console.log(e.data);
			this.setState({ loading: false, openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
		})
	}

	loginUserOficina = async () => {
		let cellPhone = '+' + this.state.cellPhone.replace(/\D/g, '');
		//logando usuário c/ Api de login
		await login(cellPhone, this.state.userInfo.triiboId.replace(/[,]/gi, "."));
		//logando firebase
		await loginUser(this.state.userInfo.triiboId.replace(/[,]/gi, "."), this.state.userInfo.passPhrase);

		//setando aliasName p/ exibir no menu
		localStorage.setItem('aliasName', this.state.userInfo.name);
		localStorage.setItem('userInfoOficina', JSON.stringify(this.state.userInfo));
		localStorage.setItem('oficinaMapfre', true);
		window.top.location = document.location.origin + '/nova-saida';
	}

	render = () => {
		if (this.state.loading) {
			return (
				<div style={{
					height: '100vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<CircularProgress />
				</div>
			)
		} else {
			if (this.state.step === 1) {
				return (
					<div style={{
						height: '100vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center'
					}}>
						<Typography variant="body2" style={{ fontSize: '17px' }}>Informe seu telefone para a gente te identificar</Typography>
						<ValidatorForm onSubmit={() => this.handleSubmitCellphone()}>
							<Input label="Celular" type="tel" autoFocus value={this.state.cellPhone} onChange={this.handleChange('cellPhone')} id="cellPhone" fullWidth placeholder="+55 (XX) XXXXX-XXXX" />
							<br /><br />
							<Typography variant="subtitle2" color="error" style={{ textAlign: 'center' }}>{this.state.errorLabel}</Typography>
							<Button disabled={this.state.cellPhone.replace(/\D/g, "").length < 13 || this.state.loading} fullWidth type='submit' variant="contained" color="primary"><span style={{ fontWeight: '550', color: 'white', whiteSpace: 'normal', textTransform: 'initial' }}>{this.state.loading ? <CircularProgress size="2rem" style={{ color: 'white' }} /> : <Typography variant="h6">Entrar</Typography>}</span></Button>
						</ValidatorForm>
					</div>
				)
			} else if (this.state.step === 2) {
				return (
					<div style={{
						height: '100vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center'
					}}>
						<Typography variant="body2" style={{ fontSize: '17px' }}>Digite o código</Typography>
						<ValidatorForm onSubmit={() => this.handleSubmitCode()}>
							<Input label="Código SMS" type="tel" autoFocus value={this.state.code} onChange={this.handleChange('code')} id="code" fullWidth placeholder="XXXXXX" />
							<br /><br />
							<Typography variant="subtitle2" color="error" style={{ textAlign: 'center' }}>{this.state.errorLabel}</Typography>
							<Button disabled={this.state.code.replace(/\D/g, "").length < 6 || this.state.loading} fullWidth type='submit' variant="contained" color="primary"><span style={{ fontWeight: '550', color: 'white', whiteSpace: 'normal', textTransform: 'initial' }}>{this.state.loading ? <CircularProgress size="2rem" style={{ color: 'white' }} /> : <Typography variant="h6">Enviar</Typography>}</span></Button>
						</ValidatorForm>
					</div>
				)
			}
		}
	}
};

export default PhoneLogin;