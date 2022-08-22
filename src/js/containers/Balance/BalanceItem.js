import React from 'react';
import { Link } from "react-router-dom";

import { Typography, Grid, Paper } from "@material-ui/core";
import placeholderItem from 'styles/assets/placeholder/Itens_Placeholder.gif';
import { downloadImage } from 'js/library/services/StorageManager.js';
import { formatDate, trackEventMatomoElementId } from 'js/library/utils/helpers';
import QRCode from 'qrcode.react';

export const BalanceItem = voucher => {
    const [thumbnail, setThumbnail] = React.useState(placeholderItem);
    const [details, showDetails] = React.useState(false);

    voucher = voucher.voucher;

    function downloadImageOnLoad() {

        if (voucher.thumbnail !== undefined) {
            downloadImage('voucher', voucher.thumbnail).then((downloaded) => {
                setThumbnail(downloaded);
            }).catch((error) => {
                return error;
            });
        }
    };

    const descricao = voucher.description === undefined ? '' : voucher.description.length < 115 ? voucher.description : voucher.description.substring(0, 70) + '...';

    return (
        <Grid item md={4} sm={6} xs={12} onMouseEnter={() => showDetails(true)} onMouseLeave={() => showDetails(false)} >
            <Paper style={{ height: '100%', minHeight: 200 }}>
                {details
                    ? <Link onClick={() => trackEventMatomoElementId('Carteira', 'click', 'cupom', voucher?.key)} to={{ pathname: '/minhaconta/detalhes', state: voucher }} style={{ textDecoration: 'none' }}>
                        {voucher.type === 'promo'
                            ? <Grid container spacing={3} style={{ width: '100%', margin: 0 }}>
                                <Grid item xs={12} style={{ margin: '10px' }}>
                                    <Typography variant="subtitle2" color="secondary" style={{ fontWeight: 'bolder' }}>{voucher.score > 1 ? voucher.plural !== undefined ? 'Meus ' + voucher.plural : 'Meus Números' : voucher.singular !== undefined ? 'Meu ' + voucher.singular : 'Meu Número'}</Typography>

                                    <Grid container>
                                        {Object.keys(voucher.vouchers).map((item) => {
                                            const number = voucher.vouchers[item];

                                            return (
                                                <Grid item sm={6} key={number.itemId !== undefined ? number.itemId : number.templateId}>
                                                    <span style={{ fontSize: '12px', color: '#747474', display: 'block' }}>{formatDate(number.sentDate)} - {item}</span>
                                                </Grid>
                                            )
                                        })
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                            : <Grid container spacing={3} style={{ width: '100%', margin: 0 }}>
                                <Grid item xs={12}>
                                    <div align="center">
                                        {
                                            voucher.consumptionType === 'externalConsumption'
                                                ? <>
                                                <Typography variant="body1" color="secondary">{voucher.key}</Typography>
                                                <span style={{ fontSize: '10px' }}>Para utilizar seu desconto, clique aqui e saiba mais</span>
                                                </>
                                                : <>
                                                    <QRCode
                                                        id="QRCode"
                                                        value={voucher.key}
                                                        size={100}
                                                        bgColor={"#ffffff"}
                                                        fgColor={"#000000"}
                                                        level={"M"}
                                                    />

                                                    <Typography variant="body1" color="secondary">{voucher.key}</Typography>

                                                    <span style={{ fontSize: '10px' }}>Para consumir seu cupom, informe o código acima ou use o QR Code</span>
                                                </>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        }
                    </Link>
                    : <Grid container spacing={3} style={{ width: '100%', margin: 0 }}>
                        <Grid item sm={6} xs={12}>
                            <img style={{ maxWidth: '100%', maxHeight: 176, margin: '0 auto', display: 'block' }} className="img-radius" src={thumbnail} alt="carteira" onLoad={() => downloadImageOnLoad()} />
                        </Grid>

                        <Grid item sm={6} xs={12}>

                            <Typography style={{ fontWeight: 'bold' }} variant="subtitle1" color="secondary">
                                {voucher.title}
                            </Typography>

                            <Typography variant="body1" color="secondary">{voucher.establishmentName}</Typography>

                            <Typography variant="caption" color="secondary">{descricao}</Typography>

                        </Grid>
                    </Grid>
                }
            </Paper>
        </Grid>
    )
};
export default BalanceItem;