import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';

export default function setAdditionalInfo(token, partnerName, infos) {

    var config = {
        method: 'post',
        url: configJson.URL_NODE + '/users/setAdditionalInfos',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        data: {
            partnerName: partnerName,
            data: infos
        }
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response);
                console.log("RESULT setAdditionalInfo =>", response);
            })
            .catch(function (error) {
                reject(error.response.data);
            });
    });
}