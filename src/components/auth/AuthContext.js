import { createContext,useReducer,useEffect } from "react"

export const AuthContext = createContext();

export const AuthReducer = (state, action)=>{
    switch(action.type){
        case 'LOGIN':
            return {admin: action.payload}
        case 'LOGOUT':
            return {admin: null}
        default:
            return state
    }
}
 
export const AuthContextProvider = ({children})=>{
const [state, dispatch] = useReducer(AuthReducer,{
    admin: {}
})


// lets check if the browser has the token then we get it 
// because by defaul by refreshing the page, react does not keep track of that
useEffect(()=>{
    let admin = JSON.parse(localStorage.getItem('admin'))
    if(admin){
        dispatch({type: 'LOGIN', payload: admin})
    }
    // let admins = JSON.parse(localStorage.getItem('admin')) || {};
    // let loggedInAdmin = Object.values(admins)[0] || null;
    // dispatch({type: 'LOGIN', payload: loggedInAdmin})
    
},[])

//    console.log('AuthContext state', state)

   return (
    <AuthContext.Provider value={{...state,dispatch}}>
        {children}
    </AuthContext.Provider>
   )
};


