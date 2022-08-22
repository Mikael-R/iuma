import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';
// import { hashTriibo1, findIndexInArray, findValueInArray } from "js/library/utils/helpers.js";

export default function getSATsTicketsById(token, id) {

    var config = {
        method: 'get',
        url: configJson.URL_NODE + '/SATsTickets/' + id,
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