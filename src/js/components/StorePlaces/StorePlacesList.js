import React, { Component } from "react";

import { Typography, Grid, TextField, InputAdornment, CircularProgress, Button, Hidden, withStyles, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
import { Search } from '@material-ui/icons';
import clsx from 'clsx';

import LoadingLists from 'js/containers/Loading/LoadingLists';
import Establishment from 'js/containers/StorePlaces/Establishment';
import Store from 'js/containers/StorePlaces/Store';

import { downloadImage } from 'js/library/services/StorageManager.js';
import { ValidatorForm } from 'react-material-ui-form-validator';
import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';
import { getStorePlaces_v2 } from 'js/library/utils/API/getStorePlaces_v2.js';
import { getCardByID } from 'js/library/utils/API/getCardByID.js';
import { getLastUserInfo, getUrlVariables, trackEventMatomoElementId } from 'js/library/utils/helpers';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = theme => ({
    filterButtonsContainer: {
        width: '96%',
        flexFlow: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        padding: '0% 2%'
    },
    filterButton: {
        margin: 5,
        textTransform: 'none',
        fontSize: 12,
        height: '100%',
        backgroundColor: '#eee',
        color: '#888',
        whiteSpace: 'nowrap',
        fontWeight: 'bold',
        flex: 'auto',
        '&:hover': {
            backgroundColor: '#ccc',
            color: '#888'
        }
    },
    filterButtonActive: {
        backgroundColor: '#CC0000',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#CC0000',
            color: '#fff'
        }
    },
    [theme.breakpoints.down('md')]: {
        filterButtonsContainer: {
            display: 'block'
        },
        filterButton: {
            width: '100%'
        }
    }
})

class StorePlacesList extends Component {

