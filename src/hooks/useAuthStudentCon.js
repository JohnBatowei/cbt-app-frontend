import { useContext } from 'react';
import { AuthContextStudent } from '../components/auth/AuthStudentContext';

export const useAuthContextStudent = () => {
  const context = useContext(AuthContextStudent);

  if (!context) {
    throw Error('useAuthContextStudent must be used inside an AuthContextProvider');
  }
  
  return context;
};
