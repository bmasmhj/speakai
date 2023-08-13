import Nav from "../models/Nav";
import TopNav from "../models/TopNav";
import Footer from "../models/Footer";
import { useState, useEffect } from "react";
import Instance from "../../axios";
import { useNotification } from "../hook/useNotification";
import Swal from "sweetalert2";
export default function Domain() {
  const { showNotificationMessage } = useNotification();
  const [traineddomain, setTrainedDomain] = useState([]);
  const [domain, setdomains] = useState('');
  const adddomain = (e) => {
    e.preventDefault();
    if(domain.trim() === ''){
      document.getElementById('domainname').classList.add('is-invalid');
      return false;
    }
    Instance.post('/bot/adddomain', {
      name : domain
    }).then((response) => {
      if(response.data.status === "success"){
        getDomains();
        showNotificationMessage("Domain Added Successfully");
        setdomains('');
      }
    }
    )
  }

  useEffect(() => {
    getDomains();
  }, [] );
  function getDomains(){
    Instance.get('/bot/domains').then((response) => {
      setTrainedDomain(response.data);
    })
  }
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
        Instance.post('/bot/deletedomain/'+e, {
        }).then((response) => {
          if(response.data.status === "success"){
            getDomains();
            showNotificationMessage("Domain Removed Successfully");
          }
        });
      }
    });
  }
  const handleDomainChange = (event) => {
    setdomains(event.target.value);
    event.target.classList.remove('is-invalid');
  };
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
                    <label htmlFor="domainname">Domain</label>
                        <div className="input-group">
                          <input type="text" value={domain} onChange={(e) => handleDomainChange(e)} className="form-control" id="domainname" placeholder="Domain  eg : agent" aria-describedby="inputGroupPrepend" required />
                          <button type="button" onClick={(e)=>adddomain(e)} className="btn btn-info">Add</button>
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
                          traineddomain.map((trained) => {
                              return (
                                <tr key={`trainedid_`+trained.id}>
                                  <td className="p-2">{trained.name}</td>
                                  <td className="p-2">
                                    <i className="cursor-pointer fa-duotone fa-trash text-danger" onClick={()=>deletethisitem(trained.id)}> </i>
                                  </td>
                                </tr>
                              )
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


