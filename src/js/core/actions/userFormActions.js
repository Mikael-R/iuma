import dispatcher from "js/core/dispatcher";
import { configJson, apiModeEnv } from 'js/library/utils/firebaseUtils';
import { encrypt, findIndexInArray } from "js/library/utils/helpers";
import { store } from 'js/core/configureStore';
import { saveForm }  from 'js/library/utils/API/saveForm.js';

export const userFormAction = (dispatch, name, aliasName, pendingEmail, birthDate, address, addressExtra, addressNumber, gender, optin1, optin2, optinList, userOrigin) => {

    //obtendo informações da consulta de CPF(1º tela)
    const mapfreModel = store.getState().mapfreQueryModel.partnerList[findIndexInArray(store.getState().mapfreQueryModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre)];

    const cpf = mapfreModel.documentList[findIndexInArray(mapfreModel.documentList, 'type', 'cpf')].value;
	const status = mapfreModel.codStatus;
	const uId = store.getState().mapfreQueryModel.uId;
	const contractList = mapfreModel.contractList;
	const memberID = '';
    
    //tratamento endereco
    address.extra = addressExtra === undefined || addressExtra === '' ? null : addressExtra;
    address.number = addressNumber === undefined || addressNumber === '' ? null : addressNumber;

    //tratamento optinList
    const currentDate = new Date().getTime();
    optinList[0].dateAcceptance = currentDate;
    optinList[1].dateAcceptance = currentDate;
    optinList[2].dateAcceptance = currentDate;
    optinList[0].accept = optin1;
    optinList[1].accept = optin1;
    optinList[2].accept = optin2;

    //convert to millis
    let convertedDate = birthDate.split('/');
    convertedDate = new Date(parseInt(convertedDate[2], 10), parseInt(convertedDate[1] - 1, 10), parseInt(convertedDate[0], 10), 0, 0).getTime();

    const fullName = name.split(" ");
    const firstName = fullName[0];
    const lastName = fullName[fullName.length - 1];

    const userInfoMapfre = {
        "aliasName": aliasName,
        "partnerName": configJson.partnerNameClubMapfre,
        "partnerId": configJson.partnerIdClubMapfre,
        "apiMode": 'REMOTE',
        "apiModeEnv": apiModeEnv,
        "authenticated": true,
        "optInList": optinList,
        "codStatus": status,
        "name": firstName,
        "lastName": lastName,
        "fullName": name,
        "birthDate": convertedDate,
        "gender": gender + 1,
        "addressList": [address],
        "contactList": [
            {
                "type": "email",
                "value": pendingEmail,
                "verified": false
            }
        ],
        "documentList": [{
            "type": "cpf",
            "value": cpf
        }],
        "contractList": contractList,
        "userOrigin": userOrigin
    };

    const userInfoCofry = {
        "userName": cpf,
        "birthDate": convertedDate,
        "channelSource": "triibo-clubmapfre",
        "contactList": [
            {
                "type": "email",
                "value": pendingEmail
            }
        ],
        "documentList": [
            {
                "type": "cpf",
                "value": cpf
            }
        ],
        "gender": gender === 0 ? 'M' : 'F',
        "lastLogin": new Date().getTime(),
        "lastName": lastName,
        "memberID": memberID,
        "name": firstName,
        "partnerName": configJson.partnerNameClubMapfreCofry,
        "partnerId": configJson.partnerIdClubMapfreCofry,
        "password": "AbcdefgHIJLMNO",
        "registrationDate": new Date().getTime(),
        "codStatus": 'Active'
    };

    const userInfoSIS = {
        "contactList": [
            {
            "type": "email",
            "value": pendingEmail,
            "verified": false
            }
        ],
        "documentList": [
            {
                "type": "cpf",
                "value": cpf
            }
        ],
        "name": name,
        "password": encrypt(cpf, configJson.cryptoSIS),
        "passwordConfirmation": encrypt(cpf, configJson.cryptoSIS),
        "partnerId": configJson.partnerIdClubMapfreSIS,
        "partnerName": configJson.partnerNameClubMapfreSIS
    };

    const userInfo = {
        "updateDate": new Date().getTime(),
        "syncType": "merge",
        "uId": uId,
        "keyWordsSetCustom": [
            "clubmapfre",
            "triibo"
        ],
        "keyWordsSetLimit": [
            "clubmapfre",
            "triibo"
        ],
        "orgs": [ "clubmapfre", "triibo" ],
        "documentList": [{
            "type": "cpf",
            "value": cpf
        }]
    };

    return dispatcher(dispatch, "USER_FORM", saveForm(userInfo, userInfoCofry, userInfoMapfre, userInfoSIS) )
}