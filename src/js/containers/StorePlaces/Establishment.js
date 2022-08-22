import React from "react";
import { downloadImage } from 'js/library/services/StorageManager.js';
import placeholder from "styles/assets/placeholder/Itens_Placeholder.gif";
import { trackEventMatomoElementId } from 'js/library/utils/helpers';
import history from 'js/library/utils/history';

export const Establishment = data => {
    const [downloadedImage, setDownloadedImage] = React.useState(null);

    const id = data.data.id;
    
    const distance = data.data[data.data.type].endereco === 'Brasil' ? '' : data.data.distance < 1 ? data.data.distance.toFixed(2) * 1000 + 'm' : data.data.distance.toFixed(2) + 'km';
	data = data.data[data.data.type];
	data.id = id;

    function downloadImageOnLoad() {
		if (data.fotoThumb !== undefined && downloadedImage === null) {
		  	downloadImage('estabelecimento', data.fotoThumb).then((downloaded) => {
                setDownloadedImage(downloaded);
		  	}).catch((error) => {
				return error;
			});
		}
    };

    const descricao = data.descricao === undefined ? '' :  data.descricao.length < 115 ? data.descricao : data.descricao.substring(0, 120) + '...';

    const nomeId = data.nome.trim().replace(/ /g, '-').replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');

    return (
        <li key={data.id}>
            <a id={nomeId} title={data.nome} href={"/estabelecimento?id=" + data.id } onClick={() =>  {history.push({ pathname: "/estabelecimento?id=" + data.id, state: data }); trackEventMatomoElementId('Ofertas', 'click', 'card-estabelecimento', data.id) } } style={{ display:'inherit', textDecoration: 'none' }}>
                <img alt="thumbnail" onLoad = { () => downloadImageOnLoad() } src={ downloadedImage === null ? placeholder : downloadedImage }/>
                <span>{data.nome}</span>
                <span>{distance}</span>

                <div style={{ marginTop: 10, float: 'left', width: '100%' }}>
                    {descricao}
                </div>
            </a>
        </li>
    );
}

export default Establishment;