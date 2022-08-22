import React, { Component } from "react";

import { Grid, Paper, Typography, CircularProgress, AppBar, Tabs, Tab, Box, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import PropTypes from 'prop-types';

import { getLastUserInfo, findValueInArray, formatDate, trackEventMatomo } from 'js/library/utils/helpers';
import { getStorePlaces_v2 } from "../../library/utils/API/getStorePlaces_v2";
import { getWallet_v1 } from 'js/library/utils/API/getWallet_v1.js';
import { getBalance_v1 } from 'js/library/utils/API/getBalance_v1.js';
import BalanceGridActive from "js/containers/Balance/BalanceGridActive";
import BalanceGridInactive from "js/containers/Balance/BalanceGridInactive";
import 'pure-react-carousel/dist/react-carousel.es.css';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';
// import { configJson } from 'js/library/utils/firebaseUtils';
// import OwlCarousel from "react-owl-carousel2";

// // import { firebaseDatabase } from 'js/library/utils/firebaseUtils'
// import {encrypt} from "js/library/utils/helpers";
// import {decrypt} from "js/library/utils/helpers";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

class MapfreBalance extends Component {

	constructor(props) {
		super(props);

		const userInfo = getLastUserInfo();
		if (userInfo != null) {
			getBalance_v1(userInfo.uId, userInfo.triiboId, findValueInArray(userInfo.documentList, 'type', 'cpf').value).then((balanceReceived) => {
				if (balanceReceived != null) {

					let balance = [];
					(Object.entries(balanceReceived.balance).reverse()).map((item, i) => {
						if (item[0] === 'consolidateBalance') {
							return this.setState({ points: item[1].total });
						}
						else {
							let itemBalance = item[1];
							itemBalance.key = item[0];
							itemBalance.date = formatDate(item[1].dataEvento);

							return balance.push(itemBalance);
						}
					});

					this.setState({ cofryBalance: balanceReceived.partnerCofry, balance });
				}
			});

			getWallet_v1(userInfo.uId).then((walletReceived) => {

				if (walletReceived != null) {

					let walletCoupons = []
					let activeCoupons = [];
					let inactiveCoupons = []

					if (walletReceived.coupons !== null) {

						Object.entries(walletReceived.coupons).map(coupon => {
							let item = coupon[1];
							item.key = coupon[0];

							walletCoupons.push(item)

							return null;
						});

						walletCoupons.sort((a, b) => {
							if (a.dueDate > b.dueDate) return -1;
							if (a.dueDate < b.dueDate) return 1;
							return 0;
						});

						walletCoupons.map(item => {
							if (item.status === 'enviado' || item.state === 'ongoing') {
                                return activeCoupons.push(item);

                            }else {
                                return inactiveCoupons.push(item);
                            }
						})
					}

					this.setState({ activeCoupons, inactiveCoupons });
				}
			});

			getStorePlaces_v2(userInfo.uId, 'product', null, null, '', null, "[(description:LIKE:triibo_trocapontos)]", 0, 200, null).then((dataReceived) => {
				if (dataReceived.list.length > 0) {
					this.setState({ productsPoints: dataReceived.list })
				}
			});
		};
		const isSmall = (window.innerWidth < 768) ? true : false;

		this.state = {
			balance: null,
			points: 0,
			cofryBalance: null,
			tab: 0,
			coupons: [],
			activeCoupons: null,
			inactiveCoupons: null,
			carouselVisibleSlides: window.innerWidth <= 767 ? 1 : 9,
			settingsGeral: {
				items: isSmall ? 1 : 4,
				nav: true,
				loop: false,
				autoplay: false,
				dots: false,
				rewind: true,
				navText: ['<', '>']
			},
			productsPoints: null
		};

		window.addEventListener('resize', () => {
			this.updateCarousel();
		});
	};

	updateCarousel = () => {
		if (window.innerWidth <= 767) {
			this.setState({ carouselVisibleSlides: 1 });
		} else {
			this.setState({ carouselVisibleSlides: 9 });
		}
	}

	handleChange = (event, newValue) => {
		this.setState({ tab: newValue })
	};

	render = () => {

		return (
			<Grid container style={{ backgroundColor: '#fafafa', paddingTop: '50px', paddingBottom: '50px', width: '100%' }}>

				<Grid item md={1} sm={false}></Grid>

				<Grid item md={10} sm={12} xs={12} style={{ paddingLeft: 15, paddingRight: 15 }}>

					<Grid container style={{ width: '100%' }}>

						<Grid item xs={12} >
							<Paper style={{ padding: '8px', marginBottom: '30px', backgroundColor: '#FAFAFA' }}>

								{this.state.activeCoupons === null || this.state.inactiveCoupons === null
									? <div align='center'>
										<CircularProgress style={{ padding: '150px 20px', boxSizing: 'content-box' }} />
									</div>
									: <div>
										<AppBar position="static" style={{ boxShadow: 'none' }}>
											<Tabs value={this.state.tab} onChange={this.handleChange} style={{ padding: '0 12px', backgroundColor: '#FAFAFA' }}>
												<Tab onClick={() => trackEventMatomo('Carteira', 'click', 'botao', 'Cupons ativos')} style={{ textTransform: 'none', color: '#CB0000', fontWeight: 'bolder' }} label="Cupons ativos" />
												<Tab onClick={() => trackEventMatomo('Carteira', 'click', 'botao', 'Cupons inativos')} style={{ textTransform: 'none', color: '#CB0000', fontWeight: 'bolder' }} label="Cupons inativos" />
											</Tabs>
										</AppBar>

										{this.state.tab === 0
											? this.state.activeCoupons.length === 0
												? <Typography variant="h6" color="secondary" style={{ paddingTop: '5px' }}><span style={{ color: '#4a4a4a' }}>Você não possui cupons ativos.</span></Typography>
												: <BalanceGridActive coupons={this.state.activeCoupons} />

											: this.state.inactiveCoupons.length === 0
												? <Typography variant="h6" color="secondary" style={{ paddingTop: '5px' }}><span style={{ color: '#4a4a4a' }}>Você não possui cupons inativos.</span></Typography>
												: <BalanceGridInactive coupons={this.state.inactiveCoupons} />
										}
									</div>}

							</Paper>
						</Grid>
					</Grid>

					<Grid container spacing={3}>

						{/* <Grid item md={6} sm={6} xs={12} >
							<Paper style={{ padding: '20px', height: '393px', overflowY: 'scroll' }}>

								{this.state.balance === null
									? <div align='center'>
										<CircularProgress style={{ padding: '150px 20px', boxSizing: 'content-box' }} />
									</div>
									: <div>

										<div style={{ float: 'left', width: '100%' }}>
											<span style={{ float: 'left', textAlign: 'left', width: '80%' }}>
												<Typography style={{ fontWeight: 'bold' }} color="primary" variant="h6">Extrato Triibo da MAPFRE</Typography>
											</span>
											<span style={{ float: 'right', textAlign: 'right', width: '20%' }}>
												<Typography color="secondary" variant="subtitle1">{this.state.points} pts</Typography>
											</span>
										</div>

										{this.state.balance.map((item, i) => {

											let showDate = this.state.balance[i - 1] === undefined || this.state.balance[i - 1].dataEvento === undefined;

											if (!showDate) {
												const lastDate = this.state.balance[i - 1].date.split('/');
												const currentDate = this.state.balance[i].date.split('/');

												showDate = !(lastDate[0] === currentDate[0] && lastDate[1] === currentDate[1] && lastDate[2] === currentDate[2]);
											}

											return (
												<div key={item.key}>
													<Typography color="secondary" variant="subtitle1" style={showDate ? { fontWeight: 'bolder' } : { display: 'none' }}>
														Dia {item.date}
													</Typography>

													<div style={{ float: 'left', width: '100%', borderBottom: '1px solid #333' }}>
														<span style={{ float: 'left', textAlign: 'left', width: '50%' }}>
															<Typography color="secondary" variant="body1">{item.descricao}</Typography>
														</span>
														<span style={{ float: 'right', textAlign: 'right', width: '50%' }}>
															<Typography color="secondary" variant="body1">{item.valor} pts</Typography>
														</span>
													</div>
												</div>
											)
										})
										}
									</div>
								}
							</Paper>
						</Grid> */}

						<Grid item sm={12} xs={12} >
							<Paper style={{ padding: '20px', height: '393px', overflowY: 'scroll' }}>

								{this.state.cofryBalance === null
									? <div align='center'>
										<CircularProgress style={{ padding: '150px 20px', boxSizing: 'content-box' }} />
									</div>
									: <div>
										<Typography style={{ fontWeight: 'bold' }} color="primary" variant="h6">Extrato Cofry da MAPFRE</Typography>

										{this.state.cofryBalance.length === 0
											? <div>
												<Typography variant="h6" style={{ paddingTop: '30px' }}><span style={{ color: '#4a4a4a' }}>Não existem dados.</span></Typography>
											</div>
											: <div>
												{this.state.cofryBalance.map((item, i) => {
													let valor = String(item.valor_devido);
													valor = valor.split('.');

													if (valor.length === 1) {
														valor = valor[0] + ',00'
													}
													else if (valor.length === 2 && valor[1].length === 1) {
														valor = valor[0] + ',' + valor[1] + '0';
													}
													else {
														valor = valor[0] + ',' + valor[1];
													}

													return (
														<Grid container key={item.id}>
															<Grid item md={9} style={{ marginTop: '16px' }}>
																<Typography variant="subtitle1" color="secondary">Loja {item.parceiro}</Typography>
																<Typography variant="subtitle2" color="secondary"><em>{formatDate(item.data_compra)} Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</em></Typography>
															</Grid>
															<Grid item md={3} style={{ marginTop: '16px' }}>
																<Typography style={{ fontWeight: 'bold' }} variant="h6" color="secondary">R$ {valor}</Typography>
															</Grid>
														</Grid>
													)
												})}
											</div>}
									</div>
								}

							</Paper>
						</Grid>
					</Grid>

					<Grid container spacing={3} style={{ marginTop: 30 }}>
						<Grid item xs={12}>

							<Typography style={{ fontWeight: 'bold' }} color="primary" variant="h6">Entenda sua carteira</Typography>

							<Accordion onClick={() => trackEventMatomo('Carteira', 'click', 'accordion faq', 'Entenda sua carteira')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									O que são os Cupons?
								</AccordionSummary>
								<AccordionDetails>
									Cupons são benefícios, descontos e números da sorte que você adquire ao participar ou utilizar “Descontos e experiências” do Club MAPFRE.
								</AccordionDetails>
							</Accordion>

							<Accordion onClick={() => trackEventMatomo('Carteira', 'click', 'accordion faq', 'Como os Cupons podem ser adquiridos')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									Como os Cupons podem ser adquiridos?
								</AccordionSummary>
								<AccordionDetails style={{ flexDirection: 'column' }}>
									<p>1. Enviados pelo Club MAPFRE: geralmente disparados em datas especiais e com um prazo de validade. Para facilitar seu uso, toda vez que enviarmos este tipo de cupom, você receberá uma notificação pelo ícone de “Sino”, localizado no canto superior direito do site.</p>
									<p>2. Solicitados por você: algumas promoções de parceiros localizados na área “Descontos e experiências” geram cupons para uso posterior. Para utilizá-los, acesse o menu “Minha Carteira”, clique no cupom desejado e apresente o QR Code ao atendente do estabelecimento. Se preferir, baixe o App Triibo e tenha seus cupons sempre á mãos. Todos os seus cupons ativos estarão disponíveis no App. Caso queira saber mais sobre como utilizar as promoções, <a href="/beneficios/#experiencias">acesse aqui</a>.</p>
									<p>3. Conquistados por você: alguns de nossos parceiros fornecem benefícios a cada compra realizada. Neste caso, você ganha um cupom de prêmio para utilizar imediatamente ou um cupom de fidelidade, que acumulado conforme promoção, dá direito a um prêmio (ex: você ganhou um café na próxima visita; junte 10 cupons e ganhe um almoço).</p>
									<p>Além disso, algumas de nossas promoções comerciais geram “Números da Sorte” em função do seu nível de relacionamento com a MAPFRE. Estes cupons dão direito à participação em sorteios de prêmios de acordo com o regulamento de cada campanha. Até a data do sorteio, os cupons estarão disponíveis em sua carteira.</p>
								</AccordionDetails>
							</Accordion>

							<Accordion onClick={() => trackEventMatomo('Carteira', 'click', 'accordion faq', 'Cupons Inativos')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									Cupons Inativos
								</AccordionSummary>
								<AccordionDetails>
									Todos os cupons já utilizados e/ou vencidos ficam armazenados na sessão “Cupons Inativos”, para que você possa consultá-los quando desejar.
								</AccordionDetails>
							</Accordion>

							{/* <Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									Extrato Triibo da MAPFRE
								</AccordionSummary>
								<AccordionDetails>
									Cada vez que você utiliza uma promoção no Club MAPFRE, ganha pontos na plataforma Triibo que podem ser convertidos em novas experiências como brindes e descontos de nossos parceiros.
								</AccordionDetails>
							</Accordion>

							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									Como pontuar na plataforma Triibo?
								</AccordionSummary>
								<AccordionDetails>
									- Cadastrar-se no Club MAPFRE – 15 pontos
									<br />
									- Baixar o app Triibo – 50 pontos
									<br />
									- Acessar o app Triibo – 1 ponto por semana
									<br />
									- Registrar visita em um estabelecimento no app Triibo - 1 ponto
									<br />
									- Compartilhar uma rede wi-fi no app Triibo - 10 pontos
									<br />
									- Conectar-se em uma rede wi-fi cadastrada no app Triibo - 2 pontos
									<br />
									- Usar pela primeira vez uma promoção de um estabelecimento da área experiências do hotsite do Club MAPFRE ou no app da Triibo - 3 pontos
									<br />
									- Trazer um amigo para o app da Triibo - 10 pontos (regra: o amigo precisa baixar, se cadastrar e ficar pelo menos 1 semana com o app ativo)
									<br />
									- Comprar no Marketplace Triibo – 1 ponto a cada R$2,00 gastos (regra: para ganhar os pontos o número de telefone ou CPF do comprados deve ser igual ao cadastrado no Club MAPFRE)
									<br />
									- Utilizar uma promoção identificada como: “Vale pontos Triibo” – quantidade de pontos definida de acordo com a promoção
								</AccordionDetails>
							</Accordion>

							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									Como resgatar seus pontos?
								</AccordionSummary>
								<AccordionDetails>
									Baixe o aplicativo da Triibo na App Store ou no Google Play e procure o card: troque seus pontos.
								</AccordionDetails>
							</Accordion> */}
						</Grid>
						{/* <Typography style={{ fontWeight: 'bold' }} color="primary" variant="h6">Você pode trocar seus pontos aqui:</Typography>
						<Grid container className={'slide_ofertas slide_ofertas--PONTOS'} style={{ textAlign: 'center' }}>
							{
								this.state.productsPoints !== null
									? (<>
										<Grid item sm={2} xs={12} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
											<div className="slide_ofertas__title">Compre com seus pontos</div>
										</Grid>
										<Grid item sm={10} xs={12} style={{ textAlign: 'center' }}>
											<OwlCarousel className={"slide_ofertas__carousel owl-carousel owl-theme"} options={this.state.settingsGeral} >
												{
													this.state.productsPoints.map((item) => {
														return (
															<div title={item.product.title} className="item">
																<a id="nameId" title={item.product.title} href={'/produto-pontos/?id=' + item.product.id}>
																	<div title={"imageDiv" + item.product.id} className="slide_ofertas__thumb">
																		<img alt={"imageDiv" + item.product.id} src={configJson.STORAGE_URL + encodeURIComponent(item.product.thumbnail) + '?alt=media'} title={'img' + item.product.id} />
																	</div>
																	<span title="nameId">{item.product.title + ' - ' + item.product.cost + ' pontos'}</span>
																</a>
															</div>
														)
													})
												}
											</OwlCarousel>
										</Grid>
									</>)
									: <CircularProgress />
								</Grid>
							} */}
					</Grid>
				</Grid>

				<Grid item md={1} sm={false}></Grid>

			</Grid>
		)
	}
}

export default MapfreBalance;