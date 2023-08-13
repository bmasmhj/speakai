import { useEffect, useState } from "react";
import Footer from "../models/Footer";
import Nav from "../models/Nav";
import TopNav from "../models/TopNav";
import Instance from "../../axios";
import Swal from "sweetalert2";
export default function Users() {
    const [ loading , setLoading ] = useState(false);
    const [ users , setUsers ] = useState([]);
    function getusers(){
        Instance.get('/user').then((res) => {
            setUsers(res.data);
        })
    }

    useEffect(() => {
        getusers();
    }, [])

    function deleteUser(id){
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete this user?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
            }).then((result) => {
                if(result.isConfirmed){
                    Instance.post('/user/deleteuser/'+id).then((res) => {
                        getusers();
                        if(res.data.affectedRows == 1 ){
                            Swal.fire(
                                'Deleted!',
                                'User has been deleted.',
                                'success'
                            )
                        }
                    })
                }else{
                    Swal.fire(
                        'Cancelled',
                        'User is safe :)',
                        'error'
                    )
                }
        })
    }

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
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Users</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="card-title">Users</h5>
                            </div>  
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => {
                                                return <tr key={user.id}>
                                                    <td>{user.access_name}</td>
                                                    <td>{user.access_email}</td>
                                                    <td>{
                                                        user.code == 0 ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span> 
                                                    }</td>
                                                    <td><i
                                                        onClick={
                                                            () => deleteUser(user.id)
                                                        }
                                                    className="cursor-pointer fa-duotone fa-trash text-danger"></i></td>
                                                </tr>
                                            })}
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
}