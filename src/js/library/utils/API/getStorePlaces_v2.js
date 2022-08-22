import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";

export function getStorePlaces_v2(uId, objectType, lat, long, userQuery, establishmentId, query, from, size, geoRadius, tags) {
    geoRadius = geoRadius === undefined ? 5000 : geoRadius;

    let sId = '500'
    
    if(tags === null || tags === undefined || tags === '') {
        tags = [];
        sId = '001'
    }

    //OBTER INFORMAÇÕES DO USUÁRIO
    return new Promise((resolve, reject) => {

        getChannelToken_v1(uId).then((result) => {
            axios.post(configJson.API_HOST_V1 + "getStorePlaces_v2", {
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
                "objectType": objectType,
                "order": true,
                "geoFocus": {
                    "lat": lat,
                    "long": long
                },
                "flagGoogle": false,
                "geoRadius": geoRadius,
                "platform": "web",
                "from": from,
                "size": size,
                "userQuery": userQuery,
                "establishmentId": establishmentId,
                "systemQuery": query,
                "tags": tags
            }).then((result) => {
                //console.log('RESULTADO STORE PLACES ===>', result);
                
                resolve(result.data.success);
            }).catch(error => {
                //console.log('ERROR STORE PLACES ===>', error);

                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}