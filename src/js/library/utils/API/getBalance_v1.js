import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";

export function getBalance_v1(uId, triiboId, cpf) {

    return new Promise((resolve, reject) => {

        getChannelToken_v1(uId).then((result) => {

            axios.post(configJson.API_HOST_V1 + "getBalance_v1", {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": uId,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId": "001",
                    "transactionId": "react"
                },
                "queryPartnerAPI": [
                    "getBalanceCofry", "getBalance"
                ],
                "triiboId": triiboId,
                "cpf": cpf
            }).then((result) => {
                //console.log('RESULTADO GET BALANCE ===>', result);

                let userBalance = result.data.error === null ? { balance: result.data.success.balance, partnerCofry: result.data.success.partnerCofry } : null;

                resolve(userBalance);
            }).catch(error => {
                //console.log('ERROR GET BALANCE ---->', error);
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });

    });
}