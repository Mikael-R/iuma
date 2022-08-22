import axios from 'axios';
import { pushDatabase } from 'js/library/services/DatabaseManager';

export default async function sendEmailAccessDifficulty(uId, name, cpf, cellPhone, email, option, description) {
    return new Promise((resolve, reject) => {
        pushDatabase('mapfre-access-difficulty', {
            uId,
            name,
            cpf,
            cellPhone,
            email,
            option,
            description,
            createdAt: Date.now()
        }).then(result => {
            axios.post(document.location.origin + '/wp-content/themes/applay/php/sendAccessDifficulty.php', {
                uId,
                name,
                cpf,
                cellPhone,
                email,
                option,
                description
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