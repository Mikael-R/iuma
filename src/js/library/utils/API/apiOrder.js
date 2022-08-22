import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';

export function apiOrder(itemId, receiver, requestLat, requestLon, sender) {
    return new Promise(function (resolve, reject) {

        axios.post(configJson.API_HOST + 'api_order', {
            "extras": {
                "paid": 0
            },
            itemId,
            receiver,
            "requestDate": Date.now(),
            requestLat,
            requestLon,
            sender,
            status: 'requested',
            "type": "promotion"
        }, {
            headers: { access_token: configJson.ACCESS_TOKEN }
        }).then((result) => {
            //console.log('RESULTADO API ORDER ====>', result);
            resolve(result);
        }).catch(error => {
            //console.log('ERRO API ORDER ===>', error);
            reject(error);
        });
    })
}