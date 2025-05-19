// components/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Aside from "./Aside";

// admin pages
import Admin            from "./Admin";              // dashboard home
import CreateEvent      from "./CreateEvent";
import ViewEvent        from "./ViewEvent";
import CreateClass      from "./CreateClass";
import Subject          from "./Subject";
import Question         from "./Question";
import Student          from "./Student";
import Registered       from "./Registered";
import ViewClassCand    from "./ViewClassCandidates";
import UploadQuestion   from "./Upload";
import ViewClass        from "./ViewClass";
import Result           from "./Result";
import Setting          from "./Setting";
import ScratchCard      from "./ScratchCard";
import ClassResultPage  from "./ClassResultPage";
import ClassResultCorr  from "./ClassResultCorrections";

const AdminLayout = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const toggleHamburger = () => setIsHamburgerOpen(o => !o);
  const location = useLocation();

  return (
    <>
      <Navbar
        toggleHamburger={toggleHamburger}
        isHamburgerOpen={isHamburgerOpen}
      />
      <Aside isHamburgerOpen={isHamburgerOpen} />
      <main className={isHamburgerOpen ? "menu-open" : ""}>
        <Switch location={location}>
          {/* dashboard */}
          <Route exact path="/admin" component={Admin} />

          {/* generic admin features */}
          <Route path="/admin/create-event" component={CreateEvent} />
          <Route path="/admin/view-event"   component={ViewEvent} />
          <Route path="/admin/create-class" component={CreateClass} />
          <Route path="/admin/subject"      component={Subject} />
          <Route path="/admin/question"     component={Question} />
          <Route path="/admin/student"      component={Student} />
          <Route path="/admin/registered"   component={Registered} />
          <Route path="/admin/registered-class/:id/:className" component={ViewClassCand} />
          <Route path="/admin/upload-question" component={UploadQuestion} />
          <Route path="/admin/view-class"   component={ViewClass} />
          <Route path="/admin/result"       component={Result} />
          <Route path="/admin/setting"      component={Setting} />
          <Route path="/admin/scratchcard"  component={ScratchCard} />

          {/* results per‑class */}
          <Route path="/admin/class-results/:id/:className" component={ClassResultPage} />
          <Route path="/admin/class-results-correction/:id/:className" component={ClassResultCorr} />
        </Switch>
      </main>
    </>
  );
};

export default AdminLayout;
