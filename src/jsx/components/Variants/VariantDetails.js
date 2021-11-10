import React, { Fragment,useState,useEffect } from "react";
import axios from "axios";
import swal from "sweetalert"
import {Link} from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageTItle from "../../layouts/PageTitle";
const VariantDetails = (props) => {
     
    // for localization
    const { t } = useTranslation();
    // let { id } = useParams();
    const id =props.match.params.id;
    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [variantData,setVariantData]=useState([]);
    const [loading, setLoading]=useState(true);

    // Quantity increment/decrement using hooks start
    const [quantity,setQuantity]=useState(1);
    const handleDecrement=()=>{
        if(quantity>1){
            setQuantity(prevCount=>prevCount-1);
        }
    }
    const handelIncrement=()=>{

        setQuantity(prevCount=>prevCount+1);
    }
    // Quantity increment/decrement using hooks end
    useEffect( () => {
        axios.get(`/api/GetPictures/${id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });

        axios.get(`/api/Getvariant/${id}`).then(res => {
            if(res.data.status === 200){
                setVariantData(res.data.variantdata);
            }
          });
      }, [quantity,id]);

    var viewImages_HTMLTABLE = "";
    if(loading){
        return <div className="container "><h4>{t('loading')}</h4></div>
    }else{
        viewImages_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <div className="col-xl-6 col-lg-6 col-sm-6" key={item.id}>
                    <div className="card overflow-hidden">
                        {/* <div className="card-body"> */}
                            <div className="text-center">
                                <div className="profile-photo">
                                    <img
                                        style={{with:'100px', height:'200px' ,objectFit: 'contain'}} 

                                        src={`http://192.168.1.103/yesilik1/public/images/variants_pics/${item.PicturesLocation}`}
                                        className="d-block w-100 img-thumbnail" 
                                        alt=""
                                    />
                                </div>
                            </div>
                        {/* </div> */}
                    </div>
                </div>
            )
        })

    }
    // add to basket start   
    const addBaskets= (e)=>{
        e.preventDefault();
        const basket={
            VariantQuantity: quantity,
        }
        axios.post(`/api/InsertBasket/${id}`,basket).then(res=>{
            if(res.data.status === 200){
                setQuantity(1);
                // setVariantData([]);
                swal("Success",res.data.message,"success");
                // thisClicked.closest("tr").remove();
            }else if(res.data.status === 404){
                swal("Success",res.data.message,"success");
            }
        });

    }
    // add to basket end   
    return (
        <div className="container">
        <Fragment>
            <PageTItle headingPara={t('variants')} activeMenu={t('variant_details')} motherMenu={t('variants')} />
            {/* <!-- Insert  Modal --> */}
            <div className="row p" >
            <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                <div className="row" >
                    {viewImages_HTMLTABLE}
			    </div>
			</div>
            <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
            {variantData.map((item,i)=>{
                return ( 
                <div className="card" key={i}>
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
                                        <p className="price">{item.CurrentPrice+' '+ item.currency_code}</p>
                                        <br></br>
                                        <br></br>
                                        <p>
                                        {t('availability')}: 
                                        <span className="item">
                                            {item.IsAvailable===0 ? ' Yes ' : ' No '}
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
                                        <div className="col-6 px-0 mt-3">
                                            <div className="input-group">
                                                <button type="button" onClick={handleDecrement} className="input-group-text">{t('minus')}</button>
                                                <div className="form-control text-center"> {quantity}</div>
                                                
                                                <button type="button" onClick={handelIncrement} className="input-group-text" disabled={item.Buyingquantity-item.SellingQuantity === quantity ? 'disabled': ''}>{t('plus')} </button>
                                            </div>
                                            {item.Buyingquantity-item.SellingQuantity === quantity
                                                ?
                                                <div className="text-danger">
                                                    {t('not_available')}
                                                </div>
                                                :""
                                                }
                                        </div>
                                        <div className="shopping-cart mt-5">
                                            <Link
                                                to="/page-login"
                                                className="btn btn-primary btn-lg">
                                                <i className="fa fa-shopping-basket mr-2"></i>
                                                    {t('add_to_basket')}
                                            </Link>
                                            {/* <button
                                                type="button"
                                                onClick={addBaskets}
                                                className="btn btn-primary btn-lg">
                                                <i className="fa fa-shopping-basket mr-2"></i>
                                                    {t('add_to_basket')}
                                            </button>
                                         */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )  
            })}
            
            </div>
         </div>
        </Fragment>
        </div>
   );
};

export default VariantDetails;
