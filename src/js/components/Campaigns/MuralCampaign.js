import React, { Component } from "react";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Typography } from "@material-ui/core";
import { getLastUserInfo, trackEventMatomo } from 'js/library/utils/helpers.js';

import { FacebookShareButton, FacebookIcon } from "react-share";

const styles = theme => ({
    root: {
    },
    faceBtn: {
        backgroundColor: '#81c2ff !important',
        display: 'flex !important',
        alignItems: 'center !important',
        padding: '15px !important',
        borderRadius: '13px !important',
        textAlign: 'center !important',
        fontSize: '20px !important',
        margin: '0 auto !important',
    }
});



class MuralCampaign extends Component {
    constructor(props) {

        super(props);
        this.state = {
            //valores
            id: '',
            userInfo: {},
        };


    }

    componentDidMount() {
        const userInfo = getLastUserInfo();
        this.setState({ userInfo: userInfo });
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let idw = urlParams.get('id');
        this.setState({ id: idw });

        let btnFace = document.getElementsByClassName('react-share__ShareButton')[0]

        btnFace.addEventListener('click', () => {
            trackEventMatomo('share-image-cartoes-de-natal', 'click', 'botao', 'share-image-facebook');
        })
    }

    render() {

        const { classes } = this.props;
        const imgSrc = window.location.origin + '/wp-content/uploads/2021/12/' + this.state.id + '.png?alt=media'

        return (
            <div style={{ minHeight: '88vh', textAlign: 'center' }}>

                <Typography variant="h1" color="primary" style={{fontSize: 30, marginTop: 20, fontWeight: 700}}>Você selecionou o seguinte cartão:</Typography>

                <img alt="campaign-img" src={imgSrc} style={{ margin: '30px 0px', width: '100%' }} />

                <Typography variant="subtitle2" color="secondary">Clique no botão abaixo para compartilhar no Facebook.</Typography>
                <FacebookShareButton hashtag="#FelizNatalClubMAPFRE" className={classes.faceBtn} url={imgSrc}><FacebookIcon size={35} round={true} style={{ marginRight: '10px' }} /> COMPARTILHAR </FacebookShareButton>

            </div>
        )
    }
}

MuralCampaign.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MuralCampaign);