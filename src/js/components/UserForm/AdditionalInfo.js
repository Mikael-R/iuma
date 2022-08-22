import React, { Component } from 'react';
import { CircularProgress, Grid, Paper, TextField, Typography, FormHelperText, Button, InputLabel, MenuItem, Select, FormControl, FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { EditOutlined, SaveOutlined } from '@material-ui/icons';
import { configJson } from 'js/library/utils/firebaseUtils';

import { getLastUserInfo, findIndexInArray, diffDays } from 'js/library/utils/helpers';
import { formExtra } from 'js/library/utils/formExtraUtils';

import setAdditionalInfo from 'js/library/utils/API/setAdditionalInfo';
import getAccessToken from 'js/library/utils/API/getAccessToken_v1';

class additionalInfo extends Component {
    constructor(props) {
        super(props);

        let userInfo = getLastUserInfo();
        const uid = userInfo.uId;
        userInfo = userInfo.partnerList[findIndexInArray(userInfo.partnerList, 'partnerId', configJson.partnerIdClubMapfre)]

        const addInfo = userInfo.additionalInfo;

        const maritalStatus = !addInfo ? null : addInfo.maritalStatus;
        const hasKids = !addInfo ? false : addInfo.hasKids;
        const numKids = !addInfo ? null : addInfo.numKids;
        const ageKids = !addInfo ? null : addInfo.ageKids;
        const hasPets = !addInfo ? false : addInfo.hasPets;
        const namePets = !addInfo ? null : addInfo.namePets;
        const occupation = !addInfo ? null : addInfo.occupation;
        const scholarity = !addInfo ? null : addInfo.scholarity;
        const teamSupport = !addInfo ? null : addInfo.teamSupport;
        const musicStyle = !addInfo ? null : addInfo.musicStyle;
        const hobbie = !addInfo ? null : addInfo.hobbie;
        const channel = !addInfo ? null : addInfo.channel;
        const interest = !addInfo ? null : addInfo.interest;
        const hasCar = !addInfo ? null : addInfo.hasCar;
        const contributeSurvey = !addInfo ? true : addInfo.contributeSurvey;
        const grownUpChildren = !addInfo ? null : addInfo.grownUpChildren;
        const smallChildren = !addInfo ? null : addInfo.smallChildren;

        this.state = {
            userInfo: {},
            uid: uid,
            additionalInfo: {},
            maritalStatus,
            hasKids: false,
            numKids,
            ageKids,
            hasPets: false,
            namePets,
            occupation,
            scholarity,
            teamSupport,
            musicStyle,
            hobbie,
            channel,
            interest,
            hasCar,
            contributeSurvey: true,
            grownUpChildren,
            smallChildren,

            newMaritalStatus: maritalStatus,
            newHasKids: hasKids,
            newNumKids: numKids,
            newAgeKids: ageKids,
            newHasPets: hasPets,
            newNamePets: namePets,
            newOccupation: occupation,
            newScholarity: scholarity,
            newTeamSupport: teamSupport,
            newMusicStyle: musicStyle,
            newHobbie: hobbie,
            newChannel: channel,
            newInterest: channel,
            newHasCar: hasCar,
            newContributeSurvey: contributeSurvey,
            newGrownUpChildren: grownUpChildren,
            newSmallChildren: smallChildren,

            //verificadores e validadores
            loading: true,
            errorMessage: '',
            step: 1
        }
    }

    componentDidMount = () => {
        let showAddicionalInfo = localStorage.getItem('showAddicionalInfo');
        let todayAccess = Date.now();

        if (showAddicionalInfo === undefined || diffDays(showAddicionalInfo, todayAccess) > 1) {
            let userInfo = getLastUserInfo();
            userInfo = userInfo.partnerList[findIndexInArray(userInfo.partnerList, 'partnerId', configJson.partnerIdClubMapfre)]
            this.setState({ userInfo, loading: false });
        }
    }

    handleChange = name => event => {
        if (name === "newHasPets") {
            this.setState({
                [name]: !this.state.newHasPets,
                editUser2: true,
            });
        } else if (name === "newHasKids") {
            this.setState({
                [name]: !this.state.newHasKids,
                editUser2: true,
            });
            if (!this.state.newHasKids === false) {
                this.setState({ newGrownUpChildren: false, newSmallChildren: false })
            }
        } else if (name === "newGrownUpChildren") {
            this.setState({
                [name]: !this.state.newGrownUpChildren,
                editUser2: true,
            });
        } else if (name === "newSmallChildren") {
            this.setState({
                [name]: !this.state.newSmallChildren,
                editUser2: true,
            });
        } else if (name === "newContributeSurvey") {
            this.setState({
                [name]: !this.state.newContributeSurvey,
                editUser2: true,
            });
        } else {
            this.setState({
                [name]: event.target.value,
                editUser2: true,
            });
        }
    }

    handleSubmitAditionalInfo = () => {
        this.setState({ loading: true })
        let data = {
            maritalStatus: this.state.newMaritalStatus ? this.state.newMaritalStatus : '',
            channel: this.state.newChannel ? this.state.newChannel : '',
            scholarity: this.state.newScholarity ? this.state.newScholarity : '',
            teamSupport: this.state.newTeamSupport ? this.state.newTeamSupport : '',
            hasPets: this.state.newHasPets ? this.state.newHasPets : false,
            namePets: this.state.newHasPets ? this.state.newNamePets : '',
            musicStyle: this.state.newMusicStyle ? this.state.newMusicStyle : '',
            occupation: this.state.newOccupation ? this.state.newOccupation : '',
            hobbie: this.state.newHobbie ? this.state.newHobbie : '',
            interest: this.state.newInterest ? this.state.newInterest : '',
            hasKids: this.state.newHasKids ? this.state.newHasKids : false,
            ageKids: this.state.newHasKids ? this.state.newAgeKids.toString() : '',
            hasCar: this.state.newHasCar ? this.state.newHasCar : '',
            contributeSurvey: this.state.newContributeSurvey ? this.state.newContributeSurvey : true,
            grownUpChildren: this.state.newGrownUpChildren ? this.state.newGrownUpChildren : false,
            smallChildren: this.state.newSmallChildren ? this.state.newSmallChildren : false,
        }
        getAccessToken(this.state.uid, 2).then(token => {
            setAdditionalInfo(token, 'Mapfre', data).then(response => {
                if (!response.data.success) {
                    this.setState({ loading: false, errorMessage: response.error })
                } else {
                    localStorage.setItem('additionalInfoOk', true);
                    this.setState({ loading: false, editUser2: false, step: 2 })
                }
            })
        })

    }

    render = () => {
        if (this.state.step === 1)
            return (
                this.state.loading
                    ? <CircularProgress />
                    :
                    <div className="addInfo-home">
                        <Typography variant='body2' style={{ textAlign: 'center', marginBottom: 10 }}>Olá {this.state.userInfo.name}, tudo bem? Queremos conhecer mais você para oferecer campanhas, promoções e descontos que te agradem!</Typography>
                        <Paper>
                            {this.state.loaded2 === false
                                ? <div align='center'>
                                    <CircularProgress style={{ padding: '150px 20px', boxSizing: 'content-box' }} />
                                </div>
                                : <ValidatorForm onSubmit={this.handleSubmitAditionalInfo}>

                                    <Grid container className='meusDados__container2-home' spacing={0}>
                                        <Grid item sm={5} xs={12}>

                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newHasCar === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="hasCar-label">Possui Veículo?</InputLabel>
                                                <Select
                                                    labelId="hasCar-label"
                                                    value={this.state.editUser2 ? this.state.newHasCar : this.state.hasCar}
                                                    onChange={this.handleChange("newHasCar")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >

                                                    {
                                                        formExtra.hasCar.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newMaritalStatus === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                            </FormControl>

                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newMaritalStatus === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="maritalStatus-label">Status de relacionamento</InputLabel>
                                                <Select
                                                    labelId="maritalStatus-label"
                                                    value={this.state.editUser2 ? this.state.newMaritalStatus : this.state.maritalStatus}
                                                    onChange={this.handleChange("newMaritalStatus")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >

                                                    {
                                                        formExtra.maritalStatus.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newMaritalStatus === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                            </FormControl>

                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newChannel === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="channel-label">Canal de comunicação preferencial</InputLabel>
                                                <Select
                                                    labelId="channel-label"
                                                    value={this.state.editUser2 ? this.state.newChannel : this.state.channel}
                                                    onChange={this.handleChange("newChannel")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >

                                                    {
                                                        formExtra.channel.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>

                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newScholarity === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="scholarity-label">Nível de escolaridade</InputLabel>
                                                <Select
                                                    labelId="scholarity-label"
                                                    value={this.state.editUser2 ? this.state.newScholarity : this.state.scholarity}
                                                    onChange={this.handleChange("newScholarity")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >


                                                    {
                                                        formExtra.scholarity.map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newScholarity === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                            </FormControl>

                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newTeamSupport === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="teamSupport-label">Time que torce</InputLabel>
                                                <Select
                                                    labelId="teamSupport-label"
                                                    value={this.state.editUser2 ? this.state.newTeamSupport : this.state.teamSupport}
                                                    onChange={this.handleChange("newTeamSupport")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >

                                                    {
                                                        formExtra.teamSupport.sort((a, b) => {
                                                            if (a.name === 'Outro') {
                                                                return 999
                                                            }
                                                            else if (a.name > b.name) {
                                                                return 1
                                                            } else {
                                                                return -1
                                                            }
                                                        }).map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newTeamSupport === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                            </FormControl>


                                            <div>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={this.state.editUser2 ? this.state.newHasPets : this.state.hasPets}
                                                            onChange={this.handleChange('newHasPets')}
                                                            name="hasPets"
                                                        />
                                                    }
                                                    label="Possui Pets?"
                                                />
                                                <TextField
                                                    id="namePets"
                                                    label="nome(s) do(s) pet(s)"
                                                    type="text" style={{ paddingBottom: '20px' }}
                                                    disabled={!this.state.newHasPets}
                                                    fullWidth
                                                    value={this.state.editUser2 ? this.state.newNamePets : this.state.namePets}
                                                    onChange={this.handleChange('newNamePets')}
                                                />
                                            </div>

                                        </Grid>

                                        <Grid item sm={2} xs={false}>
                                            <div style={{ width: 2, height: '100%', margin: '0 auto', backgroundColor: '#CB0000', display: 'block' }}></div>
                                        </Grid>

                                        <Grid item sm={5} xs={12}>

                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newMusicStyle === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="musicStyle-label">Estilo musical</InputLabel>
                                                <Select
                                                    labelId="musicStyle-label"
                                                    value={this.state.editUser2 ? this.state.newMusicStyle : this.state.musicStyle}
                                                    onChange={this.handleChange("newMusicStyle")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >


                                                    {
                                                        formExtra.musicStyle.sort((a, b) => (a.name === 'Outro') ? 999 : (a.value > b.value) ? 1 : -1).map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newMusicStyle === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                            </FormControl>

                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newHobbie === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="hobbie-label">Principal hobbie</InputLabel>
                                                <Select
                                                    labelId="hobbie-label"
                                                    value={this.state.editUser2 ? this.state.newHobbie : this.state.hobbie}
                                                    onChange={this.handleChange("newHobbie")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >

                                                    {
                                                        formExtra.hobbie.sort((a, b) => (a.name === 'Outro') ? 999 : (a.value > b.value) ? 1 : -1).map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newHobbie === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                            </FormControl>

                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newOccupation === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="occupation-label">Profissão</InputLabel>
                                                <Select
                                                    labelId="occupation-label"
                                                    value={this.state.editUser2 ? this.state.newOccupation : this.state.occupation}
                                                    onChange={this.handleChange("newOccupation")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >

                                                    {
                                                        formExtra.occupation.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText>{this.state.errorLabelAditionalInfo && this.state.newOccupation === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                            </FormControl>

                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newInterest === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="interests-label">Quais temas você gostaria de receber?</InputLabel>
                                                <Select
                                                    labelId="interests-label"
                                                    value={this.state.editUser2 ? this.state.newInterest : this.state.interest}
                                                    onChange={this.handleChange("newInterest")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >


                                                    {
                                                        formExtra.interest.sort((a, b) => (a.value > b.value) ? 1 : -1).map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newMusicStyle === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                            </FormControl>

                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={this.state.editUser2 ? this.state.newHasKids : this.state.hasKids}
                                                        onChange={this.handleChange('newHasKids')}
                                                        name="hasKids"
                                                    />
                                                }
                                                label="Possui filho(s)?"
                                            />
                                            <div style={{ display: 'flex' }}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            disabled={!this.state.newHasKids}
                                                            checked={this.state.editUser2 ? this.state.newGrownUpChildren : this.state.grownUpChildren}
                                                            onChange={this.handleChange('newGrownUpChildren')}
                                                            name="grownUpChildren"
                                                        />
                                                    }
                                                    label="Adulto(s)?"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            disabled={!this.state.newHasKids}
                                                            checked={this.state.editUser2 ? this.state.newSmallChildren : this.state.smallChildren}
                                                            onChange={this.handleChange('newSmallChildren')}
                                                            name="smallChildren"
                                                        />
                                                    }
                                                    label="Criança(s)?"
                                                />
                                            </div>
                                            <FormControl error={this.state.errorLabelAditionalInfo && this.state.newInterest === null} style={{ paddingBottom: '20px' }} fullWidth >
                                                <InputLabel id="ageKids-label">Qual a faixa etária das crianças?</InputLabel>
                                                <Select
                                                    disabled={!this.state.newSmallChildren}
                                                    labelId="ageKids-label"
                                                    value={this.state.editUser2 ? this.state.newAgeKids : this.state.ageKids}
                                                    onChange={this.handleChange("newAgeKids")}
                                                    color='secondary' style={{ fontSize: 12 }}
                                                >

                                                    {
                                                        formExtra.ageKids.map(item => {
                                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText>{this.state.errorLabelAdditionalInfo && this.state.newAgeKids === null ? 'Informação obrigatória' : ''}</FormHelperText>
                                            </FormControl>

                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={this.state.editUser2 ? this.state.newContributeSurvey : this.state.contributeSurvey}
                                                        style={{
                                                            '&.Mui-checked': {
                                                                color: 'green'
                                                            }
                                                        }}
                                                        onChange={this.handleChange('newContributeSurvey')}
                                                        name="contributeSurvey"
                                                    />
                                                }
                                                label="Gostaria de contribuir respondendo pesquisas."
                                            />

                                        </Grid>

                                        <Typography variant="body1" style={{ display: this.state.errorMessage !== "" ? 'block' : 'none' }}>{this.state.errorMessage}</Typography>

                                        <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px' }}>
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    type="submit"
                                                    color="primary"
                                                    style={{ margin: '0px 5px' }}
                                                    disabled={!this.state.editUser2}
                                                    startIcon={<SaveOutlined />}
                                                >
                                                    Salvar
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    type="button"
                                                    color="secondary"
                                                    onClick={() => window.parent.closeModal()}
                                                    style={{ margin: '0px 5px' }}
                                                    startIcon={<EditOutlined />}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            }
                        </Paper>

                    </div>
            )
        else if (this.state.step === 2)
            return (
                <div style={{
                    display: 'flex',
                    height: 450,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }
                }>
                    <Typography variant="h6">
                        Dados atualizados com sucesso!
                    </Typography>

                    <Button variant="contained" type="button" color="primary" onClick={() => window.parent.closeModal()}> Fechar </Button>
                </div >
            )
    }
}

export default additionalInfo;
