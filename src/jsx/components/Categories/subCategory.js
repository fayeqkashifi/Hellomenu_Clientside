import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";
import {Link} from "react-router-dom"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const SubCategory = (props) => {
    // validation
    const schema = yup.object().shape({
        SubCategoryName: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
    });
    // for localization
	const { t } = useTranslation();

    const id =props.match.params.id;

    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section
    const [subCategoryInsert, setSubCategoryInsert] = useState({
        SubCategoryName: '',
        CategoryID: id
    });
    const handleInput = (e) => {
        e.persist();
        setSubCategoryInsert({...subCategoryInsert, [e.target.name]: e.target.value});
    };
    const [imageState, setImageState] = useState([]);

    const handleImage = (e) => {
        setImageState({...imageState, SubCategoryIcon: e.target.files[0] });
    };
    const saveSubMenu=  (e) => {
        // e.preventDefault();
        const formData = new FormData();
        formData.append('SubCategoryName', subCategoryInsert.SubCategoryName);
        formData.append('CategoryID', subCategoryInsert.CategoryID);
        formData.append('SubCategoryIcon', imageState.SubCategoryIcon);
        axios.post("/api/InsertSubCategories", formData).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setSubCategoryInsert({
                    SubCategoryName: '',
                    CategoryID: id
                });
                reset();
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
        const formData = new FormData();
        formData.append('SubCategoryIcon', imageState.SubCategoryIcon);
        formData.append('SubCategoryName', editSubMenu.SubCategoryName);
        formData.append('CategoryID', editSubMenu.CategoryID);
        formData.append('id', editSubMenu.id);
        axios.post("/api/UpdateSubCategory", formData).then(res=>{
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
        axios.get(`/api/GetSubCategories/${id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
      }, [subCategoryInsert,editSubMenu,id]);

    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>{t('loading')}</h4>
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
                            pathname: `/products/${item.sub_id}`,
                            id:item.id,
                            ProductName:item.ProductName }} > {item.SubCategoryName}</Link></h3>
                            <p className="text-muted"></p>
                            {/* <p className="text-muted">{item.SubCategoryName}</p> */}
                          
                           
                            </div>
                        </div>
        
                        <div className="card-footer pt-0 pb-0 text-center">
                            <div className="row">
                                <div className="col-4 pt-3 pb-3 border-right">
                                    <Link
                                        to=""
                                         onClick={(e)=>fetchSubMenus(e,item.sub_id)}
                                    >
                                        <span>{t('edit')}</span>
                                    </Link>
                                </div>
                                <div className="col-4 pt-3 pb-3 border-right">
                                    <Link
                                        to=""
                                        onClick={(e)=>deleteSubMenu(e,item.sub_id)}
                                    >
                                        <span>{t('delete')}</span>
                                    </Link>
                                </div>
                                <div className="col-4 pt-3 pb-3">
                                    <Link
                                         to={{
                                            pathname: `/products/${item.id}`,
                                            }}
                                    >
                                        <span>{t('products')}</span>
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
    const deleteSubMenu= (e,id)=>{
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
                axios.delete(`/api/DeleteSubCategories/${id}`).then(res=>{
                    if(res.data.status === 200){
                        setSubCategoryInsert([]);
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
         <PageTItle headingPara={t('sub_category')} activeMenu={t('add_sub_Category')} motherMenu={t('sub_category')} />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={handleSubmit(saveSubMenu)} method= "POST" encType="multipart/form-data">
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
                            <label className="mb-1 "> <strong>{t('category_name')}: {props.location.CategoryName}</strong> </label>
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('sub_category_icon')}</strong> </label>
                            <div className="input-group">
                                <div className="custom-file">
                                    <input
                                    type="file"
                                    className="form-control"
                                    placeholder={t('sub_category_icon')}
                                    name="SubCategoryIcon"
                                    required
                                    onChange={handleImage}  
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('sub_category_name')}</strong> </label>
                            <input
                                type="text"
                                {...register("SubCategoryName")}
                                className="form-control"
                                placeholder={t('sub_category_name')}
                                name="SubCategoryName"
                                onChange={handleInput}  
                                value={subCategoryInsert.SubCategoryName}
                            />
                             <div className="text-danger">
                                {errors.SubCategoryName?.message}
                            </div>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setModalCentered(false)}
                        variant="danger light"
                    >
                        {t('close')}
                    </Button>
                    <Button variant="primary" type="submit">{t('save')}</Button>

                </Modal.Footer>
            </Form>
        </Modal>
         {/* Edit Modal */}
         <Modal className="fade" show={editmodalCentered}>
            <Form onSubmit={updateSubMenu} method= "POST" >
                <Modal.Header>
                    <Modal.Title>{t('edit_sub_category')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('sub_category_icon')}</strong> </label>
                            <div className="input-group">
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        className="form-control"
                                        placeholder={t('sub_category_icon')}
                                        name="SubCategoryIcon"
                                        
                                        onChange={handleImage} 
                                    />
                                    <img src={`http://localhost:8000/images/sub_catagories/${editSubMenu.SubCategoryIcon}`} width="70" alt=" " />

                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('sub_category_name')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('sub_category_name')}
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
							<h4 className="card-title mb-2">{t('sub_category')}</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								{t('add_sub_Category')}
							</Button>
						</div>
					</div>
					{/* <div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <tr>
                                        <th>{t('number')}</th>
                                        <th>{t('sub_category_name')}</th>
                                        <th>{t('actions')}</th>
                                    </tr>
                                </thead>
								<tbody>
                                    {viewProducts_HTMLTABLE}
							    </tbody>
                            </table>
						</div>
					</div> */}
				</div>
			</div>
         </div>
         <div className="row" >
            {viewProducts_HTMLTABLE}
        </div>
      </Fragment>
   );
};

export default SubCategory;
