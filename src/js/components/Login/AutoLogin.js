import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { withStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { Modal, Typography, CircularProgress, Grid } from '@material-ui/core';

import { findValueInArray, encrypt } from "js/library/utils/helpers";
import { configJson } from 'js/library/utils/firebaseUtils';

import { loginUser } from "../../library/services/AuthenticationManager";
import loginEmail from "../../library/utils/API/loginEmail";
import getAccessToken from "../../library/utils/API/getAccessToken_v1";

import { mapfreQueryAction } from 'js/core/actions/mapfreQueryActions';

const styles = theme => ({
    principal: {
        textAlign: 'center',
        height: '88vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

class AutoLogin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            errorLabel: '',

            //validadores
            openLabel: false,
        };

        window.pathname = null;
    };

    handleChange = name => event => {
        if (name === 'modal') {
            this.setState({ openLabel: false })
        }
    }

    componentDidMount = () => {
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        const hash = urlParams.get('hash');
        const campaignId = urlParams.get('campaignId');
        const campaignToken = urlParams.get('campaignToken');
        const urlRedirect = urlParams.get('urlRedirect');

        getAccessToken(null, 2).then(async (token) => {
            loginEmail(token, hash, campaignId, campaignToken).then(async resultGetUser => {
                
                if (resultGetUser.success) {
                    const cpf = findValueInArray(resultGetUser.result[0].documentList, 'type', 'cpf').value;
                    await this.props.mapfreQueryComponent(cpf.replace(/[.]/gi, "").replace(/[-]/gi, ""));
                    console.log(resultGetUser)

                    //logando usuário c/ email no firebase
                    await loginUser(resultGetUser.result[0].triiboId.replace(/[,]/gi, "."), resultGetUser.result[0].passPhrase);

                    const userInfoModel = { ...resultGetUser.result[0] };
                    userInfoModel.isTriibo = true;
                    userInfoModel.isMapfreV3 = true;

                    //setando objs no storage
                    localStorage.setItem('aliasName', resultGetUser.result[0].aliasName);
                    localStorage.setItem('cofryId', encrypt(findValueInArray(resultGetUser.result[0].documentList, 'type', 'cpf').value, configJson.cryptoCofry));
                    localStorage.setItem('userInfoAuxiliar', JSON.stringify(userInfoModel));

                    window.location.replace(window.location.origin + decodeURIComponent(urlRedirect));
                }
            }).catch(err => {
                console.log('err ====>', err);
            })
        })
    }

    render() {
        const { classes } = this.props;

        if (window.pathname !== null) {
            return <Redirect to={window.pathname} />;
        }
        else {
            return (
                <div>
                    <div className={classes.principal}>
                        <CircularProgress size={80} style={{ margin: 30 }}></CircularProgress>
                        <Typography>Aguarde, estamos redirecionando você!</Typography>
                    </div>

                    <Modal
                        open={this.state.openLabel}
                        // onClose={() => { this.handleChange('modal') }}
                        style={{ zIndex: 999991 }}
                    >
                        <div>
                            <Grid container>
                                {
                                    this.state.openLabel
                                        ? <Typography color="primary" >{this.state.errorLabel}</Typography>
                                        : null
                                }
                            </Grid>
                        </div>
                    </Modal>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AutoLogin);