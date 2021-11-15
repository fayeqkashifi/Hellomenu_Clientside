import React, { Fragment, useState, useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const ShowVariantDetails = (props) => {
    // validation
    const schema = yup.object().shape({
        name: yup.string().required("This field is a required field"),
        value: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    // for localization
    const { t } = useTranslation();
    // ID
    const id = props.match.params.id;
    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section
    const [variantDetailInsert, setVariantDetailInsert] = useState({
        name: '',
        value: '',
        VariantID: id
    });
    const handleInput = (e) => {
        e.persist();
        setVariantDetailInsert({ ...variantDetailInsert, [e.target.name]: e.target.value });
    };

    const saveVariantdetail = (e) => {
        // e.preventDefault();
        axios.post("/api/InsertVariatDetails", variantDetailInsert).then(res => {
            if (res.data.status === 200) {
                setVariantDetailInsert({
                    name: '',
                    value: '',
                    VariantID: id
                });
                reset();

                swal("Success", res.data.message, "success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
    };
    // edit code
    const [editVariantDetail, setEditVariantDetail] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditVariantDetail({ ...editVariantDetail, [e.target.name]: e.target.value });
    };
    const fetchVariantDetail = (e, id) => {
        e.preventDefault();
        axios.get(`/api/EditVariatDetails/${id}`).then(res => {
            if (res.data.status === 200) {
                setEditVariantDetail(res.data.Details);
                setEditModalCentered(true);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
            }

        });

    }
    const updateVariantDetail = (e) => {
        e.preventDefault();
        axios.post("/api/UpdateVariatDetails", editVariantDetail).then(res => {
            if (res.data.status === 200) {
                setEditVariantDetail('');
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
        axios.get(`/api/GetVarinatDetails/${id}`).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.fetchData);
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
        });
    }, [variantDetailInsert, editVariantDetail, id]);

    var viewProducts_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status" ><span className="sr-only">{t('loading')}</span></div>
    } else {
        viewProducts_HTMLTABLE =
            fetchData.map((item, i) => {
                return (
                    <tr key={item.id}>
                        <td>{i + 1}</td>

                        <td> {item.name}</td>
                        <td> {item.value}</td>
                        <td>
                            <button type="button" onClick={(e) => fetchVariantDetail(e, item.id)} className="btn btn-outline-danger btn-sm">{t('edit')}</button>&nbsp;&nbsp;&nbsp;
                            <button type="button" onClick={(e) => deleteVariantDetail(e, item.id)} className="btn btn-outline-warning btn-sm">{t('delete')}</button>
                        </td>
                    </tr>
                )
            })

    }
    // delete section 
    const deleteVariantDetail = (e, id) => {
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
                    axios.delete(`/api/DeleteVariatDetails/${id}`).then(res => {
                        if (res.data.status === 200) {
                            swal("Success", res.data.message, "success");
                            setVariantDetailInsert({
                                name: '',
                                value: '',
                                VariantID: id
                            });
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
                <CBreadcrumbItem className="font-weight-bold" href="/branches" >{t('Branches')}</CBreadcrumbItem>
                <CBreadcrumbItem active>{t('variant_details')}</CBreadcrumbItem>
            </CBreadcrumb>
            {/* <!-- Insert  Modal --> */}
            <Modal className="fade" show={modalCentered}>
                <Form onSubmit={handleSubmit(saveVariantdetail)} method="POST" encType="multipart/form-data">
                    <Modal.Header>
                        <Modal.Title>{t('add_variant_details')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('name')} </strong> </label>
                            <input
                                type="text"
                                {...register("name")}

                                className={
                                    errors.name?.message
                                        ? "form-control  is-invalid"
                                        : "form-control"
                                }
                                placeholder={t('name')}
                                name="name"
                                onChange={handleInput}
                                value={variantDetailInsert.name}
                            />
                             {errors.name?.message && (
                                            <div className="invalid-feedback">{errors.name?.message}</div>
                                        )}
                            {/* <div className="text-danger">
                                {errors.name?.message}
                            </div> */}
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('value')} </strong> </label>
                            <input
                                type="text"
                                {...register("value")}

                                className={
                                    errors.value?.message
                                        ? "form-control  is-invalid"
                                        : "form-control"
                                }
                                placeholder={t('value')}
                                name="value"
                                onChange={handleInput}
                                value={variantDetailInsert.value}
                            />
                             {errors.value?.message && (
                                            <div className="invalid-feedback">{errors.value?.message}</div>
                                        )}
                            {/* <div className="text-danger">
                                {errors.value?.message}
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
                        <Button variant="primary" type="submit">{t('save')}</Button>

                    </Modal.Footer>
                </Form>
            </Modal>
            {/* Edit Modal */}
            <Modal className="fade" show={editmodalCentered}>
                <Form onSubmit={updateVariantDetail} method="POST" >
                    <Modal.Header>
                        <Modal.Title>{t('edit_variant_detail')} </Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('name')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('name')}
                                name="name"
                                required
                                onChange={editHandleInput}
                                value={editVariantDetail.name}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('value')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('value')}
                                name="value"
                                required
                                onChange={editHandleInput}
                                value={editVariantDetail.value}
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
                                <h4 className="card-title mb-2">{t('variant_details')}</h4>
                            </div>
                            <div className="dropdown">
                                <Button
                                    variant="primary"
                                    type="button"
                                    className="mb-2 mr-2"
                                    onClick={() => setModalCentered(true)} >
                                    {t('add_variant_details')}
                                </Button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive ">
                                <table className="table text-center ">
                                    <thead>
                                        <tr>
                                            <th>{t('number')}</th>
                                            <th>{t('name')}</th>
                                            <th>{t('value')}</th>
                                            <th>{t('actions')}</th>
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

export default ShowVariantDetails;
