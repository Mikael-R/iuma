import React from "react";

import { Typography, Grid, Divider, CircularProgress } from '@material-ui/core';
import { WatchLaterOutlined, Map, Language, Phone } from '@material-ui/icons';
import Store from 'js/containers/StorePlaces/Store';
import { configJson } from 'js/library/utils/firebaseUtils';

import { getStorePlacesItem_v2 } from "js/library/utils/API/getStorePlacesItem_v2.js";
import { getStorePlaces_v2 } from "js/library/utils/API/getStorePlaces_v2";
import { getLastUserInfo, getUrlVariables, placeIsOpen, findIndexInArray } from 'js/library/utils/helpers';

class Places extends React.Component {

	constructor(props, context) {
		super(props, context);

		const userInfo = getLastUserInfo();

		const getVars = getUrlVariables();

		// const address = userInfo.addressList[findIndexInArray(userInfo.addressList, 'type', 'principal')];
		const address = userInfo.partnerList[findIndexInArray(userInfo.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].addressList[0];

		if (props.location.state === undefined) {
			getStorePlacesItem_v2(null, getVars.id, userInfo.uId).then((dataReceived) => {

				if (dataReceived.placesItem !== null) {
					this.setState({ establishmentData: dataReceived.placesItem });

					getStorePlaces_v2(userInfo.uId, ['promotion', 'product'], address.latitude, address.longitude, '', dataReceived.placesItem.id, '', null, null).then((dataReceived) => {
						let promotionList = [];
						let productList = [];

						dataReceived.list.map((item) => {
							if (item.type === 'product') {
								return productList.push(item)
							}
							else {
								return promotionList.push(item)
							}
						});

						this.setState({ promotionList, promotionListResearch: promotionList, productList, productListResearch: productList });
					});
				}
			});
		} else {
			getStorePlaces_v2(userInfo.uId, ['promotion', 'product'], address.latitude, address.longitude, '', props.location.state.id, '', null, null).then((dataReceived) => {
				let promotionList = [];
				let productList = [];

				dataReceived.list.map((item) => {
					if (item.type === 'product') {
						return productList.push(item)
					}
					else {
						return promotionList.push(item)
					}
				});

				this.setState({ promotionList, promotionListResearch: promotionList, productList, productListResearch: productList });
			});
		}

		this.state = {
			uId: userInfo.uId,
			address,
			establishmentData: props.location.state === undefined ? null : props.location.state,

			productList: null,
			promotionList: null,

			research: '',
			productListResearch: null,
			promotionListResearch: null
		};

		window.addEventListener('scroll', this.handleScroll);

		this.mainRef = React.createRef();
	};

	handleChange = name => event => {
		this.setState({ [name]: event.target.value });

		if (event.target.value.length === 0) {
			this.setState({ promotionListResearch: this.state.promotionList, productListResearch: this.state.productList })
		}
	};

	researchData = () => {

		if (this.state.research.length >= 3) {
			this.setState({ promotionListResearch: null, productListResearch: null });

			getStorePlaces_v2(this.state.uId, ['promotion', 'product'], this.state.address.latitude, this.state.address.longitude, this.state.research, this.state.establishmentData.id, '', null, null).then((dataReceived) => {
				let promotionListResearch = [];
				let productListResearch = [];

				dataReceived.list.map((item) => {
					if (item.type === 'product') {
						return productListResearch.push(item)
					}
					else {
						return promotionListResearch.push(item)
					}
				});

				this.setState({ promotionListResearch, productListResearch });
			});
		}

	};

	render = () => {
		const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

		let establishmentSite = undefined;
		if(this.state.establishmentData !== null) {
			establishmentSite = this.state.establishmentData.site;
			if(establishmentSite !== undefined) {
				if(establishmentSite.indexOf('http') < 0) {
					establishmentSite = 'http://' + establishmentSite;
				}
			}
		}

		return (
			<div ref={this.mainRef} style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>

				<div style={{ padding: '15px 20px', borderBottomWidth: 0, borderTopLeftRadius: 15, borderTopRightRadius: 15, position: 'relative', zIndex: 1 }}>
					{
						this.state.establishmentData === null
							? <div align='center'>
								<CircularProgress style={{ padding: '20px' }} />
							</div>
							: <div>
								<Grid container spacing={5}>
									{/* <Hidden smUp>
										<Grid item xs={12}>
											<ValidatorForm onSubmit={this.researchData}>
												<TextField variant="outlined" fullWidth={true} className="input-field" type="text" label="Pesquisar..." value={this.state.research} onChange={this.handleChange('research')} />
											</ValidatorForm>
										</Grid>
									</Hidden> */}
									<Grid item md={3} sm={12} xs={12}>
										{this.state.establishmentData.endereco === 'Brasil'
											? null
											: !placeIsOpen(this.state.establishmentData.funcionamento)
												? <Typography variant='subtitle1' align="center" style={{ color: 'red' }}><WatchLaterOutlined style={{ verticalAlign: 'middle' }} /> <i>Fechado</i></Typography>
												: <Typography variant='subtitle1' align="center" style={{ color: 'green' }}><WatchLaterOutlined style={{ verticalAlign: 'middle' }} /> <i>Aberto Agora</i></Typography>
										}

										{this.state.establishmentData.funcionamento !== undefined && this.state.establishmentData.endereco !== 'Brasil'
											? this.state.establishmentData.funcionamento.map(function (array, i) {

												return (
													<ul key={i} style={{ width: '80%', padding: 0, margin: '0 auto', listStyle: 'none' }}>
														<li key={i}>
															<span style={{ float: 'left', width: '50%' }}>{days[i]}</span><span style={{ float: 'right', width: '50%', textAlign: 'right' }}>{array.ativo ? array.horarioInicio + '-' + array.horarioFim : 'Fechado'}</span>
														</li>
													</ul>)
											})
											: null
										}

										{this.state.establishmentData.endereco === 'Brasil' && this.state.establishmentData.contatos !== undefined
											? <div>
												<Typography variant='subtitle1' align="center"><Phone style={{ verticalAlign: 'middle' }} /> <i>Contatos</i></Typography>

												{this.state.establishmentData.contatos.map(function (array, i) {
													if (array.replace(/\D/g, "").indexOf('0800') > 0) {
														const phone = array.replace(/\D/g, "").replace('55', '');
														return <Typography key={i} variant='subtitle1' align="center">{phone.substr(0, 4) + ' ' + phone.substr(4, 3) + ' ' + phone.substr(7, 4)}</Typography>
													}
													else {
														return <Typography key={i} variant='subtitle1' align="center">{array}</Typography>
													}
												})}

											</div>
											: null
										}
									</Grid>

									<Grid item md={6} sm={12}>

										{/* <Hidden xsDown>
											<ValidatorForm onSubmit={this.researchData}>
												<TextField variant="outlined" fullWidth={true} className="input-field" type="text" label="Pesquisar..." value={this.state.research} onChange={this.handleChange('research')} />
											</ValidatorForm>
										</Hidden> */}

										<Typography className='title-establishment' style={{ fontWeight: 'bold', paddingTop: '20px' }} color="secondary" variant="h6">
											{this.state.establishmentData.nome}
										</Typography>

										<Typography className="description" color="secondary" variant="body2" style={{ paddingTop: '20px' }}>
											{this.state.establishmentData.descricao}
										</Typography>
									</Grid>

									<Grid item md={3} sm={12}>

										{this.state.establishmentData.endereco !== 'Brasil'
											? <div>
												<Typography variant='subtitle1' align="center"><Map style={{ verticalAlign: 'middle' }} /> <i>Endereço</i></Typography>

												<Typography style={{ padding: '25px 10px' }} variant='subtitle1' align="center">{this.state.establishmentData.endereco}</Typography>

												<hr />
											</div>
											: null
										}

										{this.state.establishmentData.contatos !== undefined && this.state.establishmentData.endereco !== 'Brasil'
											? <div>
												<Typography variant='subtitle1' align="center" style={{ marginBottom: 25 }}><Phone style={{ verticalAlign: 'middle' }} /> <i>Contatos</i></Typography>

												{this.state.establishmentData.contatos.map(function (array, i) {
													if (array.replace(/\D/g, "").indexOf('0800') > 0) {
														const phone = array.replace(/\D/g, "").replace('55', '');
														return <Typography key={i} variant='subtitle1' align="center">{phone.substr(0, 4) + ' ' + phone.substr(4, 3) + ' ' + phone.substr(7, 4)}</Typography>
													}
													else {
														return <Typography key={i} variant='subtitle1' align="center">{array}</Typography>
													}
												})}

												<hr />
											</div>
											: null
										}

										{this.state.establishmentData.site !== undefined
											? <div>
												<Typography variant='subtitle1' align="center"><Language style={{ verticalAlign: 'middle' }} /> <i>Site</i></Typography>

												<a style={{ wordBreak: 'break-all' }} href={establishmentSite} target="new"><Typography style={{ padding: '25px 10px' }} variant='subtitle1' align="center">{this.state.establishmentData.site}</Typography></a>
											</div>
											: null
										}
									</Grid>

								</Grid>

								{this.state.promotionListResearch === null || this.state.productListResearch === null
									? <div align='center'>
										<CircularProgress style={{ padding: '150px 20px', boxSizing: 'content-box' }} />
									</div>
									: <div>
										{this.state.promotionListResearch.length > 0
											? <div>
												<Divider style={{ color: '#707070', margin: '40px 0px' }} />

												<Grid container spacing={0}>
													<Grid item md={2} sm={12}></Grid>

													<Grid item md={8} sm={12}>
														<Typography style={{ fontWeight: 'bolder', color: '#9B9A9B' }} variant='h6'><Map style={{ verticalAlign: 'middle' }} /> Ofertas</Typography>

														<div className="establishment-list">
															<ul>
																{this.state.promotionListResearch.map(row => {
																	return <Store key={row.id} data={row} />
																})
																}
															</ul>
														</div>
													</Grid>

													<Grid item md={2} sm={12}></Grid>
												</Grid>
											</div>
											: null
										}

										{this.state.productListResearch.length > 0
											? <div>
												<Divider style={{ color: '#707070', margin: '40px 0px' }} />

												<Grid container spacing={0}>
													<Grid item md={2} sm={12}></Grid>

													<Grid item md={8} sm={12}>
														<Typography style={{ fontWeight: 'bolder', color: '#9B9A9B' }} variant='h6'><Map style={{ verticalAlign: 'middle' }} /> Produtos</Typography>

														<div className="establishment-list">
															<ul>
																{this.state.productListResearch.map(row => {
																	return <Store key={row.id} data={row} />
																})
																}
															</ul>
														</div>
													</Grid>

													<Grid item md={2} sm={12}></Grid>
												</Grid>
											</div>
											: null
										}

									</div>
								}

							</div>
					}
				</div>

			</div>

		)


	}
}

export default Places;