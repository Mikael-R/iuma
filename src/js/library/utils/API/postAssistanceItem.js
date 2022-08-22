import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';
// import { hashTriibo1, findIndexInArray, findValueInArray } from "js/library/utils/helpers.js";

export default function postAssistanceItem(token, data) {

    var config = {
        method: 'post',
        url: configJson.URL_NODE + '/SATsTickets',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error.response.data);
            });
    });
}