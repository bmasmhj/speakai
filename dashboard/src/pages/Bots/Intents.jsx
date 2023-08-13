import Nav from "../models/Nav";
import TopNav from "../models/TopNav";
import Footer from "../models/Footer";
import React, { useState, useEffect } from "react";
import Instance from "../../axios";
import { useNotification } from "../hook/useNotification";
import Swal from "sweetalert2";
export default function Intents() {
  const { showNotificationMessage } = useNotification();
  const [traineddomain, setTrainedDomain] = useState([]);
  const [trainedintent, setTrainedIntents] = useState([]);
  function deletethisitem(e) {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove all the issue related to this domain , You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-info ms-1",
      },
      buttonsStyling: false,
    }).then((result) => {
      if(result.isConfirmed){
        Instance.post('/bot/deleteintent/'+e, {
        }).then((response) => {
          if(response.data.status === "success"){
            getDomains();
            getIntents();
            showNotificationMessage("Domain Removed Successfully");
          }
        });
      }
    });
  }
  function getDomains(){
    Instance.get('/bot/domains').then((response) => {
      setTrainedDomain(response.data);
    })
  }
  function getIntents(){
    Instance.get('/bot/intents').then((response) => {
      setTrainedIntents(response.data);
    })
  }
  useEffect(() => {
    getDomains();
    getIntents();
  }, [] );
  const [intent, setintents] = useState('');
  const [domain, setDomain] = useState('');
  const addintent = () => {
    if(domain.trim() === ''){
      document.getElementById('domainname').classList.add('is-invalid');
      return false;
    }
    if(intent.trim() === ''){
      document.getElementById('intentname').classList.add('is-invalid');
      return false;
    }
    Instance.post('/bot/addintents', {
      domain_id : domain,
      intent_name : intent
    }).then((response) => {
      if(response.data.status === "success"){
        getIntents();
        showNotificationMessage("Intent Added Successfully")
        setintents('');
        setDomain('');
    }
  })
  }
  return (
      <>   
      <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Nav />
        <div className="layout-page">
            <TopNav />  
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className=" card shadow-none mx-3 bg-transparent ">
              <div className="row">
                <div className="col-12">
                  <div className="card p-4">
                    <div className="input-group">
                      <select value={domain} onChange={(e) => { setDomain(e.target.value); e.target.classList.remove('is-invalid') }} className="form-select" id="domainname"  placeholder="Domain  eg : agent" aria-describedby="inputGroupPrepend"   required  >
                          <option value="" disabled>Select Domain</option>
                            {
                              traineddomain.map((trained) => {
                                  return (
                                    <option key={`option${trained.id}`} value={trained.id}>{trained.name}</option>
                                  )
                              })
                            }
                      </select>
                      <input type="text"  className="form-control" id="intentname"  placeholder="Intent  eg : happy" aria-describedby="inputGroupPrepend" required value={intent} onChange={(event) => { setintents(event.target.value); event.target.classList.remove('is-invalid') }} />
                      <button onClick={()=>addintent()} className="btn btn-info">Add</button>

                    </div>
                    <div className="table-responsive p-3">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="p-2">Name</th>
                            <th className="p-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            trainedintent.map((trintent) => {
                              const intents_tr = JSON.parse(trintent.intent);
                              return  <React.Fragment key={`intents${trintent.id}`}>
                                <tr>
                                  <td colSpan={2} className="p-2 bg-success text-white">{trintent.domain_name}</td>
                                </tr>
                                {
                                  intents_tr.map((trained_intent)=>{
                                    return <tr key={trained_intent.id}>
                                    <td  className="p-2">{trained_intent.intent}</td>
                                    <td onClick={()=>deletethisitem(trained_intent.id)}>Delete</td>
                                  </tr>
                                  })
                                }
                              </React.Fragment>
                            })
                          }
                        </tbody>
                      </table>
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
    </>
  );
}

