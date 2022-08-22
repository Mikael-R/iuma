import axios from 'axios';

import { configJson, firebaseDatabase } from 'js/library/utils/firebaseUtils';
import { hashTriibo1 } from "js/library/utils/helpers.js";

export function voucherSend(uId, triiboId, templateId, consumed, batchId) {

    const passPhrase = firebaseDatabase.ref("triibo-auth-api-channel").push().key;
    const challenge = hashTriibo1(configJson.keyapiv1clubmapfre, passPhrase, configJson.channeltoken);

    var config = {
        method: 'POST',
        url: configJson.API_HOST_V1 + 'voucherSend_v1',
        headers: {
            'Content-Type': 'application/json',
            'access_token': configJson.ACCESS_TOKEN,
        },
        data: {
            "triiboHeader": {
                "apiToken": configJson.keyapiv1clubmapfre,
                "channelGroup": configJson.channelGroup,
                "channelName": configJson.channelName,
                "uId": uId,
                "passPhrase": passPhrase,
                "challenge": challenge,
                "channelId": configJson.channelId
            },
            "clientID": triiboId,
            "templateID": templateId,
            "consumed": consumed,
            "batchID": batchId
        }
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                console.log('dentro da voucherSend ==>', response)
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error.response.data);
            });
    });
}