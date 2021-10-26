import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
const SubCategory = (props) => {
    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section
    const [subCategoryInsert, setSubCategoryInsert] = useState({
        SubCategoryName: '',
        CategoryID: props.location.id
    });
    const handleInput = (e) => {
        e.persist();
        setSubCategoryInsert({...subCategoryInsert, [e.target.name]: e.target.value});
    };
   
    const saveSubMenu=  (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('SubCategoryName', subCategoryInsert.SubCategoryName);
        formData.append('CategoryID', subCategoryInsert.CategoryID);
        axios.post("/api/InsertSubCategories", formData).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setSubCategoryInsert({
                    SubCategoryName: '',
                    CategoryID: props.location.id
                });
                swal("Success",res.data.message,"success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
    };
    // edit code
    const [editSubMenu, setEditSubMenu] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditSubMenu({...editSubMenu, [e.target.name]: e.target.value});
    };
    const fetchSubMenus = (e,id)=>{
        e.preventDefault();
      
        axios.get(`/api/EditSubCategories/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditSubMenu(res.data.menu);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }

        });

    }
    const updateSubMenu =  (e) => {
        e.preventDefault();
        axios.post("/api/UpdateSubCategory", editSubMenu).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setEditSubMenu('');
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
        axios.get(`/api/GetSubCategories/${props.location.id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
      }, [props.location.id]);

    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>Loading...!</h4>
    }else{
        viewProducts_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <tr key={item.id}>
                    <td>{i+1}</td>
                   
                    <td> {item.SubCategoryName}</td>
                    <td>
                        <button type="button"   onClick={(e)=>fetchSubMenus(e,item.id)} className="btn btn-outline-info btn-xxs ml-1">Edit</button>&nbsp;&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>deleteSubMenu(e,item.id)} className="btn btn-outline-danger btn-xxs ml-1">Delete</button>
                    </td> 
                </tr>
            )
        })

    }
    // delete section 
    const deleteSubMenu= (e,id)=>{
        e.preventDefault();
        axios.delete(`/api/DeleteSubCategories/${id}`).then(res=>{
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
         <PageTItle headingPara="Sub-Category" activeMenu="add-sub-Category" motherMenu="Sub Categories" />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={saveSubMenu} method= "POST" encType="multipart/form-data">
                <Modal.Header>
                    <Modal.Title>Add A Sub Category</Modal.Title>
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
                            <label className="mb-1 "> <strong>Category Name: {props.location.CategoryName}</strong> </label>
                        </div>
                        
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Sub Category Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Sub Category Name"
                                name="SubCategoryName"
                                required
                                onChange={handleInput}  
                                value={subCategoryInsert.SubCategoryName}
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
            <Form onSubmit={updateSubMenu} method= "POST" >
                <Modal.Header>
                    <Modal.Title>Edit Sub-Category</Modal.Title>
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
                            <label className="mb-1 "> <strong>Sub Category Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="CategoryName"
                                name="SubCategoryName"
                                required
                                onChange={editHandleInput}  
                                value={editSubMenu.SubCategoryName}
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
							<h4 className="card-title mb-2">Sub Categories</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								Add Sub-Category
							</Button>
						</div>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <tr>
                                        <th>#NO</th>
                                        <th>Sub Category Name</th>
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

export default SubCategory;
