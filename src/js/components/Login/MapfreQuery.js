import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { Input, Button, Typography, CircularProgress, Grid, Link } from '@material-ui/core';

import { cpfMask, findIndexInArray, findValueInArray, trackEventMatomo } from "js/library/utils/helpers";
import { store } from 'js/core/configureStore';
import { configJson } from 'js/library/utils/firebaseUtils';

import { ValidatorForm } from 'react-material-ui-form-validator';

import { mapfreQueryAction } from 'js/core/actions/mapfreQueryActions';

import CustomModal from 'js/components/UI/CustomModal/CustomModal';

class MapfreQuery extends Component {

    constructor() {
        super();

        this.state = {
            cpf: localStorage.getItem('inputCpf') === null ? '' : cpfMask(localStorage.getItem('inputCpf')),
            name: store.getState().mapfreQueryModel.partnerList !== null && store.getState().mapfreQueryModel.partnerList !== undefined ? store.getState().mapfreQueryModel.partnerList[findIndexInArray(store.getState().mapfreQueryModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].name : '',

            loading: false,
            openLabel: false,
            errorLabel: '',
            lgpd: false
        };

        window.pathname = null;
    };

    handleChange = name => event => {
        this.setState({ [name]: cpfMask(event.target.value) })

        if (name === 'lgpd') {
            this.setState({
                [name]: event.target.checked,
            });
        }
    }

    handleSubmit = () => {
        let blackList = [
            '00000000000',
            '11111111111',
            '22222222222',
            '33333333333',
            '44444444444',
            '55555555555',
            '66666666666',
            '77777777777',
            '88888888888',
            '99999999999',
        ]

        if (blackList.indexOf(this.state.cpf.replace(/[.]/gi, "").replace(/[-]/gi, "")) !== -1) {
            this.setState({
                openLabel: true,
                errorLabel: <span>CPF inválido</span>
            });
        } else {
            trackEventMatomo('Login', 'click', 'botao', 'Validar');
            this.props.mapfreQueryComponent(this.state.cpf.replace(/[.]/gi, "").replace(/[-]/gi, ""));
            this.setState({ loading: true, openLabel: false });
        }
    };

    handleErrors = () => {
        this.setState({ loading: false });

        if (this.props.success) {
            let status = 3;
            const partnerReply = findValueInArray(store.getState().mapfreQueryModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre);

            const partnerReplyV3 = findValueInArray(store.getState().mapfreQueryModel.userPartnerList, 'partnerId', configJson.partnerIdClubMapfre);

            status = partnerReply === null || partnerReply.codStatus === undefined ? status : partnerReply.codStatus;

            //tratar usuário com acesso negado
            //usuario com status 2 ou 3, porém possui partner MAPFRE
            if ((status === '2' || status === '4') && partnerReplyV3 !== null) {
                this.setState({ openLabel: true, errorLabel: <span>Sua apólice expirou. Aproveite a <a target="new" style={{ color: "blue", textDecoration: "underline" }} href="https://seguros.mapfre.com.br/segurosclubmapfre/">oportunidade</a> agora mesmo para renovar seu seguro e continuar aproveitando todas as vantagens que o Club MAPFRE oferece para você!</span> });
            }
            else if ((status === '2' || status === '4') && partnerReplyV3 === null) {
                //usuario com status 2 ou 3, e NÃO possui partner MAPFRE

                this.setState({ openLabel: true, errorLabel: <span>Você precisa voltar a ser MAPFRE para usufruir dos benefícios do clube de vantagens. Aproveite a <a target="new" style={{ color: "blue", textDecoration: "underline" }} href="https://www.mapfre.com.br/para-voce/">oportunidade</a> agora mesmo!</span> });
            }
            else {
                this.setState({ openLabel: true, errorLabel: <span>Não encontramos seu CPF. Verifique se você não digitou algo errado ou entre em <a target="new" style={{ color: "blue", textDecoration: "underline" }} href="https://club.mapfre.com.br/contato/">contato</a> conosco. Caso você não seja cliente MAPFRE, aproveite sua visita para conhecer o clube de vantagens e <a target="new" style={{ color: "blue", textDecoration: "underline" }} href="https://seguros.mapfre.com.br/segurosclubmapfre/">Seja MAPFRE.</a></span> });
            }
        }
        else {
            //tratar erro na API
            this.setState({ openLabel: true, errorLabel: 'Ocorreu um erro. Tente novamente mais tarde!' })
        }
    }

    render() {

        const loginOption = localStorage.getItem('loginOption') === null ? '1' : localStorage.getItem('loginOption');

        if (this.state.loading && (this.props.success || this.props.error)) this.handleErrors()

        if (window.pathname !== null) {
            return <Redirect to={window.pathname} />;
        }
        else {
            return (
                <CustomModal width={700} style={{ overflow: 'hidden' }}>
                    <Typography style={{ marginBottom: 15, fontWeight: 'normal' }} variant="h6" color="secondary">{loginOption === '1' ? 'Por favor, insira seu CPF para acessar o Club MAPFRE.' : 'Por favor, insira seu CPF para iniciarmos seu cadastro.'}</Typography>

                    <ValidatorForm onSubmit={() => this.handleSubmit()}>
                        <Grid container>
                            <Grid item sm={2} xs={12}></Grid>
                            <Grid item sm={8} xs={12}>
                                <Input color='secondary' type='tel' placeholder='Digite seu CPF' fullWidth autoFocus
                                    // style={{ marginBottom: 15, textAlign: 'center' }}
                                    value={this.state.cpf}
                                    onChange={this.handleChange('cpf')}
                                ></Input>

                                {this.state.openLabel
                                    ? <Typography variant="caption" color="primary" >{this.state.errorLabel}</Typography>
                                    : null
                                }
                                <br />
                                <br />

                                <Typography variant='subtitle2' color='secondary' style={{ fontSize: 10 }}>INFORMAÇÕES SOBRE PROTEÇÃO DE DADOS</Typography>
                                <Typography variant='subtitle2' color='secondary' style={{ fontSize: 9 }}>
                                    O Grupo MAPFRE respeita e cumpre as exigências previstas na Lei Geral de Proteção de Dados Pessoais – LGPD, Lei nº 13.709/2018 que trata da proteção de dados pessoais.
                                    Tratamos seus dados para procedimentos preliminares, execução de contrato relacionado ao produto contratado, realização de pesquisa de satisfação, oferta de produtos, promoções e vantagens.
                                    Caso deseje obter mais informações de como a MAPFRE trata os dados pessoais, consulte <Link href="https://club.mapfre.com.br/politica-privacidade-clubmapfre/" target="new" >Política de Privacidade</Link>.</Typography>
                                {/* <Typography variant='subtitle2' color='secondary' style={{fontSize: 9}}>Ao clicar em {loginOption === '1' ? 'Próximo' : 'Validar'}, você concorda com a Política de Privacidade e Cookies da MAPFRE.</Typography> */}

                                <br />
                                <Button className='login_button' disabled={this.state.cpf.length !== 14 || (this.props.loading && this.state.loading)} type='submit' variant='contained' size="large">
                                    {
                                        this.state.loading
                                            ? <CircularProgress style={{ color: '#fff' }} />
                                            : loginOption === '1' ? 'Próximo' : 'Validar'
                                    }
                                </Button>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </CustomModal>
            );
        }
    }
};

function mapStateToProps(state) {
    return {
        loading: state.mapfreQueryComponent.loading,
        success: state.mapfreQueryComponent.success,
        error: state.mapfreQueryComponent.error,
    };
}

//envia as props para as Actions
const mapDispatchToProps = dispatch => ({
    mapfreQueryComponent: (cpf) => mapfreQueryAction(dispatch, cpf)
})

export default connect(mapStateToProps, mapDispatchToProps)(MapfreQuery);