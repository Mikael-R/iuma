import { setUserInfo_v1 } from "js/library/utils/API/setUserInfo_v1";
import { configJson } from 'js/library/utils/firebaseUtils';
import { findIndexInArray } from "js/library/utils/helpers";
import { getLastUserInfo } from "js/library/utils/helpers";

export const editUserAdditionalInfo = (maritalStatus, numKids, occupation, scholarity, teamSupport, musicStyle, hobbie, favColor, channel, artist) => {

    const additionalInfo = { maritalStatus, numKids, occupation, scholarity, teamSupport, musicStyle, hobbie, favColor, channel, artist };

    let partnerInfo = getLastUserInfo().partnerList;

    partnerInfo[findIndexInArray(partnerInfo, 'partnerId', configJson.partnerIdClubMapfre)].additionalInfo = additionalInfo;

    //removendo nulos
    let newArray = partnerInfo.map((row) => {
        let array = [];
        if (row !== null) {
            array.push(row);
        }

        return array[0];
    });

    const uId = getLastUserInfo().uId;

    const userInfo = {
        uId,
        "updateDate": new Date().getTime(),
        "syncType": "merge",
        partnerList: newArray
    };

    const mapfreModel = partnerInfo[findIndexInArray(partnerInfo, 'partnerId', configJson.partnerIdClubMapfre)];

    setUserInfo_v1(uId, ["setUserInfo"], userInfo, null);
    if(mapfreModel.codStatus !== '5' && mapfreModel.codStatus !== '3' && mapfreModel.codStatus !== '6') {
        setUserInfo_v1(uId, ["setUserInfoMapfreSSO"], { 'partnerList': [mapfreModel] }, null);
    };
};