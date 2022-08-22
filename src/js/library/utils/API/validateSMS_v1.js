import axios from 'axios';
import { configJson, firebaseDatabase } from 'js/library/utils/firebaseUtils';
import { hashTriibo1 } from "js/library/utils/helpers.js";
import { getChannelTokenUidNull } from './getChannelToken_v1';

export async function validateSMS_v1(code, cellPhone, transactionId) {

    return new Promise((resolve, reject) => {

        getChannelTokenUidNull().then(result => {
            axios.post(configJson.API_HOST_V1 + "validateSMS_v1", {
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
                "transactionId": transactionId,
                "cellphone": '+' + cellPhone.replace(/\D/g, ""),
                "code": code.replace(/\D/g, "")
            }).then((result) => {
                //console.log('RESULTADO VALIDATE SMS ===>', result);

                resolve(result.data);
            }).catch(error => {
                //console.log('ERROR VALIDATE SMS ===>', error);
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
        
    });
};