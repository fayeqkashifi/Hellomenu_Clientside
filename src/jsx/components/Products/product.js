import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import {Link} from "react-router-dom"
const Product = () => {
    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section


    const [productInsert, setProductInsert] = useState('');
    const handleInput = (e) => {
        e.persist();
        setProductInsert({...productInsert, [e.target.name]: e.target.value});
    };
    const saveProduct=  (e) => {
        e.preventDefault();
        axios.post("/api/InsertProducts", productInsert).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setProductInsert('');
                 swal("Success",res.data.message,"success");
                 setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
        
    };
    // edit code
    const [editProduct, setEditProduct] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditProduct({...editProduct, [e.target.name]: e.target.value});
    };
    const fetchProduct = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditProducts/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditProduct(res.data.product);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }

        });

    }
    const updateProduct =  (e) => {
        e.preventDefault();
        axios.post("/api/UpdateProduct", editProduct).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setEditProduct('');
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
        axios.get('/api/GetProducts').then(res => {
            if(res.data.status === 200){
                // console.log(res.data.fetchData);
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
      }, []);

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
                                {/* <img
                                    src={`http://localhost:8000/images/catagories/${item.PicturesLocation}`}
                                    className="d-block w-100"
                                    alt=""
                                /> */}
                            </div>
                            <h3 className="mt-4 mb-1"><Link to={{
                            pathname: `/variants/${item.id}`,
                            id:item.id,
                            ProductName:item.ProductName }} > {item.ProductName}</Link></h3>
                            <p className="text-muted"></p>
                            {/* <p className="text-muted">{item.SubCategoryName}</p> */}
                          
                           
                            </div>
                        </div>
        
                        <div className="card-footer pt-0 pb-0 text-center">
                            <div className="row">
                                <div className="col-4 pt-3 pb-3 border-right">
                                    <Link
                                        to=""
                                         onClick={(e)=>fetchProduct(e,item.id)}
                                    >
                                        <span>Edit</span>
                                    </Link>
                                </div>
                                <div className="col-4 pt-3 pb-3 border-right">
                                    <Link
                                        to=""
                                        onClick={(e)=>deleteProduct(e,item.id)}
                                    >
                                        <span>Delete</span>
                                    </Link>
                                </div>
                                <div className="col-4 pt-3 pb-3">
                                    <Link
                                         to={{
                                            pathname: `/variants/${item.id}`,
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
    const deleteProduct= (e,id)=>{
        e.preventDefault();
        axios.delete(`/api/DeleteProducts/${id}`).then(res=>{
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
         <PageTItle headingPara="Product" activeMenu="add-Product" motherMenu="Products" />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={saveProduct} method= "POST" >
                <Modal.Header>
                    <Modal.Title>Add A Product</Modal.Title>
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
                            <label className="mb-1 "> <strong>Product Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Product Name"
                                name="ProductName"
                                required
                                onChange={handleInput}  
                                value={productInsert.ProductName}
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
            <Form onSubmit={updateProduct} method= "POST" >
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
                        <div className="form-group">
                            <label className="mb-1 "> <strong>ID</strong> </label>
                            <input
                                type="text"
                                disabled="disabled"
                                className="form-control"
                                name="id"
                                required
                                onChange={editHandleInput}  
                                value={editProduct.id}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>Product Name</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Product Name"
                                name="ProductName"
                                required
                                onChange={editHandleInput}  
                                value={editProduct.ProductName}
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
							<h4 className="card-title mb-2">Products</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								Add Product
							</Button>
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

export default Product;
