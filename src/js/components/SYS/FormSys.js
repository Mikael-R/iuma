import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Container, Grid, Hidden, TextField, FormLabel, RadioGroup, Radio, FormControl, Checkbox, FormControlLabel, Button, Modal } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getLastUserInfo, maskCEP, findIndexInArray, findValueInArray } from 'js/library/utils/helpers.js';
import { configJson } from 'js/library/utils/firebaseUtils';

import getAccessToken_v1 from "../../library/utils/API/getAccessToken_v1.js"
import axios from 'axios';
import getCategoriesSys_v1 from "../../library/utils/API/getCategoriesSys_v1";
import getProductsTypes_v1 from "../../library/utils/API/getProductsTypes_v1.js";
import getProductsBrands_v1 from "../../library/utils/API/getProductsBrands_v1.js";
import postAssistanceItem from "../../library/utils/API/postAssistanceItem.js";
import getLoginSys from "../../library/utils/API/getLoginSys_v1.js";
import getAssistancesSys from "../../library/utils/API/getAssistancesSys_v1.js";
import putTicketAssistance from "../../library/utils/API/putTicketAssistance_v1.js";



const styles = theme => ({
    root: {
    },
    heading: {
        fontWeight: 700,
        fontSize: '22px',
        color: '#555'
    },
    checkbox: {
        color: '#cc0000 !important',
        '&$checked': {
            color: red[900],
        },
    },
    formControl: {
        // margin: theme.spacing(1),
        minWidth: '100%',
        '&>div': {
            marginBottom: 25,
        },
        '&>div>div': {
            borderRadius: '12px !important',
            borderColor: 'black !important',
            '&>div': {
                borderRadius: '12px !important',
                borderColor: 'black !important',
            },
        },
    },
    button: {
        borderRadius: 15,
        textTransform: 'none',
        padding: '12px 70px',
        fontSize: 18,
        maxHeight: 40,
        maxWidth: 50,
        "@media (min-width: 600px)": {
            maxHeight: "100%",
            maxWidth: "100%",
            padding: '15px 80px',
        }
    },
    modal: {
        width: 730,
        maxWidth: '90%',
        maxHeight: '90%',
        padding: 30,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        backgroundColor: 'white',
        overflowX: 'none',
        overflowY: 'scroll',
        outline: 'none',
        "@media (min-width: 600px)": {
            '&::-webkit-scrollbar': {
                width: 5,
                background: 'lightgrey',
            },
        },
    },
    closeButton: {
        width: 50,
        fontSize: 26,
        color: '#fff',
        cursor: 'pointer',
        top: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
});



class FormSys extends Component {
    constructor(props) {

        super(props);
        this.state = {
            //valores
            id: '',
            marca: {},
            equipamento: {},
            modelo: '',
            descricao: '',
            cep: '',
            streetAve: '',
            number: 0,
            state: '',
            city: '',
            neighborhood: '',
            complement: '',
            uf: '',
            atendimento: '',
            messageModalError: '',
            user: {},
            partnerModel: {},
            assistancesPosting: [],
            assistancesVisit: [],
            assistance: 0,
            ticket: '',

            token: '',
            categorie: {},
            productTypes: [],
            brands: [],
            models: [],
            address: [],
            uIdSYS: '',

            modalType: '',

            //validadores
            loading: true,
            checkedEnd: false,
            checkedLGPD: false,
            validateCEP: true,
            addressDisable: true,
            verificaChamada: false,
            liberaModelos: false,
            openModal: false,
            assistanceSend: false,
        };
    }


    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ id: id });

        const userInfo = getLastUserInfo();

        const partnerModel = findValueInArray(userInfo.partnerList, 'partnerId', configJson.partnerIdClubMapfre)
        const address = partnerModel.addressList[findIndexInArray(partnerModel.addressList, 'type', 'principal')];

        this.setState({ partnerModel: partnerModel, user: userInfo, address: address, cep: address.zipCode, uf: address.state, city: address.city, neighborhood: address.neighborhood, streetAve: address.streetAve, number: address.number })

        getAccessToken_v1('2RmaKKWWpQcQoOQHi0TVS55j32i1').then((token) => {
            getLoginSys(token).then((result) => {
                this.setState({ token: result.token })
                getCategoriesSys_v1(this.state.token).then((categories) => {
                    categories.map((categorie) => {
                        if (categorie.id === this.state.id) {
                            this.setState({ categorie: categorie });
                        }
                        return null
                    })
                }).then(() => {
                    getProductsTypes_v1(token, this.state.categorie.id).then((types) => {
                        this.setState({
                            productTypes: types.productTypes.sort(function (a, b) {
                                if (a.name < b.name) { return -1; }
                                if (a.name > b.name) { return 1; }
                                return 0;
                            })
                        });
                    });
                    getProductsBrands_v1(token, this.state.categorie.id).then((responseBrands) => {
                        this.setState({
                            brands: responseBrands.brands.sort(function (a, b) {
                                if (a.name < b.name) { return -1; }
                                if (a.name > b.name) { return 1; }
                                return 0;
                            })
                        });
                    });
                })
            })
        });

    }

    handleChange = name => event => {

        if (name === 'modalCloser') {
            this.setState({openModal: false, assistanceSend: false})
        }

        if (name === 'checkedEnd') {
            this.setState({ checkedEnd: event.target.checked })
            if (event.target.checked) {
                this.setState({
                    cep: null,
                    uf: null,
                    city: null,
                    neighborhood: null,
                    streetAve: null,
                    number: 0,
                })
            } else {
                this.setState({
                    address: this.state.address,
                    cep: this.state.address.zipCode,
                    uf: this.state.address.state,
                    city: this.state.address.city,
                    neighborhood: this.state.address.neighborhood,
                    streetAve: this.state.address.streetAve,
                    number: this.state.address.number
                })
            }
        }
        else if (name === 'checkedLGPD') {
            this.setState({ checkedLGPD: event.target.checked })
        }
        else if (name === 'assistance') {
            this.setState({ assistance: parseInt(event.target.value, 10) })
        }
        else if (name === 'cep') {
            this.setState({ cep: maskCEP(event.target.value) });

            if (event.target.value.length === 9) {

                const cep = event.target.value.replace('-', '');

                axios.get('https://viacep.com.br/ws/' + cep + '/json/').then((result) => {
                    if (result.data.erro !== undefined) {
                        this.setState({ validateCEP: false });
                    }
                    else {
                        this.setState({
                            streetAve: result.data.logradouro,
                            state: result.data.uf,
                            city: result.data.localidade,
                            neighborhood: result.data.bairro,
                            uf: result.data.uf,
                        })
                        if (Object.keys(this.state.streetAve).length === 0) {
                            this.setState({ addressDisable: false })
                        }
                    }
                });
            }
            else if (event.target.value.length < 9) {
                this.setState({ fullAddress: null, validateCEP: true })
            }
        } else {
            this.setState({
                [name]: event.target.value,
            });
        }
    }

    changeOption = (option, form) => {
        if (form === 'marca') {
            this.setState({ marca: option, verificaChamada: true, liberaModelos: false })
        }
        if (form === 'equipamento') {
            this.setState({ equipamento: option, verificaChamada: true, liberaModelos: false })
        }
        if (form === 'modelo') {
            this.setState({ modelo: option })
        }
    }

    changeModal = (type, set) => {
        if (type === 'modal') {
            return this.setState({ verificaChamada: false, openModal: set })
        }
    }

    modalType = () => {
        const { classes } = this.props;

        if (this.state.assistancesPosting.length > 0) {
            return <div>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Escolha uma assistência da lista abaixo</FormLabel>
                    <RadioGroup aria-label="assistencias" name="assistencias" value={this.state.assistance} onChange={this.handleChange('assistance')}>
                        {
                            this.state.assistancesPosting.map((assistance, index) => {
                                return <div key={assistance.SATTechnicalAssistanceId} style={{borderBottom: '2px solid lightgrey', padding: '5px'}}>
                                    <FormControlLabel value={index} control={<Radio checked={this.state.assistance === index} />} label={assistance.name} />
                                    <p style={{ fontSize: 9, margin: '1px 0px' }}>{assistance.addressStreet}, {assistance.addressNumber} - {assistance.addressNeighborhood}</p>
                                    <p style={{ fontSize: 9, margin: '1px 0px' }}>{assistance.addressZipcode} - {assistance.addressCity} - {assistance.addressState}</p>
                                </div>
                            })
                        }
                    </RadioGroup>
                </FormControl>

                <Button variant="contained" color="primary" onClick={this.sendAssistance} className={classes.button}>
                    enviar
                </Button>

            </div>
        }
        if (this.state.assistanceSend) {
            return <div>
                <p>Envio realizado com sucesso!</p>
                <Button variant="contained" color="primary" onClick={this.handleChange('modalCloser')} className={classes.button}>
                    Fechar
                </Button>
            </div>
        }
    }

    sendForm = () => {
        let dataSys = {};

        dataSys.clientInformedAddress = {};
        dataSys.SATId = configJson.ID_ASSISTENCIAS_SYS;

        dataSys.SATProductBrandId = this.state.marca.SATBrandId;
        dataSys.SATProductCategoryId = this.state.categorie.SATCategoryId;
        dataSys.SATProductProductTypeId = this.state.equipamento.SATProductTypeId;

        dataSys.productCategoryName = this.state.categorie.name;
        dataSys.productProductTypeName = this.state.equipamento.name;
        dataSys.productBrandName = this.state.marca.name;
        dataSys.productModelName = this.state.modelo;
        
        dataSys.problemDescription = this.state.descricao;

        dataSys.clientInformedAddress.city = this.state.city;
        dataSys.clientInformedAddress.country = 'Brasil';
        dataSys.clientInformedAddress.extra = this.state.complement;
        dataSys.clientInformedAddress.neighborhood = this.state.neighborhood;
        dataSys.clientInformedAddress.number = parseInt(this.state.number, 10);
        dataSys.clientInformedAddress.state = this.state.uf;
        dataSys.clientInformedAddress.zipCode = this.state.cep;


        postAssistanceItem(this.state.token, dataSys).then((response) => {
            let ticketId = response.data.ticket.id;
            this.setState({ticket: response.data.ticket.id})
            getAssistancesSys(this.state.token, ticketId).then((response) => {
                response.assistances.map((assistanceType) => {
                    if (assistanceType.type === 'postagem') {
                        let assistancesList = assistanceType.providers
                        this.setState({ assistancesPosting: assistancesList, openModal: true })
                    }
                    if (assistanceType.type === 'visita') {
                        let assistancesList = assistanceType.providers
                        this.setState({ assistancesVisit: assistancesList, openModal: true })
                    }
                    return;
                })
            })
        })
    }

    sendAssistance = () => {
        let assistance = {}
        assistance.assistanceType = 'postagem';
        assistance.technicalAssistanceInfo = this.state.assistancesPosting[this.state.assistance]
        putTicketAssistance(this.state.token, this.state.ticket, assistance).then((response) => {
            if(response.success) {
                this.setState({assistancesPosting: [], assistanceSend: true})
            }
            // console.log(response);
        })
    }

    render() {

        const { classes } = this.props;
        let blockSubmit;

        if (this.state.marca && this.state.equipamento && this.state.descricao && this.state.atendimento && this.state.checkedLGPD) {
            blockSubmit = false;
            if (this.state.checkedEnd) {
                if (this.state.cep && this.state.streetAve && this.state.number && this.state.state && this.state.city && this.state.neighborhood && this.state.uf) {
                    blockSubmit = false;
                } else {
                    blockSubmit = true;
                }
            }
        }

        if (window.pathname !== null && this.props.success) {
            return <Redirect to={window.pathname} />;
        } else {
            return (
                <div style={{ minHeight: '88vh' }}>
                    <Hidden smUp>
                        <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/Mobile-Main-Banner.png"
                            alt="header-sys" style={{ width: '100%', height: '100%' }} />
                    </Hidden>
                    <Hidden xsDown>
                        <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/Desktop-main-Banner.png"
                            alt="header-sys" style={{ width: '100%', height: '100%' }} />
                    </Hidden>
                    <Container maxWidth="lg">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <h2 className={classes.heading}>Preencha os dados abaixo para solicitar o orçamento do conserto</h2>
                            </Grid>
                            <Grid container className={classes.grid}>
                                <Grid item xs={12}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <Autocomplete
                                            fullWidth
                                            id="equipamento-sys"
                                            options={this.state.productTypes}
                                            name="equipamento"
                                            onChange={(event, option) => this.changeOption(option, 'equipamento')}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => <TextField {...params} label="Equipamento" value={this.state.equipamento} variant="outlined" />}
                                        />
                                    </FormControl>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <Autocomplete
                                            fullWidth
                                            id="marca-sys"
                                            options={this.state.brands}
                                            name="marca"
                                            onChange={(event, option) => this.changeOption(option, 'marca')}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => <TextField {...params} label="Marca" value={this.state.marca} variant="outlined" />}
                                        />
                                    </FormControl>
                                </Grid>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <TextField
                                        fullWidth
                                        id="modelo-sys"
                                        name="modelo"
                                        variant="outlined"
                                        type="text"
                                        value={this.state.modelo === null ? '' : this.state.modelo}
                                        label="Modelo"
                                        onChange={this.handleChange('modelo')}
                                    />
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <TextField
                                        fullWidth
                                        id="descricao-sys"
                                        value={this.state.descricao}
                                        label="Descrição"
                                        placeholder="Descreva detalhadamente o problema que está acontecendo com seu aparelho (mínimo 30 caracteres)"
                                        variant="outlined"
                                        name="descricao"
                                        onChange={this.handleChange('descricao')}
                                        multiline
                                        rows={6}
                                        inputProps={{ maxLength: 300, minLength: 30 }}
                                    />
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <FormControlLabel style={{ justifyContent: 'center' }}
                                        control={<Checkbox checked={this.state.checkedEnd} className={classes.checkbox} onChange={this.handleChange('checkedEnd')} name="checkEnd" />}
                                        label="Desejo utilizar um endereço diferente do meu cadastrado no Club MAPFRE para este atendimento."
                                    />
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <TextField
                                        fullWidth
                                        id="cep-sys"
                                        name="cep"
                                        variant="outlined"
                                        type="text"
                                        placeholder="XXXXX-XXX"
                                        value={this.state.cep === null ? '' : this.state.cep}
                                        label="CEP"
                                        onChange={this.handleChange('cep')}
                                        disabled={!this.state.checkedEnd}
                                    />
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <TextField
                                        fullWidth
                                        id="estado-sys"
                                        value={this.state.uf === null ? '' : this.state.uf}
                                        label="Estado"
                                        variant="outlined"
                                        name="uf"
                                        onChange={this.handleChange('uf')}
                                        disabled
                                    />
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <TextField
                                        fullWidth
                                        id="cidade-sys"
                                        value={this.state.city === null ? '' : this.state.city}
                                        label="Cidade"
                                        variant="outlined"
                                        name="cidade"
                                        onChange={this.handleChange('cidade')}
                                        disabled
                                    />
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <TextField
                                        fullWidth
                                        id="bairro-sys"
                                        value={this.state.neighborhood === null ? '' : this.state.neighborhood}
                                        label="Bairro"
                                        variant="outlined"
                                        name="neighborhood"
                                        onChange={this.handleChange('neighborhood')}
                                        disabled={this.state.addressDisable}
                                    />
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <TextField
                                        fullWidth
                                        id="rua-sys"
                                        value={this.state.streetAve === null ? '' : this.state.streetAve}
                                        label="Rua"
                                        variant="outlined"
                                        name="streetAve"
                                        onChange={this.handleChange('streetAve')}
                                        disabled={this.state.addressDisable}
                                    />
                                </FormControl>
                                <Grid item xs={6}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            id="numero-sys"
                                            value={this.state.number === null ? '' : this.state.number}
                                            label="Número"
                                            variant="outlined"
                                            name="number"
                                            onChange={this.handleChange('number')}
                                            style={{ marginRight: 5 }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            id="complemento-sys"
                                            value={this.state.complement === null ? '' : this.state.complement}
                                            label="complemento"
                                            variant="outlined"
                                            name="complement"
                                            onChange={this.handleChange('complement')}
                                            style={{ marginLeft: 5 }}
                                        />
                                    </FormControl>
                                </Grid>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <FormControlLabel style={{ justifyContent: 'center' }}
                                        control={
                                            <Checkbox
                                                checked={this.state.checkedLGPD}
                                                className={classes.checkbox}
                                                onChange={this.handleChange('checkedLGPD')}
                                                name="checkLGPD" />}
                                        label="Estou de acordo com a coleta de dados pessoais para prestação de serviços e para efeitos de comunicação e ofertas."
                                    />
                                </FormControl>
                                <Grid item xs={6} style={{ textAlign: 'center', marginTop: 50 }}>
                                    <Button variant="contained" color="primary" className={classes.button}>
                                        Voltar
                                </Button>
                                </Grid>
                                <Grid item xs={6} style={{ textAlign: 'center', marginTop: 50 }}>
                                    <Button variant="contained" color="primary" onClick={this.sendForm} className={classes.button}>
                                        Próximo
                                </Button>
                                </Grid>
                            </Grid>
                            <div style={{ height: 80 }}></div>
                        </Grid>
                    </Container>

                    <Modal
                        open={this.state.openModal}
                        onClose={() => { this.changeModal('modal', false) }}
                        aria-labelledby="modal"
                        aria-describedby="modal"
                        style={{ zIndex: 999991 }}
                    >
                        <div className={classes.modal}>
                            <Grid container>
                                {this.modalType()}
                            </Grid>
                        </div>
                    </Modal>
                </div>
            )
        }
    }
}

FormSys.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormSys);