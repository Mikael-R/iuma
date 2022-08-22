import dispatcher from "js/core/dispatcher";
import { setUserInfo_v1 } from "js/library/utils/API/setUserInfo_v1";
import { store } from 'js/core/configureStore';
import { pushDatabase } from "js/library/services/DatabaseManager.js";
import { findIndexInArray, findValueInArray, encrypt } from "js/library/utils/helpers.js";
import { configJson } from 'js/library/utils/firebaseUtils';

import { login } from "js/library/utils/API/login";
import { loginUser } from 'js/library/services/AuthenticationManager.js';

export const phoneInputAction = async (dispatch, user, cellPhone) => {

    cellPhone = '+' + cellPhone.replace(/\D/g, '');

    const status = parseInt(store.getState().mapfreQueryModel.partnerList[findIndexInArray(store.getState().mapfreQueryModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].codStatus, 10);

    if (store.getState().mapfreQueryModel.isMapfreV3) {
        //já acessou antes

        //tageamento de login
        const objHistoricoLogin = {
            "tag": "LOGIN_CLUBMAPFRE",
            "status": status,
            "uid": store.getState().mapfreQueryModel.uId,
            "date": Date.now(),
            "authenticationMethodList": store.getState().mapfreQueryModel.authenticationMethodList === undefined ? null : store.getState().mapfreQueryModel.authenticationMethodList
        };

        //logando usuário c/ Api de login
        await login(cellPhone, store.getState().mapfreQueryModel.triiboId.replace(/[,]/gi, "."))
        //logando firebase
        await loginUser(store.getState().mapfreQueryModel.triiboId.replace(/[,]/gi, "."), store.getState().mapfreQueryModel.passPhrase);

        //setando aliasName p/ exibir no menu
        localStorage.setItem('aliasName', store.getState().mapfreQueryModel.partnerList[findIndexInArray(store.getState().mapfreQueryModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].name);
        localStorage.setItem('cofryId', encrypt(findValueInArray(store.getState().mapfreQueryModel.documentList, 'type', 'cpf').value, configJson.cryptoCofry));

        const voucherObj = {
            partnerList: store.getState().mapfreQueryModel.partnerList,
            updateDate: Date.now()
        };

        return dispatcher(dispatch, "PHONE_INPUT", pushDatabase('HistoricoLogin', objHistoricoLogin, true),
        setUserInfo_v1(store.getState().mapfreQueryModel.uId, ["setUserInfo"], voucherObj, true),
        setUserInfo_v1(store.getState().mapfreQueryModel.uId, ["setUserCofry"], { 'partnerList': [store.getState().mapfreQueryModel.partnerList[findIndexInArray(store.getState().mapfreQueryModel.partnerList, 'partnerId', configJson.partnerIdClubMapfreCofry)]] }, true));
    }
    else {
        //1º acesso
        const userFormModel = { ...store.getState().userFormModel.userInfo };
        const userFormModelMapfre = { ...store.getState().userFormModel.partnerList[findIndexInArray(store.getState().userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre)] };

        if (user === null) {
            //usuario não existe na triibo - CRIAR DO ZERO, cadastrar mapfre e incluir flag de primeiro acessos
            userFormModel.partnerList = [...store.getState().userFormModel.partnerList];

            //adicionando celular no contact list
            userFormModel.contactList = [{
                'type': 'cellPhone',
                'value': cellPhone,
                'verified': true
            }];

            userFormModel.partnerList[findIndexInArray(userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].contactList.push({
                'type': 'cellPhone',
                'value': cellPhone,
                'verified': true
            });

            userFormModel.partnerList[findIndexInArray(userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfreCofry)].contactList.push({
                'type': 'cellPhone',
                'value': cellPhone,
                'verified': true
            });

            userFormModel.partnerList[findIndexInArray(userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfreSIS)].contactList.push({
                'type': 'cellPhone',
                'value': cellPhone,
                'verified': true
            });

            userFormModel.authenticationMethodList = [{
                "type": "SMS - Triibo",
                "cellPhone": cellPhone,
                "enabled": true,
                "verified": true,
                "dateVerified": new Date().getTime(),
                "lastlogin": new Date().getTime()
            }];


            //logando usuário c/ Api de login
            const userLogin = await login(cellPhone, cellPhone + "@sms.triibo.com.br");
            //logando usuário c/ email no firebase
            await loginUser(cellPhone + "@sms.triibo.com.br", userLogin.data.user.passPhrase);

            const uId = userLogin.data.user.uId;

            userFormModel.uId = uId;

            

            //tageamento de login
            const objHistoricoLogin = {
                "tag": "FIRST_LOGIN_WEB",
                "status": status,
                "uid": uId,
                "date": Date.now(),
                "authenticationMethodList": userFormModel.authenticationMethodList
            };

            //setando aliasName p/ exibir no menu
            localStorage.setItem('aliasName', userFormModel.partnerList[findIndexInArray(userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].name);
            localStorage.setItem('cofryId', encrypt(findValueInArray(userFormModel.documentList, 'type', 'cpf').value, configJson.cryptoCofry));
            localStorage.setItem('firstAccess', true);

            return dispatcher(dispatch, "PHONE_INPUT", setUserInfo_v1(uId, ["setUserInfo"], userFormModel, true),
                status !== 5 && status !== 3 && status !== 4 && status !== 6 ? setUserInfo_v1(uId, ["setUserInfoMapfreSSO"], { 'partnerList': [userFormModel.partnerList[findIndexInArray(userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre)]] }, true) : null,
                pushDatabase('HistoricoLogin', objHistoricoLogin, null),
                // setUserInfo_v1(uId, ["setUserSIS"], { 'partnerList': [userFormModel.partnerList[findIndexInArray(userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfreSIS)]] }, true),
                setUserInfo_v1(uId, ["setUserCofry"], { 'partnerList': [userFormModel.partnerList[findIndexInArray(userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfreCofry)]] }, true));

        }
        else {
            //usuario já existe
            //atribuir aliasName, partners, número autenticado, cadastrar mapfre e incluir flag de primeiro acesso
            const userFormPartners = { ...user };

            //atribuindo cpf no documentList
            if (userFormPartners.documentList === undefined || userFormPartners.documentList.length === 0) {
                userFormPartners.documentList = [];
                userFormPartners.documentList.push({
                    type: 'cpf',
                    value: store.getState().mapfreQueryModel.documentList[findIndexInArray(store.getState().mapfreQueryModel.documentList, 'type', 'cpf')].value
                })
            };

            //atribuindo authenticationMethodList e contactList
            const hasContactList = findIndexInArray(userFormPartners.contactList, 'value', cellPhone);
            const hasAuthenticationMethodList = findIndexInArray(userFormPartners.authenticationMethodList, 'cellPhone', cellPhone);

            if (hasContactList === null) {
                userFormPartners.contactList = [];

                userFormPartners.contactList.push({
                    type: 'cellPhone',
                    value: cellPhone,
                    verified: true
                });
            }
            else {
                userFormPartners.contactList[hasContactList] = {
                    type: 'cellPhone',
                    value: cellPhone,
                    verified: true
                }
            };

            if (hasAuthenticationMethodList === null) {
                userFormPartners.authenticationMethodList = [];
                userFormPartners.authenticationMethodList.push({
                    "type": "SMS - Triibo",
                    "cellPhone": cellPhone,
                    "enabled": true,
                    "verified": true,
                    "dateVerified": new Date().getTime(),
                    "lastlogin": new Date().getTime()
                });
            }
            else {
                userFormPartners.authenticationMethodList[hasAuthenticationMethodList] = {
                    "type": "SMS - Triibo",
                    "cellPhone": cellPhone,
                    "enabled": true,
                    "verified": true,
                    "dateVerified": new Date().getTime(),
                    "lastlogin": new Date().getTime()
                }
            }

            //atribuindo keywords
            if (userFormPartners.keyWordsSetCustom === undefined) {
                userFormPartners.keyWordsSetCustom = ["clubmapfre", "triibo"];
            }
            else {
                let hasTriibo = false;
                let hasClubMapfre = false;

                userFormPartners.keyWordsSetCustom.map(function (array) {
                    if (array === 'triibo') {
                        return hasTriibo = true;
                    }
                    else {
                        return null;
                    }
                });

                userFormPartners.keyWordsSetCustom.map(function (array) {
                    if (array === 'clubmapfre') {
                        return hasClubMapfre = true;
                    }
                    else {
                        return null;
                    }
                });

                if (!hasTriibo) {
                    userFormPartners.keyWordsSetCustom.push('triibo');
                }

                if (!hasClubMapfre) {
                    userFormPartners.keyWordsSetCustom.push('clubmapfre');
                }
            }

            if (userFormPartners.keyWordsSetLimit === undefined) {
                userFormPartners.keyWordsSetLimit = ["clubmapfre", "triibo"];
            }
            else {
                let hasTriibo = false;
                let hasClubMapfre = false;

                userFormPartners.keyWordsSetLimit.map(function (array) {
                    if (array === 'triibo') {
                        return hasTriibo = true;
                    }
                    else {
                        return null;
                    }
                });

                userFormPartners.keyWordsSetLimit.map(function (array) {
                    if (array === 'clubmapfre') {
                        return hasClubMapfre = true;
                    }
                    else {
                        return null;
                    }
                });

                if (!hasTriibo) {
                    userFormPartners.keyWordsSetLimit.push('triibo');
                }

                if (!hasClubMapfre) {
                    userFormPartners.keyWordsSetLimit.push('clubmapfre');
                }
            }

            if (userFormPartners.partnerList === undefined) {
                //user não possui partner

                userFormPartners.partnerList = store.getState().userFormModel.partnerList;
            }
            else {
                const indexCofry = findIndexInArray(userFormPartners.partnerList, 'partnerId', configJson.partnerIdClubMapfreCofry);
                const indexSIS = findIndexInArray(userFormPartners.partnerList, 'partnerId', configJson.partnerIdClubMapfreSIS);

                //atribuindo partner MAPFRE
                userFormPartners.partnerList.push(store.getState().userFormModel.partnerList[findIndexInArray(store.getState().userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfre)]);

                if (indexCofry === null) {
                    userFormPartners.partnerList.push(store.getState().userFormModel.partnerList[findIndexInArray(store.getState().userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfreCofry)]);
                }
                else {
                    userFormPartners.partnerList[indexCofry] = store.getState().userFormModel.partnerList[findIndexInArray(store.getState().userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfreCofry)];
                }

                if (indexSIS === null) {
                    userFormPartners.partnerList.push(store.getState().userFormModel.partnerList[findIndexInArray(store.getState().userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfreSIS)]);
                }
                else {
                    userFormPartners.partnerList[indexSIS] = store.getState().userFormModel.partnerList[findIndexInArray(store.getState().userFormModel.partnerList, 'partnerId', configJson.partnerIdClubMapfreSIS)];
                }
            };

            //atribuindo contactList nos partners
            userFormPartners.partnerList[findIndexInArray(userFormPartners.partnerList, 'partnerId', configJson.partnerIdClubMapfre)].contactList.push({
                'type': 'cellPhone',
                'value': cellPhone,
                'verified': true
            });

            userFormPartners.partnerList[findIndexInArray(userFormPartners.partnerList, 'partnerId', configJson.partnerIdClubMapfreCofry)].contactList.push({
                'type': 'cellPhone',
                'value': cellPhone,
                'verified': true
            });

            userFormPartners.partnerList[findIndexInArray(userFormPartners.partnerList, 'partnerId', configJson.partnerIdClubMapfreSIS)].contactList.push({
                'type': 'cellPhone',
                'value': cellPhone,
                'verified': true
            });

            //tageamento de login
            const objHistoricoLogin = {
                "tag": "FIRST_LOGIN_WEB",
                "status": status,
                "uid": user.uId,
                "date": Date.now(),
                "authenticationMethodList": userFormPartners.authenticationMethodList
            };

            userFormPartners.updateDate = Date.now();

            //removendo nulos
            const newArray = userFormPartners.partnerList.filter(function (el) {
                return el != null;
            });

            userFormPartners.partnerList = newArray;

            //logando usuário c/ Api de login
            await login(cellPhone, userFormPartners.triiboId);
            //logando usuário c/ email no firebase
            await loginUser(userFormPartners.triiboId.replace(/[,]/gi, "."), userFormPartners.passPhrase);

            //setando aliasName p/ exibir no menu
            localStorage.setItem('aliasName', userFormModelMapfre.name);
            localStorage.setItem('cofryId', encrypt(findValueInArray(userFormPartners.documentList, 'type', 'cpf').value, configJson.cryptoCofry));
            localStorage.setItem('firstAccess', true);

            return dispatcher(dispatch, "PHONE_INPUT", setUserInfo_v1(user.uId, ["setUserInfo"], userFormPartners, true),
                status !== 5 && status !== 3 && status !== 4 && status !== 6 ? setUserInfo_v1(user.uId, ["setUserInfoMapfreSSO"], { 'partnerList': [userFormPartners.partnerList[findIndexInArray(userFormPartners.partnerList, 'partnerId', configJson.partnerIdClubMapfre)]] }, true) : null,
                pushDatabase('HistoricoLogin', objHistoricoLogin, null));
                // setUserInfo_v1(user.uId, ["setUserSIS"], { 'partnerList': [userFormPartners.partnerList[findIndexInArray(userFormPartners.partnerList, 'partnerId', configJson.partnerIdClubMapfreSIS)]] }, true));
        }

    }
}