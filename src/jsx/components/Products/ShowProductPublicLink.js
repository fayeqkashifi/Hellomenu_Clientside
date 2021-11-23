import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageTItle from "../../layouts/PageTitle";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

const ShowProductPublicLink = (props) => {
    // for localization
    const { t } = useTranslation();
    const id = props.match.params.id;
    //for retriving data using laravel API
    const [fetchData, setFetchData] = useState([]);
    const [variantData, setVariantData] = useState([]);
    const [variantsWithPictures, setVariantsWithPictures] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(`/api/GetProduct/${id}`).then(res => {
            if (res.data.status === 200) {
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
        });
        axios.get(`/api/GetVariantsBasedOnProduct/${id}`).then(res => {
            if (res.data.status === 200) {
                setVariantData(res.data.fetchData);
                // console.log(res.data.fetchData);
            }
        });
        axios.get(`/api/GetVariantsBasedOnProductWithPictures/${id}`).then(res => {
            if (res.data.status === 200) {
                setVariantsWithPictures(res.data.fetchData);
                // console.log(res.data.fetchData);
            }
        });


    }, [id]);

    var viewImages_HTMLTABLE = "";
    if (loading) {
        return <div className="container "><div className="spinner-border text-primary " role="status" style={{ position: 'fixed', top: '50%', left: '50%' }}><span className="sr-only">{t('loading')}</span></div></div>
    } else {
        var att;
        viewImages_HTMLTABLE =
            fetchData.map((item, i) => {
                return (
                    <>
                        <div className="col-xl-12 col-lg-12 col-sm-12 my-2" key={item.id}>
                            <div className="card overflow-hidden">
                                <div className="text-center">
                                    <div className="profile-photo">
                                        <img
                                            style={{ height: '200px', objectFit: 'contain' }}
                                            src={`http://192.168.1.103/yesilik1/public/images/products/${item.image}`}
                                            className="d-block w-100 img-thumbnail"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12 col-lg-12 col-sm-12" >
                            <div className='card border'>
                                <div className="row mx-3 mt-3">
                                    <h4> {t('product_name')}:  {item.ProductName}</h4>
                                    <p>
                                        {t('description')}: {item.Description}
                                    </p>
                                    <p>
                                        {t('unit')}: {item.UnitName}
                                    </p>
                                </div>
                                <div className="row m-3">

                                    <h4> {t('vatiants')}</h4>
                                </div>
                                <div class="d-flex justify-content-start flex-wrap mx-3 mb-2" >
                                    
                                    {variantData.map((item, i) => {
                                        return (
                                            <div  key={i}  >
                                                {item.attributeName === att ? " " : item.attributeName + ' : '}
                                                <Link className="btn btn-outline-danger btn-sm m-1"
                                                    to={`/variant-details/${item.variant_id}`}
                                                >{item.optionName}</Link>
                                                <h6 className="d-none">{att = item.attributeName}</h6>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                        </div>
                    </>
                )
            })

    }

    return (
        <div className="container">
            <Fragment>
                {/* <PageTItle headingPara={t('variants')} activeMenu={t('variant_details')} motherMenu={t('variants')} /> */}
                {/* <!-- Insert  Modal --> */}
                <div className="row" >
                    <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 ">
                        <div className="row" >
                            {viewImages_HTMLTABLE}
                        </div>
                        <div className="row" >
                            {variantsWithPictures.map((item, i) => {
                                return (
                                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-4 col-half-offset" key={i} id={item.SubCategoryName} >
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="new-arrival-product">

                                                    <div className="text-center bg-white">
                                                        <img className="img-fluid w-100 img-thumbnail" style={{ height: '100px', objectFit: 'contain' }} src={`http://192.168.1.103/yesilik1/public/images/variants_pics/${item.PicturesLocation}`} alt="" />
                                                    </div>

                                                    <Link to={`/variant-details/${item.variant_id}`} className="text-black">
                                                        <div className="new-arrival-content text-center mt-3">
                                                            <h4>
                                                                {item.VariationName}
                                                                <p className="text-success">{item.UnitName}</p>
                                                            </h4>

                                                            <span className="price">{item.CurrentPrice + ' ' + item.currency_code}</span>
                                                            <s className="ms-2">{item.OldPrice===null? " ": item.OldPrice + ' ' + item.currency_code}</s>
                                                        </div>
                                                    </Link>


                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    {/* <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
                        {variantData.map((item, i) => {
                            return (
                                <div className="card" key={i}>
                                    <div className="card-header font-weight-bold">
                                        Product Variation Details
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12  col-md-12 col-xxl-12 col-sm-12">
                                                <div className="product-detail-content">
                                                    <div className="new-arrival-content pr">
                                                        <h4 >{item.VariationName}</h4>
                                                        <div className="star-rating d-inline mb-2">
                                                            {item.ProductName}
                                                        </div>
                                                        <br></br>
                                                        <p className="price">{item.CurrentPrice + ' ' + item.currency_code}</p>
                                                        <br></br>
                                                        <br></br>
                                                        <p>
                                                            {t('availability')}:
                                                            <span className="item">
                                                                {item.IsAvailable === 0 ? ' Yes ' : ' No '}
                                                                <i className="fa fa-shopping-basket"></i>
                                                            </span>

                                                        </p>

                                                        <p>
                                                            {t('variant_code')}:
                                                            <span className="item">{id}</span>
                                                        </p>
                                                        <p>
                                                            {t('unit')}: <span className="item">{item.UnitName}</span>
                                                        </p>
                                                        <h4 className="m-b-15">{t('description')}</h4>
                                                        <p className="text-content"> {item.Description}</p>
                                                        <h4 className="m-b-15">{t('advice')}</h4>
                                                        <p className="text-content"> {item.Advice}</p>
                                                        <p>{t('variant_details')} </p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div> */}


                </div>
            </Fragment>
        </div>
    );
};

export default ShowProductPublicLink;
