import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import { Container, Grid, Hidden, Card, CardActionArea, Link } from '@material-ui/core';

const styles = theme => ({
    heading: {
        fontWeight: 700,
        fontSize: '22px',
        color: '#555'
    },
    grid: {
        justifyContent: 'center',
        margin: '5px 0px 15px 0px',
        "@media (min-width: 600px)": {
            gap: '15px',
            flexFlow: 'row',
        }
    },
    cardsGrid: {
        textAlign: 'center',
        cursor: 'pointer',
        transition: '0.5s',
        padding: '10px',
        "@media (min-width: 600px)": {
            padding: '20px 10px',
            "&:hover": {
                backgroundColor: '#eee',
                webkitTransform: 'scale(1.1)',
                transform: 'scale(1.1)'
            },
            '&>a:hover': {
                textDecoration: 'none !important'
            }
        }
    },
    card: {
        padding: '10px',
        height: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    h5: {
        margin: '5px 0px 0px 0px !important',
        color: '#777'
    }
});

class RequestSys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // pageForm: 0,
        };
    }

    render() {
        const { classes } = this.props;
        if (window.pathname !== null && this.props.success) {
            return <Redirect to={window.pathname} />;
        } else {
            // if (this.state.pageform === 0) {
            return (

                <div style={{ minHeight: '88vh' }}>
                    <Hidden smUp>
                        <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/Mobile-Main-Banner.png" alt="header-sys" style={{ width: '100%', height: '100%' }} />
                    </Hidden>
                    <Hidden xsDown>
                        <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/Desktop-main-Banner.png" alt="header-sys" style={{ width: '100%', height: '100%' }} />
                    </Hidden>
                    <Container maxWidth="lg">
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <h2 className={classes.heading}>Nova solicitação</h2>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className={classes.grid}>
                            <Grid item xs={6} sm={3} className={classes.cardsGrid} id="smartphone">
                                <Hidden smUp>
                                    <Link href="/formAssistencia/jlisjRGnxksO5NPdLkej">
                                        <Card>
                                            <CardActionArea className={classes.card}>
                                                <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/smartphone.png" alt="smartphones" style={{ height: '60px' }} />
                                                <h5 className={classes.h5}>Celulares smartphones</h5>
                                            </CardActionArea>
                                        </Card>
                                    </Link>
                                </Hidden>
                                <Hidden xsDown>
                                    <Link href="/formAssistencia/jlisjRGnxksO5NPdLkej">
                                        <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/smartphone.png" alt="smartphones" style={{ height: '60px' }} />
                                        <h5 className={classes.h5}>Celulares smartphones</h5>
                                    </Link>
                                </Hidden>
                            </Grid>
                            <Grid item xs={6} sm={3} className={classes.cardsGrid} id="eletro">
                                <Hidden smUp>
                                    <Link href="/formAssistencia/ZrtHbDcOKEFNHpfNNWwt">
                                        <Card>
                                            <CardActionArea className={classes.card}>
                                                <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/maquina-de-lavar.png" alt="eletrodomesticos" style={{ height: '60px' }} />
                                                <h5 className={classes.h5}>Eletrodomésticos</h5>
                                            </CardActionArea>
                                        </Card>
                                    </Link>
                                </Hidden>
                                <Hidden xsDown>
                                    <Link href="/formAssistencia/ZrtHbDcOKEFNHpfNNWwt">
                                        <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/maquina-de-lavar.png" alt="eletrodomesticos" style={{ height: '60px' }} />
                                        <h5 className={classes.h5}>Eletrodomésticos</h5>
                                    </Link>
                                </Hidden>
                            </Grid>
                            <Grid item xs={6} sm={3} className={classes.cardsGrid} id="info">
                                <Hidden smUp>
                                    <Link href="/formAssistencia/Hr9bLtzuk47QQrH9jtXU">
                                        <Card>
                                            <CardActionArea className={classes.card}>
                                                <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/computador.png" alt="informatica" style={{ height: '60px' }} />
                                                <h5 className={classes.h5}>Informática e tablets</h5>
                                            </CardActionArea>
                                        </Card>
                                    </Link>
                                </Hidden>
                                <Hidden xsDown>
                                    <Link href="/formAssistencia/Hr9bLtzuk47QQrH9jtXU">
                                        <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/computador.png" alt="informatica" style={{ height: '60px' }} />
                                        <h5 className={classes.h5}>Informática e tablets</h5>
                                    </Link>
                                </Hidden>
                            </Grid>
                            <Grid item xs={6} sm={3} className={classes.cardsGrid} id="tv">
                                <Hidden smUp>
                                    <Link href="/formAssistencia/h5bv8MIpMjHhIzukg2kG">
                                        <Card>
                                            <CardActionArea className={classes.card}>
                                                <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/televisao.png" alt="tv" style={{ height: '60px' }} />
                                                <h5 className={classes.h5}>TV, áudio e home theater</h5>
                                            </CardActionArea>
                                        </Card>
                                    </Link>
                                </Hidden>
                                <Hidden xsDown>
                                    <Link href="/formAssistencia/h5bv8MIpMjHhIzukg2kG">
                                        <img src="https://club.mapfre.com.br/wp-content/uploads/2019/02/televisao.png" alt="tv" style={{ height: '60px' }} />
                                        <h5 className={classes.h5}>TV, áudio e home theater</h5>
                                    </Link>
                                </Hidden>
                            </Grid>
                        </Grid>
                    </Container>
                    <div style={{ height: '20px', width: '100%', backgroundColor: '#ddd' }}></div>
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            <Grid item xs={12} style={{ textAlign: 'center', paddingBottom: '40px' }}>
                                <h2 className="heading" style={{ fontWeight: 500, fontSize: '30px', color: '#CD0000', paddingBottom: '15px' }}>Assistências</h2>
                                <p style={{ fontSize: '20px' }}>Seu celular quebrou? A geladeira parou de gelar? Tenha acesso a milhares de assistências técnicas especializadas em linha branca, celulares e computadores exclusivo para uso de segurados cadastrados no Club MAPFRE.</p>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            )
            // }
        }
    }
}

RequestSys.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RequestSys);