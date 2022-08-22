import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';
// import { hashTriibo1, findIndexInArray, findValueInArray } from "js/library/utils/helpers.js";

export default function getCategoriesSys_v1(token) {

    var config = {
        method: 'get',
        url: configJson.URL_NODE + '/SATsProducts/categories',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response.data.categories);
            })
            .catch(function (error) {
                reject(error.response.data);
            });
    });
}