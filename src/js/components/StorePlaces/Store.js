import React from "react";

import { Typography, Grid, Button, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';

import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';
import { getStorePlacesItem_v2 } from "js/library/utils/API/getStorePlacesItem_v2.js";
import { getLastUserInfo, getUrlVariables, encrypt, detectmob, formatPhone } from "js/library/utils/helpers.js";
import { downloadImage } from 'js/library/services/StorageManager.js';
import { configJson } from 'js/library/utils/firebaseUtils';
import { apiOrder } from 'js/library/utils/API/apiOrder';

import QRCode from 'qrcode.react';

class Store extends React.Component {

	constructor(props, context) {
		super(props, context);

		const userInfo = getLastUserInfo();
		const getVars = getUrlVariables();

		if (props.location.state === undefined) {

			getStorePlacesItem_v2(getVars.id, null, userInfo.uId).then((dataReceived) => {
				if (dataReceived !== null) {

					this.setState({ storeInfo: dataReceived.storeItem, qrCodeValue: encrypt(userInfo.uId + '|' + dataReceived.storeItem.templateId, configJson.CRYPTO_KEY), url: dataReceived.storeItem.type === 'businessPartner' ? dataReceived.storeItem.url : null });
				}
			});

		} else {
			if (props.location.state.type === 'businessPartner') {
				if (props.location.state.url.indexOf('{') > 0) {

					getStorePlacesItem_v2(getVars.id, null, userInfo.uId).then((dataReceived) => {
						if (dataReceived !== null) {

							this.setState({ url: dataReceived.storeItem.url });
						}
					});
				}
				else {
					this.setState({ url: props.location.state.url });
				}
			};

			this.setState({ storeInfo: props.location.state });
		}

		this.state = {
			userInfo,
			storeInfo: props.location.state === undefined ? null : props.location.state,
			qrCodeValue: props.location.state === undefined ? '' : encrypt(userInfo.uId + '|' + props.location.state.templateId, configJson.CRYPTO_KEY),

			//controle para baixar url
			url: null,
			detectmob: detectmob(),

			//states p/ controle order
			loadingOrder: false,
			orderReply: null
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

	orderStore = () => {
		this.setState({ loadingOrder: true });

		apiOrder(this.state.storeInfo.templateId, this.state.userInfo.triiboId, this.state.requestLat, this.state.requestLon, this.state.userInfo.triiboId).then(() => {
			this.setState({ loadingOrder: false, orderReply: true });
		}).catch(() => {
			this.setState({ loadingOrder: false, orderReply: false });
		});
	}

	render = () => {
		const titleId = this.state.storeInfo === null ? null : this.state.storeInfo.title.trim().replace(/ /g, '-').replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');

		return (
			<div style={{ paddingBottom: 30, backgroundColor: '#FAFAFA', minHeight: 'calc(100vh - 73px - 35px)', display: 'flex' }}>
				<div className='container' style={{alignItems: 'flex-start', flexFlow: 'row wrap', display: 'flex'}}>
					{/* <Button onClick={() => window.history.back()} variant="contained" color="secondary" style={{ textTransform: 'none', margin: '15px 0' }}>
						Voltar
					</Button> */}

					<Paper style={{ width: '100%' }}>
						{this.state.storeInfo === null
							? <div align='center'>
								<CircularProgress style={{ padding: '20px' }} />
							</div>
							: <Grid container spacing={6} style={{ padding: '15px', margin: '0px', width: '100%' }}>
								<Grid item md={7} xs={12} align="center">
									<div className='cupom'>
										<div className='cupom__thumb'>
											<Typography variant="subtitle1" color="secondary" style={{ fontWeight: 'bolder' }}><i>{this.state.storeInfo.title}</i></Typography>
											<img src={this.state.storeInfo.image === undefined ? placeholderItem : this.state.storeInfo.image} onLoad={() => this.downloadImageOnLoad()} alt="img" width="100%" className="img-header" />

											{this.state.storeInfo.type === 'businessPartner' || (this.state.storeInfo.autoValidate === undefined && this.state.storeInfo.showQRCode === undefined) ? null : <Typography variant="caption" color="secondary" >*Para utilizar esse beneficio, você deve apresentar este cupom</Typography>}
										</div>
										<div className='cupom__divisor'>
											<div>
												<span></span>
												<span></span>
												<span></span>
												<span></span>
											</div>
										</div>
										<div className='cupom__qrcode'>
											{this.state.storeInfo.type === 'businessPartner'
												? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column wrap', height: '100%' }}>
													{!this.state.detectmob && this.state.url.indexOf('tel://') >= 0 && this.state.storeInfo.type === 'businessPartner'
														? <Typography variant="subtitle1" color="secondary" gutterBottom display="block">Ligue para:<br />{formatPhone(this.state.storeInfo.url.split('//')[1])}</Typography>
														: <Button id={titleId} title={this.state.storeInfo.title} disabled={this.state.url === null} fullWidth onClick={() => window.open(this.state.url)} color="primary" variant="contained" style={{ textTransform: 'none' }}>{this.state.storeInfo.buttonLabel === undefined ? 'Visitar site' : this.state.storeInfo.buttonLabel}</Button>
													}

													<Typography variant="caption" color="secondary" gutterBottom style={{ fontWeight: 'bolder', paddingTop: '15px' }} display="block">Estabelecimento</Typography>
													<a style={{ textDecoration: 'none' }} href={"/estabelecimento?id=" + this.state.storeInfo.establishmentId}><Typography style={{ cursor: 'pointer' }} variant="caption" color="secondary" gutterBottom display="block">{this.state.storeInfo.establishmentName}</Typography></a>
												</div>
												: this.state.storeInfo.autoValidate === undefined && this.state.storeInfo.showQRCode === undefined
													? <Button disabled={this.state.loadingOrder} onClick={() => this.orderStore()} fullWidth={true} style={{ textTransform: 'none', marginTop: '40px' }} color="primary" variant="contained" component="span">
														{this.state.loadingOrder
															? <CircularProgress />
															: <span align="center" style={{ color: 'white' }}>{this.state.storeInfo.buttonLabel !== undefined ? this.state.storeInfo.buttonLabel : 'Resgatar promoção!'}</span>
														}
													</Button>
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
											}
										</div>
									</div>
								</Grid>
								<Grid item md={5} xs={12}>
									<p style={{ whiteSpace: 'pre-line' }}>{this.state.storeInfo.description}</p>
								</Grid>
							</Grid>
						}
					</Paper>
				</div>

				<Dialog open={this.state.orderReply !== null} onClose={() => this.setState({ orderReply: null })} >
					<DialogTitle>
						{this.state.orderReply ? "Atenção!!!" : "Algo deu errado."}
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{this.state.orderReply ? "Sua solicitação de resgate foi realizada e será processada em breve. Consulte sua carteira na opção Inínio -> Minha Carteira." : "Por favor, tente novamente mais tarde."}
						</DialogContentText>
					</DialogContent>
				</Dialog>

			</div>
		)
	}	
}

export default Store;