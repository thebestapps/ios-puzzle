const INITIAL_MODAL_INFO_STATE = {
  isMuted: false,
};

export const muteInfoReducer = (state = INITIAL_MODAL_INFO_STATE, action) => {
  switch (action.type) {
    case 'SET_MUTE':
      return {
        isMuted: action.payload,
      };
    default:
      return state;
  }
};
