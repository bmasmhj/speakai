import { useEffect, useState } from "react";
import Footer from "../models/Footer";
import Nav from "../models/Nav";
import TopNav from "../models/TopNav";
import Instance from "../../axios";
import { Link } from "react-router-dom";
export default function ChatbotMessages(){
    const [messages , setMessages] = useState([]);
    useEffect(() => {
        allchats();
    }, []);

    function allchats(){
        Instance.get('/bot/allchats').then((response) => {
            setMessages(response.data);
           setTimeout(() => {
            scrollToBottom();
           }, 1000);
        })
    }
    function scrollToBottom() {
        var objDiv = document.querySelector(".messagebox");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    
    return(
        <>
            <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Nav />
        <div className="layout-page">
            <TopNav />  
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">All Messages</h5>
                    </div>
                    <div className="card-body messagebox" style={{
                        height: '75vh',
                        overflowY: 'auto'
                    }}>
                          { 
                            messages.length > 0 ?
                             (
                                messages.map((message) => {
                                   if(message!=null && message!=undefined && message!='' && message.user_id!=null && message.user_id!=undefined && message.user_id!='' && message.message!=null && message.message!=undefined && message.message!=''){
                                            var last6 = message.user_id.substr(message.user_id.length - 6);
                                            return <div key={message.id} className={message.type}>
                                            <div>
                                                <small>{message.user_id}</small>
                                                <p
                                                    style={{
                                                        backgroundColor: message.type === 'outgoing' ? `#${last6}` : '#f1f1f1',
                                                        color: message.type === 'incoming' ? `#${last6}` : '#f1f1f1',

                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: message.message }} 
                                                ></p>
                                                {
                                                    message.type === 'outgoing' ? (
                                                        <Link to={`/reply/${message.user_id}`}>Reply</Link>
                                                    ) : (
                                                        <></>
                                                    )
                                                }
                                            </div>
                                        </div> 
                                   }
                                })
                             ):(
                                <> </>
                             )
}
                    </div>
                </div>
            </div>
           <Footer />
          </div>
        </div>
      </div>
    </div>
        </>
    )
}