export default function reducer(state={
    loading: false,
    error: null,
    success: false
   }, action) {
   
    switch(action.type) {
   
      case "USER_FORM_PENDING": {
        return {
          ...state,
          loading: true,
          success: false,
          error: null
        };
      }
   
      case "USER_FORM_FULFILLED": {
        return {
          ...state,
          loading: false,
          success: true,
          error: null
        };
      }
   
      case "USER_FORM_REJECTED": {
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