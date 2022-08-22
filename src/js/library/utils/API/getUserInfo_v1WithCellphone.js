import axios from 'axios';
import { configJson, firebaseDatabase } from 'js/library/utils/firebaseUtils';
import { hashTriibo1 } from "js/library/utils/helpers.js";
import { getChannelTokenUidNull } from './getChannelToken_v1';

export default function getUserInfo_v1WithCellphone(userInfo) {

    return new Promise((resolve, reject) => {

        getChannelTokenUidNull().then(result => {
            //console.log('RESULTADO GET CHANNEL TOKEN C/ UID NULL ===>', result);
            let queryPartnerAPI = ["getUserInfo"]

            axios.post(configJson.API_HOST_V1 + "getUserInfo_v1", {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": null,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId": "001",
                    "transactionId": "002"
                },
                queryPartnerAPI,
                userInfo
            }).then((result) => {
                console.log('RESULTADO DA API GET INFO WITH CELLPHONE ===>', result.data);

                resolve(result.data.success.userInfo);
            }).catch(error => {
                //console.log('ERROR GET USER INFO WITH CELLPHONE===>', error);

                reject(error);
            });

        }).catch(error => {
            //console.log('ERROR GET CHANNEL TOKEN ===>', error);
        });
    });
}