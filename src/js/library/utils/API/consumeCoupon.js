import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';

export default function consumeCoupon(token) {

    var data = JSON.stringify({
        "batchId": "-MckPkpwOUeFw7jco1r8",
        "consumed": false,
    });

    var config = {
        method: 'post',
        url: configJson.URL_NODE + '/vouchers/batch/consume',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
                console.log(error)
                console.log(error.response.success)
            });
    });
}