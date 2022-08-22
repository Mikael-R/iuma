import axios from 'axios';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";
import { configJson } from 'js/library/utils/firebaseUtils';

export function apiv1_setUserInfo(uId, queryPartnerAPI, userInfo, isTriibo, cellPhone, path) {

    return new Promise(function (resolve, reject) {

        getChannelToken_v1(uId).then((result) => {
            
            axios.post(configJson.API_HOST_V1 + 'setUserInfo_v1', {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": uId,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId": "001",
                    "transactionId": "002"
                },
                queryPartnerAPI,
                userInfo
            }).then((result) => {
                //console.log("RESULTADO SET INFO ===>", result)

                window.pathname = path;
                resolve(result.data.success.insertedData);
            }).catch(error => {
                //console.log('ERROR SET INFO ===>', error);
                reject(error);
            });

        }).catch(error => {
            reject(error);
        });
    })
}