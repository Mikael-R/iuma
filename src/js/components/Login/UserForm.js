import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import { Button, Grid, Typography, TextField, Radio, Checkbox, FormControl, FormControlLabel, FormLabel, Snackbar, Select, MenuItem, CircularProgress, FormHelperText, Link } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';

import CustomModal from 'js/components/UI/CustomModal/CustomModal';

import { maskDate, maskCEP, confirmDate, validateFullName, trackEventMatomo } from 'js/library/utils/helpers';

import axios from 'axios';

//arquivo com as actions
import { userFormAction } from "js/core/actions/userFormActions.js";

class UserForm extends Component {
	constructor() {
		super();

		this.state = {
			//dados input na tela
			name: "",
			aliasName: "",
			newPendingEmail: "",
			pendingEmail: "",
			birthDate: "",
			address: null,
			addressExtra: null,
			addressNumber: null,
			fullAddress: null,
			gender: '0',
			optin1: false,
			optin2: false,
			lgpd: false,
			//TODO melhorar conexão com o banco p/ pegar informações sobre optin
			optinList: [
				{
					"type": "Termos de Uso da Triibo",
					"optInId": "-Kzj_F6wDcfHkLMO_q4c",
					"version": 1.0
				},
				{
					"type": "Termos de Uso - Club Mapfre",
					"optInId": "-TermoDeUsoClubMapfre-01",
					"version": 1.0
				},
				{
					"type": "Termos de Uso - Club Mapfre",
					"optInId": "-TermoDeUsoClubMapfre-02",
					"version": 1.0
				}
			],
			cep: '',
			userOrigin: 'Onde conheceu o Club MAPFRE?',

			//validações de tela
			openSnackbar: false,
			loading: false,
			pasteText: false,
			formError: false,
			validateCEP: true,
			errorUserOrigin: false
		};

		window.pathname = null;
	}

