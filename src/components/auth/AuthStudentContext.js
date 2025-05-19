import { createContext, useReducer, useEffect } from "react";
import axios from '../Home/StudentAxios'; // Make sure axios is imported

export const AuthContextStudent = createContext();

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { student: action.payload }; // Set student data
    case 'LOGOUT':
      return { student: null }; // Clear student data
    default:
      return state; // Return the current state if no action matches
  }
};

export const AuthContextProviderStudent = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, { student: null }); // Initial state with null student

  // Load student data from localStorage on mount
  useEffect(() => {
    const savedStudent = JSON.parse(localStorage.getItem('student'));
    if (savedStudent) {
      dispatch({ type: 'LOGIN', payload: savedStudent });
    }
  }, []); // This runs only on mount

  // Sync state with localStorage on changes
  useEffect(() => {
    if (state.student) {
      console.log('Student data updated:', state.student);
      localStorage.setItem('student', JSON.stringify(state.student));
    } else {
      localStorage.removeItem('student'); // Clear localStorage if student logs out
    }
  }, [state.student]); // Runs whenever `state.student` changes

  // Fetch current student state from the server on mount if necessary
  useEffect(() => {
    const fetchStudentState = async () => {
      if (state.student && state.student.message && state.student.message.profileCode && !state.student.fetched) {
        try {
          const res = await axios.post('/student-state/' + state.student.message.profileCode, {
            withCredentials: true // Include cookies if needed
          });
          if (res.status === 200) {
            console.log('Fetched student state:', res.data);
            // Mark the student data as fetched to prevent further requests
            res.data.fetched = true;
            localStorage.setItem('student', JSON.stringify(res.data)); // Update localStorage with fetched data
            dispatch({ type: 'LOGIN', payload: res.data }); // Update state with fetched data
          }
        } catch (error) {
          console.error("Error fetching student state:", error);
        }
      }
    };

    // Fetch the student state only when a student is logged in and hasn't already been fetched
    if (state.student && !state.student.fetched) {
      fetchStudentState();
    }
  }, [state.student]); // Re-run this when `state.student` changes

  // Logout function
  const logout = () => {
    dispatch({ type: 'LOGOUT' }); // Dispatch logout action
  };

  return (
    <AuthContextStudent.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AuthContextStudent.Provider>
  );
};
