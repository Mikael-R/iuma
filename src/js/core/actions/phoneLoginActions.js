import dispatcher from "js/core/dispatcher";
import getUser_Oficinas from "js/library/utils/API/getUser_Oficinas.js";

export const phoneLoginAction = (dispatch, cellPhone) => {
    return dispatcher(dispatch, "PHONE_LOGIN", getUser_Oficinas( cellPhone.replace(/\D/g, ""), '/inserirCodigo' ) );
};