import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import {Link } from "react-router-dom"
import axios from "axios";
import swal from "sweetalert"
const Gallery = (props) => {
    const [modalCentered, setModalCentered] = useState(false);
    
    
    // let { id } = useParams();
    const id =props.match.params.id;
    
    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [loading, setLoading]=useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageState, setImageState] = useState([]);
    useEffect( () => {
        axios.get(`/api/GetPictures/${id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
       
      }, [id]);

    var viewImages_HTMLTABLE = "";
    if(loading){
        return <h4>Loading...!</h4>
    }else{
        viewImages_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <div className="col-xl-4 col-lg-6 col-sm-6" key={item.id}>
                    <div className="card overflow-hidden">
                        {/* <div className="card-body"> */}
                            <div className="text-center">
                                <div className="profile-photo">
                                    <img
                                        src={`http://localhost:8000/images/variants_pics/${item.PicturesLocation}`}
                                        className="d-block w-100 img-thumbnail" 
                                        alt=""
                                    />
                                </div>
                            </div>
                        {/* </div> */}
        
                        <div className="card-footer pt-0 pb-0 text-center">
                            <div className="row">
                                
                                <div className="col-12 pt-3 pb-3">
                                    <Link
                                        onClick={(e)=>deletePicture(e,item.id)}
                                    >
                                        <span>Delete</span>
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
    const deletePicture= (e,id)=>{
        e.preventDefault();
        axios.delete(`/api/DeletePictures/${id}`).then(res=>{
            if(res.data.status === 200){
                swal("Success",res.data.message,"success");
                // thisClicked.closest("tr").remove();
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }
        });
    }
    // insert 
   
    
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

    const savePictures=  (e) => {
        e.preventDefault();
        // console.log(e.target[0].files);

        // var files = e.target[0].files;
        const formData = new FormData();
        for (let i = 0; i < imageState.image.length; i++) {
            formData.append("file[]", imageState.image[i]);
          }
        // formData.append('file', imageState.PicturesLocation	);
        
        formData.append('variantID', id);
        // console.log(formData);
        axios.post("/api/InsertPictures", formData).then(res=>{
            if(res.data.status === 200){
                swal("Success",res.data.message,"success");
                setModalCentered(false)
                setSelectedFiles([]);
            }
        });
    };

    return (
      <Fragment>
         <PageTItle headingPara="Inventory" activeMenu="add-variant" motherMenu="Inventories" />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade bd-example-modal-lg" show={modalCentered} size="lg">
            <Form onSubmit={savePictures} method= "POST" encType="multipart/form-data">
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
                        <div className="row" >
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
        <div className="row" >
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
				<div className="card">
					<div className="card-header border-0">
						<div>
							<h4 className="card-title mb-2">Images</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)}
                             >
								Add Image
							</Button>
						</div>
					</div>
				</div>
			</div>
         </div>
         <div className="row" >
            {viewImages_HTMLTABLE}
        </div>
      </Fragment>
   );
};

export default Gallery;
