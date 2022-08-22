import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import SearchBar from '../HelpArea/SearchBar';

import { Container, Grid, Typography, Dialog, DialogContent, DialogActions, Button, Avatar } from '@material-ui/core';
import { trackEventMatomo } from 'js/library/utils/helpers';

// import HelpTopics from 'js/library/utils/HelpTopics';

var helpTopics = {
    clubMapfre: [
        { inicial: 'Club MAPFRE', img: 'clubmapfre-img.png' },
        { shorttitle: 'Quem poderá se cadastrar', title: 'Quem poderá se cadastrar no Club MAPFRE?', keywords: 'Quem pode poderá se cadastrar registrar no Club MAPFRE', answer: 'Pode se cadastrar no Club MAPFRE clientes pessoa física, maiores de 18 anos e titulares de de qualquer um dos produtos MAPFRE listados a seguir:\n\nMAPFRE AutoMais, MAPFRE AutoMais Responsável, MAPFRE AutoMais Gold, MAPFRE AutoMais Caminhão, MAPFRE Automais Táxi, MAPFRE Duas Rodas Online, MAPFRE Duas Rodas Special, MAPFRE Vida Você Mulher, MAPFRE Vida Você Multiflex, MAPFRE Vida Você Special, MAPFRE Vida Superfácil, MAPFRE Acidentes Pessoais Você Premiado, Life Care – Acidentes Pessoais, Life Care – Renda Diária Hospitalar, MAPFRE Parceiro Você Multiflex, Multiflex Individual, Vida Individual, Vida Individual Simplificado, Vida Individual – Estip 01, Vida Multiflex Individual, Vida Personalizada, MAPFRE Residencial, MAPFRE Residencial Super Fácil e MAPFRE Imobiliário Residencial. ' },
        { shorttitle: 'Como contratar um seguro MAPFRE', title: 'Não sou segurado, como posso contratar um seguro MAPFRE?', keywords: 'Não sou segurado, como posso contratar um seguro MAPFRE', answer: 'É só acessar o link para cotar e contratar: https://seguros.mapfre.com.br/segurosclubmapfre/' },
        { shorttitle: 'No segundo acesso será necessário realizar um novo cadastro?', title: 'No segundo acesso será necessário realizar um novo cadastro?', keywords: 'No segundo acesso será necessário realizar um novo cadastro club mapfre', answer: 'Não, uma vez realizado o cadastro no Club MAPFRE, ao acessar, você deverá informar apenas o seu CPF e um código chave que será enviado para o seu celular e/ou e-mail cadastrado no Club. Esta é uma forma de garantir a segurança do seu acesso.' },
        { shorttitle: 'Alteração de dados', title: 'Como faço para alterar meus dados?', keywords: 'Como faço para alterar alteração alteracao dos meus dados', answer: 'Para alterar dados como seu e-mail, endereço e apelido, basta ir na área logada em “Meus dados” no menu “Início” e clicar em “editar” alterar o dado e clicar em “salvar".\n\nPara alterar o seu celular, no login você deve clicar em “Deseja alterar o número de celular cadastrado? Clique aqui e solicite alteração” e seguir o passo a passo, ou enviar um e-mail para relacionamento@mapfre.com.br que entraremos em contato para realizarmos as confirmações necessárias para alterar o seu cadastro.' },
        { shorttitle: 'Dúvidas', title: 'Em caso de dúvidas a quem devo recorrer?', keywords: 'como participo das promocoes e sorteios promocao sorteio premio pra voce', answer: 'Os participantes do Club MAPFRE podem consultar os termos e condições no site https://club.mapfre.com.br/termos-condicoes-clubmapfre/ e a politica de privacidade no site: https://club.mapfre.com.br/politica-privacidade-clubmapfre/. Além disso, temos diversos canais disponíveis para atendimento:\nSAC 24h Auto e Seguros Gerais: 0800 775 4545\nVida: 0800 884 8844\nDeficientes auditivos ou de fala: 0800 775 5045\nE-mail: relacionamento@mapfre.com.br' },
    ], 
    experiencias: [
        { inicial: 'Descontos e Experiências', img: 'experiencias-img.png' },
        { shorttitle: 'Descontos', title: 'Como o desconto é aplicado?', keywords: 'Como o desconto é aplicado descontos', answer: 'Os descontos podem variar de acordo com a parceria e são aplicados das seguintes formas:\n1-) Através de uma página exclusiva para clientes da MAPFRE onde o desconto é aplicado diretamente no site do parceiro.\n2-) Através de um cupom de desconto que você utiliza na loja do parceiro Club MAPFRE e Triibo.\n3-) Descontos obtidos através de QR code na loja física. Com o App da Triibo você escaneia o QR code e obtem o seu desconto/benefício.' },
        { shorttitle: 'É possível desconto direto no site do parceiro?', title: 'É possível obter o desconto MAPFRE diretamente no site do estabelecimento escolhido?', keywords: 'É possível obter o desconto MAPFRE diretamente direto no site do estabelecimento escolhido?', answer: 'Não, para que o desconto MAPFRE seja concedido é necessário que o acesso seja realizado por meio do cadastro no Club MAPFRE e/ou pelo aplicativo Triibo.' },
        { shorttitle: 'Uso de promoção em lojas físicas', title: 'Uso de promoção em lojas físicas', keywords: 'Uso de promoção em lojas físicas É necessário se identificar como segurado MAPFRE', answer: 'Para utilização nas lojas físicas é necessário baixar o aplicativo Triibo e seguir as instruções da promoção desejada. Para que o aplicativo reconheça o segurado MAPFRE é necessário que o cadastro no Club MAPFRE já tenha sido realizado.' },
        { shorttitle: 'Limitações de utilização do benefício', title: 'Qual a limitação para utilização deste benefício?', keywords: 'Qual a limitação para utilização deste benefício limitações limitacoes de beneficio', answer: 'As limitações de uso variam conforme a parceria e são informados nos cards de cada parceiro, onde também são disponibilizadas as regras de cada benefício.' },
        { shorttitle: 'Incentivo de utilização app Triibo', title: 'Que incentivos adicionais existem para utilizar o aplicativo Triibo?', keywords: 'Que incentivos adicionais existem para utilizar o aplicativo Triibo incentivo de utilização utilizacao app', answer: 'Toda vez que utilizar o aplicativo Triibo serão concedidos pontos no programa de vantagens, confira abaixo:\n- Cadastrar-se no Club MAPFRE – 15 pontos\n- Baixar o app Triibo – 50 pontos\n- Acessar o app Triibo – 1 ponto por semana\n- Registrar visita em um estabelecimento no app Triibo - 1 ponto\n- Compartilhar uma rede wi-fi* no app Triibo - 10 pontos\n- Conectar-se em uma rede wi-fi cadastrada no app Triibo - 2 pontos\n- Usar pela primeira vez uma promoção de um estabelecimento da área experiências do hotsite do Club MAPFRE ou no app da Triibo - 3 pontos\n- Trazer um amigo para o app da Triibo - 10 pontos (regra: o amigo precisa baixar, se cadastrar e ficar pelo menos 1 semana com o app ativo)\n- Comprar no Marketplace Triibo – 1 ponto a cada R$2,00 gastos\n- Utilizar uma promoção identificada como: “Vale pontos Triibo” – quantidade de pontos definida de acordo com a promoção\n* Será auditado pela equipe Triibo. Compartilhamento de redes com senhas erradas ou já existentes no aplicativo não receberão pontuação. Os usuários podem receber no máximo 10 ponto por dia com compartilhamento de redes, independente da quantidade de redes cadastradas.' },
        { shorttitle: 'Ações de engajamento Triibo', title: 'A Triibo da MAPFRE tem algum tipo de ação de engajamento além do programa de pontuação?', keywords: 'A Triibo da MAPFRE tem algum tipo de ação de engajamento além do programa de pontuação ações acoes acao', answer: 'A Triibo da MAPFRE faz várias ações de engajamento ao longo do ano. São realizados sorteios de prêmios, de ingressos para shows e até de viagens, sempre buscando a interação com o aplicativo.\nTambém promovemos gincanas e encontros em diferentes locais, seja em lojas parceiras ou em espaços públicos.\nA Triibo da MAPFRE sempre cria uma experiência diferente para se aproximar dos usuários.' },
        { shorttitle: 'Como acompanhar e utilizar os pontos Triibo', title: 'Como faço para acompanhar meus créditos e utilizar os pontos acumulados na Triibo da MAPFRE?', keywords: 'Como faço para acompanhar meus créditos creditos e utilizar os pontos acumulados na Triibo da MAPFRE', answer: 'A pontuação está disponível no aplicativo Triibo ou no site www.club.mapfre.com.br . Os pontos acumulados são trocados por produtos e serviços na vitrine de compra por pontos do aplicativo Triibo, que pode ser acessada a partir da tela inicial do aplicativo ou em “Minha Conta” no site Club MAPFRE.' },
    ],
    // cofry: [
    //     { inicial: 'Cashback', img: 'cofry-img.png' },
    //     { shorttitle: 'O que é cashback', title: 'O que é o cashback da MAPFRE?', keywords: 'O que é o Cofry da MAPFRE', answer: 'É um sistema de cupons de descontos e recompensas que, em parceria com o Club MAPFRE, disponibiliza para os clientes cadastrados as melhores ofertas da internet permitindo que você receba uma parte do valor da sua compra online realizada nos estabelecimentos cadastrados na plataforma. Os créditos serão armazenados em seu cartão pré-pago virtual para utilizar nas contratações e renovações de produtos e serviços MAPFRE, disponível para consulta na “Minha Conta”.' },
    //     { shorttitle: 'Calculo de recompensa', title: 'Como é calculado esse valor do dinheiro de recompensa?', keywords: 'Como é calculado esse valor do dinheiro de recompensa calculo', answer: 'O valor é calculado a partir do preço final da sua compra, não incluindo o valor do frete e o valor dos descontos, caso seja utilizado algum cupom de desconto no fechamento da compra. A porcentagem do valor pode variar, de acordo com os anunciantes.' },
    //     { shorttitle: 'Sistema de recompensa', title: 'Como o sistema de recompensa funciona?', keywords: 'Como o sistema de recompensa funciona', answer: 'O primeiro passo é se cadastrar no Club MAPFRE, que é o programa de vantagens exclusivo para os clientes MAPFRE (consulte produtos participantes em club.mapfre.com.br).\nCom sua conta ativada, clique na loja onde deseja comprar e em seguida escolha “Recompensa" ou "Pegar Cupom de Desconto". Se a loja oferecer ambos, você poderá economizar duas vezes.\nApós definir suas escolhas, basta clicar em "SEGUIR" que você será direcionado para o site da loja, onde poderá fazer sua compra normalmente. Observe as condições da oferta e siga as instruções do nosso site para finalizar a compra na loja parceira. Importante: seu carrinho na loja deverá estar vazio e todas as janelas da loja fechadas. É vedada a utilização de cupons de terceiros.' },
    //     { shorttitle: 'Validação', title: 'Como funciona a validação?', keywords: 'Como funciona a validação validacao', answer: 'Após a compra, sua recompensa é marcada como "pendente" no seu extrato dentro do Club MAPFRE “Minha Conta”. A aprovação é executada diretamente pela loja parceira, por isso, o tempo de aprovação pode variar de 30 a 90 dias, dependendo do parceiro.' },
    //     { shorttitle: 'Quem valida minha recompensa?', title: 'Quem valida minha recompensa?', keywords: 'Quem valida minha recompensa realiza a validação validacao', answer: 'A aprovação ou cancelamento do seu saldo (recompensa) é executada diretamente pela loja parceira, sem interferência alguma do Cofry ou da MAPFRE. Apenas repassamos a informação que as lojas nos apresentam.' },
    //     { shorttitle: 'Como utilizar o saldo dos créditos', title: 'Como faço para utilizar o saldo dos créditos no cartão pré-pago virtual?', keywords: 'Como faço para utilizar o saldo dos créditos creditos no cartão pré-pago pre pago pré virtual', answer: 'Quando seu saldo no Club MAPFRE estiver disponível, você poderá utilizar para renovar ou contratar um novo serviço MAPFRE.' },
    //     { shorttitle: 'Identificação da compra', title: 'Como sei que minha compra foi identificada?', keywords: 'Como sei que minha compra foi identificada identificação identificacao indentificacao indentificação', answer: 'Na sua área de cliente “Minha Conta”, dento do Club MAPFRE, você consegue acompanhar seu extrato completo além das informações de sorteio e vouchers utilizados.' },
    // ],
    assistencias: [
        { inicial: 'Assistências', img: 'assistencias-img.png' },
        { shorttitle: 'Quem utiliza', title: 'Quem poderá utilizar o benefício disponibilizado pela MAPFRE AUTORIZADA?', keywords: 'Quem poderá podera utilizar utiliza o benefício disponibilizado pela MAPFRE AUTORIZADA', answer: 'Além de todos os segurados cadastrados no Club MAPFRE, é possível solicitar reparo do equipamento de seus familiares ou amigos, basta inserir as informações solicitadas no momento do registro da solicitação.' },
        { shorttitle: 'Como contratar', title: 'Como contratar o serviço e acompanhá-lo?', keywords: 'Como contratar o serviço e acompanhá-lo acompanhar', answer: 'Todo processo deverá ser contratado e acompanhado pelo site Club MAPFRE na sua área do cliente.' },
        { shorttitle: 'Opções de envio de equipamento', title: 'Quais são as opções para envio do equipamento?', keywords: 'Quais são as opções opcoes de para envio do equipamento', answer: 'Postagem, visita residencial e entrega na assistência técnica.\nVisita residencial: Quando o técnico executa o reparo na residencial (endereço registrado).\nPostagem: Equipamento é enviado pelos Correios, para realização do orçamento e reparo.\nRequisitos para postagem:\n•	Celular de até 500 Gramas;\n•	Notebook de até 4 Quilos;\n•	Tablet de até 2 Quilos;' },
        { shorttitle: 'Negativa no orçamento', title: 'O que ocorrerá em caso de negativa do orçamento?', keywords: 'O que ocorrerá ocorrera em caso de negativa do no orçamento', answer: 'O segurado poderá receber seu equipamento nas mesmas condições de envio. Poderá ser proposto ao segurado a substituição do equipamento com condições especiais.' },
        { shorttitle: 'Prazo', title: 'Qual o prazo para reparo?', keywords: 'Qual o prazo para reparo', answer: 'Após o recebimento do equipamento pela rede credenciada, o orçamento será disponibilizado em até 48h, estando disponível para consulta de status no site. Uma vez aprovado o orçamento, considerando a confirmação de pagamento, o reparo ocorrerá em até 5 dias úteis.' },
        { shorttitle: 'Abrangência', title: 'Qual a abrangência para atendimento?', keywords: 'Qual a abrangência abrengencia para atendimento', answer: 'Atendimento em território nacional. No momento da solicitação, após o preenchimento do seu endereço, o sistema apresentará as unidades credenciadas mais próximas.' },
        { shorttitle: 'Cancelamento de solicitação', title: 'É possível cancelar a solicitação de serviço?', keywords: 'É possível cancelar cancelamento a solicitação solicitacao de serviço', answer: 'Os serviços só poderão ser cancelados quando não executados. Se o pagamento foi realizado, o cancelamento será efetuado mediante o pagamento da taxa de administração, conforme Termos e Condições de Uso da SIS Soluções' },
        { shorttitle: 'O que é considerado como reincidência de defeito?', title: 'O que é considerado como reincidência de defeito?', keywords: 'O que é considerado como reincidência reincidencia deu problema novamente de defeito', answer: 'Quando o mesmo defeito ou peça permanecem com a mesma situação relatada na solicitação anterior. Quando isso ocorre, o mesmo processo de assistência pode ser solicitada novamente.' },
    ],
}

class HelpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            open: false,
            currentHelp: {},
        };
    }
    
    openModal() {
        this.setState({ open: true });
    };
    
    helpSelect(valor) {
        // const parser = new DOMParser();
        // var htmlDoc = parser.parseFromString(valor.answer, 'text/xml');
        // document.getElementById('text-help').innerHTML = htmlDoc;
        this.setState({ currentHelp: valor })
    }


    // handleOnInputChange = (event) => {
    //     const query = event.target.value;
    //     this.setState({ query, loading: true, message: '' });

    //     if (query === null || query === '') {
    //         this.setState({ resultHelp: this.helpTopics })
    //     } else {
    //         const resultHelp = this.helpTopics.filter(helpTopic => {
    //             return helpTopic.keywords.toLowerCase().indexOf(query.toLowerCase()) >= 0
    //         })
    //         this.setState({ resultHelp: resultHelp })
    //     }

    // };

    render() {
        if (window.pathname !== null && this.props.success) {
            return <Redirect to={window.pathname} />;
        } else {
            return (

                <div style={{ minHeight: '88vh' }}>
                    <Container maxWidth="lg">

                        <Grid container spacing={1}>
                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                <h2 className="heading" style={{ fontWeight: 700, fontSize: '32px', paddingTop: '60px' }}>Como podemos te ajudar?</h2>
                                <h6 className="heading">Navegue pelos principais tópicos ou busque diretamente sua dúvida</h6>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                <SearchBar lista={helpTopics} openModal={() => this.openModal()} helpSelect={(index) => this.helpSelect(index)} />
                                {/* <TextField
                                    id="search-input"
                                    label="Pesquisa"
                                    style={{ margin: 8 }}
                                    fullWidth
                                    margin="normal"
                                    placeholder="Insira aqui sua dúvida"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    onChange={this.handleOnInputChange}
                                /> */}
                            </Grid>
                        </Grid>

                        <Grid container spacing={4} id="faq-topics" style={{ marginTop: '20px', padding: '30px 15px' }}>
                            {
                                Object.keys(helpTopics).map((key, i) => {
                                    const helpTopic = helpTopics[key]
                                    return <Grid item xs={12} lg={4} key={i}>
                                        <Grid container id="faq-topic">
                                            {
                                                helpTopic.map((helpItem, i) => {
                                                    if (i === 0) {
                                                        return <Grid container key={i} alignItems="center">
                                                            <Grid item xs={3} style={{ textAlign: 'left' }}>
                                                                <Avatar alt="Remy Sharp" src={"/wp-content/uploads/2019/02/" + helpItem.img} />
                                                            </Grid>
                                                            <Grid item xs={9}>
                                                                <h2>{helpItem.inicial}</h2>
                                                            </Grid>
                                                        </Grid>
                                                    } if (i === 1) {
                                                        return <Grid key={i} item xs={12} style={{ paddingTop: '15px' }}>
                                                            <p className='faqTopics' onClick={() => {
                                                                this.openModal();
                                                                this.helpSelect(helpItem);
                                                                trackEventMatomo('Faq', 'click', 'botao', helpItem.title);
                                                            }}>{helpItem.shorttitle}</p>
                                                        </Grid>
                                                    } else {
                                                        return <Grid key={i} item xs={12}>
                                                            <p className='faqTopics' onClick={() => {
                                                                this.openModal()
                                                                this.helpSelect(helpItem);
                                                                trackEventMatomo('Faq', 'click', 'botao', helpItem.title);
                                                            }}>{helpItem.shorttitle}</p>
                                                        </Grid>
                                                    }
                                                })
                                            }
                                        </Grid>
                                    </Grid>
                                })
                            }
                        </Grid>
                    </Container>

                    <Dialog open={this.state.open} aria-describedby="alert-dialog-description" style={{height: '120vh', zIndex: 999991}} >

                        <DialogContent style={{maxHeight: '32vh'}}>
                            <Typography variant="h6" id="title-help" style={{fontWeight:700}}>{this.state.currentHelp.title}</Typography>
                            <Typography variant="body2" id="text-help">{this.state.currentHelp.answer}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { this.setState({ open: false }); trackEventMatomo('Faq-modal', 'click', 'botao', 'OK')} } color="primary">
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        }
    }
}
// function mapStateToProps(state) {
// 	return {
// 		loading: state.userFormComponent.loading,
// 		success: state.userFormComponent.success,
// 		error: state.userFormComponent.error
// 	};
// }

export default HelpScreen;