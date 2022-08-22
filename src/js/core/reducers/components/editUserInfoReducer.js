export default function reducer(state={
    loading: false,
    error: null,
    success: false
   }, action) {
   
    switch(action.type) {
   
      case "EDIT_USER_INFO_PENDING": {
        return {
          ...state,
          loading: true,
          success: false,
          error: null
        };
      }
   
      case "EDIT_USER_INFO_FULFILLED": {
        return {
          ...state,
          loading: false,
          success: true,
          error: null
        };
      }
   
      case "EDIT_USER_INFO_REJECTED": {
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