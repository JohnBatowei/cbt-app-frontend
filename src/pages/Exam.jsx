// Here, we import `React`, `useState`, and `axios`. We define our `Home` component, which renders a form that allows the user to enter their exam registration number. We use the `useState` hook to maintain the state of the `registrationNumber` field. When the form is submitted, we make an HTTP `GET` request to `/api/exam/student/:registrationNumber` to get the student information. If the request is successful, we extract the `registrationNumber` from the response data and redirect the user to the `/exam/:registrationNumber` page.

// ### Creating the Exam Page

// Inside the `pages` folder, create a new file called `Exam.js`. Add the following code to the `Exam.js` file:

// ```javascript
import React, { useEffect, useState } from "react";
import axios from "axios";

function Exam(props) {
  const [student, setStudent] = useState(null);
  const [currentSubject, setCurrentSubject] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(
    () => {
      axios
        .get(`/api/exam/student/${props.match.params.registrationNumber}`)
        .then(response => {
          const { data } = response;
          setStudent(data);
          setCurrentSubject(data.subjects[0]);
          setAnswers(new Array(60).fill(null));
        })
        .catch(error => {
          console.error(error);
        });
    },
    [props.match.params.registrationNumber]
  );

  const handleSubjectChange = event => {
    setCurrentSubject(event.target.value);
    setAnswers(new Array(60).fill(null));
  };

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setIsSubmitting(true);

    axios
      .post(
        `/api/exam/student/${props.match.params.registrationNumber}/submit`,
        {
          subject: currentSubject,
          answers: answers
        }
      )
      .then(response => {
        const { data } = response;
        alert(`Your score for ${data.subject} is ${data.score}`);
        window.location.href = "/";
      })
      .catch(error => {
        console.error(error);
        setIsSubmitting(false);
      });
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>CBT Application</h1>
      <h2>
        Welcome, {student.name}!
      </h2>
      <form onSubmit={handleSubmit}>
        <label>
          Subject:
          <select value={currentSubject} onChange={handleSubjectChange}>
            {student.subjects.map(subject =>
              <option key={subject} value={subject}>
                {subject}
              </option>
            )}
          </select>
        </label>
        <hr />
        {answers.map((answer, index) =>
          <div key={index}>
            <label>
              {index + 1}.{" "}
              <input
                type="text"
                value={answer || ""}
                onChange={event => handleAnswerChange(index, event)}
              />
            </label>
          </div>
        )}
        <hr />
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Exam;
