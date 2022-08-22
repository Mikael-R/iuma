import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';

export default function setOminous(token, personCPF, licensePlate, departureDate) {

    var config = {
        method: 'post',
        url: configJson.URL_NODE + '/MapfreOficinas/setOminous',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        data: {
            "licensePlate": licensePlate,
            "depatureDate": departureDate,
            "personCPF": personCPF
        }
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response);
                console.log("RESULT setOminous =>", response);
            })
            .catch(function (error) {
                reject(error.response.data);
            });
    });
}