import axios from 'axios';
import { configJson, firebaseDatabase } from 'js/library/utils/firebaseUtils';
import { hashTriibo1 } from "js/library/utils/helpers.js";
import { getChannelTokenUidNull } from './getChannelToken_v1';

export function login(cellphone, linkedAccount) {
    
    return new Promise((resolve, reject) => {

        getChannelTokenUidNull().then(result => {
            axios.post(configJson.API_HOST_V1 + "login", {
                "triiboHeader":{
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": null,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId":"001",
                    "transactionId":"002"
                },
                cellphone
                // linkedAccount
            }).then((result) => {
                //console.log('RESULTADO LOGIN ===>', result);
                resolve(result);
            }).catch(error => {
                //console.log('ERROR LOGIN ===>', error);
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
        
    });
}