	//altera os states conforme escrevemos no formulário
	handleChange = name => event => {

		if (name === 'cep') {
			this.setState({ 'cep': maskCEP(event.target.value) });

			if (event.target.value.length === 9) {

				const cep = event.target.value.replace('-', '');

				axios.get('https://viacep.com.br/ws/' + cep + '/json/').then((result) => {
					if (result.data.erro !== undefined) {
						this.setState({ validateCEP: false });
					}
					else {
						const fullAddress = {
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

						this.setState({ fullAddress })
					}
				});
			}
			else if (event.target.value.length < 9) {
				this.setState({ fullAddress: null, validateCEP: true })
			}
		}
		else if (name === 'optin1' || name === 'optin2') {
			trackEventMatomo('Cadastro cliente Clubmapfre', 'click', 'checkbox', name)

			this.setState({
				[name]: event.target.checked,
			});
		}

		else if (name === 'lgpd') {
			trackEventMatomo('Cadastro cliente Clubmapfre', 'click', 'checkbox', name)

			this.setState({
				[name]: event.target.checked,
			});
		}
		else if (name === 'name') {

			if (event.target.value.indexOf('  ') < 0) {
				this.setState({
					[name]: event.target.value,
				});
			}
		}
		else if (name === 'birthDate') {
			this.setState({ [name]: maskDate(event.target.value) })
		}
		else if (name === 'newPendingEmail') {
			if (!this.state.pasteText) {
				this.setState({ [name]: event.target.value })
			}
			else {
				this.setState({ pasteText: false })
			}
		}
		else {
			trackEventMatomo('Cadastro cliente Clubmapfre', 'click', 'select', event.target.value)
			this.setState({
				[name]: event.target.value,
			});
		}
	};

	handleSubmit = () => {

		if (this.state.cep.length !== 9 || this.state.pendingEmail !== this.state.newPendingEmail || confirmDate(this.state.birthDate) === false || !validateFullName(this.state.name)) {
			this.setState({ formError: true })
		}
		else if (this.state.optin1 === false) {
			this.setState({ openSnackbar: true })
		}
		else if (this.state.userOrigin === 'Onde conheceu o Club MAPFRE?') {
			this.setState({ errorUserOrigin: true })
		}
		else {
			this.setState({ loading: true });
			this.props.userFormComponent(this.state.name.trim(), this.state.aliasName.trim(), this.state.pendingEmail.trim(), this.state.birthDate, this.state.fullAddress, this.state.addressExtra, this.state.addressNumber, parseInt(this.state.gender, 10), this.state.optin1, this.state.optin2, this.state.optinList, this.state.userOrigin);
		}
	};

	render = () => {

		if (window.pathname !== null && this.props.success) {
			return <Redirect to={window.pathname} />;
		} else {
			return (
				<CustomModal width={750}>
					<ValidatorForm ref="form" onSubmit={this.handleSubmit}>
						<Grid container>

							<Grid item sm={5} xs={12}>

								<TextField required color='secondary' type="text" fullWidth value={this.state.name} id="name" className="cadastroCliente-form-control" label="Nome completo" placeholder="Meu Nome" InputLabelProps={{ shrink: true }} onChange={this.handleChange('name')} error={!validateFullName(this.state.name) && this.state.formError} helperText={!validateFullName(this.state.name) && this.state.formError ? 'Insira seu nome completo.' : null} />

								<TextField color='secondary' fullWidth type="text" value={this.state.aliasName} id="nickname" className="cadastroCliente-form-control" label="Apelido" placeholder="Meu Apelido" InputLabelProps={{ shrink: true }} onChange={this.handleChange('aliasName')} />

								<TextField required color='secondary' fullWidth type="text" value={this.state.birthDate} id="birthDate" className="cadastroCliente-form-control" label="Nascimento" placeholder="XX/XX/XXXX" InputLabelProps={{ shrink: true }} onChange={this.handleChange('birthDate')} error={!confirmDate(this.state.birthDate) && this.state.formError} helperText={!confirmDate(this.state.birthDate) && this.state.formError ? 'Data de nascimento inválida.' : null} />

								<TextField required color='secondary' fullWidth type="email" value={this.state.pendingEmail} id="email" className="cadastroCliente-form-control" placeholder="meuemail@email.com" label="E-mail" InputLabelProps={{ shrink: true }} onChange={this.handleChange('pendingEmail')} />

								<TextField required color='secondary' fullWidth type="email" placeholder="meuemail@email.com" value={this.state.newPendingEmail} autoComplete="off" id="pendingEmail" className="cadastroCliente-form-control" label="Confirmar e-mail"
									InputLabelProps={{ shrink: true }}
									onChange={this.handleChange('newPendingEmail')} onDrop={() => this.setState({ pasteText: true })} onPaste={() => this.setState({ pasteText: true })}
									error={this.state.pendingEmail !== this.state.newPendingEmail && this.state.formError}
									helperText={this.state.pendingEmail !== this.state.newPendingEmail && this.state.formError ? "Confirmação de e-mail inválida!" : null} />

								<br />
								<FormLabel style={{ fontSize: 13 }}>Gênero</FormLabel>
								<br />

								<div style={{ textAlign: 'center' }}>
									<div style={{ display: 'inline-block', textAlign: 'center' }}>
										<span className="cadastroCliente-genero" style={{ minWidth: '50%' }}>
											<Radio
												checked={this.state.gender === '0'}
												onChange={this.handleChange('gender')}
												value="0"
												name="radio-button-demo"
											/>Masculino
										</span>
										<span className="cadastroCliente-genero" style={{ minWidth: '50%', whiteSpace: 'nowrap' }}>
											<Radio
												checked={this.state.gender === '1'}
												onChange={this.handleChange('gender')}
												value="1"
												name="radio-button-demo"
											/>Feminino
										</span>
										<span className="cadastroCliente-genero" style={{ minWidth: '50%', whiteSpace: 'nowrap' }}>
											<Radio
												checked={this.state.gender === '2'}
												onChange={this.handleChange('gender')}
												value="2"
												name="radio-button-demo"
											/>Não informar
										</span>
									</div>
								</div>

							</Grid>

							<Grid item sm={2} xs={false}>
								<div style={{ width: 2, height: '100%', margin: '0 auto', backgroundColor: '#CB0000', display: 'block' }}></div>
							</Grid>

							<Grid item sm={5} xs={12} >
								<TextField name="cep" color='secondary' className="cadastroCliente-form-control" required fullWidth type="text" placeholder="XXXXX-XXX" value={this.state.cep === null ? '' : this.state.cep} label="CEP" InputLabelProps={{ shrink: true }} onChange={this.handleChange('cep')} error={(this.state.cep.length !== 9 && this.state.formError) || !this.state.validateCEP} helperText={(this.state.cep.length !== 9 && this.state.formError) || !this.state.validateCEP ? 'CEP inválido' : null} />

								<TextField name="endereco" color='secondary' className="cadastroCliente-form-control" label="Rua" placeholder="Rua" disabled fullWidth id="endereco" type="text" value={this.state.fullAddress === null ? '' : this.state.fullAddress.streetAve + ' - ' + this.state.fullAddress.neighborhood} InputLabelProps={{ shrink: true }} />

								<TextField name="cidade" color='secondary' className="cadastroCliente-form-control" label="Cidade" placeholder="Cidade" disabled fullWidth id="cidade" type="text" value={this.state.fullAddress === null ? '' : this.state.fullAddress.city + ' - ' + this.state.fullAddress.state} InputLabelProps={{ shrink: true }} />

								<br />
								<TextField required fullWidth color='secondary' id="number" className="cadastroCliente-form-control" label="Número" placeholder="Número" type="number" value={this.state.addressNumber === null ? '' : this.state.addressNumber} InputLabelProps={{ shrink: true, focused: false }} onChange={this.handleChange('addressNumber')} />

								<TextField fullWidth color='secondary' className="input-field cadastroCliente-form-control" type="text" value={this.state.addressExtra === null ? '' : this.state.addressExtra} id="complemento" label="Complemento" placeholder="Complemento" InputLabelProps={{ shrink: true, focused: false }} onChange={this.handleChange('addressExtra')} />
							</Grid>

						</Grid>

						<div align="center" style={{ marginTop: 15 }}>
							<FormControl style={{ width: '30%', paddingBottom: '20px' }} error={this.state.errorUserOrigin}>
								<Select color='secondary' style={{ fontSize: 12 }} value={this.state.userOrigin} onChange={this.handleChange('userOrigin')} >
									<MenuItem style={{ fontSize: 12 }} value="Onde conheceu o Club MAPFRE?" disabled>Onde conheceu o Club MAPFRE?</MenuItem>
									<MenuItem style={{ fontSize: 12 }} value="Google">Google</MenuItem>
									<MenuItem style={{ fontSize: 12 }} value="Triibo">Triibo</MenuItem>
									<MenuItem style={{ fontSize: 12 }} value="Redes Sociais">Redes Sociais</MenuItem>
									<MenuItem style={{ fontSize: 12 }} value="SMS">SMS</MenuItem>
									<MenuItem style={{ fontSize: 12 }} value="E-mail Club MAPFRE">E-mail Club MAPFRE</MenuItem>
									<MenuItem style={{ fontSize: 12 }} value="Kit do seguro">Kit do seguro</MenuItem>
								</Select>

								<FormHelperText>{this.state.errorUserOrigin ? 'Selecione alguma opção válida.' : ''}</FormHelperText>
							</FormControl>

							<Typography variant='h6' color='primary' style={{ fontSize: '16px' }}>Informações sobre proteção de dados</Typography>
							<Typography variant='caption' color='secondary' style={{ fontSize: '10px' }}>O Grupo MAPFRE respeita e cumpre as exigências previstas na Lei nº 13.709/2018 que dispõe sobre a proteção de dados pessoais zelando pelos seus dados pessoais. Tratamos seus dados para procedimentos preliminares, execução de contrato relacionado ao produto contratado,
								realização de pesquisa de satisfação, oferta de produtos, promoções e vantagens. Maiores informações de como o Grupo MAPFRE tratam os dados pessoais e para exercício do direito de titular
								de dados pessoais podem ser consultadas na nossa <Link onClick={() => trackEventMatomo('Cadastro cliente Clubmapfre', 'click', 'botao', 'Política de Privacidade e Cookies')} href="https://club.mapfre.com.br/politica-privacidade-clubmapfre/" target="new" >Política de Privacidade e Cookies</Link></Typography>
							<br />
							<br />

							<FormControlLabel id='optin1'
								control={
									<Checkbox
										checked={this.state.optin1}
										onChange={this.handleChange('optin1')}
										value='optin1'
									/>
								}
								label="Aceito os Termos e Condições de Uso do Club MAPFRE."
							/>
							<FormControlLabel id='lgpd'
								control={
									<Checkbox
										checked={this.state.lgpd}
										onChange={this.handleChange('lgpd')}
										value="lgpd"
									/>
								}
								label='Estou de acordo com a Política de Privacidade de Dados Pessoais.'
							/>
							<FormControlLabel id='optin2'
								control={
									<Checkbox
										checked={this.state.optin2}
										onChange={this.handleChange('optin2')}
										value="optin2"
									/>
								}
								label="Aceito receber notificações por aplicativo, SMS, WhatsApp e E-mail."
							/>
							<br />
							<br />


							<Typography id='ToS' variant="body2" gutterBottom>
								<a onClick={() => trackEventMatomo('Cadastro cliente Clubmapfre', 'click', 'botao', 'Ver Termos e Condições de Uso')} href={document.location.origin + "/termos-e-condicoes"} target="new"><u>Ver Termos e Condições de Uso</u></a>
							</Typography>


							<Typography id='Privacy' variant="body2" gutterBottom>
								<a onClick={() => trackEventMatomo('Cadastro cliente Clubmapfre', 'click', 'botao', 'Política de Privacidade')} href={document.location.origin + "/politica-privacidade"} target="new"><u>Política de Privacidade</u></a>
							</Typography>

							<Button onClick={() => trackEventMatomo('Cadastro cliente Clubmapfre', 'click', 'botao', 'Próximo')} className='login_button' disabled={!this.state.lgpd} style={{ textTransform: 'none', color: '#fff', backgroundColor: '#CC0000', marginTop: '10px' }} variant="contained" color="primary" type="submit" size="large">
								{this.state.loading
									? <CircularProgress style={{ color: '#fff' }} />
									: "Próximo"
								}
							</Button>

						</div>

					</ValidatorForm>

					<Snackbar
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
						open={this.state.openSnackbar}
						onClose={() => this.setState({ openSnackbar: false })}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">Para acessar o Club MAPFRE e usufruir todas as vantagens que oferecemos para você, você precisa aceitar "Termos e Condições de uso e Política de Privacidade dos Dados".</span>}
					/>
				</CustomModal>
			)
		}

	};
}

//recebe as props dos Reducers
function mapStateToProps(state) {
	return {
		loading: state.userFormComponent.loading,
		success: state.userFormComponent.success,
		error: state.userFormComponent.error
	};
}

//envia as props para as Actions
const mapDispatchToProps = dispatch => ({
	userFormComponent: (name, aliasName, pendingEmail, birthDate, address, addressExtra, addressNumber, gender, optin1, optin2, optinList, userOrigin) => userFormAction(dispatch, name, aliasName, pendingEmail, birthDate, address, addressExtra, addressNumber, gender, optin1, optin2, optinList, userOrigin)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);