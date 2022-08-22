import React, { Component } from 'react';
import { FormHelperText, FormControl, InputLabel, Select, MenuItem, Grid, TextField, Paper, CircularProgress, Button } from "@material-ui/core";
import { EditOutlined, SaveOutlined } from '@material-ui/icons';

import { formExtra } from 'js/library/utils/formExtraUtils';

class AdditionalInfosForm extends Component {
    constructor(props) {
        super(props);

        //informações adicionais
        const maritalStatus = !additionalInfo ? null : define(additionalInfo.maritalStatus);
        const numKids = !additionalInfo ? null : define(additionalInfo.numKids);
        const occupation = !additionalInfo ? null : define(additionalInfo.occupation);
        const scholarity = !additionalInfo ? null : define(additionalInfo.scholarity);
        const teamSupport = !additionalInfo ? null : define(additionalInfo.teamSupport);
        const musicStyle = !additionalInfo ? null : define(additionalInfo.musicStyle);
        const hobbie = !additionalInfo ? null : define(additionalInfo.hobbie);
        const favColor = !additionalInfo ? null : define(additionalInfo.favColor);
        const channel = !additionalInfo ? null : define(additionalInfo.channel);
        const artist = !additionalInfo ? null : define(additionalInfo.artist);

        this.state = {
            additionalInfo: {},
            maritalStatus,
            numKids,
            occupation,
            scholarity,
            teamSupport,
            musicStyle,
            hobbie,
            favColor,
            channel,
            artist,

            newMaritalStatus: maritalStatus,
            newNumKids: numKids,
            newOccupation: occupation,
            newScholarity: scholarity,
            newTeamSupport: teamSupport,
            newMusicStyle: musicStyle,
            newHobbie: hobbie,
            newFavColor: favColor,
            newChannel: channel,
            newArtist: artist,

            //validadores
            loaded2: false,
            editUser2: true
        }
    }

    componentDidMount = () => {
        
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
            editUser2: true,
        });
    }

    render = () => {
        return (
            <></>
        )
    }
}