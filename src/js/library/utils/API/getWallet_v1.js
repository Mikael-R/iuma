import axios from 'axios';
import {
    configJson
} from 'js/library/utils/firebaseUtils';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";

export function getWallet_v1(userId) {
    
    return new Promise((resolve, reject) => {

        getChannelToken_v1(userId).then((result) => {
            axios.post(configJson.API_HOST_V1 + "getWallet_v1", {
                "triiboHeader":{
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": userId,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId":"001",
                    "transactionId":"002"
                }
            }).then((result) => {
                //console.log('RESULTADO GET WALLET ===>', result);
                const wallet = { coupons: result.data.success.wallet, totalPoints: result.data.success.totalPoints };

                resolve(wallet);
            }).catch(error => {
                //console.log('ERROR GET WALLET ===>', error);
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
        
    });
}