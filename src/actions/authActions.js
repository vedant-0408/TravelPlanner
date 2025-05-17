export const setUserInfo = (newInfo) => {
    return {
      type: 'UPDATE_PERSON_DETAILS',
      payload: newInfo,
    };
};

export const setAdminAccess=(isAdmin)=>{
  return {
    type:'SET_ADMIN_ACCESS',
    payload:isAdmin,
  }
}