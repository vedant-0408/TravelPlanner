const initialState={
    adminAccess:false,
}

const adminReducer=(state=initialState,action)=>{
    switch(action.type){
        case "SET_ADMIN_ACCESS":
            console.log('Admin reducer received:', action.payload);
            return {...state,adminAccess:action.payload}
        default:
            return state;
    }
}

export default adminReducer;