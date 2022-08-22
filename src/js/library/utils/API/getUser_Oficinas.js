import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';

export default function getUser_Oficinas(token, cellPhone) {

    var config = {
        method: 'post',
        url: configJson.URL_NODE + '/MapfreOficinas/getUser?cellphone=' + cellPhone,
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