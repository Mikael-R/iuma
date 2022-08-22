export default function reducer(state = {
  userInfo: null

}, action) {

  switch (action.type) {

    case "PHONE_INPUT_PENDING":
      {
        return {
          ...state,
          userInfo: null
        };
      }

    case "PHONE_INPUT_FULFILLED":
      { 
        return {
          ...state,
          userInfo: action.payload
        };
      }

    case "PHONE_INPUT_REJECTED":
      {
        return {
          ...state,
          userInfo: null
        };
      }

    default:
      return state;
  }
}