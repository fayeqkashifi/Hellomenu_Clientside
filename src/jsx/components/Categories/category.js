import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
/// Bootstrap
import { Row, Col, Card } from "react-bootstrap";
import {Link } from "react-router-dom"
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const Category = (props) => {
    const schema = yup.object().shape({
        CategoryName: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
    });
    // for localization
	const { t } = useTranslation();
    // insert modal
    const id =props.match.params.id;

    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section

    const [categoryInsert, setCategoryInsert] = useState({
        CategoryName : '',
        branchID : id,
    });
    const [imageState, setImageState] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setCategoryInsert({...categoryInsert, [e.target.name]: e.target.value});
    };
    const handleImage = (e) => {
        setImageState({...imageState, CategoryIcon: e.target.files[0] });
    };
    const saveMenu=  (e) => {
        // e.preventDefault();
        const formData = new FormData();
        formData.append('CategoryIcon', imageState.CategoryIcon);
        formData.append('CategoryName', categoryInsert.CategoryName);
        formData.append('branchID', categoryInsert.branchID);

        axios.post("/api/InsertCategories", formData).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setCategoryInsert({
                    CategoryName : '',
                    branchID : id,
                });
                reset();
                swal("Success",res.data.message,"success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
        
    };
    // edit code
    const [editMenu, setEditMenu] = useState('');
    const editHandleInput = (e) => {
        e.persist();
        setEditMenu({...editMenu, [e.target.name]: e.target.value});
    };
    const fetchMenus = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditCategories/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditMenu(res.data.menu);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }

        });

    }
    const updateMenu =  (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('CategoryIcon', imageState.CategoryIcon);
        formData.append('CategoryName', editMenu.CategoryName);
        formData.append('branchID', editMenu.branchID);
        formData.append('id', editMenu.id);


        axios.post("/api/UpdateCategories", formData).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setEditMenu('');
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
        axios.get(`/api/GetCategories/${id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
      }, [categoryInsert,editMenu,id]);

    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>{t('loading')}</h4>
    }else{
        viewProducts_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                    <Col xl={4} key={item.id}>
                    <Card>
                        <Card.Header>
                            <h4 className="card-intro-title">{item.CategoryName}</h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                                <img
                                    src={`http://localhost:8000/images/catagories/${item.CategoryIcon}`}
                                    className="d-block w-100"
                                    alt=""
                                />
                            
                        </Card.Body>
                        <Card.Footer>
                            <Link className="btn btn-outline-success btn-xxs ml-1" to={{
                            pathname: `/sub-category/${item.id}`,
                            CategoryName:item.CategoryName }}>
                               {t('sub_category')} 
                            </Link>

                            <button type="button"   onClick={(e)=>fetchMenus(e,item.id)} className="btn btn-outline-info btn-xxs ml-1">{t('edit')} </button>
                            <button type="button" onClick={(e)=>deleteMenu(e,item.id)} className="btn btn-outline-danger btn-xxs ml-1">{t('delete')} </button>
                        </Card.Footer>
                    </Card>
                    </Col>
                // <tr key={item.id}>
                //     <td>{i+1}</td>
                //     <Link to={{
                //         pathname: '/sub-category',
                //         id:item.id,
                //         CategoryName:item.CategoryName }}>
                //     <td><img src={`http://localhost:8000/images/catagories/${item.CategoryIcon}`} width="100" /></td>
                //     <td>{item.CategoryName}</td>
                //     </Link>
                //     <td>
                //         <button type="button"   onClick={(e)=>fetchMenus(e,item.id)} className="btn btn-outline-danger btn-sm">Edit</button>&nbsp;&nbsp;&nbsp;
                //         <button type="button" onClick={(e)=>deleteMenu(e,item.id)} className="btn btn-outline-warning btn-sm">Delete</button>
                //     </td> 
                // </tr>
            )
        })

    }
    // delete section 
    const deleteMenu= (e,id)=>{
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
                axios.delete(`/api/DeleteCategories/${id}`).then(res=>{
                    if(res.data.status === 200){
                        setCategoryInsert([]);
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
         <PageTItle headingPara={t('categories')} activeMenu={t('add_category')} motherMenu={t('categories')} />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={handleSubmit(saveMenu)} method= "POST" encType="multipart/form-data">
                <Modal.Header>
                    <Modal.Title>{t('add_category')} </Modal.Title>
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
                    <div className="form-group">
                        <label className="mb-1 "> <strong>{t('category_icon')}</strong> </label>
                        <div className="input-group">
                            <div className="custom-file">
                                <input
                                type="file"
                                className="form-control"
                                placeholder={t('category_icon')}
                                name="CategoryIcon"
                                required
                                onChange={handleImage}  
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="mb-1 "> <strong>{t('category_name')}</strong> </label>
                        <input
                            type="text"
                            {...register("CategoryName")}
                            className="form-control"
                            placeholder={t('category_name')}
                            name="CategoryName"
                            
                            onChange={handleInput}  
                            value={categoryInsert.CategoryName}
                        />
                        <div className="text-danger">
                            {errors.CategoryName?.message}
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
            <Form onSubmit={updateMenu} method= "POST" >
                <Modal.Header>
                    <Modal.Title>{t('edit_category')}</Modal.Title>
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
                        <label className="mb-1 "> <strong>{t('edit_category')}</strong> </label>
                        <input
                            type="text"
                            disabled="disabled"
                            className="form-control"
                            name="id"
                            required
                            onChange={editHandleInput}  
                            value={editMenu.id}
                        />
                    </div>
                    <div className="form-group">
                        <label className="mb-1 "> <strong>{t('category_icon')}</strong> </label>
                        <div className="input-group">
                            <div className="custom-file">
                                <input
                                    type="file"
                                    className="form-control"
                                    placeholder={t('category_icon')}
                                    name="CategoryIcon"
                                    
                                    onChange={handleImage} 
                                />
                                <img src={`http://localhost:8000/images/catagories/${editMenu.CategoryIcon}`} width="70" alt=" " />

                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="mb-1 "> <strong>{t('category_name')}</strong> </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={t('category_name')}
                            name="CategoryName"
                            required
                            onChange={editHandleInput}  
                            value={editMenu.CategoryName}
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
							<h4 className="card-title mb-2">{t('categories')}</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								{t('add_category')}
							</Button>
						</div>
					</div>
				</div>
			</div>
         </div>
         <Row>
            {viewProducts_HTMLTABLE}
         </Row>


        
      </Fragment>
   );
};

export default Category;
