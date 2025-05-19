import React, { useState, useEffect, useRef } from 'react';
import { useAuthContextStudent } from "../../hooks/useAuthStudentCon";
import axios from './Axios';
import axiosSt from '../Home/StudentAxios'
import Calculator from '../calc/components/Calculator';
import './styles/exam.scss';
import calcImg from '../assets/calc.png';
import { useHistory } from 'react-router-dom';
// import debounce from "lodash.debounce";


const Exam = () => {
    const { student } = useAuthContextStudent();
    const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    // const [timerId, setTimerId] = useState(null);
    const timerIdRef = useRef(null);
    const [calc, setCalc] = useState(false);
    const submissionInProgress = useRef(false); // To prevent double submission
    const selectedOptionRef = useRef({}); // To hold selected options across renders
    const saveIntervalRef = useRef(null);

    const history = useHistory();
    

    const showCalculator = () => {
        setCalc(prevCalc => !prevCalc);
    };

    const [resultConfirmation,setResultConfirmation] = useState('no')

const getResultConfirmation = async () => {
  try {
    // const res = await axios.get('http://localhost:3800/headings', {
    const res = await axiosSt.get('/headings', {
      headers: { 'Content-Type':'application/json' },
    });

    if (res.status === 200 && res.data.data) {
      const headingData = res.data.data.find((data) => data.deff === 'confirmation');
      // console.log(headingData);

      // Update heading regardless of confirmation status
      if (headingData) {
        setResultConfirmation(headingData.confirmation || 'no');
      }
    }
  } catch (error) {
    console.error('Error fetching headings:', error);
    setResultConfirmation('Coordinators Portal');
  }
};


useEffect(() => {
  getResultConfirmation();
}, []);





useEffect(() => {
    if (!student || !student.message?.subject) return;

    const findSubjectsQuestionSelectedOption = student.message.subject.map(subject => {
        const questionsData = subject?.questions.map(question => {
            if (question.selectedOption !== '') {
                return {
                    questionId: question._id,
                    selectedOption: question.selectedOption
                };
            }
            return null;
        }).filter(Boolean);
        return questionsData;
    });

    const initialSelectedOption = {};
    findSubjectsQuestionSelectedOption?.forEach(sub => {
        sub?.forEach(({ questionId, selectedOption }) => {
            initialSelectedOption[questionId] = selectedOption;
        });
    });

    setSelectedOption(initialSelectedOption);
    selectedOptionRef.current = initialSelectedOption;
}, [student]); // ✅ Depend on student

    

const handleSubmit = async () => {
    if (submissionInProgress.current) return;
    submissionInProgress.current = true;

    const subjectsData = student?.message?.subject?.map(subject => {
        const questionsData = subject?.questions.map(question => ({
            questionId: question._id,
            selectedOption: selectedOptionRef.current[question._id] || '',
            correctAnswer: question.answer,
            question: question.question,
            option_A : question.option_A,
            option_B: question.option_B,
            option_C : question.option_C

        }));
        return {
            subjectId: subject._id,
            subjectName: subject.name,
            questions: questionsData
        };
    });

    const dataToSend = {
        classId: student?.message?.classId,
        className: student?.message?.className,
        candidateName: student?.message?.candidateName,
        profileCode: student?.message?.profileCode,
        studentId: student?.message?._id,
        subjects: subjectsData
    };

    try {
        const response = await axios.post('/mark-questions', dataToSend, {
            withCredentials: true
        });

        if (response.status === 200) {
            const logoutResponse = await fetch('/api/api/index/student-logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (!logoutResponse.ok) {
                throw new Error('Logout failed on the server');
            }

            localStorage.removeItem('examState');
            localStorage.removeItem('student');

            if (resultConfirmation !== 'yes') {
                history.push('/thankyou');
            } else {
                history.push('/student-results/' + response.data.markedResult);
            }
        }

    } catch (error) {
        console.error('Error submitting answers', error);
    } finally {
        submissionInProgress.current = false;
    }
};




    useEffect(() => {
        if (!student?.message) {
            console.log('Student message not available');
            return;
        }
    
        const initialTimer = parseInt(student.message.timer, 10) * 60;
    
        const storedState = JSON.parse(localStorage.getItem('examState'));
        // console.log(storedState)
        // console.log(student.message)

        if (storedState && storedState.timeLeft > 0) {
            setTimeLeft(storedState.timeLeft);
            setSelectedOption(storedState.selectedOption);
            setActiveSubjectIndex(storedState.activeSubjectIndex);
            setActiveQuestionIndex(storedState.activeQuestionIndex);
            selectedOptionRef.current = storedState.selectedOption;
        } else {
            setTimeLeft(initialTimer);
        }
    
        const id = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(id);
                    handleSubmit(); // Automatically submit when time is up
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    
        // Store the interval ID in a ref
        timerIdRef.current = id;
    
        return () => {
            clearInterval(timerIdRef.current); // Cleanup on component unmount
        };
    }, [student]);


        const saveExamProgress = async () => {
            let a = 1
            console.log('saved :',a+=1)
            if (!student?.message) return;
    
                // When active question changes, check if there is an answered option from server

            const subjectsData = student?.message?.subject?.map(subject => {
                const questionsData = subject?.questions.map(question => ({
                    questionId: question._id,
                    selectedOption: selectedOptionRef.current[question._id] || '',
                    correctAnswer: question.answer,
                }));
                console.log(subject);
                return {
                    subjectId: subject._id,
                    subjectName: subject.name,
                    questions: questionsData
                };
            });
    
            // console.log(subjectsData.questionId, subjectsData.selectedOption)
            const dataToSend = {
                classId: student?.message?.classId,
                className: student?.message?.className,
                candidateName: student?.message?.candidateName,
                profileCode: student?.message?.profileCode,
                studentId: student?.message?._id,
                subjects: subjectsData,
                timer: parseInt(timeLeft/60) // Add timer to be sent to backend
            };
            // console.log(dataToSend.timer)
            try {
                await axios.post('/save-exam-instances', dataToSend, {
                    withCredentials: true
                });
            } catch (error) {
                clearInterval(saveIntervalRef.current);
                console.error('Error saving exam progress', error);
            }
        };
     

        
    useEffect(() => {
        localStorage.setItem('examState', JSON.stringify({
            timeLeft,
            selectedOption: selectedOptionRef.current,
            activeSubjectIndex,
            activeQuestionIndex
    
        }));
    }, [timeLeft, activeSubjectIndex, activeQuestionIndex]);
    


    const handleSubjectClick = (index) => {
        setActiveSubjectIndex(index);
        setActiveQuestionIndex(0);
    };



    const handleQuestionClick = (index) => {
        setActiveQuestionIndex(index);
        setSelectedOption(prev => ({
            ...prev,
            [activeSubject?.questions[index]?._id]: prev[activeSubject?.questions[index]?._id] || ''
        }));
    };



    const handleOptionChange = (event) => {
        setSelectedOption(prev => ({
            ...prev,
            [activeSubject?.questions[activeQuestionIndex]?._id]: event.target.value
        }));
        selectedOptionRef.current = {
            ...selectedOptionRef.current,
            [activeSubject?.questions[activeQuestionIndex]?._id]: event.target.value
        };

        saveExamProgress();
    };

    const activeSubject = student?.message?.subject[activeSubjectIndex];
    const activeQuestion = activeSubject?.questions[activeQuestionIndex];

    const handleNextQuestion = () => {
        if (activeQuestionIndex < activeSubject?.questions.length - 1) {
            setActiveQuestionIndex(prev => prev + 1);
        } else if (activeSubjectIndex < student.message.subject.length - 1) {
            setActiveSubjectIndex(prev => prev + 1);
            setActiveQuestionIndex(0); // Reset question index for new subject
        }
    };
    
    // Function to handle moving to the previous question or subject
    const handlePreviousQuestion = () => {
        if (activeQuestionIndex > 0) {
            setActiveQuestionIndex(prev => prev - 1);
        } else if (activeSubjectIndex > 0) {
            setActiveSubjectIndex(prev => prev - 1);
            const prevSubjectQuestions = student.message.subject[activeSubjectIndex - 1].questions;
            setActiveQuestionIndex(prevSubjectQuestions.length - 1); // Move to last question of previous subject
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!activeQuestion) return;
    
            const key = event.key.toLowerCase();
    
            // Option selection
            if (['a', 'b', 'c'].includes(key)) {
                const updatedOption = {
                    ...selectedOptionRef.current,
                    [activeQuestion._id]: key
                };
    
                // Update state and ref
                setSelectedOption(prev => ({
                    ...prev,
                    [activeQuestion._id]: key
                }));
                selectedOptionRef.current = updatedOption;
    
                // Save progress using latest selection
                saveExamProgress();
            }
    
            // Navigation with arrow keys
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                handleNextQuestion();
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                handlePreviousQuestion();
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeQuestion, handleNextQuestion, handlePreviousQuestion]);
    
    


    const formatTime = (seconds) => {
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    };
    


    if (!student?.message) {
        return <div style={{color: 'whitesmoke',margin:'4rem 8rem', fontSize:'2rem'}}>Loading...</div>;
    }







    // Image Validator function
    const imgValidator = () => {
        const imageUrl = student?.image;
        // console.log(imageUrl)
        if (imageUrl) {
          // Extract filename from URL
          const filename = imageUrl.split('/').pop();
          if(filename){
            return <img crossOrigin="anonymous" src={`${window.location.origin}${imageUrl}`} alt={filename} />;
          }
        }
        
        // Default SVG when no image is available
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
        );
      };

    return (
        <div className="exam-wrapper">
        <div className="exam">
            <header>
                <div className="top-header">
                    <span className={`timer ${timeLeft <= 60 ? 'warning' : ''}`}>
                        Time: {formatTime(timeLeft)}
                    </span>
                    <span className='name'> <div className="img">  {imgValidator()} </div> {student?.message?.candidateName}</span>
                    <span className='calcImg' onClick={showCalculator}><img src={calcImg} alt="" className='calcImg' /></span>
                    <div className={`calculatorDisplay ${calc === true ? 'showCalcNow' : ''}`}>
                        {calc && <Calculator />}
                    </div>
                    <button onClick={handleSubmit} className='submit'>Submit</button>
                </div>

                <div className="bottom-header">
                    <p>Profile Code : {student?.message?.profileCode}</p>

                    <div className='subjests-warapper'>
                        {/* {student?.message?.subject?.length > 0 ? (
                            student.message.subject.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className={`subjects ${index === activeSubjectIndex ? 'active' : ''}`}
                                    onClick={() => handleSubjectClick(index)}
                                >
                                    <span>{item.name}</span>
                                </div>
                            ))
                        ) : (
                            <p>No subjects available</p>
                        )} */}
                              {student?.message?.subject?.length > 0 ? (
                                student.message.subject.map((item, index) => {
                                    const allAnswered = item.questions.every(q => selectedOption[q._id]);
                                    return (
                                    <div
                                        key={item._id || index}
                                        className={`subjects ${index === activeSubjectIndex ? 'active' : ''} ${allAnswered ? 'completed' : ''}`}
                                        onClick={() => handleSubjectClick(index)}
                                    >
                                        <span>{item.name}</span>
                                    </div>
                                    );
                                })
                                ) : (
                                <p>No subjects available</p>
                                )}

                    </div>
                </div>
            </header>

            <section>
                {activeSubject ? (
                    <div className="question">
                        <h3>Question {activeQuestionIndex + 1}</h3>
                        <div className="main">
                            {/* <p>{activeQuestion?.question || 'No question available'}</p> */}
                            <p dangerouslySetInnerHTML={{ __html: activeQuestion?.question || 'No question available' }} />

                            {activeQuestion?.image && (
                                <div className="image-container">
                                    {/* {console.log(activeQuestion.image)} */}
                                    <img crossOrigin="anonymous" src={`${activeQuestion.image}`} alt="Question diagram" />
                                </div>
                            )}

                            <div className="options">
                                {activeQuestion ? (
                                    <>
                                        <label>
                                            <span>A </span>
                                            <input
                                                type="radio"
                                                name={`question-${activeQuestion._id}`}
                                                value="a"
                                                checked={selectedOption[activeQuestion._id] === 'a'}
                                                onChange={handleOptionChange}
                                            />
                                            <span dangerouslySetInnerHTML={{ __html: activeQuestion.option_A }} />
                                        </label>
                                        <label>
                                            <span>B </span>
                                            <input
                                                type="radio"
                                                name={`question-${activeQuestion._id}`}
                                                value="b"
                                                checked={selectedOption[activeQuestion._id] === 'b'}
                                                onChange={handleOptionChange}
                                            />
                                            {/* <span> {activeQuestion.option_B}</span> */}
                                            <span dangerouslySetInnerHTML={{ __html: activeQuestion.option_B }} />
                                        </label>
                                        <label>
                                            <span>C </span>
                                            <input
                                                type="radio"
                                                name={`question-${activeQuestion._id}`}
                                                value="c"
                                                checked={selectedOption[activeQuestion._id] === 'c'}
                                                onChange={handleOptionChange}
                                            />
                                            {/* <span>{activeQuestion.option_C}</span> */}
                                            <span dangerouslySetInnerHTML={{ __html: activeQuestion.option_C }} />
                                        </label>
                                    </>
                                ) : (
                                    <p>No options available</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No subject selected</p>
                )}
            </section>

            <footer>
                <div className="questions-list">
                <button 
                    className="prev-btn"
                    onClick={handlePreviousQuestion}
                    disabled={activeSubjectIndex === 0 && activeQuestionIndex === 0}
                >
                    Prev
                </button>
                    <div className="question-item-div">
                    {activeSubject?.questions.map((_, index) => {
                        const isAnswered = selectedOption[activeSubject.questions[index]?._id];
                        return (
                            <div
                                key={index}
                                className={`question-item ${index === activeQuestionIndex ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                                onClick={() => handleQuestionClick(index)}
                            >
                                <span>{index + 1}</span>
                            </div>
                        );
                    })}
                    </div>

                                    <button 
                    className="next-btn"
                    onClick={handleNextQuestion}
                    disabled={
                        activeSubjectIndex === student.message.subject.length - 1 &&
                        activeQuestionIndex === activeSubject?.questions.length - 1
                    }
                >
                    Next
                </button>
                </div>
            </footer>
        </div>
        </div>
    );
};

export default Exam;
