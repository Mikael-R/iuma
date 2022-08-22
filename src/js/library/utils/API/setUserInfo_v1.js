import axios from 'axios';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";
import { configJson } from 'js/library/utils/firebaseUtils';

export function setUserInfo_v1(uId, queryPartnerAPI, userInfo, path) {
    
    return new Promise(function (resolve, reject) {

        if (uId.error !== undefined) {
            reject(uId.error);
        }
        else {
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
                    console.log('RESULTADO SET USER ===>', result);

                    window.pathname = path;
                    resolve(result.data.success.newUserInfo);
                }).catch(error => {
                    console.log('ERRO SET USER', error);
                    
                    reject(error);
                });

            });
        }
    })
}