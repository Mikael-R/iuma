import axios from 'axios';

export default async function sendChangeEmail(name, cellPhone, newCellPhone, email) {
    return new Promise((resolve, reject) => {
        axios.post(document.location.origin + '/wp-content/themes/applay/php/sendChangeEmail.php', {
            name,
            cellPhone,
            newCellPhone,
            email
        }).then((result) => {
            console.log('certo result: ', result);
            resolve(result.data);
        }).catch((error) => {
            console.log('erro result: ', error);
            reject(error.data);
        });
    });
}