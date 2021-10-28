import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
const Unit = (props) => {
    const id =props.match.params.id;
    
    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section
    const [unitInsert, setUnitInsert] = useState({
        UnitName: '',
        brancheID: id
    });
    const handleInput = (e) => {
        e.persist();
        setUnitInsert({...unitInsert, [e.target.name]: e.target.value});
    };
   
    const saveUnit=  (e) => {
        e.preventDefault();
        axios.post("/api/InsertUnits", unitInsert).then(res=>{
            if(res.data.status === 200){
                setUnitInsert({
                    UnitName: '',
                    brancheID: id
                });
                swal("Success",res.data.message,"success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
    };
    // edit code
    const [editUnit, setEditUnit] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditUnit({...editUnit, [e.target.name]: e.target.value});
    };
    const fetchUnit = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditUnits/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditUnit(res.data.unit);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }

        });

    }
    const updateUnit =  (e) => {
        e.preventDefault();
        axios.post("/api/UpdateUnit", editUnit).then(res=>{
            if(res.data.status === 200){
                setEditUnit('');
                swal("Success",res.data.message,"success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");

            }
        });
        
    };
    





    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [loading, setLoading]=useState(true);
    
    useEffect( () => {
        axios.get(`/api/GetUnits/${id}`).then(res => {
            if(res.data.status === 200){
                // console.log(res.data.fetchData);

                setFetchData(res.data.fetchData);

            }
            setLoading(false);
          });
      }, [id]);

    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>Loading...!</h4>
    }else{
        viewProducts_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <tr key={item.id}>
                    <td>{i+1}</td>
                   
                    <td> {item.UnitName}</td>
                    <td>
                        <button type="button"   onClick={(e)=>fetchUnit(e,item.id)} className="btn btn-outline-danger btn-sm">Edit</button>&nbsp;&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>deleteUnit(e,item.id)} className="btn btn-outline-warning btn-sm">Delete</button>
                    </td> 
                </tr>
            )
        })

    }
    // delete section 
    const deleteUnit= (e,id)=>{
        e.preventDefault();
        axios.delete(`/api/DeleteUnits/${id}`).then(res=>{
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
         <PageTItle headingPara="Unit" activeMenu="add-unit" motherMenu="Units" />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={saveUnit} method= "POST" encType="multipart/form-data">
                <Modal.Header>
                    <Modal.Title>Add A Unit</Modal.Title>
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
                            <label className="mb-1 "> <strong>Branch Name: {props.location.branchName}</strong> </label>
                        </div>
                        
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Unit Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Unit Name"
                                name="UnitName"
                                required
                                onChange={handleInput}  
                                value={unitInsert.UnitName}
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
                    <Button variant="primary" type="submit">Save</Button>

                </Modal.Footer>
            </Form>
        </Modal>
         {/* Edit Modal */}
         <Modal className="fade" show={editmodalCentered}>
            <Form onSubmit={updateUnit} method= "POST" >
                <Modal.Header>
                    <Modal.Title>Edit Unit</Modal.Title>
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
                            <label className="mb-1 "> <strong>Unit Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Service Area"
                                name="UnitName"
                                required
                                onChange={editHandleInput}  
                                value={editUnit.UnitName}
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
							<h4 className="card-title mb-2">Units</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								Add Unit
							</Button>
						</div>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <tr>
                                        <th>#NO</th>
                                        <th>Unit Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
								<tbody>
                                    {viewProducts_HTMLTABLE}
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

export default Unit;
