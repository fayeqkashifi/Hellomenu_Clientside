import React, { Fragment, useState, useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal, Form } from "react-bootstrap";
/// Bootstrap
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom"
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CBreadcrumb, CBreadcrumbItem, CDropdown, CDropdownToggle, CDropdownMenu } from '@coreui/react'

const Category = (props) => {
    const schema = yup.object().shape({
        CategoryName: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    // for localization
    const { t } = useTranslation();
    // insert modal
    const id = props.match.params.id;

    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section

    const [categoryInsert, setCategoryInsert] = useState({
        CategoryName: '',
        branchID: id,
    });
    const [imageState, setImageState] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setCategoryInsert({ ...categoryInsert, [e.target.name]: e.target.value });
    };
    const handleImage = (e) => {
        setImageState({ ...imageState, CategoryIcon: e.target.files[0] });
    };
    const saveMenu = (e) => {
        // e.preventDefault();
        const formData = new FormData();
        formData.append('CategoryIcon', imageState.CategoryIcon);
        formData.append('CategoryName', categoryInsert.CategoryName);
        formData.append('branchID', categoryInsert.branchID);

        axios.post("/api/InsertCategories", formData).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.status);
                setCategoryInsert({
                    CategoryName: '',
                    branchID: id,
                });
                reset();
                swal("Success", res.data.message, "success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });

    };
    // edit code
    const [editMenu, setEditMenu] = useState('');
    const editHandleInput = (e) => {
        e.persist();
        setEditMenu({ ...editMenu, [e.target.name]: e.target.value });
    };
    const fetchMenus = (e, id) => {
        e.preventDefault();
        axios.get(`/api/EditCategories/${id}`).then(res => {
            if (res.data.status === 200) {
                setEditMenu(res.data.menu);
                setEditModalCentered(true);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
            }

        });

    }
    const updateMenu = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('CategoryIcon', imageState.CategoryIcon);
        formData.append('CategoryName', editMenu.CategoryName);
        formData.append('branchID', editMenu.branchID);
        formData.append('id', editMenu.id);


        axios.post("/api/UpdateCategories", formData).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.status);
                setEditMenu('');
                swal("Success", res.data.message, "success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");

            }
        });

    };
    //for retriving data using laravel API
    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/GetCategories/${id}`).then(res => {
            if (res.data.status === 200) {
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
        });
    }, [categoryInsert, editMenu, id]);

    var viewProducts_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status"><span className="sr-only" >{t('loading')}</span></div>
    } else {
        viewProducts_HTMLTABLE =
            fetchData.map((item, i) => {
                return (
                    <Col xl={3} key={item.id}>
                        <Card>
                            <Card.Header>
                                <h4 className="card-intro-title">{item.CategoryName}</h4>
                            </Card.Header>
                            <Card.Body >
                                <div className="text-center">
                            <Link to={{pathname: `/sub-category/${item.id}`, CategoryName: item.CategoryName}}>
                                <span>
                                <img
                                    style={{ height: '100px', objectFit: 'contain' }}
                                    src={`http://localhost:8000/images/catagories/${item.CategoryIcon}`}
                                    className="w-40"
                                    alt="Menu"
                                />
                                </span>
                                </Link>
                                </div>
                            </Card.Body>

                            <Card.Footer className="text-center">
                                <CDropdown variant="btn-group">
                                    {/* <CButton color="primary" size="sm"></CButton> */}
                                    <CDropdownToggle color="primary" size="sm"  shape="rounded" caret={false}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                    </svg>
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        <div className="mx-3 my-2">

                                            <Link
                                                to=""
                                                onClick={(e) => fetchMenus(e, item.id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                </svg>
                                                <span> {t('edit')}</span>
                                            </Link>
                                        </div>

                                        <div className="mx-3 my-2">

                                            <Link
                                                to=""
                                                onClick={(e) => deleteMenu(e, item.id)}

                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                                <span> {t('delete')}</span>


                                            </Link>
                                        </div>
                                        <div className="mx-3 my-2">

                                            <Link to={{
                                                pathname: `/sub-category/${item.id}`,
                                                CategoryName: item.CategoryName
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-subtract" viewBox="0 0 16 16">
                                                    <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z" />
                                                </svg>
                                                <span> {t('sub_category')}</span>

                                            </Link>
                                        </div>



                                    </CDropdownMenu>
                                </CDropdown>
                            </Card.Footer>
                        </Card>
                    </Col>
                )
            })

    }
    // delete section 
    const deleteMenu = (e, id) => {
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
                    axios.delete(`/api/DeleteCategories/${id}`).then(res => {
                        if (res.data.status === 200) {
                            setCategoryInsert([]);
                            swal("Success", res.data.message, "success");
                            // thisClicked.closest("tr").remove();
                        } else if (res.data.status === 404) {
                            swal("Error", res.data.message, "error");
                        }
                    });

                } else {
                    swal("Your Data is safe now!");
                }
            });


    }

    return (
        <Fragment>
            <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
                <CBreadcrumbItem className="font-weight-bold" href="/branches">{t('Branches')}</CBreadcrumbItem>
                <CBreadcrumbItem active>{t('categories')}</CBreadcrumbItem>
            </CBreadcrumb>
            {/* <PageTItle headingPara={t('categories')} activeMenu={t('add_category')} motherMenu={t('categories')} /> */}
            {/* <!-- Insert  Modal --> */}
            <Modal className="fade" show={modalCentered}>
                <Form onSubmit={handleSubmit(saveMenu)} method="POST" encType="multipart/form-data">
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
                <Form onSubmit={updateMenu} method="POST" >
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
            <Row>
                {viewProducts_HTMLTABLE}
                <div className="col-xl-3 col-lg-4 col-sm-4 " >
                    <div className="card overflow-hidden "  >
                        <div className="card-body d-flex justify-content-center text-center" style={{ border: "2px dashed red" }}>
                            <div className="align-self-center text-center">
                                <button type="button" className="btn btn-outline-primary"
                                    onClick={() => setModalCentered(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                    </svg>
                                    {t('add_category')}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </Row>



        </Fragment>
    );
};

export default Category;
