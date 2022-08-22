import React, { Component } from "react";

import { Modal, Typography, Button, FormGroup, FormControlLabel, Checkbox, Grid } from '@material-ui/core';
import { getLastUserInfo, findValueInArray } from 'js/library/utils/helpers';
import { updateOptIn } from 'js/library/utils/API/updateOptIn';
import imageShout from 'styles/assets/icons/shout.png';

function getModalStyle() {
    return {
        width: 730,
        maxWidth: '90%',
        maxHeight: '90%',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        backgroundColor: 'white',
        overflow: 'hidden',
        outline: 'none'
    };
}

class HomeModal extends Component {

    constructor() {
        super();

        const checkOptIn = findValueInArray(getLastUserInfo().optInList, 'optInId', '-TermoDeUsoClubMapfre-02');
        const optinObj = JSON.parse(localStorage.getItem('optinObj'));

        let openModal = false;

        if (checkOptIn === null || !checkOptIn.accept) {
            const mkTime = optinObj === null ? 0 : new Date(optinObj.lastDate).getTime() / 1000.00;
            const mkTimeCurrent = optinObj === null ? 0 : new Date().getTime() / 1000.00;
            const date = optinObj === null ? 0 : Math.floor((((mkTimeCurrent - mkTime) / 60) / 60) / 24);

            if (optinObj === null || (!optinObj.accept && !optinObj.disable && date > 0)) {
                openModal = true;
            }
        }

        this.state = {
            openModal,
            optinObj,

            checkbox: optinObj === null || !optinObj.disable ? false : true
        };
    };

    handleAlert = option => {
        if (option === 'decline') {
            if (this.state.optinObj === null) {
                localStorage.setItem('optinObj', '{"accept": false, "lastDate": ' + new Date().getTime() + ', "counter": 1, "disable": ' + this.state.checkbox + '}');
                this.setState({ openModal: false });
            }
            else {
                const counter = this.state.optinObj.counter + 1;

                localStorage.setItem('optinObj', '{"accept": false, "lastDate": ' + new Date().getTime() + ', "counter":' + counter + ', "disable": ' + this.state.checkbox + '}');
                this.setState({ openModal: false });
            }
        }
        else {
            localStorage.setItem('optinObj', '{"accept": true, "lastDate": ' + new Date().getTime() + ', "counter":0, "disable": true }');
            updateOptIn();
            this.setState({ openModal: false });
        }
    };

    render() {

        return (
            <Modal
                open={this.state.openModal}
                /* onClose={handleClose} */
                aria-labelledby="optin-sms"
                aria-describedby="optin-sms"
                style={{ zIndex: 999991 }}
            >
                <div style={getModalStyle()} className='modalOptIn'>
                    <Grid container>
                        <Grid item xs={12} style={{ backgroundColor: '#cc0000', textAlign: 'center', textTransform: 'uppercase', padding: '10px 0', position: 'relative' }}>
                            <Typography variant="h3" className='modalOptIn__title' style={{ color: '#fff', fontSize: 26 }}>
                                Atenção!
                            </Typography>
                            <span className='modalOptIn__close-button' style={{ width: 50, fontSize: 26, color: '#fff', cursor: 'pointer', top: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => this.handleAlert('decline')}>X</span>
                        </Grid>
                        <Grid item xs={12} style={{ padding: 16 }} className='modalOptIn__content'>
                            <Grid container spacing={4}>
                                <Grid item sm={4} xs={12} style={{ justifyContent: 'center', alignItems: 'center', display: '-webkit-flex' }}>
                                    <img className='modalOptIn__image' alt='optin' src={imageShout} style={{ maxWidth: '100%', margin: '0 auto', display: 'block' }} />
                                </Grid>
                                <Grid item sm={8} xs={12}>
                                    <Typography variant="h5" className='modalOptIn__description' style={{ fontSize: 20, color: '#383838' }}>
                                        Notamos que você ainda não autorizou o envio de mensagens por SMS, WhatsApp e e-mail. <br />
                                        Isso é importante para melhorarmos sua experiência com o Club MAPFRE. <br /><br />
                                        Deseja autorizar agora? <br /><br />
                                    </Typography>
                                    {this.state.optinObj === null || this.state.optinObj.counter < 5
                                        ? null
                                        :<div>
                                            <FormGroup row>
                                                <FormControlLabel
                                                    control={<Checkbox checked={this.state.checkbox} onChange={() => this.setState({ checkbox: !this.state.checkbox })} name="checkbox" />}
                                                    label="Desativar modal"
                                                /><br /><br />
                                            </FormGroup><br /><br />
                                        </div>
                                    }
                                    <Grid container>
                                        <Grid item sm={6} xs={12}>
                                            <Button fullWidth onClick={() => this.handleAlert('accept')} variant='contained' color="primary" style={{ textTransform: 'none' }}>
                                                <Typography className='modalOptIn__button modalOptIn__button--agree' variant="h4" style={{ fontSize: 20, color: '#fff' }}>Sim</Typography>
                                            </Button>
                                        </Grid>
                                        <Grid item sm={6} xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Button fullWidth onClick={() => this.handleAlert('decline')} style={{ textTransform: 'none' }}>
                                                <Typography className='modalOptIn__button' variant="h5" style={{ textDecoration: 'underline', fontSize: 12, color: '#383838' }}>Agora não</Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        );

    }
};

export default HomeModal;