import React, { Fragment, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom"
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { CSmartTable} from '@coreui/react-pro'
const Inventory = (props) => {
    // for localization
    const { t } = useTranslation();

    const id = props.match.params.id;
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    const [editIventory, setEditInventory] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditInventory({ ...editIventory, [e.target.name]: e.target.value });
    };
    const fetchUnit = (e, id) => {
        e.preventDefault();
        axios.get(`/api/EditInventory/${id}`).then(res => {
            if (res.data.status === 200) {
                setEditInventory(res.data.intenvtory);
                setEditModalCentered(true);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
            }
        });

    }
    const updateInventory = (e) => {
        e.preventDefault();
        axios.post("/api/UpdateInventory", editIventory).then(res => {
            if (res.data.status === 200) {
                setEditInventory('');
                swal("Success", res.data.message, "success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");

            }
        });
    };
    // edit End 
    // delete start 
    const deleteInventory = (e, id) => {
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
                    axios.delete(`/api/DeleteInventory/${id}`).then(res => {
                        if (res.data.status === 200) {
                            setEditInventory([]);
                            swal("Success", res.data.message, "success");
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
        axios.get(`/api/GetInventory/${id}`).then(res => {
            if (res.data.status === 200) {
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
        });

    }, [editIventory, id]);
    const columns = [
        {
            key: 'variant_name',
        },
        {
            key: 'Buyingquantity',
        },
        {
            key: 'SellingQuantity',
        },
        {
            key: 'buyingPrice',
        },
        {
            key: 'sellingPrice',
        },
        {
            key: 'actions',
        }


    ]

    var viewInventory_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status" ><span className="sr-only" >{t('loading')}</span></div>
    } else {
        viewInventory_HTMLTABLE =
            // fetchData.map((item, i) => {
            // return (
            <CSmartTable
                activePage={1}
                cleaner
                // clickableRows
                columns={columns}
                // columnFilter
                columnSorter
                // footer
                items={fetchData}
                itemsPerPageSelect
                itemsPerPage={10}
                pagination
                scopedColumns={{
                    actions: (item) => {
                        return (
                            <td>
                                <Link
                                    to=""
                                    onClick={(e) => fetchUnit(e, item.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg>
                                </Link>
                                <span> | </span>
                                <Link
                                    to=""
                                    onClick={(e) => deleteInventory(e, item.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                </Link>
                            </td>
                        )
                    },
                }}
                // selectable
                // sorterValue={{ column: 'name', state: 'asc' }}
                tableFilter
                // tableHeadProps={{
                //   color: 'primary',
                // }}
                tableProps={{
                    striped: true,
                    hover: true,
                }}
            />
        //     )
        // })

    }
    
    return (
        <Fragment>
            <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
                <CBreadcrumbItem className="font-weight-bold" href="/branches" >{t('Branches')}</CBreadcrumbItem>
                <CBreadcrumbItem active>{t('inventory')}</CBreadcrumbItem>
            </CBreadcrumb>
            {/* Edit Modal */}
            <Modal className="fade bd-example-modal-lg" show={editmodalCentered} size="lg">
                <Form onSubmit={updateInventory} method="POST" >
                    <Modal.Header>
                        <Modal.Title> {t('edit_inventory')} </Modal.Title>
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
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('variant_name')}</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('variant_name')}
                                        name="variant_name"
                                        required
                                        onChange={editHandleInput}
                                        value={editIventory.variant_name}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('buying_quantity')}</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('buying_quantity')}
                                        name="Buyingquantity"
                                        required
                                        onChange={editHandleInput}
                                        value={editIventory.Buyingquantity}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">

                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('buying_price')}</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('buying_price')}
                                        name="buyingPrice"
                                        required
                                        onChange={editHandleInput}
                                        value={editIventory.buyingPrice}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('selling_price')}</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('selling_price')}
                                        name="sellingPrice"
                                        required
                                        onChange={editHandleInput}
                                        value={editIventory.sellingPrice}
                                    />
                                </div>
                            </div>
                            {/* <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>SellingQuantity</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="SellingQuantity"
                                        name="SellingQuantity"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.SellingQuantity}
                                    />
                                </div>
                            </div> */}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => setEditModalCentered(false)}
                            variant="danger light"
                        >
                            {t('close')}
                        </Button>
                        <Button variant="primary" type="submit"> {t('update')} </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
           
            {viewInventory_HTMLTABLE}
        </Fragment>
    );
};

export default Inventory;
