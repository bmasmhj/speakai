import { Link } from "react-router-dom";
import Footer from "../models/Footer";
import Nav from "../models/Nav";
import TopNav from "../models/TopNav";
import { useEffect, useState } from "react";
import Instance from "../../axios";

export default function Dashboard() {
  const [ overal , setOveral ] = useState({
    user : 0,
    domains : 0,
    intents : 0,
    utterances : 0,
    answers : 0,
    messages : 0,
  });
useEffect(() => {
  Instance.get('/overal').then((response) => {
    setOveral(response.data);
  })
}, [] );
return <>
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Nav />
        <div className="layout-page">
            <TopNav />  
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Home</li>
                </ol>
              </nav>
              <div className="row">
                <div className="col-md-6 col-xl-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="me-3">
                          <div className="text-muted small">Total Users</div>
                          <div className="text-large">{overal.user}</div>
                        </div>
                        <div className="position-relative">
                          <i className="fa-duotone fa-user"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  
                <div className="col-md-6 col-xl-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="me-3">
                          <div className="text-muted small">Total Message</div>
                          <div className="text-large">{overal.messages}</div>
                        </div>
                        <div className="position-relative">
                          <i className="fa-duotone fa-message"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  
                <div className="col-md-6 col-xl-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="me-3">
                          <div className="text-muted small">Total Domains</div>
                          <div className="text-large">{overal.domains}</div>
                        </div>
                        <div className="position-relative">
                          <i className="fa-duotone fa-folders"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  
                <div className="col-md-6 col-xl-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="me-3">
                          <div className="text-muted small">Total Intents</div>
                          <div className="text-large">{overal.intents}</div>
                        </div>
                        <div className="position-relative">
                          <i className="fa-duotone fa-chart-network"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  
                <div className="col-md-6 col-xl-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="me-3">
                          <div className="text-muted small">Total Utterances</div>
                          <div className="text-large">{overal.utterances}</div>
                        </div>
                        <div className="position-relative">
                          <i className="fa-duotone fa-messages-question"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  
                <div className="col-md-6 col-xl-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="me-3">
                          <div className="text-muted small">Total Answers</div>
                          <div className="text-large">{overal.answers}</div>
                        </div>
                        <div className="position-relative">
                          <i className="fa-duotone fa-message-dots"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>    
              </div>
            <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
}