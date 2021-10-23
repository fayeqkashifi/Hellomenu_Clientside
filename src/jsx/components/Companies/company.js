import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
const Company = () => {
    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert section
    const [companyState, setCompanyState] = useState('');
    const handleInput = (e) => {
        e.preventDefault();
        setCompanyState({...companyState, [e.target.name]: e.target.value});
    };
    const saveCompany =  (e) => {
        e.preventDefault();
        
        axios.post("/api/InsertCompanies", companyState).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setCompanyState('');
                 swal("Success",res.data.message,"success");
                 setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
        
    };
    // edit code
    const [editCompanystate, setEditCompanystate] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditCompanystate({...editCompanystate, [e.target.name]: e.target.value});
    };
    const editCompany = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditCompanies/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditCompanystate(res.data.company);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }

        });

    }
    const updateCompany =  (e) => {
        e.preventDefault();
        
        axios.post("/api/UpdateCompanies", editCompanystate).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setEditCompanystate('');
                swal("Success",res.data.message,"success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }
        });
        
    };
    

    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [loading, setLoading]=useState(true);
    
    useEffect( () => {
        axios.get('/api/GetCompanies').then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
      }, []);

    var viewCompanies_HTMLTABLE = "";
    if(loading){
        return <h4>Loading...!</h4>
    }else{
        viewCompanies_HTMLTABLE = 
        fetchData.map((item)=>{
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.company}</td>
                    <td>
                        <button type="button"   onClick={(e)=>editCompany(e,item.id)} className="btn btn-outline-danger btn-sm">Edit</button>&nbsp;&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>deleteCompany(e,item.id)} className="btn btn-outline-warning btn-sm">Delete</button>
                    </td> 
                </tr>
            )
        })

    }
    // delete section 
    const deleteCompany= (e,id)=>{
        e.preventDefault();
        axios.delete(`/api/DeleteCompanies/${id}`).then(res=>{
            if(res.data.status === 200){
                swal("Success",res.data.message,"success");
                // thisClicked.closest("tr").remove();
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }
        });

    }
    
    return (
      <Fragment>
         <PageTItle headingPara="Company" activeMenu="add-Company" motherMenu="Companies" />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={saveCompany} method= "POST" >
                <Modal.Header>
                    <Modal.Title>Add A Company</Modal.Title>
                    <Button
                        onClick={() => setModalCentered(false)}
                        variant=""
                        className="close"
                    >
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>User ID</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="User ID"
                                name="user_id"
                                required
                                disabled
                                onChange={handleInput}  
                                value={localStorage.getItem('auth_id')}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Company Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Company Name"
                                name="company"
                                required
                                onChange={handleInput}  
                                value={companyState.company}
                            />
                        </div>
                       
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setModalCentered(false)}
                        variant="danger light"
                    >
                        Close
                    </Button>
                    <Button variant="primary" type="submit">Save </Button>

                </Modal.Footer>
            </Form>
        </Modal>
         {/* Edit Modal */}
         <Modal className="fade" show={editmodalCentered}>
            <Form onSubmit={updateCompany} method= "POST" >
                <Modal.Header>
                    <Modal.Title>Edit Company</Modal.Title>
                    <Button
                        onClick={() => setEditModalCentered(false)}
                        variant=""
                        className="close"
                    >
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>ID</strong> </label>
                            <input
                                type="text"
                                disabled="disabled"
                                className="form-control"
                                placeholder="Company Name"
                                name="id"
                                required
                                onChange={editHandleInput}  
                                value={editCompanystate.id}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Company Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Company Name"
                                name="company"
                                required
                                onChange={editHandleInput}  
                                value={editCompanystate.company}
                            />
                        </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setEditModalCentered(false)}
                        variant="danger light"
                    >
                        Close
                    </Button>
                    <Button variant="primary" type="submit">Update </Button>

                </Modal.Footer>
            </Form>
        </Modal>
         <div className="row" >
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
				<div className="card">
					<div className="card-header border-0">
						<div>
							<h4 className="card-title mb-2">Companies</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								Add Company
							</Button>
						</div>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Company Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
								<tbody>
                                    {viewCompanies_HTMLTABLE}
							    </tbody>
                            </table>
						</div>
					</div>
				</div>
			</div>
         </div>
      </Fragment>
   );
};

export default Company;
