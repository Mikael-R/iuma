export default function reducer(
  state = {
    userInfo: null,
    partnerList: null
  }, action) {

  switch (action.type) {
    case "USER_FORM_PENDING":
      {
        return {
          ...state,
          userInfo: null,
          partnerList: null
        };
      }
    case "USER_FORM_FULFILLED":
      {
        return {
          ...state,
          userInfo: action.payload.userInfo,
          partnerList: action.payload.partnerList
        };
      }
    case "USER_FORM_REJECTED":
      {
        return {
          ...state,
          userInfo: null,
          partnerList: null
        };
      }
    default:
      return state;
  }
}