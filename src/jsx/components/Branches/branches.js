import React, { Fragment,useState,useEffect } from "react";
import { Link } from "react-router-dom";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";

const Branches = () => {
   
    const [modalCentered, setModalCentered] = useState(false);
    const [branchstate, setBranchstate] = useState({
        BrancheName: '',
    });
    const handleInput = (e) => {
        setBranchstate({[e.target.name]: e.target.value});
    };
    const saveBranch = async (e) => {
        e.preventDefault();
        console.log(branchstate);
        const res = await axios.post("http://localhost/yesilik1/public/api/InsertBranches", branchstate);
        if(res.data.status === 200){
            branchstate({
                BrancheName: '',
             });
             this.props.history.push("/")
        }
    };
    //for retriving data using laravel API
   
    const [branchdata,setBranchdata]=useState({
        branches:[],
        loading:true,
    });
     useEffect(async () => {
        const res=  await axios.get('http://localhost/yesilik1/public/api/GetBranches');

        setBranchdata({
            branches: res.data.branches,
            loading:false,
        });

      });
    

    return (
      <Fragment>
         <PageTItle headingPara="Branches" activeMenu="add-branch" motherMenu="Branch" />
        {/* <!-- Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={saveBranch} method= "POST">
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
								add
							</Button>
							
						</div>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <th>
                                        ID
                                    </th>
                                    <th>
                                        Branch Name
                                    </th>
                                    <th>
                                        Actions
                                    </th>
                                </thead>
								<tbody>
                                {branchdata.branches.map((branch) => (
                                    <tr>
                                        <td >
                                            <h5>{branch.id}</h5>
                                        </td>
                                        <td>
                                            <h5>{branch.BrancheName}</h5>
                                        </td> 
                                        <td>
                                            <button type="button" class="btn btn-outline-danger btn-sm">Edit</button>&nbsp;&nbsp;&nbsp;
                                            <button type="button" class="btn btn-outline-warning btn-sm">Delete</button>
                                        </td> 
                                    </tr>	
                                   ))}											
							</tbody></table>
							
						</div>
					</div>
				</div>
			</div>
         </div>
      </Fragment>
   );
};

export default Branches;
