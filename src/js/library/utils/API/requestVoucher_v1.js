import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';
// import { hashTriibo1, findIndexInArray, findValueInArray } from "js/library/utils/helpers.js";

export default function requestVoucher(token, seedId) {

    const config = {
        method: 'put',
        url: configJson.URL_NODE + '/twoYearsClubMapfre/requestVoucher?seedId=' + seedId,
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token
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