import React from "react";

import { Typography, Grid, Button, Paper, CircularProgress, Input } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';

import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';
import { getStorePlacesItem_v2 } from "js/library/utils/API/getStorePlacesItem_v2.js";
import { getUrlVariables, detectmob, formatPhone, cpfMask, findValueInArray, encrypt } from "js/library/utils/helpers.js";
import { downloadImage } from 'js/library/services/StorageManager.js';
import { configJson, apiModeEnv } from 'js/library/utils/firebaseUtils';
import { apiGetUserInfo_v1 } from "js/library/utils/API/getUserInfo_v1.js"
import axios from 'axios';
import { loginUser } from 'js/library/services/AuthenticationManager.js';

import QRCode from 'qrcode.react';

class StoreLanding extends React.Component {

	constructor(props, context) {
		super(props, context);

		const getVars = getUrlVariables();
		const id = getVars.id.split('?');
		
		const uId = configJson.uIdLandingPages;

		getStorePlacesItem_v2(id[0], null, uId).then((dataReceived) => {
			if (dataReceived !== null) {

				this.setState({ storeInfo: dataReceived.storeItem, url: dataReceived.storeItem.type === 'businessPartner' ? dataReceived.storeItem.url : null });

				//qrCodeValue: encrypt(userInfo.uId + '|' + dataReceived.storeItem.templateId, configJson.CRYPTO_KEY)
			}
		});

		this.state = {
			storeInfo: null,
			qrCodeValue: null,

			//validação de usuário
			cpf: '',
			validateUser: false,
			loading: false,
			openLabel: false,
			errorLabel: '',

			//controle para baixar url
			url: null,
			detectmob: detectmob()
		};
	}

	downloadImageOnLoad = () => {
		let data = this.state.storeInfo;
		const folder = data.type === 'product' ? 'triibomania-premios' : 'promocao';

		downloadImage(folder, data.thumbnail).then((downloaded) => {
			data.image = downloaded;

			this.setState({ storeInfo: data })
		}).catch((error) => {
			return error;
		});
	};

	handleChange = name => event => {
		this.setState({ [name]: cpfMask(event.target.value) })
	}

