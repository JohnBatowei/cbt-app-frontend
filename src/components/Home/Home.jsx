import "./styles/styles.scss";
import Cordinator from "./Cordinator";
import TakeExam from "./TakeExam";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [headings, setHeadings] = useState("AriTron CBT Software");

  const getHeadings = async () => {
    try {
      const res = await axios.get("/api/index/headings", {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200 && res.data.data) {
        const headingData = res.data.data.find((data) => data.deff === "f");
        if (headingData) {
          setHeadings(headingData.frontPage || "AriTron CBT Software");
        }
      }
    } catch (error) {
      console.error("Error fetching headings:", error);
      setHeadings("AriTron CBT Software");
    }
  };

  useEffect(() => {
    getHeadings();
  }, []);

  return (
    <div className="Home-wrapper">
      <div className="Home">
        <h1 className="main-heading">{headings}</h1>

        <marquee behavior="smooth" direction="left" className="notice">
          Students/Candidates should click the "Take Exam" button below. The "Coordinator" link is for authorized exam officials only.
        </marquee>

        <div className="ExamCord">
          <TakeExam />
          <Cordinator />
        </div>
        
      <div className="can-check-result">
        <Link to="check-result">Check Result Portal</Link>
      </div>
      </div>

    </div>
  );
};

export default Home;
