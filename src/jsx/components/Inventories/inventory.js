import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
const Inventory = (props) => {
    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section
    const [variantInsert, setVariantInsert] = useState({
        variant_name: '',
        // SellingQuantity: '',
        Buyingquantity: '',
        buyingPrice: '',
        sellingPrice: '',
        Description: '',
        Advice: '',
        CurrentPrice: '',
        OldPrice: '',
        UnitID: '',
        sub_categoryID:'',
        ProductName:'',
        branch_id: props.location.id
    });
    const handleInput = (e) => {
        e.persist();
        setVariantInsert({...variantInsert, [e.target.name]: e.target.value});
    };
    // edit code
    const [editIventory, setEditInventory] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditInventory({...editIventory, [e.target.name]: e.target.value});
    };
    const fetchUnit = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditInventory/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditInventory(res.data.intenvtory);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }
        });

    }
    const updateInventory =  (e) => {
        e.preventDefault();
        axios.post("/api/UpdateInventory", editIventory).then(res=>{
            if(res.data.status === 200){
                setEditInventory('');
                swal("Success",res.data.message,"success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");

            }
        });
        
    };

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageState, setImageState] = useState([]);

    const handleImageChange = (e) => {
        const imagesArray = [];
        for (let i = 0; i < e.target.files.length; i++) {      
            imagesArray.push(e.target.files[i]);
        }
        setImageState({...imageState, image : imagesArray });

        setSelectedFiles([]);
        if (e.target.files) {
        const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
        setSelectedFiles((prevImages) => prevImages.concat(filesArray));
        Array.from(e.target.files).map(
            (file) => URL.revokeObjectURL(file)
        );
        }
       
    };

    const renderPhotos = (source) => {
        return source.map((photo) => {
        return <img className="p-2" src={photo} alt="" key={photo} style={{ width: "100", height: "100px" }} />;
        });
    };

    const saveInventory=  (e) => {
        e.preventDefault();
        // console.log(e.target[0].files);

        // var files = e.target[0].files;
        const formData = new FormData();
        for (let i = 0; i < imageState.image.length; i++) {
            formData.append("file[]", imageState.image[i]);
          }
        // formData.append('file', imageState.PicturesLocation	);
        formData.append('variant_name', variantInsert.variant_name);
        formData.append('Buyingquantity', variantInsert.Buyingquantity);
        formData.append('buyingPrice', variantInsert.buyingPrice);
        formData.append('sellingPrice', variantInsert.sellingPrice);
        formData.append('Description', variantInsert.Description);
        formData.append('Advice', variantInsert.Advice);
        formData.append('CurrentPrice', variantInsert.CurrentPrice);
        formData.append('OldPrice', variantInsert.OldPrice);
        formData.append('UnitID', variantInsert.UnitID);
        formData.append('sub_categoryID', variantInsert.sub_categoryID);
        formData.append('ProductName', variantInsert.ProductName);
        formData.append('branch_id', variantInsert.branch_id);
        // console.log(formData);
        axios.post("/api/InsertInventory", formData).then(res=>{
            if(res.data.status === 200){
                setVariantInsert({
                    variant_name: '',
                    // SellingQuantity: '',
                    Buyingquantity: '',
                    buyingPrice: '',
                    sellingPrice: '',
                    Description: '',
                    Advice: '',
                    CurrentPrice: '',
                    OldPrice: '',
                    UnitID: '',
                    sub_categoryID:'',
                    branch_id: props.location.id
                });
                swal("Success",res.data.message,"success");
                setModalCentered(false)
                setSelectedFiles([]);
            }
        });
    };



    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [unitData,setUnitData]=useState([]);
    const [subCategoryData,setSubCategoryData]=useState([]);
    const [loading, setLoading]=useState(true);
    const [products, setProducts]=useState([]);
    
    useEffect( () => {
        axios.get(`/api/GetInventory/${props.location.id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
        axios.get(`/api/GetUnits/${props.location.id}`).then(res => {
            if(res.data.status === 200){
                setUnitData(res.data.fetchData);
            }
          });
        axios.get(`/api/GetAllSubCategories/`).then(res => {
            if(res.data.status === 200){
                setSubCategoryData(res.data.fetchData);
            }
          });
        axios.get('/api/GetProducts').then(res => {
            if(res.data.status === 200){
                setProducts(res.data.fetchData);
            }
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
                   
                    <td> {item.variant_name}</td>
                    <td> {item.Buyingquantity}</td>
                    <td> {item.SellingQuantity}</td>
                    <td> {item.buyingPrice}</td>
                    <td> {item.sellingPrice}</td>
                    <td> {item.purchase_sell}</td>
                    <td>
                        <button type="button"   onClick={(e)=>fetchUnit(e,item.id)} className="btn btn-outline-danger btn-sm">Edit</button>&nbsp;&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>deleteInventory(e,item.id)} className="btn btn-outline-warning btn-sm">Delete</button>
                    </td> 
                </tr>
            )
        })

    }
    // delete section 
    const deleteInventory= (e,id)=>{
        e.preventDefault();
        axios.delete(`/api/DeleteInventory/${id}`).then(res=>{
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
         <PageTItle headingPara="Inventory" activeMenu="add-variant" motherMenu="Inventories" />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade bd-example-modal-lg" show={modalCentered} size="lg">
            <Form onSubmit={saveInventory} method= "POST" encType="multipart/form-data">
                <Modal.Header>
                    <Modal.Title>Add To Inventory</Modal.Title>
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
                        <div className="row" >
                            <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Product Name</strong> </label>
                                    <select type="text"
                                        className="form-control"
                                        placeholder="ProductName"
                                        name="ProductName"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.ProductName}>
                                        <option value=''>Select A Product</option> )
                                        {
                                        products.map( (item) => 
                                        <option value={item.id} key={item.id}>{item.ProductName}</option> )
                                    }</select>
                                </div>
                            </div>
                            <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>sub Category</strong> </label>
                                    <select type="text"
                                        className="form-control"
                                        placeholder="sub_categoryID"
                                        name="sub_categoryID"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.sub_categoryID}>
                                        <option value="">Select SubCategory</option> )
                                        
                                        {
                                        subCategoryData.map( (item) => 
                                        <option value={item.id} key={item.id}>{item.SubCategoryName}</option> )
                                    }</select>
                                </div>
                            </div>
                            <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Unit</strong> </label>
                                    <select type="text"
                                        className="form-control"
                                        placeholder="UnitID"
                                        name="UnitID"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.UnitID}>
                                        <option value="">Select A Unit</option> )
                                        {
                                        unitData.map( (item) => 
                                        <option value={item.id} key={item.id}>{item.UnitName}</option> )
                                    }</select>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Variant Name</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Variant Name"
                                        name="variant_name"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.variant_name}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Buying Quantity</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buying Quantity"
                                        name="Buyingquantity"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.Buyingquantity}
                                    />
                                </div>
                            </div>
                            
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Buying Price</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buying Price"
                                        name="buyingPrice"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.buyingPrice}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Selling Price</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Selling Price"
                                        name="sellingPrice"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.sellingPrice}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Description</strong> </label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        placeholder="Buying Price"
                                        name="Description"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.Description}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Advice</strong> </label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        placeholder="Advice"
                                        name="Advice"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.Advice}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Current Price</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="CurrentPrice"
                                        name="CurrentPrice"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.CurrentPrice}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Old Price</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="OldPrice"
                                        name="OldPrice"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.OldPrice}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">

                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Images</strong> </label>
                                    {/* <div class="file-loading"> */}
                                        <input 
                                        type="file" 
                                        name="file"
                                        className="form-control"
                                        onChange={handleImageChange}  
                                        required
                                        multiple 
                                        data-overwrite-initial="false" 
                                        data-min-file-count="1" />
                                    </div>

                                {/* </div> */}
                            </div>
                            <div className="result">{renderPhotos(selectedFiles)}</div>

                            {/* <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Selling Quantity</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="SellingQuantity"
                                        name="SellingQuantity"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.SellingQuantity}
                                    />
                                </div>
                            </div> */}
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
         <Modal className="fade bd-example-modal-lg" show={editmodalCentered} size="lg">
            <Form onSubmit={updateInventory} method= "POST" >
                <Modal.Header>
                    <Modal.Title>Edit Inventory</Modal.Title>
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
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Variant Name</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Variant Name"
                                        name="variant_name"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.variant_name}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Buying Quantity</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buying Quantity"
                                        name="Buyingquantity"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.Buyingquantity}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                               
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Buying Price</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buying Price"
                                        name="buyingPrice"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.buyingPrice}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>Selling Price</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Selling Price"
                                        name="sellingPrice"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.sellingPrice}
                                    />
                                </div>
                            </div>
                            {/* <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>SellingQuantity</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="SellingQuantity"
                                        name="SellingQuantity"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.SellingQuantity}
                                    />
                                </div>
                            </div> */}
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
								Add Variant
							</Button>
						</div>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <tr>
                                        <th>#NO</th>
                                        <th>Variant Name</th>
                                        <th>Buying Quantity</th>
                                        <th>Selling Quantity</th>
                                        <th>Buying Price</th>
                                        <th>Selling Price</th>
                                        <th>Purchase Sell</th>
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

export default Inventory;
