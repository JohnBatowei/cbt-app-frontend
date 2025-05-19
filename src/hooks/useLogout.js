

import { useAuthContext } from "./useAuthContext";
// import Cookies from 'js-cookie';


export const useLogout = () => {
   const { dispatch } = useAuthContext();
 
   const logout = async () => {
     // Call the backend to clear the HTTP-only cookie
     await fetch('/api/api/index/admin-logout', {
       method: 'POST',
       credentials: 'include' // send cookies
     });
 
     // Remove from localStorage
     localStorage.removeItem('admin');
 
     // Dispatch logout action
     dispatch({ type: 'LOGOUT' });
   };
 
   return { logout };
 };
 