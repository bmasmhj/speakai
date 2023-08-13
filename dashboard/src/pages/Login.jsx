import axios from "axios"
import { useState } from "react";
export default function Login() {
    const [ admin , setadmin ] = useState({
        email : "",
        password : ""
    });
    const login = () => {
        const statmsg = document.getElementById("stat_msgs");
        const user_email = document.getElementById("user_email")
        const user_password = document.getElementById("user_password")
        statmsg.innerHTML = "";
        statmsg.classList.remove("text-danger");
        statmsg.classList.remove("text-success");
        statmsg.innerHTML = "Logging in...";
        if(admin.email.trim() == "" || admin.password.trim() == ""){
            if(admin.email.trim() == ""){
                document.getElementById("user_email").classList.add("is-invalid");
            }
            if(admin.password.trim() == ""){
                document.getElementById("user_password").classList.add("is-invalid");
            }
            return false;
        }else{
            statmsg.innerHTML = "Verifying Username and Password.";
            axios.post( import.meta.env.VITE_API_URL+'/adminlogin', {
                username: admin.email,
                password: admin.password
            })
            .then(function (response) {
                if(response.data.status == "login_verified"){
                    statmsg.innerHTML = "Login Verified";
                    statmsg.classList.add("text-success");
                    user_email.classList.remove("is-invalid");
                    user_email.classList.remove("is-invalid");
                    user_email.classList.add("is-valid");
                    user_password.classList.add("is-valid");
                    localStorage.setItem("token", response.data.acess_token);
                    localStorage.setItem("user", response.data.user_id);
                    localStorage.setItem("admininfo" , JSON.stringify(response.data));
                    window.location.href = "/dashboard";
                }else{
                    showerr(response.data.status)
                }
            })
            .catch(function (error) {
                // console.log(error);
            });
        }
    }

    // track enter key pressed 
    window.addEventListener('keydown', function (e) {
        if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
            e.preventDefault();
            login();
        }
    }, true);

    function showerr(status){
        const statmsg = document.getElementById("stat_msgs")
        const user_email = document.getElementById("user_email")
        const user_password = document.getElementById("user_password")
        if(status == "unregistered"){
            statmsg.innerHTML = "Username not registered";
            statmsg.classList.add("text-danger");
            user_email.classList.add("is-invalid");
            user_password.classList.add("is-invalid");
        }else if(status == "password_incorrect"){
            statmsg.innerHTML = "Incorrect Password";
            statmsg.classList.add("text-danger");
            user_password.classList.add("is-invalid");
        }else if(status == "email_unverified"){
            statmsg.innerHTML = "Please verify your email";
            statmsg.classList.add("text-danger");
            user_email.classList.add("is-invalid");
            user_password.classList.add("is-invalid");
        }
    }

    const handleChange = (e) => {
        setadmin({
            ...admin,
            [e.target.name] : e.target.value
        })
        e.target.classList.remove("is-invalid");
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 offset-md-4 py-7">
                        <div className="card mt-5">
                            <div className="card-body">
                                <h3 className="text-center">Login</h3>
                                <p className="text-center" id="stat_msgs"></p>
                                <form>
                                    <div className="form-group mb-3">
                                        <label htmlFor="email">Username</label>
                                        <input type="text" id="user_email" className="form-control" name="email" value={admin.email} onChange={(e)=>handleChange(e)} placeholder="Enter Username" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password">Password</label>
                                        <input type="password"  id="user_password" className="form-control" name="password" value={admin.password} onChange={(e)=>handleChange(e)} placeholder="Enter Password" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <span className="btn btn-primary btn-block" onClick={()=>login()} >Login</span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
