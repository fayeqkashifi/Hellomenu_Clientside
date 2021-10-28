import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import {Link} from "react-router-dom"
const Variants = (props) => {
    const id =props.match.params.id;

    // insert modal
    // const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section


   
    // edit code
    const [editVariant, setEditVariant] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditVariant({...editVariant, [e.target.name]: e.target.value});
    };
    
    const fetchVariant = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/Editvariations/${id}`).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.variant);
                setEditVariant(res.data.variant);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }

        });

    }
    const updateVariant =  (e) => {
        e.preventDefault();
        axios.post("/api/UpdateVariations", editVariant).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setEditVariant('');
                swal("Success",res.data.message,"success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }
        });
        
    };
    





    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [loading, setLoading]=useState(true);
    const [unitData,setUnitData]=useState([]);
    
    useEffect( () => {
        axios.get(`/api/Getvariations/${id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
                // console.log(fetchData);
            }
            setLoading(false);
          });
          axios.get(`/api/GetUnitsAll/${editVariant.UnitID}`).then(res => {
            if(res.data.status === 200){
                // console.log(editVariant.UnitID);
                setUnitData(res.data.fetchData);
            }
          });
      }, [id]);

    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>Loading...!</h4>
    }else{
        viewProducts_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <div className="col-xl-4 col-lg-6 col-sm-6" key={item.id}>
                    <div className="card overflow-hidden">
                        <div className="card-body">
                            <div className="text-center">
                            <div className="profile-photo">
                                <img
                                    src={`http://localhost:8000/images/variants_pics/${item.PicturesLocation}`}
                                    className="d-block w-100"
                                    alt=""
                                />
                            </div>
                            <h3 className="mt-4 mb-1"><Link to={`/gallery/${item.variantID}`}> {item.VariationName}</Link></h3>
                            <p className="text-muted">{item.Description} </p>
                            {/* <p className="text-muted">{item.SubCategoryName}</p> */}
                          
                           
                            </div>
                        </div>
        
                        <div className="card-footer pt-0 pb-0 text-center">
                            <div className="row">
                                <div className="col-4 pt-3 pb-3 border-right">
                                    <Link
                                         onClick={(e)=>fetchVariant(e,item.variantID)}
                                    >
                                        <span>Edit</span>
                                    </Link>
                                </div>
                                <div className="col-4 pt-3 pb-3 border-right">
                                    <Link
                                        onClick={(e)=>deleteVariant(e,item.variantID)}
                                    >
                                        <span>Delete</span>
                                    </Link>
                                </div>
                                <div className="col-4 pt-3 pb-3">
                                    <Link
                                         to={{
                                            pathname: '/variants',
                                            id:item.id,
                                            ProductName:item.ProductName }}
                                    >
                                        <span>variants</span>
                                    </Link>
                                </div>
                            
                            
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

    }
    // delete section 
    const deleteVariant= (e,id)=>{
        e.preventDefault();
        axios.delete(`/api/Deletevariations/${id}`).then(res=>{
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
         <PageTItle headingPara="Variant" activeMenu="add-variant" motherMenu="Variants" />
         {/* Edit Modal */}
         <Modal className="fade bd-example-modal-lg" show={editmodalCentered} size="lg"> 
            <Form onSubmit={updateVariant} method= "POST" >
                <Modal.Header>
                    <Modal.Title>Edit Product</Modal.Title>
                    <Button
                        onClick={() => setEditModalCentered(false)}
                        variant=""
                        className="close"
                    >
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                <div className="row" >
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>ID</strong> </label>
                            <input
                                type="text"
                                disabled="disabled"
                                className="form-control"
                                name="id"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.id}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Variation Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Variation Name"
                                name="VariationName"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.VariationName}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Unit</strong> </label>
                            <select type="text"
                                className="form-control"
                                placeholder="UnitID"
                                name="UnitID"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.UnitID}>
                                <option value={editVariant.UnitID}>Selected</option> )
                                {
                                unitData.map( (item) => 
                                <option value={item.id} key={item.id}>{item.UnitName}</option> )
                            }</select>
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Description</strong> </label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder="Description"
                                name="Description"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.Description}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Advice</strong> </label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder="Advice"
                                name="Advice"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.Advice}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Current Price</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Current Price"
                                name="CurrentPrice"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.CurrentPrice}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">

                        <div className="form-group">
                            <label className="mb-1 "> <strong>Old Price</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Old Price"
                                name="OldPrice"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.OldPrice}
                            />
                        </div>
                    </div>

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
							<h4 className="card-title mb-2">Variants</h4>
						</div>
						<div className="dropdown">
							{/* <Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								Add Variant
							</Button> */}
						</div>
					</div>
					
				</div>
			</div>
         </div>
        <div className="row" >
            {viewProducts_HTMLTABLE}
        </div>
      </Fragment>
   );
};

export default Variants;
