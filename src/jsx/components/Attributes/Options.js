import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CBreadcrumb } from '@coreui/react'

const Options = (props) => {
    // validation start
    const schema = yup.object().shape({
        optionName: yup.string().required("This field is a required field"),
        description: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    // validation end 

    // for localization
    const { t } = useTranslation();

    // ID
    const id = props.match.params.id;

    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    const [Insert, setInsert] = useState({
        optionName: '',
        description: '',
        attribute_id: id
    });
    const handleInput = (e) => {
        e.persist();
        setInsert({ ...Insert, [e.target.name]: e.target.value });
    };

    const save = (e) => {
        // e.preventDefault();
        axios.post("/api/InsertOption", Insert).then(res => {
            if (res.data.status === 200) {
                setInsert({
                    optionName: '',
                    description: '',
                    attribute_id: id
                });
                reset();

                swal("Success", res.data.message, "success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
    };
    // insert end 

    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    const [edit, setUnit] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setUnit({ ...edit, [e.target.name]: e.target.value });
    };
    const fetch = (e, id) => {
        e.preventDefault();
        axios.get(`/api/EditOption/${id}`).then(res => {
            if (res.data.status === 200) {
                setUnit(res.data.unit);
                setEditModalCentered(true);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
            }

        });

    }
    const update = (e) => {
        e.preventDefault();
        axios.post("/api/UpdateOption", edit).then(res => {
            if (res.data.status === 200) {
                setUnit('');
                swal("Success", res.data.message, "success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");

            }
        });

    };
    // edit end 

    // delete start 
    const deleteOption = (e, id) => {
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
                    axios.delete(`/api/DeleteOption/${id}`).then(res => {
                        if (res.data.status === 200) {
                            swal("Success", res.data.message, "success");
                            setInsert({
                                optionName: '',
                                description: '',
                                attribute_id: id
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
    // delete end 

    //for retriving data using laravel API
    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get(`/api/GetOptions/${id}`).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.fetchData);
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
        });
    }, [Insert, edit, id]);

    var viewProducts_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status" ><span className="sr-only">{t('loading')}</span></div>
    } else {
        viewProducts_HTMLTABLE =
            fetchData.map((item, i) => {
                return (
                    <tr key={item.id}>
                        <td>{i + 1}</td>

                        <td> {item.optionName}</td>
                        <td> {item.description}</td>
                        <td>
                            <button type="button" onClick={(e) => fetch(e, item.id)} className="btn btn-outline-danger btn-sm">{t('edit')}</button>&nbsp;&nbsp;&nbsp;
                            <button type="button" onClick={(e) => deleteOption(e, item.id)} className="btn btn-outline-warning btn-sm">{t('delete')}</button>
                        </td>
                    </tr>
                )
            })

    }

    return (
        <Fragment>
            <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
                <Link className="font-weight-bold" to="/branches" >{t('Branches')} </Link> /
                <Link className="font-weight-bold" to="/attributes" >{t('attributes')} </Link>  /
                <Link active>{t('options')}</Link>
            </CBreadcrumb>
            {/* <PageTItle headingPara={t('units')} activeMenu={t('add_unit')} motherMenu={t('units')} /> */}
            {/* <!-- Insert  Modal --> */}
            <Modal className="fade" show={modalCentered}>
                <Form onSubmit={handleSubmit(save)} method="POST" encType="multipart/form-data">
                    <Modal.Header>
                        <Modal.Title>{t('add_option')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('option_name')} </strong> </label>
                            <input
                                type="text"
                                {...register("optionName")}

                                className="form-control"
                                placeholder={t('option_name')}
                                name="optionName"
                                onChange={handleInput}
                                value={Insert.optionName}
                            />
                            <div className="text-danger">
                                {errors.optionName?.message}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('description')} </strong> </label>
                            <textarea
                                type="text"
                                {...register("description")}
                                className="form-control"
                                placeholder={t('description')}
                                name="description"
                                onChange={handleInput}
                                value={Insert.description}
                            />
                            <div className="text-danger">
                                {errors.description?.message}
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
                <Form onSubmit={update} method="POST" >
                    <Modal.Header>
                        <Modal.Title>{t('edit_option')} </Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('option_name')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('option_name')}
                                name="optionName"
                                required
                                onChange={editHandleInput}
                                value={edit.optionName}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('description')} </strong> </label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder={t('description')}
                                name="description"
                                onChange={editHandleInput}
                                value={edit.description}
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
                                <h4 className="card-title mb-2">{t('options')}</h4>
                            </div>
                            <div className="dropdown">
                                <Button
                                    variant="primary"
                                    type="button"
                                    className="mb-2 mr-2"
                                    onClick={() => setModalCentered(true)} >
                                    {t('add_option')}
                                </Button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive ">
                                <table className="table ">
                                    <thead>
                                        <tr>
                                            <th>{t('number')}</th>
                                            <th>{t('option_name')}</th>
                                            <th>{t('description')}</th>
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

export default Options;
