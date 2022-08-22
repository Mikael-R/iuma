import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';
// import { hashTriibo1, findIndexInArray, findValueInArray } from "js/library/utils/helpers.js";

export default function getAssistancesSys(token, idTicket) {

    var config = {
        method: 'get',
        url: configJson.URL_NODE + '/SATsTickets/' + idTicket + '/assistances',
        headers: {
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