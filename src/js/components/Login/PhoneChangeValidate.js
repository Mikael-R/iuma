import React, { Component } from 'react';

import { Paper, Typography, Button, CircularProgress } from '@material-ui/core'

import confirmPhoneChange from 'js/library/utils/API/confirmPhoneChange';
import logo from 'styles/assets/Logo_CLUB_MAPFRE_VERMELHO.png'
import firebase from 'firebase/app';

class PhoneChangeValidate extends Component {
    state = {
        loading: true,
        errorMessage: ''
    }

    componentDidMount() {
        try {
            const data = this.props.history.location.search.replace(/\?h=/gi, '');

            if(!data) {
                this.setState({ loading: false, errorMessage: 'Ooops, esse link é inválido' });
                return;
            }

            confirmPhoneChange(data).then(success => {
                this.setState({ loading: false, errorMessage: '' });

                firebase.auth().signOut().then(() => {
                    localStorage.removeItem('channelToken');
                    localStorage.removeItem('aliasName');
                });
            }).catch(err => {
                const errorMessage = err.response.data.errorMessage;

                let message = '';

                if(errorMessage === 'Invalid date.') {
                    message = 'Ooops, esse link expirou';
                } else {
                    message = 'Ooops, esse link é inválido';
                }

                this.setState({ loading: false, errorMessage: message })
            });
        } catch (err) {
            this.setState({ loading: false, errorMessage: 'Erro ao válidar mudança. Tente novamente mais tarde' });
        }            
    }

    render() {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <div style={{ width: 600, maxWidth: '100%', textAlign: 'center', padding: 15, margin: '0 auto', display: 'block' }}>
                    <Paper style={{ padding: '20px 15px' }}>
                        <img src={logo} alt="Logo Club MAPFRE" style={{ width: 250, maxWidth: '100%', display: 'block', margin: '0 auto' }} />
                        <br />
                        {
                            this.state.loading
                                ? <React.Fragment>
                                    <CircularProgress />
                                    <Typography variant='h6'>Aguarde...</Typography>
                                </React.Fragment>
                                : this.state.errorMessage
                                    ? <React.Fragment>
                                        <Typography variant='h6'>{this.state.errorMessage}</Typography>
                                        <br />
                                        <a href={document.location.origin + '/clubmapfre'} style={{ textDecoration: 'none' }}>
                                            <Button className='login_button' size="large">
                                                <Typography variant='h6'>Ir para home</Typography>
                                            </Button>
                                        </a>
                                    </React.Fragment>
                                    : <React.Fragment>
                                        <Typography variant='h6'>Número de celular alterado com sucesso.</Typography>
                                        <br />
                                        <a href={document.location.origin + '/clubmapfre'} style={{ textDecoration: 'none' }}>
                                            <Button className='login_button' size="large">
                                                <Typography variant='h6'>Ir para home</Typography>
                                            </Button>
                                        </a>
                                    </React.Fragment>
                        }                        
                    </Paper>

                </div>
            </div>
        )
    }
}

export default PhoneChangeValidate;