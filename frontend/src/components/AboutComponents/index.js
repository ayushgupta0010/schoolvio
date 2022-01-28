import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { REST_URL } from "../../utils/urls";
import { DEVELOPER, JOIN_US, WEBSITE_NAME } from "../../utils/websiteData";
import Axios from "axios";

const About = () => {
  const [about, setAbout] = useState({
    student: "",
    teacher: "",
    school: "",
    total: "",
  });

  useEffect(() => {
    document.title = "About";
    Axios.get(REST_URL.COUNT_USERS).then((response) =>
      setAbout({ ...response.data })
    );
  }, []);

  return (
    <>
      <div className='container mt-9'>
        <div
          className='rounded my-3 p-5'
          style={{ backgroundColor: "#1cb65d " }}>
          <div className='container text-center'>
            <h1 className='styledFont text-light'>
              Welcome to{" "}
              <span
                className='styledFont'
                style={{ textTransform: "capitalize" }}>
                {WEBSITE_NAME}
              </span>
            </h1>
            <p className='lead m-0' style={{ fontFamily: "Poiret One" }}>
              Share your school experience with students from various schools,
              <br />
              connect with students with similar interests
            </p>
          </div>
        </div>
        <div className='container'>
          <div className='text-center'>
            <h2 className='text-success mb-3'>
              We are currently in{" "}
              <span className='styledFont'>{about.school}</span> school(s) with{" "}
              <span className='styledFont'>{about.student}</span> student(s) and
              <span className='styledFont'> {about.teacher}</span> teacher(s).
            </h2>
            <h4 className='text-success'>Total users: {about.total}</h4>
          </div>
          <div className='text-center text-md-start'>
            <h3 className='styledFont text-skyblue'>Meet the developer</h3>
            <div className='card mb-3'>
              <div className='row g-0'>
                <div className='col-md-3'>
                  <img
                    src={DEVELOPER.photo}
                    className='card-img'
                    alt='profile-pic'
                    style={{ height: "250px" }}
                  />
                </div>
                <div className='col-md-8'>
                  <div className='card-body pb-2'>
                    <h5 className='card-title mt-0 styledFont'>
                      {DEVELOPER.name}
                    </h5>
                    <p className='card-text m-0 font-monospace'>
                      I have created this website to provide efficient online
                      studies and to overcome the difficulties faced by me and
                      my teachers during this pandemic.
                      <br /> <br /> I know Java, Python, Django(and what goes with it
                      Django REST Framework, Channels and Celery, Graphene
                      Django), HTML, CSS, JS, React, GraphQL.
                    </p>
                    <p className='card-text m-0 mt-5'>
                      <small className='text-muted fs-5 styledFont'>
                        <a
                          href='https://github.com/ayushgupta0010'
                          target='_blank'
                          rel='noreferrer'>
                          <i className='bi bi-github me-3' />
                          My Github Profile
                        </a>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='position-absolute bottom-0 w-100'>
        <div className='d-flex justify-content-around py-3 bg-dark'>
          <Link to='/contact_us' className='styledFont text-skyblue fw-bolder'>
            Contact Us
          </Link>
          <a
            href={`mailto:${JOIN_US.email}?subject=${JOIN_US.subject}`}
            className='styledFont text-skyblue fw-bolder'
            target='_blank'
            rel='noreferrer'>
            Join Us
          </a>
        </div>
      </div>
    </>
  );
};

export default About;