	handleSubmit = async () => {
		this.setState({ loading: true, openLabel: false });

		//buscando na whiteList
		let isWhiteList = false;

		let user = await (axios.get(configJson.whiteListUrl));

		if (user.data[this.state.cpf.replace(/\D/g, "")]) {
			isWhiteList = true;
		};

		const queryPartnerAPI = ["getUserInfo", "getUserInfoMapfreSSO"];

		const userInfo = {
			"documentList": [{
				"type": "cpf",
				"value": this.state.cpf.replace(/\D/g, "")
			}],
			"partnerList": [{
				"partnerName": configJson.partnerNameClubMapfre,
				"partnerId": configJson.partnerIdClubMapfre,
				"apiMode": 'REMOTE',
				"apiModeEnv": apiModeEnv,
				"documentList": [{
					"type": "cpf",
					"value": this.state.cpf.replace(/\D/g, "")
				}]
			}]
		};

		apiGetUserInfo_v1(queryPartnerAPI, userInfo).then(async (resultGetUser) => {
			let status = '3';
			const partnerReplyV3 = resultGetUser.success.userInfo === null ? null : findValueInArray(resultGetUser.success.userInfo.partnerList, 'partnerId', configJson.partnerIdClubMapfre);

			const partnerReply = resultGetUser.success.partnerList[0];

			status = isWhiteList ? '6' : partnerReply === null || partnerReply.codStatus === undefined ? status : String(partnerReply.codStatus);
			
			//tratar usuário com acesso negado
			if ((status === '2' || status === '4') && partnerReplyV3 !== null) {
				this.setState({ loading: false, openLabel: true, errorLabel: <span>Sua apólice expirou. Aproveite a <a target="new" style={{ color: "blue", textDecoration: "underline" }} href="https://seguros.mapfre.com.br/segurosclubmapfre/">oportunidade</a> agora mesmo para renovar seu seguro e continuar aproveitando todas as vantagens que o Club MAPFRE oferece para você!</span> });
			}
			else if ((status === '2' || status === '4') && partnerReplyV3 === null) {
				this.setState({ loading: false, openLabel: true, errorLabel: <span>Você precisa voltar a ser MAPFRE para usufruir dos benefícios do clube de vantagens. Aproveite a <a target="new" style={{ color: "blue", textDecoration: "underline" }} href="https://seguros.mapfre.com.br/segurosclubmapfre/">oportunidade</a> agora mesmo!</span> });
			}
			else if ((status === '0' || status === '1' || status === '5' || status === '6') && partnerReplyV3 === null) {
				//usuário c/ acesso permitido, mas s/ cadastro no club
				localStorage.setItem('inputCpf', this.state.cpf.replace(/\D/g, ""))
				localStorage.setItem('loginOption', '2')

				this.setState({ loading: false, openLabel: true, errorLabel: <span>Você ainda não possui cadastro no Club MAPFRE. <a target="new" style={{ color: "blue", textDecoration: "underline" }} href={document.location.origin + '/clubmapfre?login=true'}>Cadastre-se</a> agora para usufruir dos benefícios do clube de vantagens.</span> });
			}
			else if ((status === '0' || status === '1' || status === '5' || status === '6') && partnerReplyV3 !== null) {
				//usuário c/ acesso permitido e c/ cadastro no club

				//logando usuário c/ email no firebase
				await loginUser(resultGetUser.success.userInfo.triiboId.replace(/[,]/gi, "."), resultGetUser.success.userInfo.passPhrase);

				const userInfoModel = {...resultGetUser.success.userInfo};
				userInfoModel.isTriibo = true;
				userInfoModel.isMapfreV3 = true;

				//setando objs no storage
				localStorage.setItem('aliasName', resultGetUser.success.userInfo.aliasName);
				localStorage.setItem('cofryId', encrypt(findValueInArray(resultGetUser.success.userInfo.documentList, 'type', 'cpf').value, configJson.cryptoCofry));
				localStorage.setItem('userInfoAuxiliar', JSON.stringify(userInfoModel));

				//após logado, encaminhar para a url da oferta
				window.location = this.state.storeInfo.url;
			}
			else {
				this.setState({ loading: false, openLabel: true, errorLabel: <span>Não encontramos seu CPF. Verifique se você não digitou algo errado ou entre em <a target="new" style={{ color: "blue", textDecoration: "underline" }} href="https://club.mapfre.com.br/contato/">contato</a> conosco. Caso você não seja cliente MAPFRE, aproveite sua visita para conhecer o clube de vantagens e <a target="new" style={{ color: "blue", textDecoration: "underline" }} href="https://seguros.mapfre.com.br/segurosclubmapfre/">Seja MAPFRE.</a></span> });
			};

		}).catch((error) => {
			//console.log(error);
			
			this.setState({ loading: false, openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
		})
	};

	render = () => {

		return (
			<div style={{ padding: '30px 0px', backgroundColor: '#f2f2f2', minHeight: 'calc(100vh - 73px - 35px)', display: 'flex' }}>
				<div className='container' style={{ alignItems: 'flex-start', flexFlow: 'row wrap', display: 'flex' }}>

					<Paper style={{ width: '100%' }}>
						{this.state.storeInfo === null
							? <div align='center' style={{ padding: '20px' }}>
								<CircularProgress />
							</div>
							: <div>
								<Grid container spacing={5} style={{ padding: '15px', margin: '0px', width: '100%' }}>
									<Grid item sm={5} xs={12} align="center">
										<img src={this.state.storeInfo.image === undefined ? placeholderItem : this.state.storeInfo.image} onLoad={() => this.downloadImageOnLoad()} alt="img" width="100%" className="img-header" />

										{this.state.storeInfo.type === 'businessPartner' ? null : <Typography variant="caption" color="secondary" >*Para utilizar esse beneficio, você deve apresentar este cupom</Typography>}
									</Grid>
									<Grid item sm={7} xs={12}>
										<Typography variant="subtitle1" color="secondary" style={{ fontWeight: 'bolder' }}><i>{this.state.storeInfo.title}</i></Typography>

										<p style={{ whiteSpace: 'pre-line' }}>{this.state.storeInfo.description}</p>
									</Grid>
								</Grid>

							</div>
						}
					</Paper>

					{this.state.storeInfo === null
						? null
						: <Grid container spacing={0}>
							<Grid item xs={12} md={4}></Grid>
							<Grid item xs={12} md={4}>

								<div align="center">
									{this.state.validateUser
										? this.state.storeInfo.type === 'businessPartner'
											? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column wrap', height: '100%' }}>
												{!this.state.detectmob && this.state.url.indexOf('tel://') >= 0 && this.state.storeInfo.type === 'businessPartner'
													? <Typography variant="subtitle1" color="secondary" gutterBottom display="block">Ligue para:<br />{formatPhone(this.state.storeInfo.url.split('//')[1])}</Typography>
													: <Button disabled={this.state.url === null} fullWidth onClick={() => window.open(this.state.url)} color="primary" variant="contained" style={{ textTransform: 'none' }}>{this.state.storeInfo.buttonLabel === undefined ? 'Visitar site' : this.state.storeInfo.buttonLabel}</Button>
												}

												<Typography variant="caption" color="secondary" gutterBottom style={{ fontWeight: 'bolder', paddingTop: '15px' }} display="block">Estabelecimento</Typography>
												<a style={{ textDecoration: 'none' }} href={"/estabelecimento?id=" + this.state.storeInfo.establishmentId}><Typography style={{ cursor: 'pointer' }} variant="caption" color="secondary" gutterBottom display="block">{this.state.storeInfo.establishmentName}</Typography></a>
											</div>
											: <div>
												<QRCode
													id="QRCode"
													value={this.state.qrCodeValue}
													size={140}
													bgColor={"#ffffff"}
													fgColor={"#000000"}
													level={"M"}
												/>
												<Typography variant="caption" color="secondary" gutterBottom style={{ fontWeight: 'bolder', paddingTop: '15px' }} display="block">Estabelecimento</Typography>
												<a style={{ textDecoration: 'none' }} href={"/estabelecimento?id=" + this.state.storeInfo.establishmentId}><Typography style={{ cursor: 'pointer' }} variant="caption" color="secondary" gutterBottom display="block">{this.state.storeInfo.establishmentName}</Typography></a>
											</div>
										: <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column wrap', height: '100%' }}>
											<Typography variant="subtitle1" gutterBottom style={{ color: 'black' }}>Entre e aproveite!</Typography>
											
											<ValidatorForm onSubmit={() => this.handleSubmit()}>
												<Input type='tel' placeholder='digite seu CPF' fullWidth autoFocus
													style={{ marginBottom: 15 }}
													value={this.state.cpf}
													onChange={this.handleChange('cpf')}
												></Input>

												{this.state.openLabel
													? <Typography variant="caption" color="primary" >{this.state.errorLabel}</Typography>
													: null
												}
												<br />

												<Button fullWidth style={{ textTransform: 'none' }} color="primary" disabled={this.state.cpf.length !== 14 || this.state.loading} type='submit' variant='contained' size="large">
													{this.state.loading ? <CircularProgress /> : 'Entrar'}
												</Button>
											</ValidatorForm>
										</div>
									}
								</div>

							</Grid>
							<Grid item xs={12} md={4}></Grid>
						</Grid>
					}
				</div>
			</div>
		)
	}
}

export default StoreLanding;