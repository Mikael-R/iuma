import axios from 'axios';
import { pushDatabase } from 'js/library/services/DatabaseManager';

export default async function sendHelpEmail(uId, cpf, name, cellPhone, newCellPhone, email) {
    return new Promise((resolve, reject) => {
        pushDatabase('mapfre-help-email', {
            uId,
            cpf,
            name,
            cellPhone,
            newCellPhone,
            email,
            createdAt: Date.now()
        }).then(result => {
            axios.post(document.location.origin + '/wp-content/themes/applay/php/sendHelpEmail.php', {
                uId,
                cpf,
                name,
                cellPhone,
                newCellPhone,
                email
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                reject(error.data);
            });
        }).catch(error => {
            reject(error)
        })
    });
}