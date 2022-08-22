import axios from 'axios';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";
import { configJson } from 'js/library/utils/firebaseUtils';

export default async function requestPhoneChange(uId, source, priorPhone, newPhone) {
    return new Promise(function (resolve, reject) {
        if (uId.error !== undefined) {
            reject(uId.error);
        }
        else {
            getChannelToken_v1(uId).then((result) => {
                axios.post(configJson.API_HOST_V1 + 'requestPhoneChange', {
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
                    uId,
                    source,
                    priorPhone,
                    newPhone
                }, {
                    headers: {
                        access_token: configJson.ACCESS_TOKEN,
                        ContentType: 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
                    }
                }).then((result) => {
                    resolve(result.data);
                }).catch(error => {
                    reject(error);
                });
            });
        }
    })
}