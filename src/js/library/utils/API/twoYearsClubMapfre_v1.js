import axios from 'axios';

import { configJson } from 'js/library/utils/firebaseUtils';

export default function getPromo2Years(token, userData) {

    if ( userData.length > 15 ) {
        userData = 'hash=' + userData
    } else {
        userData = 'cpf=' + userData
    }

    var config = {
        method: 'get',
        url: configJson.URL_NODE + '/twoYearsClubMapfre?' + userData,
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
