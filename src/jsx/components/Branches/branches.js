import React, { Fragment, useState, useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";

import { Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom"
// import profile from "../../../images/hellomenu/logo.svg";
import { useTranslation } from "react-i18next";
import axios from "axios";
import swal from "sweetalert"
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CBreadcrumb, CDropdownMenu, CDropdownDivider, CDropdown, CDropdownToggle, CDropdownItem, CBreadcrumbItem, CButton, CCloseButton, COffcanvas, COffcanvasBody, COffcanvasHeader, COffcanvasTitle } from '@coreui/react'

const schema = yup.object().shape({
    BrancheName: yup.string().required("This field is a required field"),
    currencyID: yup.string().required("This field is a required field"),
}).required();
const Branches = () => {
    // validation

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    // localization
    const { t } = useTranslation();

    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a branch
    const [branchstate, setBranchstate] = useState([]);
    const handleInput = (e) => {
        e.preventDefault();
        setBranchstate({ ...branchstate, [e.target.name]: e.target.value });
    };
    const saveBranch = (e) => {
        // e.preventDefault();
        axios.post("/api/InsertBranches", branchstate).then(res => {
            if (res.data.status === 200) {
                setBranchstate([]);
                reset();
                swal("Success", res.data.message, "success");
                setModalCentered(false)
            }
        });
    };
    // edit code
    const [editBranchstate, setEditBranchstate] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditBranchstate({ ...editBranchstate, [e.target.name]: e.target.value });
    };
    const editBranch = (e, id) => {
        e.preventDefault();
        axios.get(`/api/EditBranches/${id}`).then(res => {
            if (res.data.status === 200) {
                setEditBranchstate(res.data.branch);
                setEditModalCentered(true);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
            }
        });

    }
    const updateBranch = (e) => {
        e.preventDefault();
        console.log(editBranchstate);

        axios.post("/api/UpdateBranches", editBranchstate).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.status);
                setEditBranchstate([]);
                swal("Success", res.data.message, "success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }
        });

    };
    //for retriving data using laravel API
    const [branchdata, setBranchdata] = useState([]);
    const [currency, setCurrency] = useState([]);
    const [loading, setLoading] = useState(true);
    // for mobile
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        axios.get('/api/GetBranches').then(res => {
            if (res.data.status === 200) {
                setBranchdata(res.data.branches);
            }
            setLoading(false);
        });
        axios.get('/api/GetCurrencies').then(res => {
            if (res.data.status === 200) {
                setCurrency(res.data.fetchData);
            }
        });

    }, [branchstate, editBranchstate]);
    const [destinationLink, setDestinationLink] = useState("");

    const phone = (e, srcLink) => {
        e.preventDefault();
        setDestinationLink(srcLink);
        setVisible(true)
    }
    var viewBranches_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status"><span className="sr-only">{t('loading')}</span></div>
        //  <h4>{t('loading')}</h4>

    } else {
        viewBranches_HTMLTABLE =
            branchdata.map((item, i) => {
                return (
                    <div className="col-xl-4 col-lg-6 col-sm-6" key={item.id}>
                        <div className="card overflow-hidden">
                            <div className="card-body">
                                <div className="text-center">
                                    {/* <div className="profile-photo"> */}
                                    {/* <div className="primary"> */}

                                    <Link
                                        to={`show-branch-details/${btoa(item.id)}`}
                                        target="_blank"
                                    >
                                        <QRCode value={`http://192.168.1.103:3000/show-branch-details/${btoa(item.id)}`} className="primary" />
                                    </Link>

                                    {/* </div> */}

                                    {/* <img
                                    src={profile}
                                    width="100"
                                    className="img-fluid rounded-circle"
                                    alt=""
                                    /> */}
                                    {/* </div> */}
                                    <h3 className="mt-4 mb-1"><Link to={{
                                        pathname: `/category/${item.id}`,
                                        branchName: item.BrancheName
                                    }} > {item.BrancheName}</Link></h3>
                                    <CDropdown variant="btn-group">
                                        {/* <CButton color="primary" size="sm"></CButton> */}
                                        <CDropdownToggle color="primary" size="lg" split="hover" shape="rounded" caret={false}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                        </svg></CDropdownToggle>
                                        <CDropdownMenu>
                                            <div className="mx-3 my-2">

                                                <Link
                                                    to=""
                                                    onClick={(e) => editBranch(e, item.id)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                    </svg>
                                                    <span> {t('edit')}</span>
                                                </Link>
                                            </div>

                                            <div className="mx-3 my-2">

                                                <Link
                                                    to=""
                                                    onClick={(e) => deleteBranch(e, item.id)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                    </svg>
                                                    <span> {t('delete')}</span>


                                                </Link>
                                            </div>
                                            <div className="mx-3 my-2">

                                                <Link
                                                    data-toggle="tooltip" data-placement="right" title="To perview on mobile click this."
                                                    onClick={(e) => phone(e, `http://192.168.1.103:3000/show-branch-details/${btoa(item.id)}`)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-phone-fill" viewBox="0 0 16 16">
                                                        <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0z" />
                                                    </svg>
                                                    <span> {t('preview')}</span>
                                                </Link>
                                            </div>



                                            <div className="mx-3 my-2">

                                                <Link
                                                    to={{
                                                        pathname: `/service-area/${item.id}`,
                                                        branchName: item.BrancheName
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bounding-box" viewBox="0 0 16 16">
                                                        <path d="M5 2V0H0v5h2v6H0v5h5v-2h6v2h5v-5h-2V5h2V0h-5v2H5zm6 1v2h2v6h-2v2H5v-2H3V5h2V3h6zm1-2h3v3h-3V1zm3 11v3h-3v-3h3zM4 15H1v-3h3v3zM1 4V1h3v3H1z" />
                                                    </svg>
                                                    <span> {t('services')}</span>
                                                </Link>
                                            </div>
                                            <div className="mx-3 my-2">
                                                <Link

                                                    to={{
                                                        pathname: `/unit/${item.id}`,
                                                        branchName: item.BrancheName
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-border-style" viewBox="0 0 16 16">
                                                        <path d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1zm0 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-1zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm8 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-4 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm8 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-4-4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-1z" />
                                                    </svg>
                                                    <span> {t('units')}</span>
                                                </Link>
                                            </div>

                                            <div className="mx-3 my-2">
                                                <Link

                                                    to={{
                                                        pathname: `/inventory/${item.id}`,
                                                        branchName: item.BrancheName
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stack-overflow" viewBox="0 0 16 16">
                                                        <path d="M12.412 14.572V10.29h1.428V16H1v-5.71h1.428v4.282h9.984z" />
                                                        <path d="M3.857 13.145h7.137v-1.428H3.857v1.428zM10.254 0 9.108.852l4.26 5.727 1.146-.852L10.254 0zm-3.54 3.377 5.484 4.567.913-1.097L7.627 2.28l-.914 1.097zM4.922 6.55l6.47 3.013.603-1.294-6.47-3.013-.603 1.294zm-.925 3.344 6.985 1.469.294-1.398-6.985-1.468-.294 1.397z" />
                                                    </svg>
                                                    <span> {t('inventory')}</span>
                                                </Link>
                                            </div>
                                        </CDropdownMenu>
                                    </CDropdown>

                                </div>
                            </div>

                        </div>
                    </div>
                )
            })

    }
    // delete branch 
    const deleteBranch = (e, id) => {
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
                    axios.delete(`/api/DeleteBranches/${id}`).then(res => {
                        if (res.data.status === 200) {
                            swal("Success", res.data.message, "success");
                            // thisClicked.closest("tr").remove();
                        } else if (res.data.status === 404) {
                            swal("Success", res.data.message, "success");
                        }
                        setBranchstate([]);
                    });
                } else {
                    swal("Your Data is safe now!");
                }
            });
    }
    return (
        <Fragment>
            <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
                <CBreadcrumbItem active>{t('Branches')}</CBreadcrumbItem>
            </CBreadcrumb>
            {/* <PageTItle headingPara={t('Branches')} activeMenu={t('add_branch')} motherMenu={t('Branches')} /> */}
            {/* <!-- Insert  Modal --> */}
            <Modal className="fade" show={modalCentered}>
                <Form onSubmit={handleSubmit(saveBranch)} method="POST" >
                    <Modal.Header>
                        <Modal.Title>{t('add_branch')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('branch_name')}</strong> </label>
                            <input
                                type="text"
                                {...register("BrancheName")}
                                className="form-control"
                                placeholder={t('branch_name')}
                                name="BrancheName"
                                onChange={handleInput}
                                value={branchstate.BrancheName}
                            />

                            <div className="text-danger">
                                {errors.BrancheName?.message}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('currency')}</strong> </label>
                            <select type="text"
                                {...register("currencyID")}

                                className="form-control"
                                placeholder="currencyID"

                                name="currencyID"
                                onChange={handleInput}
                                value={branchstate.currencyID}>
                                <option value=''>{t('select_currency')}</option> )
                                {
                                    currency.map((item) =>
                                        <option value={item.id} key={item.id}>{item.currency_name + ' / ' + item.currency_code}</option>)
                                }</select>
                            <div className="text-danger">
                                {errors.currencyID?.message}
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
                <Form onSubmit={updateBranch} method="POST" >
                    <Modal.Header>
                        <Modal.Title>{t('edit_branch')}</Modal.Title>
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
                                // placeholder="Branch Name"
                                name="id"
                                required
                                onChange={editHandleInput}
                                value={editBranchstate.id}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('branch_name')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('branch_name')}
                                name="BrancheName"
                                required
                                onChange={editHandleInput}
                                value={editBranchstate.BrancheName}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('currency')}</strong> </label>
                            <select type="text"
                                className="form-control"
                                placeholder="currencyID"
                                name="currencyID"
                                required
                                onChange={editHandleInput}
                                value={editBranchstate.currencyID}>
                                <option value=''>{t('select_currency')}</option> )
                                {
                                    currency.map((item) =>
                                        <option value={item.id} key={item.id}>{item.currency_name + ' / ' + item.currency_code}</option>)
                                }</select>
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
            {/* mobile modal */}

            {/* <CButton onClick={() =>}>Toggle offcanvas</CButton> */}
            <COffcanvas placement="end" className="fade bd-example-modal-lg" scroll visible={visible} onHide={() => setVisible(false)} >
                <COffcanvasHeader >
                    <COffcanvasTitle>{t('display_mobile')}</COffcanvasTitle>
                    <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
                </COffcanvasHeader>
                <COffcanvasBody >
                    <div class="wrapper">
                        <div class="iphone">
                            <div class="power"></div>
                            <div class="lock"></div>
                            <div class="volume up"></div>
                            <div class="volume down"></div>
                            <div class="camera"></div>
                            <div class="speaker"></div>
                            <div class="screen">
                                <iframe src={destinationLink} height="100%" width="100%" title="Devices"></iframe>
                            </div>
                            <div class="button">
                                <div class="square"></div>
                            </div>
                        </div>
                    </div>
                </COffcanvasBody>
            </COffcanvas>
            <div className="row" >
                {viewBranches_HTMLTABLE}
                <div className="col-xl-4 col-lg-6 col-sm-6 " >
                    <div className="card overflow-hidden "  >
                        <div className="card-body d-flex justify-content-center text-center" style={{ border: "2px dashed red" }}>
                            <div className="align-self-center text-center">
                                <button type="button" className="btn btn-outline-primary"
                                    onClick={() => setModalCentered(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                    </svg>
                                    {t('add_branch')}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </Fragment>

    );
};

export default Branches;
