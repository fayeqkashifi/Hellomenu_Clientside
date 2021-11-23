import React, { Fragment, useState, useEffect } from "react";
// import PageTItle from "../../layouts/PageTitle";
import { Container, Button, Card, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CBreadcrumb } from '@coreui/react'
import Select from 'react-select';
import TagInputSelect from './TagInputSelect'

const AddProduct = (props) => {
    // validation
    const schema = yup.object().shape({
        Description: yup.string().required("This field is a required field"),
        ProductName: yup.string().required("This field is a required field"),
        UnitID: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    // for localization
    const { t } = useTranslation();
    const id = props.match.params.id;



    // insert a section
    const [productInsert, setProductInsert] = useState([]);
    const handleInput = (e) => {
        e.persist();
        setProductInsert({ ...productInsert, [e.target.name]: e.target.value });
    };
    const [productImageState, setProductImageState] = useState([]);

    const handleImage = (e) => {
        setProductImageState({ ...productImageState, CategoryIcon: e.target.files[0] });
    };
    // insert
    const saveProduct = (e) => {
        // e.preventDefault();
        const formData = new FormData();
        console.log(productInsert);
        formData.append('image', productImageState.image);
        formData.append('Description', productInsert.Description);
        formData.append('ProductName', productInsert.ProductName);
        formData.append('UnitID', productInsert.UnitID);
        formData.append('form', JSON.stringify(form));

        axios.post('/api/InsertProducts', formData).then(res => {
            if (res.data.status === 200) {
                setForm([]);

                setProductInsert([]);
                reset();
                swal("Success", res.data.message, "success");

                // setSelectedFiles([]);
            }
        });
    };


    
    const [form, setForm] = useState([]);

    const prevIsValid = () => {
        if (form.length === 0) {
            return true;
        }
        const someEmpty = form.some(
            (item) => item.combination === "" || item.price === "" || item.quantity === "" || item.sku === ""
        );

        if (someEmpty) {
            form.map((item, index) => {
                const allPrev = [...form];

                if (form[index].combination === "") {
                    allPrev[index].errors.combination = "Variant Name is required";
                }
                if (form[index].price === "") {
                    allPrev[index].errors.price = "Price is required";
                }
                if (form[index].quantity === "") {
                    allPrev[index].errors.quantity = "Quantity is required";
                }

                if (form[index].sku === "") {
                    allPrev[index].errors.sku = "SKU is required";
                }
                setForm(allPrev);
            });
        }

        return !someEmpty;
    };

    const handleAddLink = (e) => {
        e.preventDefault();
        const inputState = {
            combination: "",
            price: "",
            quantity: "",
            sku: "",

            errors: {
                combination: null,
                price: null,
                quantity: null,
                sku: null,
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
    // select images start 
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
    // select images end 

    //for retriving data using laravel API
    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unitData, setUnitData] = useState([]);
    useEffect(() => {
        axios.get(`/api/GetUnitsAll`).then(res => {
            if (res.data.status === 200) {
                // console.log(res.data.fetchData)
                setUnitData(res.data.fetchData);
            }
            setLoading(false);
        });
        axios.get(`/api/GetAttributes`).then(res => {
            if (res.data.status === 200) {
                setFetchData(res.data.fetchData);
            }
        });

    }, [id]);
    // set Attribute select box 
    const [displayValue, setDisplayValue] = useState([]);
    const handleSelectEvent = (e) => {
        setDisplayValue(Array.isArray(e) ? e.map(item => item.label) : [])
    }
    // set by child TagInputSelect 
    const [tagArray, setTagArray] = useState([]);

    // jsut for testing in console
    // const check = (e) => {
    //     e.preventDefault()
    //     console.log(tagArray);
    // }


    var viewProducts_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status" ><span className="sr-only">{t('loading')}</span></div>
    } else {

        viewProducts_HTMLTABLE =
            // fetchData.map((item, i) => {
            //     return (
            <Container>
                <Form onSubmit={handleSubmit(saveProduct)} method="POST" encType="multipart/form-data">
                    <Card.Header>
                        <Card.Title>{t('add_product')}</Card.Title>


                    </Card.Header>
                    <Card.Body>
                        <div className="row" >
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('product_name')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("ProductName")}
                                        className={
                                            errors.ProductName?.message
                                                ? "form-control  is-invalid"
                                                : "form-control"
                                        }
                                        placeholder={t('product_name')}
                                        name="ProductName"
                                        onChange={handleInput}
                                        value={productInsert.ProductName}
                                    />
                                    {errors.ProductName?.message && (
                                        <div className="invalid-feedback">{errors.ProductName?.message}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('unit')}</strong> </label>
                                    <select type="text"
                                        {...register("UnitID")}

                                        className={
                                            errors.UnitID?.message
                                                ? "form-control  is-invalid"
                                                : "form-control"
                                        }
                                        placeholder="UnitID"
                                        name="UnitID"
                                        onChange={handleInput}
                                        value={productInsert.UnitID}>
                                        <option value="">{t('select_a_unit')}</option> )
                                        {
                                            unitData.map((item) =>
                                                <option value={item.id} key={item.id}>{item.UnitName}</option>)
                                        }</select>
                                    {errors.UnitID?.message && (
                                        <div className="invalid-feedback">{errors.UnitID?.message}</div>
                                    )}

                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('description')}</strong> </label>
                                    <textarea
                                        type="text"
                                        {...register("Description")}
                                        className={
                                            errors.Description?.message
                                                ? "form-control  is-invalid"
                                                : "form-control"
                                        }
                                        placeholder={t('description')}
                                        name="Description"
                                        onChange={handleInput}
                                        value={productInsert.Description}
                                    />
                                    {errors.Description?.message && (
                                        <div className="invalid-feedback">{errors.Description?.message}</div>
                                    )}

                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('image')}</strong> </label>
                                    {/* <div className="file-loading"> */}
                                    <input
                                        type="file"
                                        className="form-control"
                                        placeholder={t('image')}
                                        name="image"
                                        required
                                        onChange={handleImage}
                                    />
                                    {/* </div> */}
                                </div>
                            </div>
                            {/* <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">

                                <div className="form-group">
                                    <label className="title"> <strong>{t('product_variation')}</strong> </label>
                                 
                                </div>

                            </div> */}
                            
                            {/* <div className="result">{renderPhotos(selectedFiles)}</div> */}
                        </div>

                    </Card.Body>
                        {/* <Card.Footer>
                            <Button variant="primary" type="submit"> {t('save')} </Button>
                        </Card.Footer>
                    </Form>
                    <Form > */}
                    <Card.Header>
                        <Card.Title>{t('product_variation')}</Card.Title>


                    </Card.Header>
                    <Card.Body>
                    <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                            {form.map((item, index) => (
                                <div className="row my-1" key={`item-${index}`}>
                                    <div className="col-xl-3 col-xxl-3 col-lg-3 col-sm-6 ">
                                        <input
                                            type="text"
                                            className={
                                                item.errors.combination
                                                    ? "form-control  is-invalid"
                                                    : "form-control"
                                            }
                                            name="combination"
                                            placeholder={t('variant_name')}
                                            value={item.combination}
                                            onChange={(e) => onChange(index, e)}
                                        />

                                        {item.errors.combination && (
                                            <div className="invalid-feedback">{item.errors.combination}</div>
                                        )}
                                    </div>
                                    <div className="col-xl-2 col-xxl-2 col-lg-2 col-sm-6 ">
                                        <input
                                            type="text"
                                            className={
                                                item.errors.price
                                                    ? "form-control  is-invalid"
                                                    : "form-control"
                                            }
                                            name="price"
                                            placeholder={t('price')}
                                            value={item.price}
                                            onChange={(e) => onChange(index, e)}
                                        />

                                        {item.errors.price && (
                                            <div className="invalid-feedback">{item.errors.price}</div>
                                        )}
                                    </div>
                                    <div className="col-xl-2 col-xxl-2 col-lg-2 col-sm-6 ">
                                        <input
                                            type="text"
                                            className={
                                                item.errors.quantity
                                                    ? "form-control  is-invalid"
                                                    : "form-control"
                                            }
                                            name="quantity"
                                            placeholder={t('quantity')}
                                            value={item.quantity}
                                            onChange={(e) => onChange(index, e)}
                                        />

                                        {item.errors.quantity && (
                                            <div className="invalid-feedback">{item.errors.quantity}</div>
                                        )}
                                    </div>

                                    <div className="col-xl-2 col-xxl-2 col-lg-2 col-sm-6 ">
                                        <input
                                            type="text"
                                            className={
                                                item.errors.sku
                                                    ? "form-control  is-invalid"
                                                    : "form-control"
                                            }
                                            name="sku"
                                            placeholder={t('sku')}
                                            value={item.value}
                                            onChange={(e) => onChange(index, e)}
                                        />

                                        {item.errors.sku && (
                                            <div className="invalid-feedback">{item.errors.sku}</div>
                                        )}
                                    </div>
                                    <div className="col-xl-2 col-xxl-2 col-lg-2 col-sm-12">

                                        <div className="form-group">
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

                                    <div className="col-xl-1 col-xxl-1 col-lg-1 col-sm-3">
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
                                    <div className="result">{renderPhotos(selectedFiles)}</div>

                                </div>
                            ))}
                            </div>

                            <div className="col-xl-4 col-xxl-4 col-lg-3 col-sm-12">
                                <button className="btn btn-primary mt-2" onClick={handleAddLink}>
                                    {t('add_variants')}
                                </button>
                            </div>

                    </Card.Body>
                    <Card.Footer className="text-right">
                        <Button variant="primary" type="submit"> {t('save')} </Button>
                    </Card.Footer>
                </Form>
            </Container>
        //     )
        // }) 

    }

    return (
        <Fragment>
            <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
                <Link className="font-weight-bold" to={`/products/${id}`}>{t('products_list')} </Link>
            </CBreadcrumb>
            {viewProducts_HTMLTABLE}
        </Fragment>
    );
};

export default AddProduct;
