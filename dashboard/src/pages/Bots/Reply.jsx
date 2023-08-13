import { useEffect, useState } from "react";
import Footer from "../models/Footer";
import Nav from "../models/Nav";
import TopNav from "../models/TopNav";
import Instance from "../../axios";
import { socket } from "../Dashboard/socket";

import { useParams } from "react-router-dom";
export default function ReplyMessage(){

    const [messages , setMessages] = useState([]);
    const [replies , setReplies] = useState([]);
    const [user_id , setUserId] = useState('');
    const { id } = useParams();

    
    useEffect(() => {
       if(id){
        allchats(id);
        setUserId(id);
       }
    }, [id]);

    function allchats(user_id){
        Instance.get('/bot/chat/'+user_id).then((response) => {
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
    const handleChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        setReplies(value);
    }
    function sendmessage(){
       if(replies.length > 0 && replies.trim() !== '' && user_id.length > 0 && user_id.trim() !== ''){
            socket.emit("send-admin-message", {
                message : replies, 
                user_id : user_id,
                type : 'incoming'
            });
            messages.push({
                message : replies,
                user_id : user_id,
                type : 'incoming'
            });
            setMessages(messages);
            setReplies('');
            document.getElementById('message').value = '';
            setTimeout(() => {
                scrollToBottom();
            }, 500);
        }
    }

    useEffect(() => {
      
    }, []);
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
                                    <h5 className="card-title">{id}</h5>
                                </div>
                                <div className="card-body messagebox" style={{
                                    height: '65vh',
                                    overflowY: 'auto'
                                }}>
                                    { 
                                        messages.length > 0 ?
                                        (
                                            messages.map((message) => {
                                                // var extract last 6 character from message.user_id
                                                var last6 = message.user_id.substr(message.user_id.length - 6);
                                                return <div key={message.id} className={message.type}>
                                                <div>
                                                    <small>{user_id}</small>
                                                    <p
                                                        style={{
                                                            backgroundColor: message.type === 'outgoing' ? `#${last6}` : '#f1f1f1',
                                                            color: message.type === 'incoming' ? `#${last6}` : '#f1f1f1',
                                                        }}
                                                        dangerouslySetInnerHTML={{ __html: message.message }} 
                                                    ></p>
                                                </div>
                                            </div> 
                                            })
                                        ):(
                                            <>No Messages</>
                                        )
                                    }
                                </div>
                                <div className="card-footer">
                                    <div className="input-group">
                                        <textarea id="message" onChange={handleChange} type="text" rows="1" cols="1" defaultValue={replies} name="replies" class="form-control message-input" placeholder="Type a message here..." autoComplete="off"></textarea>
                                        <button onClick={()=>sendmessage()} className="btn btn-success" type="button"><i className="fa-duotone fa-paper-plane-top text-white"></i></button>
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
    )
}