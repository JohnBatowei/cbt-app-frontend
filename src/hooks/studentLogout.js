import { useAuthContextStudent } from "./useAuthStudentCon";

export const useLogout = () => {
  const { dispatch } = useAuthContextStudent();

  const logout = async () => {
    // console.log('function called');
    try {
      const response = await fetch('/api/api/index/student-logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout failed on the server');
      }

      localStorage.removeItem('studentExamCookie');
      localStorage.removeItem('examState');
      localStorage.removeItem('student')
      dispatch({ type: 'LOGOUT' });

      // Optionally redirect or show success message
      // navigate('/student-login');
    } catch (error) {
      console.error('Logout error:', error.message);
      // Optionally notify user
    }
  };

  return { logout };
};
