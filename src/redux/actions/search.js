
import searchTypes from "../types/user";
const {ON_SEARCH_INPUT_CHANGE, } = searchTypes;

export const onSearchInput = (searchInput) => {
    return {
      type: ON_SEARCH_INPUT_CHANGE,
      payload : searchInput
    };
  };