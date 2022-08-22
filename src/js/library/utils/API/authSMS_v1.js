import axios from 'axios';
import { configJson, firebaseDatabase } from 'js/library/utils/firebaseUtils';
import { hashTriibo1 } from "js/library/utils/helpers.js";
import { getChannelTokenUidNull } from './getChannelToken_v1';

export function authSMS_v1(cellPhone) {
    //OBTER INFORMAÇÕES DO USUÁRIO
    return new Promise((resolve, reject) => {
        getChannelTokenUidNull().then(result => {
            axios.post(configJson.API_HOST_V1 + "authSMS_v1", {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": "",
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId": "001",
                    "transactionId": "002"
                },
                "cellphone": '+' + cellPhone.replace(/\D/g, ""),
                "platform": "clubmapfre_site"
            }).then((result) => {
                console.log('RESULTADO AUTH SMS ===>', result);
                resolve(result.data);
            }).catch(error => {
                //console.log('ERROR GET WALLET ===>', error);
                reject(error);
            });
        })
        .catch(error => {
            reject(error);
        });
    });
};