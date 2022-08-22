import axios from 'axios';
import {
    configJson
} from 'js/library/utils/firebaseUtils';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";

export function getCardByID(uId, cardID) {

    return new Promise((resolve, reject) => {

        if (cardID === null) {
            resolve(null);
        }
        else {
            getChannelToken_v1(uId).then((result) => {
                //console.log('RESULTADO GET CHANNEL TOKEN ===>', result);
                axios.post(configJson.API_HOST_V1 + "getCardByID", {
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
                    "cardID": cardID
                }).then((result) => {
                    //console.log('RESULTADO GET CARD BY ID ===>', result);
                    resolve(result.data);
                }).catch(error => {
                    //console.log('ERROR GET CARD BY ID ---->', error);
                    reject(error);
                });

            }).catch(error => {
                //console.log('ERROR GET CHANNEL TOKEN ---->', error);
            });
        }

    });
}