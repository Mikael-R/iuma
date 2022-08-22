import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';
// import { hashTriibo1, findIndexInArray, findValueInArray } from "js/library/utils/helpers.js";

export default function getAccessToken(uid, type) {

    let auth = '';

    if(type === 1) {
        auth = window.btoa(configJson.USERNAME_AUTH + ':' + configJson.PASSWORD_AUTH)
    } else if (type === 2) {
        auth = window.btoa(configJson.USERNAME_CLUBMAPFRE + ':' + configJson.PASSWORD_CLUBMAPFRE)
    }

    const config = {
        method: 'post',
        url: configJson.URL_NODE + '/auth',
        headers: {
            'Authorization': 'Basic ' + auth,
            'uid': uid
        }
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response.data.token);
            })
            .catch(function (error) {
                reject(error.response.data);
            });
    });
}