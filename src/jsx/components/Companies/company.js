import React, { Fragment, useState, useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const Company = () => {
    // for validation start
    const schema = yup.object().shape({
        company: yup.string().required(),
    }).required();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    //   validation end

    // for localization
    const { t } = useTranslation();

    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert section
    const [companyState, setCompanyState] = useState([]);
    const handleInput = (e) => {
        e.preventDefault();
        setCompanyState({ ...companyState, [e.target.name]: e.target.value });
    };
    const saveCompany = (e) => {
        axios.post("/api/InsertCompanies", companyState).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.status);
                setCompanyState('');
                reset();
                swal("Success", res.data.message, "success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });

    };
    // edit code
    const [editCompanystate, setEditCompanystate] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditCompanystate({ ...editCompanystate, [e.target.name]: e.target.value });
    };
    const editCompany = (e, id) => {
        e.preventDefault();
        axios.get(`/api/EditCompanies/${id}`).then(res => {
            if (res.data.status === 200) {
                setEditCompanystate(res.data.company);
                setEditModalCentered(true);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
            }

        });

    }
    const updateCompany = (e) => {
        e.preventDefault();
        axios.post("/api/UpdateCompanies", editCompanystate).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.status);
                setEditCompanystate('');
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
        axios.get('/api/GetCompanies').then(res => {
            if (res.data.status === 200) {
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
        });
    }, [companyState, editCompanystate]);

    var viewCompanies_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status"><span className="sr-only" style={{position: 'fixed',top: '50%',  left: '50%'}}>{t('loading')}</span></div>
    } else {
        viewCompanies_HTMLTABLE =
            fetchData.map((item, i) => {
                return (
                    <tr key={item.id}>
                        <td>{i + 1}</td>
                        <td>{item.company}</td>
                        <td>
                            <button type="button" onClick={(e) => editCompany(e, item.id)} className="btn btn-outline-danger btn-sm">{t('edit')}</button>&nbsp;&nbsp;&nbsp;
                            <button type="button" onClick={(e) => deleteCompany(e, item.id)} className="btn btn-outline-warning btn-sm">{t('delete')}</button>
                        </td>
                    </tr>
                )
            })

    }
    // delete section 
    const deleteCompany = (e, id) => {
        // e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: [t('cancel'), t('confirm')],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(`/api/DeleteCompanies/${id}`).then(res => {
                        if (res.data.status === 200) {
                            swal(res.data.message, {
                                icon: "success",
                            });
                            // swal("Success",,"success");
                            // thisClicked.closest("tr").remove();
                        } else if (res.data.status === 404) {
                            swal("Error", res.data.message, "error");
                        }
                        setCompanyState([]);

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
                <CBreadcrumbItem active>{t('companies')}</CBreadcrumbItem>
            </CBreadcrumb>
            {/* <PageTItle headingPara={t('companies')} activeMenu={t('add_company')} motherMenu={t('companies')} /> */}
            {/* <!-- Insert  Modal --> */}
            <Modal className="fade" show={modalCentered}>
                <Form onSubmit={handleSubmit(saveCompany)} method="POST" >
                    <Modal.Header>
                        <Modal.Title>{t('add_company')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('user_id')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('user_id')}
                                name="user_id"
                                required
                                disabled
                                onChange={handleInput}
                                value={localStorage.getItem('auth_id')}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('company_name')}</strong> </label>
                            <input
                                type="text"
                                {...register("company")}
                                className="form-control"
                                placeholder={t('company_name')}
                                name="company"
                                onChange={handleInput}
                                value={companyState.company}
                            />
                            <div className="text-danger">
                                {errors.company?.message}
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
                <Form onSubmit={updateCompany} method="POST" >
                    <Modal.Header>
                        <Modal.Title>{t('edit_company')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('id')}</strong> </label>
                            <input
                                type="text"
                                disabled="disabled"
                                className="form-control"
                                // placeholder="Company Name"
                                name="id"
                                required
                                onChange={editHandleInput}
                                value={editCompanystate.id}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('company_name')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('company_name')}
                                name="company"
                                required
                                onChange={editHandleInput}
                                value={editCompanystate.company}
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
                                <h4 className="card-title mb-2">{t('companies')} </h4>
                            </div>
                            <div className="dropdown">
                                <Button
                                    variant="primary"
                                    type="button"
                                    className="mb-2 mr-2"
                                    onClick={() => setModalCentered(true)} >
                                    {t('add_company')}
                                </Button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive ">
                                <table className="table ">
                                    <thead>
                                        <tr>
                                            <th>{t('number')} </th>
                                            <th>{t('company_name')} </th>
                                            <th>{t('actions')} </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewCompanies_HTMLTABLE}
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

export default Company;
