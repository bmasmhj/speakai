
import TrainedData from "./model/TrainedData";
import { useState, useEffect } from "react";
import TrainForm from "./model/TrainForm";
import Console from "./model/TrainingLog";
import Nav from "../models/Nav";
import TopNav from "../models/TopNav";
import Footer from "../models/Footer";
import Instance from "../../axios";

export default function Entity() {
    const [ refresh , setRefresh ] = useState(false);
    function onRefresh(){
        setRefresh(Math.random());
    }
    const [trainedintent, setintent] = useState([]);
    const [intentTitle, setintentTitle] = useState('Please select Intents');
    const [selectedDomain, setSelectedDomain] = useState('0');
    const [selectedIntent, setSelectedIntent] = useState('0');
    const handleSelectChange = (e) => {
        const {value } = e.target;
        setSelectedDomain(value.split('.')[0]);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const optionText = selectedOption.text;
        setintentTitle(optionText);    
        setSelectedIntent(value.split('.')[1]);
    };

    useEffect(() => {
        gettrainedintent();
        
    }, []);

    function gettrainedintent(){
        Instance.post('/bot/entities' ).then((response) => {
            setintent(response.data);
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
            <div className="bg-gray-100 main-content position-relative vh-100 ">
            <div className=" card shadow-none mx-3 bg-transparent ">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                            <label htmlFor=""> Select Intents</label>
                                <select  name=""  className="form-select mt-2"  value={`${selectedDomain}.${selectedIntent}`} onChange={handleSelectChange}>
                                    <option disabled value="0.0">Select an option</option>
                                    {
                                        trainedintent.map((intents) => {
                                            return intents.domain_name && intents.intent_name && (
                                            <option
                                                key={`domain${intents.domain_id}${intents.intent_id}`}
                                                value={`${intents.domain_id}.${intents.intent_id}`}
                                            >
                                                {intents.domain_name}.{intents.intent_name}
                                            </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="card-body">
                                <TrainForm 
                                refresh={refresh}
                                onRefresh={onRefresh}
                                name={intentTitle} domain={selectedDomain} intent={selectedIntent} />
                            </div>
                        </div>
                        <div className="card mt-3">
                            <div className="card-body">
                              
                                <Console
                                    name={intentTitle}
                                />
                            </div>
                        </div>
                    </div>
                        <TrainedData 
                        refresh={refresh}
                        onRefresh={onRefresh}
                        name={intentTitle} domain={selectedDomain} intent={selectedIntent} />
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


