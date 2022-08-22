import axios from 'axios';
import { configJson } from 'js/library/utils/firebaseUtils';
import { getChannelToken_v1 } from "js/library/utils/API/getChannelToken_v1";

export function mailChangeCellphone(requestID, requestDate, uid, name, newCellPhone, mail) {

    let date = new Date().getTime();
    let baseJson = btoa(`{ "requestID": "${requestID}", "linkDate": ${requestDate}, "date": ${requestDate} }`)
    let messageBody =
        `Olá, ${name} Tudo bem? <br><br>
    Verificamos que você solicitou a atualização do número de celular cadastrado no Club MAPFRE para o número ${newCellPhone}. <br><br>
    Por questões de segurança, gostaríamos de confirmar a veracidade do pedido. <br><br>
    Para confirmar a atualização, clique no link abaixo: <br><br>
    <a href="https://club.mapfre.com.br/mudarcelularconfirmacao/?h=${baseJson}">https://club.mapfre.com.br/mudarcelularconfirmacao/?h=${baseJson}</a> <br><br>
    Caso você não tenha solicitado está alteração, por favor, ignore esta comunicação ou nos comunique pelo e-mail: relacionamento@mapfre.com.br <br><br>
    Equipe Club MAPFRE <br>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td>relacionamento@mapfre.com.br</td>
        </tr>
        <tr>
            <td>
                <img width="150" src="https://club.mapfre.com.br/wp-content/uploads/2019/02/mapfre_logo_vermelho.png" alt="Logo MAPFRE" style="width: 150px;margin: 15px 0;display:block;" />
            </td>
        </tr>
        <tr>
            <td>
                <img width="150" src="https://club.mapfre.com.br/wp-content/uploads/2019/02/club_mapfre_logo_vermelho.png" alt="Logo Club MAPFRE" style="width: 150px;margin: 15px 0;display:block;" />
            </td>
        </tr>
        <tr>
            <td><a href="https://mapfre.com.br">www.mapfre.com.br</a></td>
        </tr>
        <tr>
            <td><a href="https://club.mapfre.com.br">club.mapfre.com.br</a></td>
        </tr>
    </table>
    `

    return new Promise((resolve, reject) => {
        getChannelToken_v1(uid).then((result) => {

            var data = JSON.stringify({
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": uid,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId": "001",
                    "transactionId": "002"
                },
                "transporter": "clubmapfre",
                'from': 'hotsiteclubmapfre@equipetriibo.com.br',
                'to': mail,
                'subject': 'Club MAPFRE | Trocar celular',
                'html': messageBody
            });

            var config = {
                method: 'post',
                url: configJson.API_HOST_V1 + 'sendEmail',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error.response.data);
                });
        });
    });
}