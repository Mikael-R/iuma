import React from 'react';
import { downloadImage } from 'js/library/services/StorageManager.js';
import placeholder from "styles/assets/placeholder/Itens_Placeholder.gif";
import history from 'js/library/utils/history';
import { trackEventMatomoElementId } from 'js/library/utils/helpers';
import { getStorePlacesItem_v2 } from "js/library/utils/API/getStorePlacesItem_v2.js";
import { Tooltip } from '@material-ui/core';
import { Link } from '@material-ui/icons';
import { configJson } from 'js/library/utils/firebaseUtils';

export const Store = data => {
    const [downloadedImage, setDownloadedImage] = React.useState(null);
    const [downloadedUrl, setDownloadedUrl] = React.useState(null);
    const [url, setUrl] = React.useState(null);
    const cofryId = localStorage.getItem('cofryId');

    const id = data.data.id;
    const uId = data.uId;

    data = data.data[data.data.type];
    data.id = id;

    function downloadImageOnLoad() {
        if (data.thumbnail !== undefined && downloadedImage === null) {
            const folder = data.type === 'product' ? 'triibomania-premios' : 'promocao';

            downloadImage(folder, data.thumbnail.replace('triibomania-premios/', '')).then((downloaded) => {
                setDownloadedImage(downloaded);
            }).catch((error) => {
                return error;
            });
        }
    };

    function getItem() {
        
        if ((url === null && downloadedUrl === null) || data.establishmentId === configJson.cofryEstablishmentoId) {
            setDownloadedUrl(true);

            if(data.url.indexOf('{') > 0 || data.url.indexOf('}') > 0) {
                getStorePlacesItem_v2(data.id, null, uId).then((item) => {
                    setUrl(item.storeItem.url);
                    setDownloadedUrl(null);
                    window.location.assign(item.storeItem.url);
                })
            }
            else {
                setUrl(data.url);
                setDownloadedUrl(null);
                window.open(data.url);
            }
        }
        else if(downloadedUrl === null) {
            setUrl(url.replace('{cpf}', cofryId));
            window.open(url);
        }
    }

    const titleId = data.title.trim().replace(/ /g, '-').replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');

    return (
        <li key={data.id} id="businessDiv">
            <a id={titleId} title={data.title} href={"/oferta?id=" + data.id} onClick={() => {history.push({ pathname: "/oferta?id=" + data.id, state: data }); trackEventMatomoElementId('Ofertas', 'click', 'card-promocao', data.id) }} style={{ display: 'inherit', textDecoration: 'none' }}><img alt="thumbnail" onLoad={() => downloadImageOnLoad()} src={downloadedImage === null ? placeholder : downloadedImage} /></a>

            <span style={ data.type === 'businessPartner' ? { width: '90%' } : { width: '100%' } }><a href={"/oferta?id=" + data.id} onClick={() => history.push({ pathname: "/oferta?id=" + data.id, state: data })} style={{ display: 'inherit', textDecoration: 'none' }}>{data.title}</a></span>
            <Tooltip title="Acesso rápido"><span id={titleId} title={data.title} onClick={() => data.type === 'businessPartner' ? getItem() : null } style={ data.type === 'businessPartner' ? { width: '10%', cursor: 'pointer' } : { width: '0%', cursor: 'pointer' } }>{data.type === 'businessPartner' ? <Link /> : ''}</span></Tooltip>
        </li>
    );
};

export default Store;