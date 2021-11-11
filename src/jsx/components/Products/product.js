import React, { Fragment, useState, useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const Product = (props) => {
    // validation
    const schema = yup.object().shape({
        ProductName: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    // for localization
    const { t } = useTranslation();
    const subMenuId = props.match.params.id;


    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section


    const [productInsert, setProductInsert] = useState('');
    const handleInput = (e) => {
        e.persist();
        setProductInsert({ ...productInsert, [e.target.name]: e.target.value });
    };
    const saveProduct = (e) => {
        // e.preventDefault();
        axios.post(`/api/InsertProducts/${subMenuId}`, productInsert).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.status);
                setProductInsert('');
                reset();
                swal("Success", res.data.message, "success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });

    };
    // edit code
    const [editProduct, setEditProduct] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    };
    const fetchProduct = (e, id) => {
        e.preventDefault();
        axios.get(`/api/EditProducts/${id}`).then(res => {
            if (res.data.status === 200) {
                setEditProduct(res.data.product);
                setEditModalCentered(true);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
            }

        });

    }
    const updateProduct = (e) => {
        e.preventDefault();
        axios.post("/api/UpdateProduct", editProduct).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.status);
                setEditProduct('');
                swal("Success", res.data.message, "success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }
        });

    };
    //for retriving data using laravel API
    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/GetProducts/${subMenuId}`).then(res => {
            if (res.data.status === 200) {
                setFetchData(res.data.fetchData);
                // console.log(res.data.fetchData);
            }
            setLoading(false);
        });
    }, [productInsert, editProduct, subMenuId]);

    var viewProducts_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status"><span className="sr-only">{t('loading')}</span></div>
    } else {
        viewProducts_HTMLTABLE =
            fetchData.map((item, i) => {
                return (
                    <div className="col-xl-4 col-lg-6 col-sm-6" key={i}>
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
                                        pathname: `/variants/${item.product_id}`,

                                        ProductName: item.ProductName
                                    }} > {item.ProductName}</Link></h3>
                                    <p className="text-muted"></p>
                                    {/* <p className="text-muted">{item.SubCategoryName}</p> */}


                                </div>
                            </div>

                            <div className="card-footer pt-0 pb-0 text-center">
                                <div className="row">
                                    <div className="col-4 pt-3 pb-3 border-right">
                                        <Link
                                            to=""
                                            onClick={(e) => fetchProduct(e, item.id)}
                                        >
                                            <span>{t('edit')}</span>
                                        </Link>
                                    </div>
                                    <div className="col-4 pt-3 pb-3 border-right">
                                        <Link
                                            to=""
                                            onClick={(e) => deleteProduct(e, item.id)}
                                        >
                                            <span>{t('delete')}</span>
                                        </Link>
                                    </div>
                                    <div className="col-4 pt-3 pb-3">
                                        <Link
                                            to={{
                                                pathname: `/variants/${item.product_id}`,
                                                id: item.id,
                                                ProductName: item.ProductName
                                            }}
                                        >
                                            <span>{t('variants')} </span>
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
    const deleteProduct = (e, id) => {
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
                    axios.delete(`/api/DeleteProducts/${id}`).then(res => {
                        if (res.data.status === 200) {
                            swal("Success", res.data.message, "success");
                            setProductInsert([]);
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
            <PageTItle headingPara={t('products')} activeMenu={t('add_product')} motherMenu={t('products')} />
            {/* <!-- Insert  Modal --> */}
            <Modal className="fade" show={modalCentered}>
                <Form onSubmit={handleSubmit(saveProduct)} method="POST" >
                    <Modal.Header>
                        <Modal.Title>{t('add_product')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('product_name')}</strong> </label>
                            <input
                                type="text"
                                {...register("ProductName")}
                                className="form-control"
                                placeholder={t('product_name')}
                                name="ProductName"
                                onChange={handleInput}
                                value={productInsert.ProductName}
                            />
                            <div className="text-danger">
                                {errors.ProductName?.message}
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
                        <Button variant="primary" type="submit">{t('save')} </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
            {/* Edit Modal */}
            <Modal className="fade" show={editmodalCentered}>
                <Form onSubmit={updateProduct} method="POST" >
                    <Modal.Header>
                        <Modal.Title>{t('edit_product')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('ID')}</strong> </label>
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
                            <label className="mb-1 "> <strong>{t('product_name')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('product_name')}
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
                                <h4 className="card-title mb-2">{t('products')}</h4>
                            </div>
                            <div className="dropdown">
                                <Button
                                    variant="primary"
                                    type="button"
                                    className="mb-2 mr-2"
                                    onClick={() => setModalCentered(true)} >
                                    {t('add_product')}
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
