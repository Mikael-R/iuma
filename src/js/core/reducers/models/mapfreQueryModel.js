export default function reducer(
  state = {
    isTriibo: null,
    isMapfreV3: null,
    authenticationMethodList: null,
    contactList: null,
    documentList: null,
    addressList: null,
    linkedAccount: null,
    name: null,
    aliasName: null,
    birthDate: null,
    passPhrase: null,
    photoList: null,
    registrationDate: null,
    gender: null,
    temporary: null,
    triiboId: null,
    uId: null,
    updateDate: null,
    partnerList: null,
    optInList: null,
    userPartnerList: null,
    transactionId: null
  }, action) {

  switch (action.type) {
    case "MAPFRE_QUERY_PENDING":
    {
      return {
        ...state,
        isTriibo: null,
        isMapfreV3: null,
        authenticationMethodList: null,
        contactList: null,
        documentList: null,
        addressList: null,
        linkedAccount: null,
        name: null,
        aliasName: null,
        birthDate: null,
        passPhrase: null,
        photoList: null,
        registrationDate: null,
        gender: null,
        temporary: null,
        triiboId: null,
        uId: null,
        updateDate: null,
        partnerList: null,
        optInList: null,
        userPartnerList: null,
        transactionId: null
      };
    }

    case "MAPFRE_QUERY_FULFILLED":
    {
      return {
        ...state,
        isTriibo: action.payload.isTriibo,
        isMapfreV3: action.payload.isMapfreV3,
        authenticationMethodList: action.payload.authenticationMethodList,
        contactList: action.payload.contactList,
        documentList: action.payload.documentList,
        addressList: action.payload.addressList,
        linkedAccount: action.payload.linkedAccount,
        name: action.payload.name,
        passPhrase: action.payload.passPhrase,
        photoList: action.payload.photoList,
        registrationDate: action.payload.registrationDate,
        gender: action.payload.gender,
        aliasName: action.payload.aliasName,
        birthDate: action.payload.birthDate,
        temporary: action.payload.temporary,
        triiboId: action.payload.triiboId,
        uId: action.payload.uId,
        updateDate: action.payload.updateDate,
        partnerList: action.payload.partnerList,
        optInList: action.payload.optInList,
        userPartnerList: action.payload.userPartnerList,
        transactionId: action.payload.transactionId
      };
    }
    case "MAPFRE_QUERY_REJECTED":
    {
      return {
        ...state,
        isTriibo: null,
        isMapfreV3: null,
        authenticationMethodList: null,
        contactList: null,
        documentList: null,
        addressList: null,
        linkedAccount: null,
        name: null,
        aliasName: null,
        birthDate: null,
        passPhrase: null,
        photoList: null,
        registrationDate: null,
        gender: null,
        temporary: null,
        triiboId: null,
        uId: null,
        updateDate: null,
        partnerList: null,
        optInList: null,
        userPartnerList: null,
        transactionId: null
      };
    }
    default:
    return state;
  }
}