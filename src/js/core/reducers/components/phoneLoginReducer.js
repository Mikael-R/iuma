export default function reducer(state={
    loading: false,
    error: null,
    success: false
   }, action) {
   
    switch(action.type) {
   
      case "PHONE_LOGIN_PENDING": {
        return {
          ...state,
          loading: true,
          success: false,
          error: null
        };
      }
   
      case "PHONE_LOGIN_FULFILLED": {
        return {
          ...state,
          loading: false,
          success: true,
          error: null
        };
      }
   
      case "PHONE_LOGIN_REJECTED": {
        return {
          ...state,
          loading: false,
          success: false,
          error: action.payload
        };
      }
   
      default: return state;
   
    }
   }