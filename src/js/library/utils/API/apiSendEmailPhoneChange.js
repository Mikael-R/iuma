import axios from 'axios';

export default async function sendEmailPhoneChange(requestID, name, cpf,cellPhone, email, newCellPhone) {
    return new Promise((resolve, reject) => {
        axios.post(document.location.origin + '/wp-content/themes/applay/php/sendPhoneChange.php', {
            requestID,
            name,
            cpf,
            cellPhone,
            email,
            newCellPhone
        }).then((result) => {
            resolve(result.data);
        }).catch((error) => {
            reject(error.data);
        });
    });
}