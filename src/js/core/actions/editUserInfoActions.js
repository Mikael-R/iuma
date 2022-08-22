import dispatcher from "js/core/dispatcher";
import { setUserInfo_v1 } from "js/library/utils/API/setUserInfo_v1";
import { configJson } from 'js/library/utils/firebaseUtils';
import { apiModeEnv } from "js/library/utils/firebaseUtils";
import { findIndexInArray } from "js/library/utils/helpers";

export const editUserInfoAction = (dispatch, uId, newAliasName, newEmail, newOptInList, newFullAddress, newAddressExtra, newAddressNumber, newBirthDate, newGender, userInfoEdit) => {

    //convertender data de nascimento
    let birthDate = newBirthDate.split('/');
    birthDate = new Date(parseInt(birthDate[2], 10), parseInt(birthDate[1] - 1, 10), parseInt(birthDate[0], 10), 0, 0).getTime();

    //adicionar endereço
    newFullAddress['extra'] = newAddressExtra;
    newFullAddress['number'] = newAddressNumber;

    //gerenciando contactList
    if (findIndexInArray(userInfoEdit.contactList, 'type', 'email') === null) {
        userInfoEdit.contactList.push({
            type: 'email',
            value: newEmail
        });
    }
    else {
        userInfoEdit.contactList[findIndexInArray(userInfoEdit.contactList, 'type', 'email')].value = newEmail;
    }
    
    //obj cofry
    let cofryModel = userInfoEdit.partnerList[findIndexInArray(userInfoEdit.partnerList, 'partnerId', configJson.partnerIdClubMapfreCofry)];

    cofryModel.contactList = userInfoEdit.contactList;
    cofryModel.addressList = [newFullAddress];
    cofryModel.birthDate = birthDate;
    cofryModel.gender = newGender === '0' ? 'M' : 'F';

    //obj mapfre
    let mapfreModel = userInfoEdit.partnerList[findIndexInArray(userInfoEdit.partnerList, 'partnerId', configJson.partnerIdClubMapfre)];
    mapfreModel.apiMode = 'REMOTE';
    mapfreModel.apiModeEnv = apiModeEnv;
    mapfreModel.contactList = userInfoEdit.contactList;
    mapfreModel.optInList = newOptInList;
    mapfreModel.addressList = [newFullAddress];
    mapfreModel.birthDate = birthDate;
    mapfreModel.gender = parseInt(newGender, 10) + 1;
    mapfreModel.aliasName = newAliasName;
    
    //inserindo no partnerList
    userInfoEdit.partnerList[findIndexInArray(userInfoEdit.partnerList, 'partnerId', configJson.partnerIdClubMapfreCofry)] = cofryModel;
    userInfoEdit.partnerList[findIndexInArray(userInfoEdit.partnerList, 'partnerId', configJson.partnerIdClubMapfre)] = mapfreModel;

    //removendo nulos
    let newArray = userInfoEdit.partnerList.map((row) => {
        let array = [];
        if (row !== null) {
            array.push(row);
        }

        return array[0];
    });

    const userInfo = {
        uId,
        aliasName: newAliasName,
        "updateDate": new Date().getTime(),
        "syncType": "merge",
        addressList: [newFullAddress],
        contactList: userInfoEdit.contactList,
        optInList: newOptInList,
        partnerList: newArray,
        birthDate,
        gender: parseInt(newGender, 10)
    };

    return dispatcher(dispatch, "EDIT_USER_INFO", setUserInfo_v1(uId, ["setUserInfo"], userInfo, null), mapfreModel.codStatus !== '5' && mapfreModel.codStatus !== '3' && mapfreModel.codStatus !== '6' ? setUserInfo_v1(uId, ["setUserInfoMapfreSSO"], { 'partnerList': [mapfreModel] }, null) : null, setUserInfo_v1(uId, ["setUserCofry"], { 'partnerList': [cofryModel] }, null));
}