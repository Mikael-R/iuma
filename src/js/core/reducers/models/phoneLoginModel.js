export default function reducer(state = {
  userInfoOficinas: null

}, action) {

  switch (action.type) {

    case "PHONE_LOGIN_PENDING":
      {
        return {
          ...state,
          userInfoOficinas: null
        };
      }

    case "PHONE_LOGIN_FULFILLED":
      {
        return {
          ...state,
          userInfoOficinas: action.payload
        };
      }

    case "PHONE_LOGIN_REJECTED":
      {
        return {
          ...state,
          userInfoOficinas: action.payload
        };
      }

    default:
      return state;
  }
}