import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';
// import { hashTriibo1, findIndexInArray, findValueInArray } from "js/library/utils/helpers.js";

export default function getLoginSys(token) {

    const config = {
        method: 'post',
        url: configJson.URL_NODE + '/SATsAuth',
        headers: {
            'Authorization': 'Bearer ' + token,
            'origin': 'http://localhost:3000/'
        }
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
}
