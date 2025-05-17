const initialState={
    userInfo:undefined,
}

const authReducer=(state=initialState,action)=>{
    switch(action.type){
        case 'UPDATE_PERSON_DETAILS':
            return {...state,userInfo:action.payload}
        default:
            return state;
    }
}

export default authReducer;