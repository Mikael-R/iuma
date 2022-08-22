import React from 'react';
import { Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import historyEntries from "styles/assets/CarRepair/historyEntries.png"
import newEntry from "styles/assets/CarRepair/newEntrie.png"
import historyEntriesVisited from "styles/assets/CarRepair/historyEntriesVisited.png"
import newEntryVisited from "styles/assets/CarRepair/newEntrieVisited.png"
import exit from "styles/assets/CarRepair/exit.png"
import { logoutUser } from 'js/library/services/AuthenticationManager.js';

export const Header = () => {

    var isHistorico;
    var isSaida;

    if (window.location.pathname === "/historico-saidas" || window.location.pathname === "/historico-saidas/") {
        isHistorico = true;
        isSaida = false;
    } else if (window.location.pathname === "/nova-saida" || window.location.pathname === "/nova-saida/") {
        isHistorico = false;
        isSaida = true;
    }

    return (
        <Grid container style={{ boxShadow: '0px 2px 7px 0px #00000050' }}>
            <Grid item xs={12} style={{ background: '#cc0000', display: 'flex', width: '100%', minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" style={{ color: 'white' }}>Oficinas recomendadas MAPFRE</Typography>
            </Grid>
            {
                localStorage.getItem('oficinaMapfre')
                    ? <Grid item xs={12} style={{ background: '#f6f6f6', width: '100%' }}>
                        <Grid container style={{ maxWidth: 700, margin: '0 auto' }}>
                            <Grid item xs={false} sm={3}></Grid>
                            <Grid item xs={4} sm={2}>
                                <Link to="/historico-saidas" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '50%' }}>
                                        <img src={isHistorico ? historyEntriesVisited : historyEntries} width="100%" alt="history-entries" />
                                    </div>
                                    <Typography variant="subtitle2" style={{ color: isHistorico ? '#CC0000' : '#000' }}>Histórico</Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={4} sm={2}>
                                <Link to="/nova-saida" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '50%' }}>
                                        <img src={isSaida ? newEntryVisited : newEntry} width="100%" alt="new-entry" />
                                    </div>
                                    <Typography variant="subtitle2" style={{ color: isSaida ? '#cc0000' : '#000' }}>Nova saída</Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={4} sm={2}>
                                <Link to="#" onClick={() => logoutUser()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '50%' }}>
                                        <img src={exit} width="100%" alt="logout" />
                                    </div>
                                    <Typography variant="subtitle2" style={{ color: '#000' }}>Sair</Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={false} sm={3}></Grid>
                        </Grid>
                    </Grid>
                    : null
            }
        </Grid>
    )
}