export default function reducer(
  state = {
    userInfo: null
  }, action) {

  switch (action.type) {
    case "EDIT_USER_INFO_PENDING":
      {
        return {
          ...state,
          userInfo: null
        };
      }
    case "EDIT_USER_INFO_FULFILLED":
      {
        return {
          ...state,
          userInfo: action.payload
        };
      }
    case "EDIT_USER_INFO_REJECTED":
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