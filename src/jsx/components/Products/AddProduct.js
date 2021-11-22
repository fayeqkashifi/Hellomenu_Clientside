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
    const [imageState, setImageState] = useState([]);

    const handleImage = (e) => {
        setImageState({ ...imageState, CategoryIcon: e.target.files[0] });
    };
    // insert
    const saveProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        console.log(productInsert);
        formData.append('image', imageState.image);
        formData.append('Description', productInsert.Description);
        formData.append('ProductName', productInsert.ProductName);
        formData.append('UnitID', productInsert.UnitID);
        axios.post('/api/InsertProducts', formData).then(res => {
            if (res.data.status === 200) {
                // setProductInsert();
                reset();
                swal("Success", res.data.message, "success");
                // setSelectedFiles([]);
            }
        });
    };
    // select images start 
    // const [selectedFiles, setSelectedFiles] = useState([]);
    // const [imageState, setImageState] = useState([]);
    // const handleImageChange = (e) => {
    //     const imagesArray = [];
    //     for (let i = 0; i < e.target.files.length; i++) {
    //         imagesArray.push(e.target.files[i]);
    //     }
    //     setImageState({ ...imageState, image: imagesArray });

    //     setSelectedFiles([]);
    //     if (e.target.files) {
    //         const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    //         setSelectedFiles((prevImages) => prevImages.concat(filesArray));
    //         Array.from(e.target.files).map(
    //             (file) => URL.revokeObjectURL(file)
    //         );
    //     }

    // };
    // const renderPhotos = (source) => {
    //     return source.map((photo) => {
    //         return <img className="p-2" src={photo} alt="" key={photo} style={{ width: "100", height: "100px" }} />;
    //     });
    // };
    // select images end 

    //for retriving data using laravel API
    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unitData, setUnitData] = useState([]);
    useEffect(() => {
        axios.get(`/api/GetUnitsAll/${id}`).then(res => {
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

    }, [id, productInsert]);
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
                        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 ">
                            <div className="form-group">
                                <label className="mb-1 "> <strong>{t('attributes')}</strong> </label>

                                <Select
                                    // defaultValue={[colourOptions[2], colourOptions[3]]}
                                    isMulti
                                    name="colors"
                                    options={fetchData.map((o, i) => {
                                        return { id: i, value: o.id, label: o.attributeName };
                                    })}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleSelectEvent}
                                />

                                {/* <div className="text-danger">
                                    {errors.attributes?.message}
                                </div> */}
                            </div>
                            {/* {displayValue.length } */}
                        </div>

                        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 mt-3">
                            {
                                displayValue?.map((item, i) => {
                                    return (
                                        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12" key={i}>
                                            <div className="form-group">
                                                <label className="mb-1 "> <strong>{item}</strong> </label>
                                                <TagInputSelect item={item} setfunction={setTagArray} arr={tagArray} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {/* <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 mt-3">
                            <button onClick={(e) => check(e)}>check</button>
                        </div> */}
                        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 3mt-">
                            {
                                tagArray?.map((item, i) => {
                                    return (
                                        <div className="row my-1" key={`item-${i}`}>

                                            <div className="col-xl-3 col-xxl-3 col-lg-3 col-sm-12 ">
                                                <div className="form-group">
                                                    <label className="mb-1 "> <strong>{productInsert.ProductName}--{item}</strong> </label>
                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-xxl-2 col-lg-2 col-sm-12 ">
                                                <div className="form-group">
                                                    <label className="mb-1 "> <strong>Price</strong> </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Price"
                                                        placeholder="Price"
                                                    // value={item.name}
                                                    // onChange={(e) => onChange(index, e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-xxl-2 col-lg-2 col-sm-12 ">
                                                <div className="form-group">
                                                    <label className="mb-1 "> <strong>Quantity</strong> </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Quantity"
                                                        placeholder="Quantity"
                                                    // value={item.name}
                                                    // onChange={(e) => onChange(index, e)}
                                                    />

                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-xxl-2 col-lg-2 col-sm-12 ">
                                                <div className="form-group">
                                                    <label className="mb-1 "> <strong>sku</strong> </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="sku"
                                                        placeholder="sku"
                                                    // value={item.name}
                                                    // onChange={(e) => onChange(index, e)}
                                                    />

                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-xxl-2 col-lg-2 col-sm-2 mt-1">
                                                <div className="form-group">
                                                    <label className="mb-1 "> <strong>Photos</strong> </label>
                                                    {/* <div className="file-loading"> */}
                                                    <input
                                                        type="file"
                                                        name="file"
                                                        className="form-control"
                                                        // onChange={handleImageChange}
                                                        multiple
                                                        required
                                                        data-overwrite-initial="false"
                                                        data-min-file-count="1" />
                                                </div>

                                            </div>
                                            <div className="col-xl-1 col-xxl-1 col-lg-1 col-sm-1 mt-1">
                                                <button
                                                    className="btn btn-warning "
                                                // onClick={(e) => handleRemoveField(e, index)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
                                                        <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </div>


                    </Card.Body>
                    <Card.Footer>
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
