import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";

export function getStorePlacesItem_v2(storeId, establishmentId, uId, tag) {

    let sId = '500'
    
    if(tag === null || tag === undefined || tag === '') {
        sId = '001'
    }
    
    return new Promise(function (resolve, reject) {
        getChannelToken_v1(uId).then((result) => {
            
            axios.post(configJson.API_HOST_V1 + 'getStorePlacesItem_v2', {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": uId,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId": sId,
                    "transactionId": "002"
                },
                "storeId": storeId,
                "establishmentId": establishmentId
            }).then((result) => {
                //console.log("RESULTADO STORE PLACES ITEM ===> ", result);

                resolve(result.data.success);
            }).catch(error => {
                //console.log('ERROR STORE PLACES ITEM ===>', error);
                reject(error);
            });
            
        });
    })
}