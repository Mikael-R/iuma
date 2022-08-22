import React, { Component } from 'react';

import { findValueInArray } from "js/library/utils/helpers";

import { Grid, TextField, Button, FormControlLabel, Checkbox, CircularProgress, Typography } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { store } from 'js/core/configureStore';
import CustomModal from 'js/components/UI/CustomModal/CustomModal';
import sendEmailAccessDifficulty from 'js/library/utils/API/apiSendEmailAccessDifficulty';

class AccessDifficulty extends Component {
    constructor(props) {
        super(props)

        const partnerList = findValueInArray(store.getState().mapfreQueryModel.partnerList, 'channelSource', 'triibo-clubmapfre');

        this.state = {
            selectedOption: 'Não recebi o SMS',
            description: '',
            name: store.getState().mapfreQueryModel.isMapfreV3 ? store.getState().mapfreQueryModel.name : '',
            email: store.getState().mapfreQueryModel.isMapfreV3 ? findValueInArray(partnerList.contactList, 'type', 'email').value : '',
            cpf: store.getState().mapfreQueryModel.isMapfreV3 ? findValueInArray(partnerList.documentList, 'type', 'cpf').value : '',
            cellPhone: store.getState().mapfreQueryModel.isMapfreV3 ? findValueInArray(store.getState().mapfreQueryModel.contactList, 'type', 'cellPhone').value : '',
            uId: store.getState().mapfreQueryModel.isMapfreV3 ? store.getState().mapfreQueryModel.uId : '',
    
            loading: false,
            success: false,
            error: false
        }
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit = () => {
        this.setState({ loading: true });

        if( this.state.name === '' || this.state.email === '' | this.state.uId === '' || this.state.cpf === '' || this.state.cellPhone === '' ) {
            this.setState({ loading: false, success: false, error: true });
            return;
        }

        sendEmailAccessDifficulty(
            this.state.uId,
            this.state.name,
            this.state.cpf,
            this.state.cellPhone,
            this.state.email,
            this.state.selectedOption,
            this.state.description,
        ).then(success => {
            this.setState({ loading: false, success: true });
        }).catch(error => {
            this.setState({ loading: false, success: false, error: true });
        })
    }

    render() {
        return (
            <CustomModal title='Dificuldades no acesso' width={1000}>
                {
                    this.state.loading 
                    ? <div align='center' style={{ padding: '30px 0' }}>
                        <CircularProgress />
                    </div>
                    :  this.state.success
                    ? (
                        <Typography align='center' variant='h6'>
                            Suas informações foram enviadas. <br />
                            Nossa equipe entrará em contato com você.
                        </Typography>
                    )
                    : <ValidatorForm onSubmit={this.handleSubmit}>
                        <Grid container>
                            <Grid item sm={4} xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.selectedOption === 'Não recebi o SMS'}
                                            onChange={this.handleChange}
                                            name='selectedOption'
                                            value="Não recebi o SMS"
                                            color="secondary"
                                        />
                                    }
                                    style={{ margin: 0 }}
                                    label="Não recebi o SMS"
                                />
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.selectedOption === 'Código inválido'}
                                            onChange={this.handleChange}
                                            name='selectedOption'
                                            value="Código inválido"
                                            color="secondary"
                                        />
                                    }
                                    style={{ margin: 0 }}
                                    label="Código inválido"
                                />
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.selectedOption === 'Outros'}
                                            onChange={this.handleChange}
                                            name='selectedOption'
                                            value="Outros"
                                            color="secondary"
                                        />
                                    }
                                    style={{ margin: 0 }}
                                    label="Outros"
                                />
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: 30, marginBottom: 30 }}>
                            <Grid item sm={2} xs={12}></Grid>
                            <Grid item sm={8} xs={12}>
                                <TextField 
                                    color='secondary'
                                    style={{ width: '100%' }} 
                                    multiline 
                                    rows={5} 
                                    variant='outlined' 
                                    label='Descreva o problema' 
                                    name='description' 
                                    onChange={this.handleChange} 
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Button 
                            className='login_button'
                            style={{ margin: '0 5px' }} 
                            type='submit' 
                            variant='contained' 
                            size="large" 
                            disabled={ this.state.description.trim().length <= 0 }
                        >
                            Enviar
                        </Button>
                        {
                            this.state.error 
                            ? <Typography align='center' style={{ marginTop: 15, color: '#cc0000', fontSize: 12 }}>Ocorreu um erro. Tente novamente mais tarde</Typography>
                            : null
                        }
                    </ValidatorForm>
                }
            </CustomModal>
        )
    }
}

export default AccessDifficulty;