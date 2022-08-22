import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';
// import { hashTriibo1, findIndexInArray, findValueInArray } from "js/library/utils/helpers.js";

export default function getProductsModels_v1(token, categoryId, brandId, productTypeId) {

    var config = {
        method: 'get',
        url: configJson.URL_NODE + '/SATsProducts/models/?categoryId=' + categoryId + '&brandId=' + brandId + '&productTypeId=' + productTypeId,
        headers: {
            'Authorization': 'Bearer ' + token}
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
