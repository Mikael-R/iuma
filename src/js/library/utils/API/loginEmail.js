import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';

export default function loginEmail(token, hash, campaignId, campaignToken ) {

    var config = {
        method: 'get',
        url: configJson.URL_NODE + `/juice/loginEmail?hash=${hash}&token=${campaignToken}&campaignId=${campaignId}`,
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
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
