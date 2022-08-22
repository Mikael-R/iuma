import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';

export default function getOminous(token) {

    var config = {
        method: 'get',
        url: configJson.URL_NODE + '/MapfreOficinas/getOminous',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response);
                console.log("RESULT getOminous =>", response);
            })
            .catch(function (error) {
                reject(error.response.data);
            });
    });
}