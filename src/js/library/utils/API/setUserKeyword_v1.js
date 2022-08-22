import axios from 'axios';

import { configJson, firebaseDatabase } from 'js/library/utils/firebaseUtils';
import { hashTriibo1 } from "js/library/utils/helpers.js";
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";

export default function setUserKeyword(keyword, uId) {

    const passPhrase = firebaseDatabase.ref("triibo-auth-api-channel").push().key;
    const challenge = hashTriibo1(configJson.keyapiv1clubmapfre, passPhrase, configJson.channeltoken);


    getChannelToken_v1(uId).then((result) => {

        var data = JSON.stringify({
            "triiboHeader": {
                "apiToken": configJson.keyapiv1clubmapfre,
                "channelGroup": configJson.channelGroup,
                "channelName": configJson.channelName,
                "channelTokenId": result,
                "uId": uId,
                "passPhrase": passPhrase,
                "challenge": challenge,
                "channelId": configJson.channelId
            },
            "keyword": keyword
        });

        const config = {
            method: 'post',
            url: configJson.API_HOST_V1 + 'setUserKeyword_v1',
            headers: {
                'Content-type': 'application/json'
            },
            data: data
        };

        return new Promise((resolve, reject) => {
            axios(config)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error.response.data);
                });
        });
    });
}