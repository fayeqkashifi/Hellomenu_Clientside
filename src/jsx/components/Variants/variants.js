import React, { Fragment, useState, useEffect } from "react";
// import PageTItle from "../../layouts/PageTitle";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CBreadcrumb, CBreadcrumbItem, CDropdownMenu, CDropdownToggle, CDropdown } from '@coreui/react'
import Select from 'react-select';

const Variants = (props) => {
    // validation
    const schema = yup.object().shape({
        variant_name: yup.string().required("This field is a required field"),
        quantity: yup.number().positive().integer().required().typeError('You must specify a number'),
        Description: yup.string().required("This field is a required field"),
        sku: yup.string().required("This field is a required field"),
        Advice: yup.string().required("This field is a required field"),
        CurrentPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        // OldPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        // UnitID: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    // for localization
    const { t } = useTranslation();
    const id = props.match.params.id;
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section
    const [modalCentered, setModalCentered] = useState(false);

    // edit code
    const [editVariant, setEditVariant] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditVariant({ ...editVariant, [e.target.name]: e.target.value });
    };
    const fetchVariant = (e, id) => {
        e.preventDefault();
        axios.get(`/api/Editvariations/${id}`).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.variant);
                setEditVariant(res.data.variant);
                setEditModalCentered(true);
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
            }

        });

    }
    const updateVariant = (e) => {
        e.preventDefault();
        axios.post("/api/UpdateVariations", editVariant).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.status);
                setEditVariant('');
                swal("Success", res.data.message, "success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }
        });

    };
    // insert a section
    const [variantInsert, setVariantInsert] = useState({});
    const handleInput = (e) => {
        e.persist();
        setVariantInsert({ ...variantInsert, [e.target.name]: e.target.value });
    };
    // insert
    const saveInventory = (e) => {
        // e.preventDefault();
        console.log(displayValue[0]);

        const formData = new FormData();
        for (let i = 0; i < imageState.image.length; i++) {
            formData.append("file[]", imageState.image[i]);
        }
        formData.append('variant_name', variantInsert.variant_name);
        formData.append('quantity', variantInsert.quantity);
        formData.append('Description', variantInsert.Description);
        formData.append('Advice', variantInsert.Advice);
        formData.append('CurrentPrice', variantInsert.CurrentPrice);
        formData.append('sku', variantInsert.sku);
        formData.append('attribute', JSON.stringify(displayValue));
        formData.append('option', JSON.stringify(options));
        formData.append('form', JSON.stringify(form));
        axios.post(`/api/InsertInventory/${id}`, formData).then(res => {
            if (res.data.status === 200) {
                setVariantInsert({});
                setDisplayValue([]);
                setOptions([]);
                reset();
                swal("Success", res.data.message, "success");
                setForm([]);
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
        setImageState({ ...imageState, image: imagesArray });

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
    const [fetchData, setFetchData] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get(`/api/Getvariations/${id}`).then(res => {
            if (res.data.status === 200) {
                setFetchData(res.data.fetchData);
                // console.log(fetchData);
            }
            setLoading(false);
        });
        axios.get(`/api/GetAttributes`).then(res => {
            if (res.data.status === 200) {
                setAttributes(res.data.fetchData);
            }
        });
    }, [id, variantInsert,attributes, editVariant]);

    const [options, setOptions] = useState([]);
    const selectOnChange = (index, event) => {
        event.preventDefault();
        event.persist();

        setOptions({
                    ...options,
                    [event.target.name]: event.target.value,
                
        });
        console.log(options);
        console.log(displayValue);
    };
    const [form, setForm] = useState([]);

    const prevIsValid = () => {
        if (form.length === 0) {
            return true;
        }

        const someEmpty = form.some(
            (item) => item.value === "" || item.name === ""
        );

        if (someEmpty) {
            form.map((item, index) => {
                const allPrev = [...form];

                if (form[index].name === "") {
                    allPrev[index].errors.name = "Name is required";
                }

                if (form[index].value === "") {
                    allPrev[index].errors.value = "Value is required";
                }
                setForm(allPrev);
            });
        }

        return !someEmpty;
    };

    const handleAddLink = (e) => {
        e.preventDefault();
        const inputState = {
            name: "",
            value: "",

            errors: {
                name: null,
                value: null,
            },
        };

        if (prevIsValid()) {
            setForm((prev) => [...prev, inputState]);
        }
    };

    const onChange = (index, event) => {
        event.preventDefault();
        event.persist();

        setForm((prev) => {
            return prev.map((item, i) => {
                if (i !== index) {
                    console.log(item);

                    return item;
                }

                return {
                    ...item,
                    [event.target.name]: event.target.value,

                    errors: {
                        ...item.errors,
                        [event.target.name]:
                            event.target.value.length > 0
                                ? null
                                : [event.target.name] + " Is required",
                    },
                };
            });
        });
    };

    const handleRemoveField = (e, index) => {
        e.preventDefault();

        setForm((prev) => prev.filter((item) => item !== prev[index]));
    };

    // select input
    const [displayValue, setDisplayValue] = useState([]);
    const handleSelectEvent = (e) => {
        setDisplayValue(Array.isArray(e) ? e.map(item => item.label) : [])
    }
    const [attributeInsert, setAttributeInsert] = useState([]);
    const [attributeModal, setAttributeModal] = useState(false);

    const handleInputAttribute = (e) => {
        e.persist();
        setAttributeInsert({ ...attributeInsert, [e.target.name]: e.target.value });
    };
    const saveAttribute= (e) => {
        e.preventDefault();
        axios.post("/api/InsertAttribute", attributeInsert).then(res => {
            if (res.data.status === 200) {
                setAttributeInsert([]);
                reset();

                swal("Success", res.data.message, "success");
                setAttributeModal(false)
                //  this.props.history.push("/")
            }
        });
    };


    var branchID = 0;
    var CategoryID = 0;
    var sub_category_id = 0;
    var viewProducts_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status" ><span className="sr-only">{t('loading')}</span></div>
    } else {

        viewProducts_HTMLTABLE =
            fetchData.map((item, i) => {
                branchID = item.branchID;
                CategoryID = item.CategoryID;
                sub_category_id = item.sub_category_id;
                return (
                    <div className="col-xl-3 col-lg-4 col-sm-6" key={i}>
                        <div className="card overflow-hidden">
                            <div className="card-body">
                                <div className="text-center">

                                    <img
                                        style={{ height: '100px', objectFit: 'contain' }}

                                        src={`http://localhost:8000/images/variants_pics/${item.PicturesLocation}`}
                                        className=" w-40 img-thumbnail"
                                        alt=""
                                    />

                                    <h4 className="mt-4 mb-1"> {item.VariationName}</h4>
                                    {/* <p className="text-muted">{item.Description} </p> */}
                                    <CDropdown variant="btn-group">
                                        {/* <CButton color="primary" size="sm"></CButton> */}
                                        <CDropdownToggle color="primary" size="lg" split="hover" shape="rounded" caret={false}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                        </svg></CDropdownToggle>
                                        <CDropdownMenu>
                                            <div className="mx-3 my-2">

                                                <Link
                                                    to=""
                                                    onClick={(e) => fetchVariant(e, item.variantID)}
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
                                                    onClick={(e) => deleteVariant(e, item.variantID)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                    </svg>
                                                    <span> {t('delete')}</span>


                                                </Link>
                                            </div>

                                            <div className="mx-3 my-2">
                                                <Link to={`/gallery/${item.variantID}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                                                    <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                                    <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
                                                </svg> <span> {t('gallery')}</span></Link>
                                            </div>
                                            <div className="mx-3 my-2">
                                                <Link to={`/show_variant_detials/${item.variantID}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-ticket-detailed" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6V4.5ZM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5h-13ZM4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5Zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5ZM5 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
                                                </svg> <span> {t('details')}</span></Link>
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
    // delete section 
    const deleteVariant = (e, id) => {
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
                    axios.delete(`/api/Deletevariations/${id}`).then(res => {
                        if (res.data.status === 200) {
                            setVariantInsert({});
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
                <CBreadcrumbItem className="font-weight-bold" href="/branches" >{t('Branches')}</CBreadcrumbItem>
                <CBreadcrumbItem className="font-weight-bold" href={`/category/${branchID}`} >{t('categories')}</CBreadcrumbItem>
                <CBreadcrumbItem className="font-weight-bold" href={`/sub-category/${CategoryID}`} >{t('sub_category')}</CBreadcrumbItem>
                <CBreadcrumbItem className="font-weight-bold" href={`/products/${sub_category_id}`}>{t('products')} </CBreadcrumbItem>
                <CBreadcrumbItem active> {t('variants')} </CBreadcrumbItem>
            </CBreadcrumb>
            {/* <PageTItle headingPara={t('variants')} activeMenu={t('variant_list')} motherMenu={t('variants')} /> */}
            {/* <!-- Insert  Modal --> */}
            <Modal className="fade" show={attributeModal}>
                <Form onSubmit={saveAttribute} method="POST" encType="multipart/form-data">
                    <Modal.Header>
                        <Modal.Title>{t('add_attribute')}</Modal.Title>
                        <Button
                            onClick={() => setAttributeModal(false)}
                            variant=""
                            className="close"
                        >
                            <span>&times;</span>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('attribute_name')} </strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('attribute_name')}
                                name="attributeName"
                                required
                                onChange={handleInputAttribute}
                                value={attributeInsert.attributeName}
                            />
                            
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => setAttributeModal(false)}
                            variant="danger light"
                        >
                            {t('close')}
                        </Button>
                        <Button variant="primary" type="submit">{t('save')}</Button>

                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal className="fade bd-example-modal-lg" show={modalCentered} size="lg">
                <Form onSubmit={handleSubmit(saveInventory)} method="POST" encType="multipart/form-data">
                    <Modal.Header>
                        <Modal.Title>{t('add_variants')}</Modal.Title>
                        <Button
                            onClick={() => setModalCentered(false)}
                            variant=""
                            className="close"
                        >
                            <span>&times;</span>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row" >
                        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 ">
                            <div className="form-group">
                                <div className="d-flex justify-content-between">
                                <label className="mb-1 "> <strong>{t('attributes')}</strong> </label>
                                <label className=" "> {t('attributes_add_note')}   
                                <Link
                                onClick={() => setAttributeModal(true)}
                                >
                                 {t('add_attribute')}
                                </Link>
                                </label>
                                </div>
                                <Select
                                    // defaultValue={[colourOptions[2], colourOptions[3]]}
                                    isMulti
                                    name="colors"
                                    options={attributes.map((o, i) => {
                                        return { id: i, value: o.id, label: o.attributeName };
                                    })}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleSelectEvent}
                                />
                            </div>
                        </div>
                        
                        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 mt-3">
                            {
                                displayValue?.map((item, i) => {
                                    return (
                                        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12" key={i}>
                                            <div className="form-group">
                                                <label className="mb-1 "> <strong>{item}</strong> </label>
                                                <input
                                            type="text"
                                            className="form-control"
                                            name={item}
                                            placeholder={item}
                                            value={options.option}
                                            onChange={(e) => selectOnChange(i, e)}
                                        />

                                         
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
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
                                    <label className="mb-1 "> <strong>{t('quantity')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("quantity")}
                                        className="form-control"
                                        placeholder={t('quantity')}
                                        name="quantity"
                                        onChange={handleInput}
                                        value={variantInsert.quantity}
                                    />
                                    <div className="text-danger">
                                        {errors.quantity?.message}
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
                                    <label className="mb-1 "> <strong>{t('price')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("CurrentPrice")}

                                        className="form-control"
                                        placeholder={t('price')}
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
                                    <label className="mb-1 "> <strong>{t('sku')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("sku")}

                                        className="form-control"
                                        placeholder={t('price')}
                                        name="sku"
                                        onChange={handleInput}
                                        value={variantInsert.sku}
                                    />
                                    <div className="text-danger">
                                        {errors.sku?.message}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">

                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('images')}</strong> </label>
                                    {/* <div className="file-loading"> */}
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
                            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">

                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('variant_details')}</strong> </label>
                                    {/* <div className="file-loading"> */}
                                </div>

                                {/* </div> */}
                            </div>
                            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">

                            {form.map((item, index) => (
                                <div className="row my-1" key={`item-${index}`}>
                                    <div className="col-xl-5 col-xxl-5 col-lg-5 col-sm-12 ">
                                        <input
                                            type="text"
                                            className={
                                                item.errors.name
                                                    ? "form-control  is-invalid"
                                                    : "form-control"
                                            }
                                            name="name"
                                            placeholder={t('name')}
                                            value={item.name}
                                            onChange={(e) => onChange(index, e)}
                                        />

                                        {item.errors.name && (
                                            <div className="invalid-feedback">{item.errors.name}</div>
                                        )}
                                    </div>

                                    <div className="col-xl-5 col-xxl-5 col-lg-5 col-sm-12 mt-1">
                                        <input
                                            type="text"
                                            className={
                                                item.errors.value
                                                    ? "form-control  is-invalid"
                                                    : "form-control"
                                            }
                                            name="value"
                                            placeholder={t('value')}
                                            value={item.value}
                                            onChange={(e) => onChange(index, e)}
                                        />

                                        {item.errors.value && (
                                            <div className="invalid-feedback">{item.errors.value}</div>
                                        )}
                                    </div>
                                    <div className="col-xl-2 col-xxl-2 col-lg-2 col-sm-12 mt-1">
                                        <button
                                            className="btn btn-warning "
                                            onClick={(e) => handleRemoveField(e, index)}
                                        >
                                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                                                <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            </div>

                            <div className="col-xl-4 col-xxl-4 col-lg-3 col-sm-12">
                                <button className="btn btn-primary mt-2" onClick={handleAddLink}>
                                    {t('add_details')}
                                </button>
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
                        <Button variant="primary" type="submit"> {t('save')} </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
            {/* Edit Modal */}
            <Modal className="fade bd-example-modal-lg" show={editmodalCentered} size="lg">
                <Form onSubmit={updateVariant} method="POST" >
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
                            {/* <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
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
                                            unitData.map((item) =>
                                                <option value={item.id} key={item.id}>{item.UnitName}</option>)
                                        }</select>
                                </div>
                            </div> */}
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
                <div className="col-xl-3 col-lg-3 col-sm-4 " >
                    <div className="card overflow-hidden "  >
                        <div className="card-body d-flex justify-content-center text-center" style={{ border: "2px dashed red" }}>
                            <div className="align-self-center text-center">
                                <button type="button" className="btn btn-outline-primary"
                                    onClick={() => setModalCentered(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                    </svg>
                                    {t('add_variant')}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
                {viewProducts_HTMLTABLE}

            </div>
        </Fragment>
    );
};

export default Variants;
