import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import { Header } from 'js/containers/Header/Header.js'
import { Grid, TextField, TablePagination, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from "@material-ui/core";
import getAccessToken from "../../library/utils/API/getAccessToken_v1";
import getUser_Oficinas from "js/library/utils/API/getUser_Oficinas.js";
import getOminous from "../../library/utils/API/getOminous";
import { cpfMask, findValueInArray } from "js/library/utils/helpers.js";

const styles = theme => ({
    root: {
    },
    inputSearch: {
        '& .MuiOutlinedInput-root': {
            boxShadow: '0px 0px 6px 3px #00000020',
            borderRadius: 20,
            '& fieldset': {
                border: 'none !important',
            },
        },
    }
});

class HistoryEntries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 6,
            entriesList: [],
            entriesListFiltered: [],
            searchField: '',
            userInfo: {},

            //validadores
            loading: true,

        }
        if (localStorage.getItem('oficinaMapfre')) {
            let userInfo = JSON.parse(localStorage.getItem('userInfoOficina'))

            getAccessToken(null, 2).then(token => {
                getUser_Oficinas(token, findValueInArray(userInfo.contactList, 'type', 'cellPhone').value.replace(/\D/g, "")).then(data => {
                    if (!data.status) {
                        window.location = document.location.origin + '/oficinas';
                    } else {
                        getAccessToken(userInfo.uId, 2).then(token => {
                            getOminous(token).then(result => {
                                this.setState({ userInfo: data.userInfo, entriesList: result.data.userOminous, loading: false });
                            })
                        })
                    }
                });
            });
        } else {
            window.location = document.location.origin + '/oficinas';
        }
    }

    filterRows = value => {
        if (this.state.searchField.length > 0) {
            if (value.personCPF?.toUpperCase().indexOf(this.state.searchField) > -1) {
                return value;
            } else if (value.licensePlate?.toUpperCase().indexOf(this.state.searchField.toUpperCase()) > -1) {
                return value;
            } else {
                return null;
            }
        } else {
            return value;
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: +event.target.value, page: 0 });
    };

    render = () => {
        const { classes } = this.props;
        var entriesFiltered;
        if (this.state.entriesList?.length) {
            entriesFiltered = this.state.entriesList.filter(this.filterRows);
        }
        return (
            <>
                <Header />
                <div style={{ minHeight: '60vh', display: 'flex' }}>
                    <Grid container style={{ maxWidth: 1300, margin: '0 auto', alignItems: 'center' }}>

                        <Grid item xs={12} style={{ margin: '30px 0px' }}>
                            <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                placeholder="Pesquisa"
                                value={this.state.searchField}
                                onChange={this.handleChange('searchField')}
                                className={classes.inputSearch}
                                InputProps={{
                                    className: 'input-search-filter'
                                }}
                            />
                        </Grid>
                        {
                            this.state.loading
                                ?
                                <Grid item xs={12} style={{ textAlign: 'center' }}>
                                    <CircularProgress />
                                </Grid>
                                :
                                !entriesFiltered?.length ?

                                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                                        Sem registros de saídas de veículos
                                    </Grid>
                                    : <>
                                        <Grid item xs={12}>
                                            <TableContainer>
                                                <Table style={{ minWidth: 650 }} size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center" style={{ borderRight: '2px solid lightgrey' }}>CPF do segurado</TableCell>
                                                            <TableCell align="center" style={{ borderRight: '2px solid lightgrey' }}>Placa do veículo</TableCell>
                                                            <TableCell align="center">Data da retirada do veículo</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            entriesFiltered.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                                                                .map((entry, i) => {
                                                                    let depdate = new Date(entry.depatureDate);
                                                                    return <TableRow
                                                                        key={i}
                                                                        style={{ '&:lastChild td, &:lastChild th': { border: 0 } }}
                                                                    >
                                                                        <TableCell align="center" style={{ padding: '15px 0px' }}>{cpfMask(entry.personCPF)}</TableCell>
                                                                        <TableCell align="center" style={{ padding: '15px 0px' }}>{entry.licensePlate?.toUpperCase()}</TableCell>
                                                                        <TableCell align="center" style={{ padding: '15px 0px' }}>{depdate.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                                                                    </TableRow>
                                                                })
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TablePagination
                                                rowsPerPageOptions={[6, 12, 18, 24]}
                                                component="div"
                                                count={this.state.entriesList.length}
                                                rowsPerPage={this.state.rowsPerPage}
                                                page={this.state.page}
                                                onPageChange={this.handleChangePage}
                                                onRowsPerPageChange={this.handleChangeRowsPerPage}
                                            />
                                        </Grid>
                                    </>
                        }
                    </Grid>
                </div >
            </>
        )
    }
}

HistoryEntries.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HistoryEntries);