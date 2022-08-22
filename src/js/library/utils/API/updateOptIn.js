import axios from 'axios';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";
import { configJson } from 'js/library/utils/firebaseUtils';

import { getLastUserInfo, findIndexInArray } from 'js/library/utils/helpers';

export function updateOptIn() {

    const userInfo = getLastUserInfo();

    let newOptIn = Array.isArray(userInfo.optInList) ? [...userInfo.optInList] : null;

    if(newOptIn === null) {
        newOptIn = [{
            'accept': true,
            'dateAcceptance': new Date().getTime(),
            'optInId': "-TermoDeUsoClubMapfre-02",
            'type': "Termos de Uso - Club Mapfre",
            'version': 1
        }]
    }
    else if(findIndexInArray(newOptIn, 'optInId', '-TermoDeUsoClubMapfre-02') === null) {
        newOptIn.push({
            'accept': true,
            'dateAcceptance': new Date().getTime(),
            'optInId': "-TermoDeUsoClubMapfre-02",
            'type': "Termos de Uso - Club Mapfre",
            'version': 1
        })
    }
    else {
        newOptIn[findIndexInArray(newOptIn, 'optInId', '-TermoDeUsoClubMapfre-02')].accept = true;
    }

    const newUserInfo = {
        "uId": userInfo.uId,
        "updateDate": new Date().getTime(),
        "syncType": "merge",
        optInList: newOptIn
    };

    return new Promise(function (resolve, reject) {
        getChannelToken_v1(userInfo.uId).then((result) => {
                
            axios.post(configJson.API_HOST_V1 + 'setUserInfo_v1', {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": userInfo.uId,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId": "001",
                    "transactionId": "002"
                },
                "queryPartnerAPI": ["setUserInfo"],
                "userInfo": newUserInfo
            }).then((result) => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
    
        });
    });

}