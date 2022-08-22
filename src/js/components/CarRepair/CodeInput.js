import React, { Component } from "react";
import { connect } from 'react-redux';

import { ValidatorForm } from 'react-material-ui-form-validator';
import { Typography, Button, Snackbar, TextField, CircularProgress, LinearProgress } from "@material-ui/core";

import { store } from 'js/core/configureStore';
import { validateSMS_v1 } from "js/library/utils/API/validateSMS_v1.js";
import { authSMS_v1 } from "js/library/utils/API/authSMS_v1.js";

import { codeInputAction } from "js/core/actions/codeInputActions.js";

class CodeInput extends Component {
	constructor({
		cellPhoneProps,
		transactionIdProps
	}) {
		super();

		this.state = {
			code: '',
			cellPhone: cellPhoneProps !== undefined ? cellPhoneProps : store.getState().phoneInputModel.cellPhone,
			transactionId: transactionIdProps !== undefined ? transactionIdProps : store.getState().phoneInputModel.transactionId,

			//verificações de tela
			loading: false,
			renderTime: 0,
			messageSnackbar: 'O Usuário não foi logado!',
			openSnackbar: false,
			startTimer: true
		};

		if (this.state.startTimer) {
			this.handleRenderTime();
		}

		window.pathname = null;
	};

	//altera os states conforme escrevemos no formulário
	handleChange = name => event => {
		if (event.target.value.length < 7) {
			this.setState({
				[name]: event.target.value.replace(/\D/g, "")
			});
		}
	};

	handleCloseSnackbar = () => {
		this.setState({ openSnackbar: false });
	};

	validateteSMS = () => {
		this.setState({ loading: true });
		//this.props.codeInputComponent(this.state.code)

		validateSMS_v1(this.state.code, this.state.cellPhone, this.state.transactionId).then((result) => {
			if (result.data.error === null) {
				this.props.codeInputComponent(this.state.cellPhone);
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
		}).catch(() => {
			this.setState({ loading: false, openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
		})
	};

	handleRenderTime = () => {
		const timer = setInterval(() => {
			if (this.state.renderTime < 75) {
				this.setState({ renderTime: this.state.renderTime + 0.25 });
			} else {
				clearInterval(timer);
				this.setState({ startTimer: false, renderTime: 0 });
			}
		}, 100);
	}

	getNewCode = () => {
		this.setState({ startTimer: true })
		this.handleRenderTime();

		authSMS_v1(this.state.cellPhone, null).then((resultSendSMS) => {
			if (resultSendSMS.error === null) {
				this.setState({ transactionId: resultSendSMS.transactionId })
			}
			else {
				this.setState({ loading: false, openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
			}
		}).catch(() => {
			this.setState({ loading: false, openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
		})
	};

	render = () => {
		return (
			<>
				<Typography variant="body1" >Dentro de alguns segundos você receberá um código de autenticação por SMS</Typography>
				<br />
				<ValidatorForm onSubmit={() => this.validateteSMS()}>
					<TextField autoComplete="off" type="tel" autoFocus fullWidth id="code" value={this.state.code} onChange={this.handleChange('code')} margin="normal" />
					<br /><br />
					<div style={{ paddingBottom: 30 }}>
						{this.state.startTimer
							? <div>
								<LinearProgress variant="determinate" value={this.state.renderTime} />
							</div>
							: <Typography variant='body2' style={{ color: '#0000FF' }}><u onClick={() => this.getNewCode()} style={{ cursor: 'pointer' }}>Enviar código novamente</u></Typography>
						}
					</div>
					<Button disabled={this.state.code.length !== 6 || this.state.loading} fullWidth type='submit' variant="contained" color="primary"><span style={{ fontWeight: '550', color: 'white', whiteSpace: 'normal', textTransform: 'initial' }}>{this.state.loading ? <CircularProgress size="2rem" style={{ color: 'white' }} /> : <Typography variant="h6">Continuar</Typography>}</span></Button>
				</ValidatorForm>
				<br /><br />
				<Snackbar
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
					open={this.state.openSnackbar}
					onClose={this.handleCloseSnackbar}
					ContentProps={{ 'aria-describedby': 'message-id' }}
					message={<span id="message-id">{this.state.messageSnackbar}</span>}
				/>
			</>
		)
	}
};

//recebe as props dos Reducers
function mapStateToProps(state) {
	return {
		loading: state.codeInputComponent.loading,
		success: state.codeInputComponent.success,
		error: state.codeInputComponent.error
	};
}

//envia as props para as Actions
const mapDispatchToProps = dispatch => ({
	codeInputComponent: (cellPhone) => codeInputAction(dispatch, cellPhone)
})

export default connect(mapStateToProps, mapDispatchToProps)(CodeInput);