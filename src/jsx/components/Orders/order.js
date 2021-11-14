import React, { Fragment, useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import axios from "axios";
import PageTItle from "../../layouts/PageTitle";
import { useTranslation } from "react-i18next";

const Order = () => {
    // for localization
    const { t } = useTranslation();
    //for retriving data using laravel API
    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/Getvariations`).then(res => {
            if (res.data.status === 200) {
                setFetchData(res.data.fetchData);
                // console.log(fetchData);
            }
            setLoading(false);
        });
    }, []);

    var viewVariants_HTMLTABLE = "";
    if (loading) {
        return <div className="spinner-border text-primary " role="status" ><span className="sr-only" >{t('loading')}</span></div>
    } else {
        viewVariants_HTMLTABLE =
            fetchData.map((item, i) => {
                if (item.IsAvailable === 0) {
                    return (
                        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6" key={i}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="new-arrival-product">
                                        <div className="new-arrivals-img-contnent">
                                            <img className="img-fluid" src={`http://localhost:8000/images/variants_pics/${item.PicturesLocation}`} alt="" />
                                        </div>
                                        <div className="new-arrival-content text-center mt-3">
                                            <h4>
                                                <Link to={`/variant-details/${item.variantID}`} className="text-black"> {item.VariationName}</Link>
                                            </h4>
                                            <h5>{item.ProductName}</h5>
                                            <span className="price">{item.CurrentPrice + ' ' + item.currency_code}</span>
                                            <s className="ms-2">{item.OldPrice + ' ' + item.currency_code}</s>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 " key={item.id}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="new-arrival-product">
                                        <div className="new-arrivals-img-contnent">
                                            <img className="img-fluid" src={`http://localhost:8000/images/variants_pics/${item.PicturesLocation}`} alt="" />
                                        </div>
                                        <div className="new-arrival-content text-center mt-3">
                                            <h4>
                                                <Link to={`/variant-details/${item.variantID}`} className="text-black"> {item.VariationName}</Link>
                                            </h4>
                                            <h5>{item.ProductName}</h5>
                                            <span className="price">{item.CurrentPrice}</span>
                                            <s className="ms-2">{item.OldPrice}</s>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            })

    }
    return (

        <Fragment>
            <PageTItle headingPara={t('orders')} activeMenu={t('add_to_basket')} motherMenu={t('orders')} />

            <div className="row">
                {viewVariants_HTMLTABLE}
            </div>
        </Fragment>

    );
}
export default Order;