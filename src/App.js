import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from "./components/Home/Home";
import ExamPortal from "./components/Home/ExamPortal";
import CheckResult from './components/Home/CheckResult'
import CordPortal from "./components/Home/CordPortal";
import Admin from "./components/admin/Admin";
import ProtectedAdminRoute from "./HOC"; // Adjust path as needed
import ProtectedStudentRoute from "./StudentHOC"; // Adjust path as needed
import CreateEvent from "./components/admin/CreateEvent";
import ViewEvent from "./components/admin/ViewEvent";
import CreateClass from "./components/admin/CreateClass";
import Subject from "./components/admin/Subject";
import Registered from "./components/admin/Registered";
import ViewClassCandidates from "./components/admin/ViewClassCandidates";
import UploadQuestion from "./components/admin/Upload";
import ViewClass from "./components/admin/ViewClass";
import Student from "./components/admin/Student";
import Setting from "./components/admin/Setting";
import Question from "./components/admin/Question";
import Result from "./components/admin/Result";
import Dashboard from "./components/student/Dashboard";
import Exam from './components/student/Exam';
import Thankyou from './components/student/ThankYou';
import ClassResultPage from './components/admin/ClassResultPage';
import SeeResult from './components/student/SeeResult';
import ScratchCard from './components/admin/ScratchCard';
import ForOFor from './components/ForOFor';
import './styles/App.scss'
import ClassResultPageCorrection from './components/admin/ClassResultCorrections';


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/examportal" component={ExamPortal} />
          <Route path="/cordportal" component={CordPortal} />
          <Route path="/check-result" component={CheckResult} />

          {/* Protected Admin Routes */}
         {/* <div id="admin-protected"> */}
          <ProtectedAdminRoute path="/admin" component={Admin} />
          <ProtectedAdminRoute path="/create-event" component={CreateEvent} />
          <ProtectedAdminRoute path="/create-class" component={CreateClass} />
          <ProtectedAdminRoute path="/subject" component={Subject} />
          <ProtectedAdminRoute path="/question" component={Question} />
          <ProtectedAdminRoute path="/student" component={Student} />
          <ProtectedAdminRoute path="/registered" component={Registered} />
          <ProtectedAdminRoute path="/registered-class/:id/:className" component={ViewClassCandidates} />
          <ProtectedAdminRoute path="/view-event" component={ViewEvent} />
          <ProtectedAdminRoute path="/result" component={Result} />
          <ProtectedAdminRoute path="/setting" component={Setting} />
          <ProtectedAdminRoute path="/upload-question" component={UploadQuestion} />
          <ProtectedAdminRoute path="/view-class" component={ViewClass} />
          <ProtectedAdminRoute path="/scratchcard" component={ScratchCard} />
          <ProtectedAdminRoute path="/class-results/:id/:className" component={ClassResultPage} />
          <ProtectedAdminRoute path="/class-results-correction/:id/:className" component={ClassResultPageCorrection} />
          {/* </div> */}

          {/* Protected Student Route */}
          <ProtectedStudentRoute path="/dashboard" component={Dashboard} />
          <ProtectedStudentRoute path="/exam" component={Exam} />
          <Route path="/thankyou" component={Thankyou} />
          <Route path="/student-results/:id" component={SeeResult} />

          {/* Default 404 route */}
          {/* <Route path="*" render={() => <h1>Ooops 404 Page not found !!!</h1>} /> */}
          <Route path="*" component={ForOFor} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;