import { useEffect, useState } from "react";
import Instance from "../../../axios";
export default function TrainedData({name , domain , intent , onRefresh , refresh }){
    const [trainedutterances, setutterances] = useState([]);
    const [trainedanswer, setanswer] = useState([]);


    useEffect(() => {
        if(name !== '' && domain !== 0 && intent !== 0){
            gettrained();
        }
    }, [name , domain , intent , refresh]);

    function gettrained(){
        const data = {
            domain_id : domain,
            intent_id : intent
        }
        Instance.post('/bot/trained',data).then((response) => {
            setutterances(response.data.utterances);
            setanswer(response.data.answers);
        }
        )
    }
    
    function delete_utterance(id){
        Instance.post('/bot/deleteutterance/'+id).then((response) => {
            if(response.data.status === "success"){
                gettrained();
                onRefresh();
            }
        })
    }
    function delete_answer(id){
        Instance.post('/bot/deleteanswer/'+id).then((response) => {
            if(response.data.status === "success"){
                gettrained();
                onRefresh();
            }
        })
    }
    
    return(
        <>
            <div className="col-md-6"> 
                <div className="card">
                    <div className="card-body">
                            <h5>Trained Data ( {name} )</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 p-0 m-0">
                                <h6 className="text-center">Utterance</h6>
                                <ul className="list-group border-radius-none">
                                        {
                                            trainedutterances && trainedutterances.map((utterance) => {
                                                    return (
                                                        <li
                                                            key = {`utterance_`+utterance.id}
                                                            className="list-group-item d-flex justify-content-between align-items-center">
                                                            <p className="p-0 m-0" dangerouslySetInnerHTML={{ __html: utterance.utterance }} />
                                                            <span className="cursor-pointer badge badge-danger bg-transparent  badge-pill"><i className="text-danger fa-duotone fa-trash" onClick={()=>delete_utterance(utterance.id)}></i></span>
                                                        </li>
                                                    )
                                                })
                                        }
                                </ul>
                            </div>
                            <div className="col-md-6 p-0 m-0">
                                <h6 className="text-center">Answer</h6>
                                <ul className="list-group border-radius-none">
                                        { 
                                            trainedanswer && trainedanswer.map((answer) => {
                                                if(answer.answer.includes("!----NEWLINE----!")){
                                                    var amswers = answer.answer.split("!----NEWLINE----!");
                                                    return (
                                                        <li
                                                            key={`answer_`+answer.id}   
                                                            className="list-group-item d-flex justify-content-between align-items-center">
                                                             <div>
                                                                {
                                                                    amswers.map((ans , indexans) => {
                                                                        return (
                                                                                <p  key={`subans_`+indexans} className="p-2 m-0 mb-2 form-control" dangerouslySetInnerHTML={{ __html: ans }} />
                                                                        )
                                                                    })
                                                                }
                                                             </div>

                                                            <span className="  badge badge-danger bg-transparent  badge-pill"><i className="cursor-pointer text-danger fa-duotone fa-trash" onClick={()=>delete_answer(answer.id)}></i></span>
                                                        </li>

                                                    )
                                                }
                                                else{
                                                    return (
                                                        <li
                                                            key={`answer_`+answer.id}
                                                            className="list-group-item d-flex justify-content-between align-items-center">
                                                            <p className="p-0 m-0" dangerouslySetInnerHTML={{ __html: answer.answer }} />
                                                            <span className="  badge badge-danger bg-transparent  badge-pill"><i className="cursor-pointer text-danger fa-duotone fa-trash" onClick={()=>delete_answer(answer.id)}></i></span>
                                                        </li>
                                                    )
                                                }
                                               
                                            })
                                        }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}