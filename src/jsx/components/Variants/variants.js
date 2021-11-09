import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import {Link} from "react-router-dom"
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const Variants = (props) => {
    // validation
    const schema = yup.object().shape({
        variant_name: yup.string().required("This field is a required field"),
        Buyingquantity: yup.number().positive().integer().required().typeError('You must specify a number'),
        buyingPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        sellingPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        Description: yup.string().required("This field is a required field"),
        Advice: yup.string().required("This field is a required field"),
        CurrentPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        OldPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        UnitID: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
    });
    // for localization
    const { t } = useTranslation();
    const id =props.match.params.id;
    

    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section
    const [modalCentered, setModalCentered] = useState(false);

    const[barchid, setBranchId]=useState(0);
   
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
        branch_id: barchid
    });
    const handleInput = (e) => {
        e.persist();
        setVariantInsert({...variantInsert, [e.target.name]: e.target.value});
    };
    // insert
    const saveInventory=  (e) => {
        // e.preventDefault();
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
        formData.append('branch_id', barchid);
        // console.log(formData);
        axios.post(`/api/InsertInventory/${id}`, formData).then(res=>{
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
                    branch_id: barchid
                });
                reset();
                swal("Success",res.data.message,"success");
                setModalCentered(false)
                setSelectedFiles([]);
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
    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [loading, setLoading]=useState(true);
    const [unitData,setUnitData]=useState([]);
    // const [unitData,setUnitData]=useState([]);
    useEffect( () => {
        axios.get(`/api/Getvariations/${id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
                // console.log(fetchData);
            }
            setLoading(false);
          });
          axios.get(`/api/GetUnitsAll/${id}`).then(res => {
            if(res.data.status === 200){
                setBranchId(res.data.fetchData[0].branchID);
                setUnitData(res.data.fetchData);
            }
          });
       
      }, [id,variantInsert,editVariant]);
    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>{t('loading')}</h4>
    }else{
        viewProducts_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <div className="col-xl-4 col-lg-6 col-sm-6" key={i}>
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
                                <div className="col-6 pt-3 pb-3 border-right">
                                    <Link
                                         onClick={(e)=>fetchVariant(e,item.variantID)}
                                    >
                                        <span>{t('edit')}</span>
                                    </Link>
                                </div>
                                <div className="col-6 pt-3 pb-3">
                                    <Link
                                        onClick={(e)=>deleteVariant(e,item.variantID)}
                                    >
                                        <span>{t('delete')}</span>
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
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: [t('cancel'), t('confirm')],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                axios.delete(`/api/Deletevariations/${id}`).then(res=>{
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
                            branch_id: id
                        });
                        swal("Success",res.data.message,"success");
                        // thisClicked.closest("tr").remove();
                    }else if(res.data.status === 404){
                        swal("Error",res.data.message,"error");
                    }
                });
               
            } else {
              swal("Your Data is safe now!");
            }
          });
        

    }
    return (
      <Fragment>
         <PageTItle headingPara={t('variants')} activeMenu={t('variant_list')} motherMenu={t('variants')} />
         {/* <!-- Insert  Modal --> */}
        <Modal className="fade bd-example-modal-lg" show={modalCentered} size="lg">
            <Form onSubmit={handleSubmit(saveInventory)} method= "POST" encType="multipart/form-data">
                <Modal.Header>
                    <Modal.Title>{t('add_to_inventory')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('branch_name')}: {props.location.branchName}</strong> </label>
                        </div>
                        <div className="row" >
                            {/* <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('product_name')}</strong> </label>
                                    <select type="text"
                                        className="form-control"
                                        placeholder="ProductName"
                                        name="ProductName"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.ProductName}>
                                        <option value=''>{t('select_a_product')}</option> )
                                        {
                                        products.map( (item) => 
                                        <option value={item.id} key={item.id}>{item.ProductName}</option> )
                                    }</select>
                                </div>
                            </div> */}
                            {/* <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong></strong> </label>
                                    <select type="text"
                                        className="form-control"
                                        placeholder="sub_categoryID"
                                        name="sub_categoryID"
                                        required
                                        onChange={handleInput}  
                                        value={variantInsert.sub_categoryID}>
                                        <option value="">{t('select_subCategory')}</option> )
                                        
                                        {
                                        subCategoryData.map( (item) => 
                                        <option value={item.id} key={item.id}>{item.SubCategoryName}</option> )
                                    }</select>
                                </div>
                            </div> */}
                            
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('variant_name')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("variant_name")}
                                        className="form-control"
                                        placeholder={t('variant_name')}
                                        name="variant_name"
                                        onChange={handleInput}  
                                        value={variantInsert.variant_name}
                                    />
                                     <div className="text-danger">
                                        {errors.variant_name?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('buying_quantity')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("Buyingquantity")}
                                        className="form-control"
                                        placeholder={t('buying_quantity')}
                                        name="Buyingquantity"
                                        onChange={handleInput}  
                                        value={variantInsert.Buyingquantity}
                                    />
                                    <div className="text-danger">
                                        {errors.Buyingquantity?.message}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('buying_price')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("buyingPrice")}
                                        className="form-control"
                                        placeholder={t('buying_price')}
                                        name="buyingPrice"
                                        onChange={handleInput}  
                                        value={variantInsert.buyingPrice}
                                    />
                                    <div className="text-danger">
                                        {errors.buyingPrice?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('selling_price')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("sellingPrice")}
                                        className="form-control"
                                        placeholder={t('selling_price')}
                                        name="sellingPrice"
                                        onChange={handleInput}  
                                        value={variantInsert.sellingPrice}
                                    />
                                    <div className="text-danger">
                                        {errors.sellingPrice?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('description')}</strong> </label>
                                    <textarea
                                        type="text"
                                        {...register("Description")}
                                        className="form-control"
                                        placeholder={t('description')}
                                        name="Description"
                                        onChange={handleInput}  
                                        value={variantInsert.Description}
                                    />
                                    <div className="text-danger">
                                        {errors.Description?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('advice')}</strong> </label>
                                    <textarea
                                        type="text"
                                        {...register("Advice")}
                                        className="form-control"
                                        placeholder={t('advice')}
                                        name="Advice"
                                        onChange={handleInput}  
                                        value={variantInsert.Advice}
                                    />
                                    <div className="text-danger">
                                        {errors.Advice?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('current_price')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("CurrentPrice")}

                                        className="form-control"
                                        placeholder={t('current_price')}
                                        name="CurrentPrice"
                                        onChange={handleInput}  
                                        value={variantInsert.CurrentPrice}
                                    />
                                    <div className="text-danger">
                                        {errors.CurrentPrice?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('old_price')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("OldPrice")}
                                        className="form-control"
                                        placeholder={t('old_price')}
                                        name="OldPrice"
                                        onChange={handleInput}  
                                        value={variantInsert.OldPrice}
                                    />
                                    <div className="text-danger">
                                        {errors.OldPrice?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('unit')}</strong> </label>
                                    <select type="text"
                                        {...register("UnitID")}

                                        className="form-control"
                                        placeholder="UnitID"
                                        name="UnitID"
                                        onChange={handleInput}  
                                        value={variantInsert.UnitID}>
                                        <option value="">{t('select_a_unit')}</option> )
                                        {
                                        unitData.map( (item) => 
                                        <option value={item.id} key={item.id}>{item.UnitName}</option> )
                                    }</select>
                                     <div className="text-danger">
                                        {errors.UnitID?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">

                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('images')}</strong> </label>
                                    {/* <div class="file-loading"> */}
                                        <input 
                                        type="file" 
                                        name="file"
                                        className="form-control"
                                        onChange={handleImageChange}  
                                        multiple 
                                        required
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
                       {t('close')} 
                    </Button>
                    <Button variant="primary" type="submit"> {t('save')} </Button>

                </Modal.Footer>
            </Form>
        </Modal>
         {/* Edit Modal */}
         <Modal className="fade bd-example-modal-lg" show={editmodalCentered} size="lg"> 
            <Form onSubmit={updateVariant} method= "POST" >
                <Modal.Header>
                    <Modal.Title>{t('edit_variant')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('id')}</strong> </label>
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
                            <label className="mb-1 "> <strong>{t('variant_name')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('variant_name')}
                                name="VariationName"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.VariationName}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('unit')}</strong> </label>
                            <select type="text"
                                className="form-control"
                                placeholder={t('unit')}
                                name="UnitID"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.UnitID}>
                                <option value={editVariant.UnitID}>selected</option> )
                                {
                                unitData.map( (item) => 
                                <option value={item.id} key={item.id}>{item.UnitName}</option> )
                            }</select>
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('description')}</strong> </label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder={t('description')}
                                name="Description"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.Description}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('advice')}</strong> </label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder={t('advice')}
                                name="Advice"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.Advice}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('current_price')} </strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('current_price')} 
                                name="CurrentPrice"
                                required
                                onChange={editHandleInput}  
                                value={editVariant.CurrentPrice}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">

                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('old_price')} </strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('old_price')}
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
                        {t('close')}
                    </Button>
                    <Button variant="primary" type="submit">{t('update')} </Button>

                </Modal.Footer>
            </Form>
        </Modal>
         <div className="row" >
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
				<div className="card">
					<div className="card-header border-0">
						<div>
							<h4 className="card-title mb-2">{t('variant_list')}</h4>
						</div>
						<div className="dropdown">
                            <div className="dropdown">
                                <Button 
                                variant="primary"
                                type="button"
                                className="mb-2 mr-2"
                                onClick={() => setModalCentered(true)} >
                                    {t('add_variant')}
                                </Button>
                            </div>
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
