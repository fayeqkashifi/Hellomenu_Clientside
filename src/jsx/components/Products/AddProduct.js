import React, { Fragment, useState, useEffect, Component, KeyboardEventHandler  } from "react";
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
// import CreatableSelect from 'react-select/creatable';
// import { ActionMeta, OnChangeValue } from 'react-select';

  
const AddProduct = (props) => {
    // validation
    const schema = yup.object().shape({
        variant_name: yup.string().required("This field is a required field"),
        Buyingquantity: yup.number().positive().integer().required().typeError('You must specify a number'),
        buyingPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        sellingPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        Description: yup.string().required("This field is a required field"),
        Advice: yup.string().required("This field is a required field"),
        CurrentPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        OldPrice: yup.number().positive().integer().required().typeError('You must specify a number'),
        UnitID: yup.string().required("This field is a required field"),
        attributes: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    // for localization
    const { t } = useTranslation();
    const id = props.match.params.id;


    const [barchid, setBranchId] = useState(0);

    // insert a section
    const [variantInsert, setVariantInsert] = useState({
        variant_name: '',
        // SellingQuantity: '',
        Buyingquantity: '',
        buyingPrice: '',
        sellingPrice: '',
        Description: '',
        Advice: '',
        CurrentPrice: '',
        OldPrice: '',
        UnitID: '',
        sub_categoryID: '',
        ProductName: '',
        branch_id: barchid
    });
    const handleInput = (e) => {
        e.persist();
        setVariantInsert({ ...variantInsert, [e.target.name]: e.target.value });
    };
    // insert
    const saveInventory = (e) => {
        // e.preventDefault();
        // console.log(e.target[0].files);

        // var files = e.target[0].files;
        const formData = new FormData();
        for (let i = 0; i < imageState.image.length; i++) {
            formData.append("file[]", imageState.image[i]);
        }
        // for (let i = 0; i < form.length; i++) {
        //     formData.append("form[]", form[i]);
        // }
        // formData.append('file', imageState.PicturesLocation	);
        formData.append('variant_name', variantInsert.variant_name);
        formData.append('Buyingquantity', variantInsert.Buyingquantity);
        formData.append('buyingPrice', variantInsert.buyingPrice);
        formData.append('sellingPrice', variantInsert.sellingPrice);
        formData.append('Description', variantInsert.Description);
        formData.append('Advice', variantInsert.Advice);
        formData.append('CurrentPrice', variantInsert.CurrentPrice);
        formData.append('OldPrice', variantInsert.OldPrice);
        formData.append('UnitID', variantInsert.UnitID);
        formData.append('sub_categoryID', variantInsert.sub_categoryID);
        formData.append('ProductName', variantInsert.ProductName);
        formData.append('branch_id', barchid);
        formData.append('form', JSON.stringify(form));
        axios.post(`/api/InsertInventory/${id}`, formData).then(res => {
            if (res.data.status === 200) {
                setVariantInsert({
                    variant_name: '',
                    // SellingQuantity: '',
                    Buyingquantity: '',
                    buyingPrice: '',
                    sellingPrice: '',
                    Description: '',
                    Advice: '',
                    CurrentPrice: '',
                    OldPrice: '',
                    UnitID: '',
                    sub_categoryID: '',
                    branch_id: barchid
                });
                reset();
                swal("Success", res.data.message, "success");
                setForm([]);
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
    const [loading, setLoading] = useState(true);
    const [unitData, setUnitData] = useState([]);
    // const [unitData,setUnitData]=useState([]);
    useEffect(() => {
        axios.get(`/api/GetUnitsAll/${id}`).then(res => {
            if (res.data.status === 200) {
                setBranchId(res.data.fetchData[0].branchID);
                setUnitData(res.data.fetchData);
            }
            setLoading(false);
        });
        axios.get(`/api/GetAttributes`).then(res => {
            if (res.data.status === 200) {
                setFetchData(res.data.fetchData);
            }
        });

    }, [id, variantInsert]);

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
    
    var sub_category_id = 0;
    var viewProducts_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status" ><span className="sr-only">{t('loading')}</span></div>
    } else {

        viewProducts_HTMLTABLE =
            fetchData.map((item, i) => {
                sub_category_id = item.sub_category_id;
                return (
                    <div className="col-xl-3 col-lg-4 col-sm-6" key={i}>
                        
                    </div>
                )
            })

    }
    // const options = 
    // fetchData.map((item)=>{
    //     [
    //         { value: 'chocolate', label: 'Chocolate' },
    //     ]

    // })    
    // [
    //     { value: 'strawberry', label: 'Strawberry' },
    //     { value: 'vanilla', label: 'Vanilla' }
    //   ]
      
    
    return (
        <Fragment>
            <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
                <Link className="font-weight-bold" to={`/products/${sub_category_id}`}>{t('products_list')} </Link>
            </CBreadcrumb>

            {/* <PageTItle headingPara={t('variants')} activeMenu={t('variant_list')} motherMenu={t('variants')} /> */}
            {/* <!-- Insert  Modal --> */}
            {/* <Modal className="fade bd-example-modal-lg" show={modalCentered} size="lg"> */}
                <Form onSubmit={handleSubmit(saveInventory)} method="POST" encType="multipart/form-data">
                    <Modal.Header>
                        <Modal.Title>{t('add_product')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row" >
                            {/* <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type something and press enter..."
        value={value}
      /> */}
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
                                    <label className="mb-1 "> <strong>{t('buying_quantity')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("Buyingquantity")}
                                        className="form-control"
                                        placeholder={t('buying_quantity')}
                                        name="Buyingquantity"
                                        onChange={handleInput}
                                        value={variantInsert.Buyingquantity}
                                    />
                                    <div className="text-danger">
                                        {errors.Buyingquantity?.message}
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('buying_price')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("buyingPrice")}
                                        className="form-control"
                                        placeholder={t('buying_price')}
                                        name="buyingPrice"
                                        onChange={handleInput}
                                        value={variantInsert.buyingPrice}
                                    />
                                    <div className="text-danger">
                                        {errors.buyingPrice?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('selling_price')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("sellingPrice")}
                                        className="form-control"
                                        placeholder={t('selling_price')}
                                        name="sellingPrice"
                                        onChange={handleInput}
                                        value={variantInsert.sellingPrice}
                                    />
                                    <div className="text-danger">
                                        {errors.sellingPrice?.message}
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
                                    <label className="mb-1 "> <strong>{t('current_price')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("CurrentPrice")}

                                        className="form-control"
                                        placeholder={t('current_price')}
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
                                    <label className="mb-1 "> <strong>{t('old_price')}</strong> </label>
                                    <input
                                        type="text"
                                        {...register("OldPrice")}
                                        className="form-control"
                                        placeholder={t('old_price')}
                                        name="OldPrice"
                                        onChange={handleInput}
                                        value={variantInsert.OldPrice}
                                    />
                                    <div className="text-danger">
                                        {errors.OldPrice?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('unit')}</strong> </label>
                                    <select type="text"
                                        {...register("UnitID")}

                                        className="form-control"
                                        placeholder="UnitID"
                                        name="UnitID"
                                        onChange={handleInput}
                                        value={variantInsert.UnitID}>
                                        <option value="">{t('select_a_unit')}</option> )
                                        {
                                            unitData.map((item) =>
                                                <option value={item.id} key={item.id}>{item.UnitName}</option>)
                                        }</select>
                                    <div className="text-danger">
                                        {errors.UnitID?.message}
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
                                            placeholder="Name"
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
                                            placeholder="Value"
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
                                    {t('add_variant_details')}
                                </button>
                            </div>
                            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 mt-3">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('attributes')}</strong> </label>
                                    {/* <select type="text"
                                        {...register("attributes")}

                                        className="form-control"
                                        placeholder="attributes"
                                        name="attributes"
                                        onChange={handleInput}
                                        value={variantInsert.attributes}>
                                        <option value="">{t('select_a_attributes')}</option> )
                                        {
                                            fetchData.map((item) =>
                                                <option value={item.id} key={item.id}>{item.attributeName}</option>)
                                        }</select> */}
                                           <Select
                                        // defaultValue={[colourOptions[2], colourOptions[3]]}
                                        isMulti
                                        name="colors"
                                        options={fetchData.map((o, i) => {
                                            return { id: i, value: o.id, label: o.attributeName };
                                        })}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        />
                                        
                                    <div className="text-danger">
                                        {errors.attributes?.message}
                                    </div>
                                </div>
                            </div>
                         
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                       
                        <Button variant="primary" type="submit"> {t('save')} </Button>

                    </Modal.Footer>
                </Form>
            {/* </Modal> */}
            
            
        </Fragment>
    );
};

export default AddProduct;