    constructor() {
        super();

        const userInfo = getLastUserInfo();

        //parametros de chamada
        const getVars = getUrlVariables();
        let query = getVars.query;
        let nationalQuery = query === undefined ? '' : '[' + query.replace('[', '').replace(']', '') + ',(endereco.keyword:LIKE:Brasil)]';
        query = query === undefined ? '' : '[' + query.replace('[', '').replace(']', '') + ',(endereco.keyword:DIFF:Brasil)]';
        let objectType = getVars.objectType;
        const cardId = getVars.cardId === undefined ? null : getVars.cardId;

        if (objectType === 'promotion_list') {
            nationalQuery = query === undefined ? '' : '[' + query.replace('[', '').replace(']', '') + ',(establishment.endereco.keyword:LIKE:Brasil)]';
            query = query === undefined ? '' : '[' + query.replace('[', '').replace(']', '') + ',(establishment.endereco.keyword:DIFF:Brasil)]';
        }


        this.state = {
            userInfo,
            query: query === undefined ? '' : query,
            nationalQuery: query === undefined ? '' : nationalQuery,
            objectType: objectType === undefined ? '' : objectType,
            cardInfo: false,
            cardThumbnail: placeholderItem,
            filter1: 'sort_distance',
            filter2: '',
            queryFilter2: '',
            nationalQueryFilter2: '',

            arrayComplete: null,
            arrayResearch: null,
            arrayNationalComplete: null,
            arrayNationalResearch: null,
            from: 0,
            size: 8,
            latitude: null,
            longitude: null,

            listOption: 'national',

            openDialog: true,
            hasMore: false,
            loadedList: true,
            research: '',
            researchList: false
        };

        getCardByID(userInfo.uId, cardId).then((cardInfo) => {
            if (cardInfo === null || !cardInfo.success) {
                this.setState({ cardInfo: null })
            }
            else {
                this.setState({ cardInfo: cardInfo.card });

                query = cardInfo.card.appFilter.query;
                nationalQuery = query === undefined ? '' : '[' + query.replace('[', '').replace(']', '') + ',(establishment.endereco.keyword:LIKE:Brasil)]';
                query = query === undefined ? '' : '[' + query.replace('[', '').replace(']', '') + ',(endereco.keyword:DIFF:Brasil)]';
                objectType = cardInfo.card.action === 'promotion_list' ? 'promotion' : 'establishment';

                this.setState({ query, nationalQuery, objectType });

                const thumb = cardInfo.card.images.mobile.split('/')
                downloadImage(thumb[0], thumb[1]).then((downloaded) => {
                    this.setState({ cardThumbnail: downloaded })
                }).catch((error) => {
                    return error;
                });
            }

            navigator.geolocation.getCurrentPosition((position) => {

                //buscando nacional
                getStorePlaces_v2(userInfo.uId, objectType, position.coords.latitude, position.coords.longitude, '', null, nationalQuery, 0, 50).then((dataReceived) => {
                    this.setState({ arrayNationalComplete: dataReceived.list });
                });

                //buscando local
                getStorePlaces_v2(userInfo.uId, objectType, position.coords.latitude, position.coords.longitude, '', null, query, this.state.from, this.state.size, 100).then((dataReceived) => {

                    this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude, from: this.state.from + this.state.size, arrayComplete: dataReceived.list });
                    if (dataReceived.list.length >= this.state.size) {
                        this.setState({ hasMore: true });
                    } else {
                        this.setState({ hasMore: false });
                    }
                });
            },
                () => {
                    //buscando nacional
                    getStorePlaces_v2(userInfo.uId, objectType, null, null, '', null, nationalQuery, 0, 50).then((dataReceived) => {
                        this.setState({ arrayNationalComplete: dataReceived.list });
                    });

                    //buscando local
                    getStorePlaces_v2(userInfo.uId, objectType, null, null, '', null, query, this.state.from, this.state.size, 100).then((dataReceived) => {

                        this.setState({ latitude: null, longitude: null, from: this.state.from + this.state.size, arrayComplete: dataReceived.list });

                        if (dataReceived.list.length >= this.state.size) {
                            this.setState({ hasMore: true });
                        } else {
                            this.setState({ hasMore: false });
                        }
                    });
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 },
            );
        });

        window.addEventListener('scroll', this.handleScroll);

        this.mainRef = React.createRef();


        const classTroqme = document.getElementsByClassName('link-troqme');

        classTroqme.forEach(item => {
            console.log(item);
            item.style.cursor = "pointer";
            item.addEventListener("click", function() {
                trackEventMatomoElementId(document.title, 'click', 'banner', 'troqme');
                window.open("https://mapfre-troqme.azurewebsites.net/", '_blank').focus();
            });
        });
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });

        if (event.target.value.length === 0 && this.state.researchList) {
            this.setState({ researchList: false, arrayResearch: null, arrayNationalResearch: null, hasMore: false });
        }
    }

    handleScroll = () => {
        if (Math.floor(this.mainRef.current.getBoundingClientRect().bottom) <= Math.floor(window.innerHeight)) {
            if (this.state.hasMore && this.state.loadedList) {
                this.setState({ loadedList: false });

                let query = this.state.query.replace('[', '').replace(']', '');
                query = '[' + query + this.state.queryFilter2 + ']';

                getStorePlaces_v2(this.state.userInfo.uId, this.state.objectType, this.state.latitude, this.state.longitude, this.state.research, null, query, this.state.from, this.state.size, 100).then((dataReceived) => {
                    const arrayList = this.state.researchList ? 'arrayResearch' : 'arrayComplete';
                    this.setState({ [arrayList]: [...this.state[arrayList] === null ? [] : this.state[arrayList], ...dataReceived.list], from: this.state.from + this.state.size, loadedList: true });
                    if (dataReceived.list.length >= this.state.size) {
                        this.setState({ hasMore: true });
                    } else {
                        this.setState({ hasMore: false });
                    }
                });
            }
        }
    };

    filter = (filterName, name) => {
        this.setState({ [filterName]: name });

        if (filterName === 'filter2') {
            let nationalQueryFilter2 = '';
            let queryFilter2 = '';

            if (this.state.queryFilter2.indexOf(name) >= 0) {
                this.setState({ [filterName]: '' });
            } else {
                nationalQueryFilter2 = ',(description:LIKE:' + name + ')';
                queryFilter2 = ',(description:LIKE:' + name + ')';
            }

            this.setState({
                nationalQueryFilter2,
                queryFilter2
            }, () => {
                this.researchData();
            })
        }
    }

    researchData = () => {
        this.setState({ researchList: true, arrayResearch: null, arrayNationalResearch: null, from: 0 }, () => {
            let nationalQuery = this.state.nationalQuery.replace('[', '').replace(']', '');
            nationalQuery = '[' + nationalQuery + this.state.nationalQueryFilter2 + ']';

            let query = this.state.query.replace('[', '').replace(']', '');
            query = '[' + query + this.state.queryFilter2 + ']';

            //nacional
            getStorePlaces_v2(this.state.userInfo.uId, this.state.objectType, this.state.latitude, this.state.longitude, this.state.research, null, nationalQuery, this.state.from, this.state.size).then((dataReceived) => {
                this.setState({ arrayNationalResearch: dataReceived.list });
            });

            //local
            getStorePlaces_v2(this.state.userInfo.uId, this.state.objectType, this.state.latitude, this.state.longitude, this.state.research, null, query, this.state.from, this.state.size, 100).then((dataReceived) => {

                this.setState({ arrayResearch: dataReceived.list, from: this.state.from + this.state.size });
                if (dataReceived.list.length >= this.state.size) {
                    this.setState({ hasMore: true });
                } else {
                    this.setState({ hasMore: false });
                }
            });
        });
    };

    render = () => {
        const { classes } = this.props;

        let arrayList = this.state.researchList ? this.state.arrayResearch : this.state.arrayComplete;
        let arrayNational = this.state.researchList ? this.state.arrayNationalResearch : this.state.arrayNationalComplete;
        // const promotionTitle = this.state.query.indexOf('club_auto') >=0 ? 'Automotivos' 
        //     : this.state.query.indexOf('club_presentes') >= 0 ? 'Presentes' 
        //     : this.state.query.indexOf('club_alimentacao') >= 0 ? 'Comer e Beber' 
        //     : this.state.query.indexOf('club_belezaesaude') >= 0 ? 'Beleza e Saúde' : null;

        if (this.state.filter1 === 'sort_alphabetic' && arrayList !== null && arrayNational !== null) {
            arrayList = [...arrayList];
            arrayList = arrayList.sort((a, b) => {
                if (a.establishment.nome < b.establishment.nome) return -1;
                if (a.establishment.nome > b.establishment.nome) return 1;
                return 0;
            })

            arrayNational = [...arrayNational];
            arrayNational = arrayNational.sort((a, b) => {
                if (a.establishment.nome < b.establishment.nome) return -1;
                if (a.establishment.nome > b.establishment.nome) return 1;
                return 0;
            })
        }

        return (
            <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }} ref={this.mainRef}>

                {this.state.cardInfo === false
                    ? <div align='center'>
                        <CircularProgress style={{ padding: '150px 20px', boxSizing: 'content-box' }} />
                    </div>
                    : <div style={{ padding: '15px 20px', borderBottomWidth: 0 }}>
                        {this.state.cardInfo === null
                            ? null
                            : <Grid container spacing={4}>
                                <Grid item xs={false} sm={4} md={4}></Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                    <div align="center">
                                        <img src={this.state.cardThumbnail} alt="Thubmnail do Card" width="100%" />
                                        <Typography variant="subtitle1" color="primary">{this.state.cardInfo.title}</Typography>
                                        <Typography variant="subtitle1" color="secondary">{this.state.cardInfo.description}</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={false} sm={4} md={4}></Grid>
                            </Grid>
                        }

                        <Grid container spacing={4}>
                            <Grid item xs={false} sm={1} md={1}></Grid>
                            <Grid item xs={12} sm={10} md={10}>
                                {/* <Typography variant='h6' align='center' style={{ marginBottom: 15, fontWeight: 'bold' }}>{promotionTitle}</Typography> */}
                                {this.state.query.indexOf('retomadasegura') < 0
                                    ? <Grid container>
                                        <Grid item xs={false} sm={1} md={1}></Grid>
                                        <Grid item xs={12} sm={10} md={10}>
                                            <ValidatorForm onSubmit={this.researchData}>
                                                <TextField variant="outlined" style={{ backgroundColor: 'white', boxShadow: '3px 3px 6px #00000029' }} fullWidth={true} type="text" label="Pesquisar..." value={this.state.research} onChange={this.handleChange('research')}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment onClick={this.researchData} style={{ cursor: 'pointer' }} position="start">
                                                                <Search />
                                                            </InputAdornment>
                                                        ),
                                                    }} />
                                            </ValidatorForm>
                                        </Grid>
                                    </Grid>
                                    : null
                                }


                                {this.state.query.indexOf('retomadasegura') >= 0
                                    ? <div>
                                        <Hidden mdDown>
                                            <Grid container spacing={2} alignItems="center" style={{ marginTop: '2px' }}>

                                                <div className={clsx(classes.filterButtonsContainer)}>
                                                    {/* <Button
                                                        onClick={(e) => {
                                                            this.filter('filter2', e.currentTarget.name);
                                                        }}
                                                        name='retomada_auto' title='filtro_retomada_auto'
                                                        className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                            [classes.filterButtonActive]: this.state.filter2 === 'retomada_auto'
                                                        })}
                                                        type='button' variant='contained' size="large"
                                                    >
                                                        Automotivo
                                                    </Button> */}
                                                    <Button
                                                        onClick={(e) => {
                                                            this.filter('filter2', e.currentTarget.name);
                                                        }}
                                                        name='retomada_belezaesaude' title='filtro_retomada_belezaesaude'
                                                        className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                            [classes.filterButtonActive]: this.state.filter2 === 'retomada_belezaesaude'
                                                        })}
                                                        type='button' variant='contained' size="large"
                                                    >
                                                        Beleza e Saúde
                                                    </Button>
                                                    <Button
                                                        onClick={(e) => {
                                                            this.filter('filter2', e.currentTarget.name);
                                                        }}
                                                        name='retomada_alimentacao' title='filtro_retomada_alimentacao'
                                                        className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                            [classes.filterButtonActive]: this.state.filter2 === 'retomada_alimentacao'
                                                        })}
                                                        type='button' variant='contained' size="large"
                                                    >
                                                        Comer e Beber
                                                    </Button>
                                                    {/* <Button
                                                        onClick={(e) => {
                                                            this.filter('filter2', e.currentTarget.name);
                                                        }}
                                                        name='retomada_presentes' title='filtro_retomada_presentes'
                                                        className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                            [classes.filterButtonActive]: this.state.filter2 === 'retomada_presentes'
                                                        })}
                                                        type='button' variant='contained' size="large"
                                                    >
                                                        Presentes
                                                    </Button> */}
                                                    <Button
                                                        onClick={(e) => {
                                                            this.filter('filter2', e.currentTarget.name);
                                                        }}
                                                        name='retomada_servicos' title='filtro_retomada_servicos'
                                                        className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                            [classes.filterButtonActive]: this.state.filter2 === 'retomada_servicos'
                                                        })}
                                                        type='button' variant='contained' size="large"
                                                    >
                                                        Serviços
                                                    </Button>
                                                    <Button
                                                        onClick={(e) => {
                                                            this.filter('filter2', e.currentTarget.name);
                                                        }}
                                                        name="retomada_outros AND LIKE retomada_auto AND LIKE retomada_presentes AND LIKE club_outros" title='filtro_retomada_outros'
                                                        className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                            [classes.filterButtonActive]: this.state.filter2 === "retomada_outros AND LIKE retomada_auto AND LIKE retomada_presentes AND LIKE club_outros"
                                                        })}
                                                        type='button' variant='contained' size="large"
                                                    >
                                                        Outros
                                                    </Button>
                                                </div>
                                            </Grid>
                                        </Hidden>
                                        <Hidden lgUp>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    Filtros
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container spacing={1} alignItems="center" style={{ marginTop: '2px' }}>
                                                        {/* <Grid item xs={12}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    this.filter('filter2', e.currentTarget.name);
                                                                }}
                                                                name='retomada_auto' title='filtro_retomada_auto'
                                                                className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                                    [classes.filterButtonActive]: this.state.filter2 === 'retomada_auto'
                                                                })}
                                                                type='button' variant='contained' size="large"
                                                            >
                                                                Automotivo
                                                            </Button>
                                                        </Grid> */}
                                                        <Grid item xs={12}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    this.filter('filter2', e.currentTarget.name);
                                                                }}
                                                                name='retomada_belezaesaude' title='filtro_retomada_belezaesaude'
                                                                className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                                    [classes.filterButtonActive]: this.state.filter2 === 'retomada_belezaesaude'
                                                                })}
                                                                type='button' variant='contained' size="large"
                                                            >
                                                                Beleza e Saúde
                                                            </Button>
                                                        </Grid><Grid item xs={12}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    this.filter('filter2', e.currentTarget.name);
                                                                }}
                                                                name='retomada_alimentacao' title='filtro_retomada_alimentacao'
                                                                className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                                    [classes.filterButtonActive]: this.state.filter2 === 'retomada_alimentacao'
                                                                })}
                                                                type='button' variant='contained' size="large"
                                                            >
                                                                Comer e Beber
                                                            </Button>
                                                        </Grid>
                                                        {/* <Grid item xs={12}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    this.filter('filter2', e.currentTarget.name);
                                                                }}
                                                                name='retomada_presentes' title='filtro_retomada_presentes'
                                                                className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                                    [classes.filterButtonActive]: this.state.filter2 === 'retomada_presentes'
                                                                })}
                                                                type='button' variant='contained' size="large"
                                                            >
                                                                Presentes
                                                            </Button>
                                                        </Grid> */}
                                                        <Grid item xs={12}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    this.filter('filter2', e.currentTarget.name);
                                                                }}
                                                                name='retomada_servicos' title='filtro_retomada_servicos'
                                                                className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                                    [classes.filterButtonActive]: this.state.filter2 === 'retomada_servicos'
                                                                })}
                                                                type='button' variant='contained' size="large"
                                                            >
                                                                Serviços
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    this.filter('filter2', e.currentTarget.name);
                                                                }}
                                                                name="retomada_outros AND LIKE retomada_auto AND LIKE retomada_presentes AND LIKE club_outros" title='filtro_retomada_outros'
                                                                className={clsx(classes.filterButton, 'slimstat-clickable', {
                                                                    [classes.filterButtonActive]: this.state.filter2 === "retomada_outros AND LIKE retomada_auto AND LIKE retomada_presentes AND LIKE club_outros"
                                                                })}
                                                                type='button' variant='contained' size="large"
                                                            >
                                                                Outros
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        </Hidden>
                                    </div>
                                    : null
                                }

                                {arrayNational === null || arrayNational.length > 0
                                    ? <Typography variant="subtitle1" color="primary" style={{ fontWeight: 'bolder', paddingTop: '20px' }}>Em todo o Brasil</Typography>
                                    : null
                                }

                                <div className="establishment-list">

                                    <ul style={arrayList !== null && arrayList.length === 0 ? { justifyContent: 'center' } : null}>
                                        {arrayNational === null
                                            ? ['0', '1', '2', '3'].map(row => {
                                                return (
                                                    <li key={row}>
                                                        <img alt="placeholder" src={placeholderItem} />
                                                    </li>
                                                )
                                            })
                                            : arrayNational.length > 0
                                                ? arrayNational.map(row => {
                                                    if (row.type === 'establishment') {
                                                        return <Establishment key={row.id} data={row} />
                                                    } else {
                                                        return <Store key={row.id} data={row} uId={this.state.userInfo.uId} />
                                                    }
                                                })
                                                : null
                                            // : <Typography variant="subtitle1" gutterBottom style={{ color: '#919191' }}>Nenhum resultado encontrado.</Typography>
                                        }
                                    </ul>
                                </div>

                                <Typography variant="subtitle1" color="primary" style={{ fontWeight: 'bolder', paddingTop: '20px' }}>Próximos a você</Typography>

                                <div className="establishment-list" style={{ paddingTop: '20px' }}>
                                    <ul style={arrayList !== null && arrayList.length === 0 ? { justifyContent: 'center' } : null}>
                                        {arrayList === null
                                            ? ['0', '1', '2', '3'].map(row => {
                                                return (
                                                    <li key={row}>
                                                        <img alt="placeholder" src={placeholderItem} />
                                                    </li>
                                                )
                                            })
                                            : arrayList.length > 0
                                                ? arrayList.map(row => {
                                                    if (row.type === 'establishment') {
                                                        return <Establishment key={row.id} data={row} />
                                                    } else {
                                                        return <Store key={row.id} data={row} uId={this.state.userInfo.uId} />
                                                    }
                                                })
                                                : <div align="center">
                                                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bolder', color: '#919191' }}>Infelizmente não possuímos ofertas próximas a seu endereço cadastrado.</Typography>
                                                    <Typography variant="subtitle1" style={{ color: '#919191' }} gutterBottom>Estamos trabalhando para oferecer benefícios na sua área.</Typography>

                                                    <Typography variant="subtitle1" style={{ paddingTop: '15px', color: '#919191' }}>Gostaria de indicar algum estabelecimento? Envie através do email: relacionamento@mapfre.com.br</Typography>
                                                </div>
                                        }
                                    </ul>
                                    {this.state.hasMore && arrayList !== null && arrayList.length >= 4
                                        ? <LoadingLists />
                                        : null
                                    }
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                }
            </div>
        );
    }
}

export default withStyles(useStyles)(StorePlacesList);