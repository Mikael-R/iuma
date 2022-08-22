import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';
import { firebaseDatabase } from 'js/library/utils/firebaseUtils';
import { hashTriibo1, validateRegistrationDate } from "js/library/utils/helpers.js";

export function getChannelToken_v1(uId) {

    return new Promise((resolve, reject) => {
        
        //capturando dados do Storage
        const channelObj = JSON.parse(localStorage.getItem('channelToken'));

        const valideDate = validateRegistrationDate(channelObj === null ? null : channelObj.registrationDate);
        const channelUId = channelObj === null ? null : channelObj.uId;

        //token não existe no storage
        if (channelObj === null || channelObj.id === null || channelObj.id === '' || channelObj.id === undefined || !valideDate || channelUId === undefined || channelUId === null || channelUId !== uId) {
            
            const passPhrase = firebaseDatabase.ref("triibo-auth-api-channel").push().key;
            const challenge = hashTriibo1(configJson.keyapiv1clubmapfre, passPhrase, configJson.channeltoken);

            axios.post(configJson.API_HOST_V1 + "getChannelToken_v1", {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": uId,
                    "passPhrase": passPhrase,
                    "challenge": challenge,
                    "channelId": configJson.channelId
                }
            }).then((result) => {
                //console.log('RESULTADO GET CHANNEL TOKEN', result);
                localStorage.setItem('channelToken', '{ "id":"' + challenge + '", "registrationDate":' + Date.now() + ', "uId":"' + uId + '" }');

                resolve(challenge);
            }).catch(error => {
                //console.log('ERRO GET CHANNEL TOKEN', error);

                reject(error)
            });
        }
        //token existe no storage
        else
        {
            resolve(channelObj.id);
        }
    });
}

export function getChannelTokenUidNull() {

    return new Promise((resolve, reject) => {
        
        //capturando dados do Storage
        const channelObj = JSON.parse(localStorage.getItem('channelTokenUidNull'));

        const valideDate = validateRegistrationDate(channelObj === null ? null : channelObj.registrationDate);
        
        //token não existe no storage
        if (channelObj === null || channelObj.id === null || channelObj.id === '' || channelObj.id === undefined || !valideDate) {
            
            const passPhrase = firebaseDatabase.ref("triibo-auth-api-channel").push().key;
            const challenge = hashTriibo1(configJson.keyapiv1clubmapfre, passPhrase, configJson.channeltoken);

            axios.post(configJson.API_HOST_V1 + "getChannelToken_v1", {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": null,
                    "passPhrase": passPhrase,
                    "challenge": challenge,
                    "channelId": configJson.channelId
                }
            }).then((result) => {
                //console.log('RESULTADO GET CHANNEL TOKEN', result);
                localStorage.setItem('channelTokenUidNull', '{ "id":"' + challenge + '", "registrationDate":' + Date.now() + '}');

                resolve(challenge);
            }).catch(error => {
                //console.log('ERRO GET CHANNEL TOKEN', error);
                reject(error)
            });
        }
        //token existe no storage
        else
        {
            resolve(channelObj.id);
        }
    });
}