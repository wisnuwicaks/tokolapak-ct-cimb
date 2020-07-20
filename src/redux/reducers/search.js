import userTypes from "../types/user";

const { 
  ON_SEARCH_INPUT_CHANGE,

} = userTypes;

const init_state = {
  searchInput : '',
  
};

export default (state = init_state, action) => {
  switch (action.type) {
   
    case ON_SEARCH_INPUT_CHANGE :
      return { ...state, searchInput:action.payload };
    default:
      return { ...init_state, };
  }
};
