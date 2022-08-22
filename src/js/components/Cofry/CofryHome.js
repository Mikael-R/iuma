import React, { Component } from "react";

import { withStyles } from '@material-ui/styles';

import { configJson } from 'js/library/utils/firebaseUtils';

import OwlCarousel from 'react-owl-carousel2';

import { Grid, CircularProgress, Hidden, Button, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';
import { getStorePlaces_v2 } from "js/library/utils/API/getStorePlaces_v2";
import { getLastUserInfo, trackEventMatomo, trackEventMatomoElementId } from 'js/library/utils/helpers';


const isSmall = (window.innerWidth < 768) ? true : false;

const styles = theme => ({
    root: {
    },
    formControl: {
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    inputMaterial: {
        '& input': {
            background: 'white'
        },
    },
    selectLeft: {
        background: 'white',
        '&:first-child': {
            borderRadius: '15px 0px 0px 15px'
        }
    },
    selectRight: {
        background: 'white',
        '&:last-child': {
            borderRadius: '0px 15px 15px 0px'
        }
    },
    filters: isSmall ? {
        position: 'fixed',
        zIndex: 999999999,
        background: 'white',
        width: '100%',
        height: '100vh',
        overflow: 'scroll',
        top: '0%',
        padding: '10px',
        transition: '0.5s'
    } : null
});

class CofryHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: getLastUserInfo(),
            segment: '',
            searchVal: '',
            departmentList: [
                { id: 0, checked: true, name: 'Alimentos e Bebidas' },
                { id: 1, checked: false, name: 'Assinaturas e Serviços' },
                { id: 2, checked: false, name: 'Atacado' },
                { id: 3, checked: true, name: 'Automotivo' },
                { id: 4, checked: false, name: 'Bebês e Crianças' },
                { id: 5, checked: false, name: 'Beleza e Perfume' },
                { id: 6, checked: false, name: 'Casa e Decoração' },
                { id: 7, checked: true, name: 'Computadores' },
                { id: 8, checked: false, name: 'Construção e Reforma' },
                { id: 9, checked: false, name: 'Cursos e Concursos' },
                { id: 10, checked: true, name: 'Eletrodomésticos' },
                { id: 11, checked: false, name: 'Esporte e Lazer' },
                { id: 12, checked: false, name: 'Festas, Presentes e Brindes' },
                { id: 13, checked: false, name: 'Games e Consoles' },
                { id: 14, checked: false, name: 'Joalheria' },
                { id: 15, checked: false, name: 'Livros e e-Books' },
                { id: 16, checked: false, name: 'Locação de Veículos' },
                { id: 17, checked: false, name: 'Lojas Internacionais' },
                { id: 18, checked: false, name: 'Lojas de Departamentos' },
                { id: 19, checked: false, name: 'Moda e Acessórios' },
                { id: 20, checked: false, name: 'Ótica' },
                { id: 21, checked: false, name: 'Outros' },
                { id: 22, checked: false, name: 'Papelaria, Gráfica e Fotografia' },
                { id: 23, checked: true, name: 'Pets' },
                { id: 24, checked: true, name: 'Saúde e Bem Estar' },
                { id: 25, checked: true, name: 'Smartphones' },
                { id: 26, checked: false, name: 'Som e Instrumentos Musicais' },
                { id: 27, checked: false, name: 'Tecnologia e Inovação' },
                { id: 28, checked: false, name: 'Viagens e Turismo' },
            ],
            filter: [],
            selectSegmento: '',
            selectFiltro: '',
            lojasDestaques: [],
            departments: [],
            settingsDestaque: {
                items: isSmall ? 1 : 5,
                nav: true,
                loop: true,
                autoplay: false,
                dots: false,
                rewind: true,
                navText: ['<', '>']
            },
            settingsGeral: {
                items: isSmall ? 1 : 4,
                nav: true,
                loop: true,
                autoplay: false,
                dots: false,
                rewind: true,
                navText: ['<', '>']
            },

            //validadores
            haveDepartments: false,
            filterOpen: false
        };

        this.setState({ departments: [], lojasDestaques: [] })

        getStorePlaces_v2(this.state.userInfo.uId, 'establishment', null, null, '', null, '[(endereco.keyword:LIKE:Brasil)]', 0, 8, null, ['Cofry', 'Destaques']).then((dataReceived) => {
            this.setState({ lojasDestaques: dataReceived.list });
        });

        this.getCarousels()
    }


    getCarousels = () => {
        this.state.departmentList.map((department, i) => {

            getStorePlaces_v2(this.state.userInfo.uId, 'establishment', null, null, '', null, '[(endereco.keyword:LIKE:Brasil)]', 0, 8, null, ['Cofry', department.name]).then((dataReceived) => {
                let departmentAux = {};
                departmentAux.name = department.name;
                departmentAux.list = dataReceived.list
                departmentAux.id = department.id

                this.setState({ departments: [...this.state.departments, departmentAux], haveDepartments: true });
            })
            return;
        })
    }

    handleChange = (department, event) => {
        let depsAux = this.state.departmentList
        depsAux.map((dep, i) => {
            if (dep.name === department.name) {
                depsAux[i].checked = event.target.checked
                this.setState({ departmentList: depsAux })
                trackEventMatomo('Cofry', 'click', 'checkbox', 'filtro - ' + department.name + ' - ' + event.target.checked)
            }
            return;
        })
    };

    render() {
        const { classes } = this.props;
        return (
            <div style={{ minHeight: '88vh' }}>
                <div style={{ width: '100vw', background: 'lightgrey' }}>
                    <img src="/wp-content/uploads/2019/02/banner.cashback.png" alt="banner-header-cofry" width="100%" />
                </div>
                <Grid container style={{ background: '#cc0000', alignItems: 'center', padding: isSmall ? '10px' : '25px 100px', flexDirection: 'column' }}>
                    <Grid container style={{ maxWidth: 1300 }}>
                        <Grid container className={'slide_ofertas slide_ofertas--DESTAQUES'} xs={12} style={{ textAlign: 'center' }}>
                            <Grid item sm={2} xs={12} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                                <div class="slide_ofertas__title">LOJAS DESTAQUE</div>
                            </Grid>
                            <Grid item sm={10} xs={12} style={{ textAlign: 'center' }}>
                                {this.state.lojasDestaques.length > 0 ? (
                                    <OwlCarousel className={"slide_ofertas__carousel owl-carousel owl-theme"} options={this.state.settingsDestaque} >
                                        {
                                            this.state.lojasDestaques.map(loja => {
                                                return (
                                                    <div title={loja.establishment.nome} className="item">
                                                        <a id="nameId" title={loja.establishment.nome} href={'/estabelecimentosCofry/?store=' + loja.id} onClick={() => trackEventMatomoElementId('Cofry', 'click', 'Carrossel Destaques', loja.id)}>
                                                            <div title={"imageDiv-" + loja.establishment.nome} class="slide_ofertas__thumb">
                                                                <img alt={"imageDiv-" + loja.establishment.nome} src={configJson.STORAGE_URL + encodeURIComponent('estabelecimento/' + loja.establishment.fotoThumb) + '?alt=media'} onerror={"this.onerror=null;this.src=" + placeholderItem + ';'} title={'img-' + loja.establishment.nome} />
                                                            </div>
                                                            <span title="nameId">{loja.establishment.cashbackDefault}% de cashback </span>
                                                        </a>
                                                    </div>
                                                )
                                            })
                                        }
                                    </OwlCarousel>
                                ) : null
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container style={{ background: '#fff', alignItems: 'center', padding: isSmall ? '10px' : '25px 100px', flexDirection: 'column' }}>
                    <Grid container style={{ maxWidth: 1300, margin: '0 auto', marginTop: 30 }}>
                        <Hidden smUp>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" style={{ width: '100%', marginBottom: '20px' }} onClick={() => { this.setState({ filterOpen: true }) }}>Filtros</Button>
                            </Grid>
                        </Hidden>
                        <Grid item xs={12} sm={3} className={classes.filters} style={{ left: isSmall ? this.state.filterOpen ? '0%' : '-100%' : null }}>
                            <Hidden smUp>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" style={{ float: 'right' }} onClick={() => { this.setState({ filterOpen: false }); trackEventMatomo('Cofry', 'click', 'botao', 'filtros') }}>X</Button>
                                </Grid>
                            </Hidden>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Filtros</FormLabel>
                                <FormGroup aria-label="filtros" column>
                                    {this.state.departmentList.map((department, i) => (
                                        <FormControlLabel
                                            key={i}
                                            value="department.name"
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={this.state.departmentList[i].checked}
                                                    onChange={(e) => { this.handleChange(department, e) }}
                                                />}
                                            label={department.name}
                                            labelPlacement="end"
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            {
                                this.state.haveDepartments ?
                                    this.state.departments.sort((a, b) => {
                                        if (a.id > b.id) return 1;
                                        if (a.id < b.id) return -1;
                                        return 0;
                                    }).map((department, i) => {
                                        return this.state.departmentList[department.id].checked ? (
                                            <Grid container className={'slide_ofertas slide_ofertas--' + department.name.replace(/[ ]/gi, "-")} xs={12} style={{ textAlign: 'center' }} key={i}>
                                                <Grid item sm={2} xs={12} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                                                    <div class="slide_ofertas__title">{department.name}</div>
                                                    <a href={"/estabelecimentosCofry/?dep=" + department.name.replace(/[ ]/gi, "-")} onClick={() => trackEventMatomoElementId('Cofry', 'click', 'botao ver mais', department.name.replace(/[ ]/gi, "-"))} style={{ marginTop: 'auto', height: 'auto' }}>ver mais</a>
                                                </Grid>
                                                <Grid item sm={10} xs={12} style={{ textAlign: 'center' }}>
                                                    <OwlCarousel className={"slide_ofertas__carousel owl-carousel owl-theme"} options={this.state.settingsGeral} >
                                                        {department.list.map(loja => {
                                                            return (
                                                                <div title={loja.establishment.nome} className="item">
                                                                    <a id="nameId" title={loja.establishment.nome} href={'/estabelecimentosCofry/?store=' + loja.id} onClick={() => trackEventMatomoElementId('Cofry', 'click', 'card '+ department.name, loja.id)} >
                                                                        <div title={"imageDiv-" + loja.establishment.nome} class="slide_ofertas__thumb">
                                                                            <img alt={"imageDiv-" + loja.establishment.nome} src={configJson.STORAGE_URL + encodeURIComponent('estabelecimento/' + loja.establishment.fotoThumb) + '?alt=media'} onerror={"this.onerror=null;this.src=" + placeholderItem + ';'} title={'img-' + loja.establishment.nome} />
                                                                        </div>
                                                                        <span title="nameId">{loja.establishment.cashbackDefault}% de cashback </span>
                                                                    </a>
                                                                </div>
                                                            )
                                                        })
                                                        }
                                                    </OwlCarousel>
                                                </Grid>
                                            </Grid>
                                        ) : null
                                    })
                                    : <Grid container style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', placeContent: 'center' }}>
                                        <CircularProgress />
                                    </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(CofryHome);