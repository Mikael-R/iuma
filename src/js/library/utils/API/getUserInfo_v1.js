import axios from 'axios';

import { firebaseDatabase, configJson } from 'js/library/utils/firebaseUtils';
import { hashTriibo1, findIndexInArray, findValueInArray } from "js/library/utils/helpers.js";
import { getChannelTokenUidNull } from './getChannelToken_v1';

export default async function getUserInfo_v1(queryPartnerAPI, userInfo) {

    let isWhiteList = true;
    // let user = await (axios.get(configJson.whiteListUrl));

    // if (user.data[userInfo.documentList[0].value]) {
    //     isWhiteList = true
    // };

    return new Promise((resolve, reject) => {

        getChannelTokenUidNull().then(result => {
            //console.log('RESULTADO GET CHANNEL TOKEN C/ UID NULL ===>', result);

            axios.post(configJson.API_HOST_V1 + "getUserInfo_v1", {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": null,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId": "001",
                    "transactionId": "002"
                },
                queryPartnerAPI,
                userInfo
            }).then((result) => {
                console.log('RESULTADO DA API GET INFO ===>', result);

                const mapfrePartnerList = findValueInArray(result.data.success.partnerList, 'partnerId', configJson.partnerIdClubMapfre);
                let status = mapfrePartnerList === null ? '3' : mapfrePartnerList.codStatus;

                //USUARIO NÃO EXISTE NA TRIIBO
                if (result.data.success.userInfo === null) {

                    //definindo o formulario para qual o usuario será encaminhado
                    window.pathname = status === '0' || status === '1' || status === '5' || isWhiteList ? '/cadastroCliente-clubmapfre/' : null;

                    //atribuindo status 6 caso esteja no whiteList
                    if (isWhiteList) {
                        result.data.success.partnerList[findIndexInArray(result.data.success.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].codStatus = "6";
                    }

                    const reply = {
                        isTriibo: false,
                        isMapfreV3: false,
                        partnerList: result.data.success.partnerList,
                        documentList: [{
                            type: 'cpf',
                            value: userInfo.documentList[0].value
                        }]
                    };

                    resolve(reply);
                } else {
                    //USUARIO EXISTE NA TRIIBO
                    result.data.success.userInfo.isTriibo = true;
                    if (isWhiteList) {
                        result.data.success.partnerList[findIndexInArray(result.data.success.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].codStatus = "6";
                    };

                    //usuario não possui mapfre no partner list da v3
                    if (findValueInArray(result.data.success.userInfo.partnerList, 'partnerId', configJson.partnerIdClubMapfre) === null) {
                        //se usuario tiver o status correto ou estiver no whiteList
                        if (status === '0' || status === '1' || status === '5' || isWhiteList) {
                            window.pathname = '/cadastroCliente-clubmapfre';

                            result.data.success.userInfo.isMapfreV3 = false;
                            result.data.success.userInfo.userPartnerList = result.data.success.userInfo.partnerList === undefined ? null : [...result.data.success.userInfo.partnerList];

                            if (result.data.success.userInfo.partnerList === undefined) {
                                result.data.success.userInfo.partnerList = [...result.data.success.partnerList];
                            }
                            else {
                                //concatenando o partner existente no banco e vindo da API
                                result.data.success.userInfo.partnerList = result.data.success.userInfo.partnerList.concat(result.data.success.partnerList);
                            };

                            resolve(result.data.success.userInfo);
                        } else {
                            //usuario não possui o status correto e não esta no whiteList
                            result.data.success.userInfo.isMapfreV3 = false;
                            result.data.success.userInfo.partnerList = result.data.success.partnerList;

                            window.pathname = null;
                            resolve(result.data.success.userInfo);
                        }
                    }
                    //usuario possui mapfre no partner list da v3
                    else {
                        //caso a API da mapfre não retorne codStatus, utilizar o status cadastrado na triibo
                        status = status === undefined || status === null ? result.data.success.userInfo.partnerList[findIndexInArray(result.data.success.userInfo.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].codStatus : status;

                        result.data.success.userInfo.userPartnerList = [...result.data.success.userInfo.partnerList];
                        result.data.success.userInfo.isMapfreV3 = true;

                        //atualizando status no partner
                        result.data.success.userInfo.partnerList[findIndexInArray(result.data.success.userInfo.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].codStatus = isWhiteList ? '6' : status;

                        window.pathname = status === '0' || status === '1' || status === '5' || isWhiteList ? '/confirmarCelular-clubmapfre' : null;

                        resolve(result.data.success.userInfo);
                    }

                }
            }).catch(error => {
                //console.log('ERROR GET USER INFO ===>', error);
                reject(error);
            });


        }).catch(error => {
            //console.log('ERROR GET CHANNEL TOKEN ===>', error);
            reject(error);
        });

    });
}

export function apiGetUserInfo_v1(queryPartnerAPI, userInfo) {

    return new Promise((resolve, reject) => {

        getChannelTokenUidNull().then(result => {
            //console.log('RESULTADO GET CHANNEL TOKEN C/ UID NULL ===>', result);

            axios.post(configJson.API_HOST_V1 + "getUserInfo_v1", {
                "triiboHeader": {
                    "apiToken": configJson.keyapiv1clubmapfre,
                    "channelGroup": configJson.channelGroup,
                    "channelName": configJson.channelName,
                    "uId": null,
                    "channelTokenId": result,
                    "channelId": configJson.channelId,
                    "sessionId": "001",
                    "transactionId": "002"
                },
                queryPartnerAPI,
                userInfo
            }).then((result) => {
                //console.log('RESULTADO DA API GET INFO ===>', result);

                resolve(result.data)
            }).catch(error => {
                //console.log('ERROR GET USER INFO ===>', error);

                reject(error);
            });

        }).catch(error => {
            //console.log('ERROR GET CHANNEL TOKEN ===>', error);
        });

    });
}