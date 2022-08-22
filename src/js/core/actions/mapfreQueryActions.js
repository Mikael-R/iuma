import dispatcher from "js/core/dispatcher";
import getUserInfo_v1 from "js/library/utils/API/getUserInfo_v1";
import { configJson, apiModeEnv } from 'js/library/utils/firebaseUtils';

export const mapfreQueryAction = (dispatch, cpf) => {

    console.log('entrei no mqa')
    
    const queryPartnerAPI = ["getUserInfoMapfreSSO", "getUserInfo"];
    
    console.log('entrei no mqa com var', queryPartnerAPI)
    
    const userInfo = {
        "documentList": [{
            "type": "cpf",
            "value": cpf
        }],
        "partnerList": [{
            "partnerName": configJson.partnerNameClubMapfre,
            "partnerId": configJson.partnerIdClubMapfre,
            "apiMode": 'REMOTE',
            "apiModeEnv": apiModeEnv,
            "documentList": [{
                "type": "cpf",
                "value": cpf
            }]
        }]
    }

    return dispatcher(dispatch, "MAPFRE_QUERY", getUserInfo_v1(queryPartnerAPI, userInfo));
}