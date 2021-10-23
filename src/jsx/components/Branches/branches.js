import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import {Link} from "react-router-dom"
import axios from "axios";
import swal from "sweetalert"
const Branches = () => {
    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a branch
    const [branchstate, setBranchstate] = useState({
        BrancheName: '',
    });
    const handleInput = (e) => {
        e.preventDefault();
        setBranchstate({...branchstate, [e.target.name]: e.target.value});
    };
    const saveBranch =  (e) => {
        e.preventDefault();
        const data={
            BrancheName:branchstate.BrancheName
        }
        axios.post("/api/InsertBranches", data).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setBranchstate({
                    BrancheName: '',
                 });
                 swal("Success",res.data.message,"success");
                 setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
        
    };
    // edit code
    const [editBranchstate, setEditBranchstate] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditBranchstate({...editBranchstate, [e.target.name]: e.target.value});
    };
    const editBranch = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditBranches/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditBranchstate(res.data.branch);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }

        });

    }
    const updateBranch =  (e) => {
        e.preventDefault();
        
        axios.post("/api/UpdateBranches", editBranchstate).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setEditBranchstate('');
                swal("Success",res.data.message,"success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }
        });
        
    };
    





    //for retriving data using laravel API
    const [branchdata,setBranchdata]=useState([]);
    const [loading, setLoading]=useState(true);
    
    useEffect( () => {
        axios.get('/api/GetBranches').then(res => {
            if(res.data.status === 200){
            setBranchdata(res.data.branches);
            }
            setLoading(false);
          });
      }, []);

    var viewBranches_HTMLTABLE = "";
    if(loading){
        return <h4>Loading...!</h4>
    }else{
        viewBranches_HTMLTABLE = 
        branchdata.map((item)=>{
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                    <Link to={{
                        pathname: '/menu',
                        id:item.id,
                        branchName:item.BrancheName }} > {item.BrancheName}</Link></td>
                    <td>
                        <button type="button"   onClick={(e)=>editBranch(e,item.id)} className="btn btn-outline-danger btn-sm">Edit</button>&nbsp;&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>deleteBranch(e,item.id)} className="btn btn-outline-warning btn-sm">Delete</button>
                    </td> 
                </tr>
            )
        })

    }
    // delete branch 
    const deleteBranch= (e,id)=>{
        e.preventDefault();
        axios.delete(`/api/DeleteBranches/${id}`).then(res=>{
            if(res.data.status === 200){
                swal("Success",res.data.message,"success");
                // thisClicked.closest("tr").remove();
            }else if(res.data.status === 404){
                swal("Success",res.data.message,"success");
            }
        });

    }
    
    return (
      <Fragment>
         <PageTItle headingPara="Branches" activeMenu="add-branch" motherMenu="Branch" />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={saveBranch} method= "POST" >
                <Modal.Header>
                    <Modal.Title>Add A Branch</Modal.Title>
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
                            <label className="mb-1 "> <strong>Branch Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Branch Name"
                                name="BrancheName"
                                required
                                onChange={handleInput}  
                                value={branchstate.BrancheName}
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
            <Form onSubmit={updateBranch} method= "POST" >
                <Modal.Header>
                    <Modal.Title>Edit Branch</Modal.Title>
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
                                placeholder="Branch Name"
                                name="id"
                                required
                                onChange={editHandleInput}  
                                value={editBranchstate.id}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Branch Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Branch Name"
                                name="BrancheName"
                                required
                                onChange={editHandleInput}  
                                value={editBranchstate.BrancheName}
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
							<h4 className="card-title mb-2">Branches</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								Add
							</Button>
						</div>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Branch Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
								<tbody>
                                    {viewBranches_HTMLTABLE}
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

export default Branches;
