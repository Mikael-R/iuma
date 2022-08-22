import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';

export default async function confirmPhoneChange(base64_JSON) {
    return new Promise(function (resolve, reject) {
        axios.post(configJson.API_HOST_V1 + 'confirmPhoneChange', {
            "triiboHeader": {
                "apiToken": configJson.keyapiv1clubmapfre,
                "channelGroup": configJson.channelGroup,
                "channelName": configJson.channelName,
                "channelId": configJson.channelId,
                "sessionId": "001",
                "transactionId": "002"
            },
            "base64JSON": base64_JSON
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
    })
}