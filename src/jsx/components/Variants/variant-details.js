import React, { Fragment,useState,useEffect } from "react";
import {Link } from "react-router-dom"
import axios from "axios";
const VariantDetails = (props) => {
   
    
    // let { id } = useParams();
    const id =props.match.params.id;
    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [variantData,setVariantData]=useState([]);
    const [loading, setLoading]=useState(true);
   
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
        
       
      }, [id]);

    var viewImages_HTMLTABLE = "";
    if(loading){
        return <h4>Loading...!</h4>
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
                                        src={`http://localhost:8000/images/variants_pics/${item.PicturesLocation}`}
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
    
    

    return (
      <Fragment>
        {/* <!-- Insert  Modal --> */}
        <div className="row" >
            <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
                <div className="row" >
                    {viewImages_HTMLTABLE}
					
			    </div>
			</div>
            <div className="col-xl-6 col-xxl-6 col-lg-12 col-sm-12">
            {variantData.map((item,i)=>{
                return ( 
            <div className="card">
                <div className="card-body">
                    <div className="row">
                    <div className="col-xl-12 col-lg-12  col-md-12 col-xxl-12 col-sm-12">
                        <div className="product-detail-content">
                            <div className="new-arrival-content pr">
                                <h4 >{item.VariationName}</h4>
                                <div className="star-rating d-inline mb-2">
                                    {item.ProductName}
                                </div>
                                <p className="price">{item.CurrentPrice}</p>
                                <p>
                                Availability: 
                                <span className="item">
                                    {item.IsAvailable===0 ? ' Yes ' : ' No '}
                                    <i className="fa fa-shopping-basket"></i>
                                </span>
                                </p>
                                <p>
                                Variant code: 
                                <span className="item">{id}</span>
                                </p>
                                <p>
                                Unit: <span className="item">{item.UnitName}</span>
                                </p>
                                
                                <h4 className="m-b-15">Description</h4>
                                <p className="text-content">{item.Description}</p>
                                <h4 className="m-b-15">Advice</h4>
                                <p className="text-content">{item.Advice}</p>
                               
                                <div className="col-2 px-0 mt-3">
                                <input
                                    type="number"
                                    name="num"
                                    className="form-control input-btn input-number"
                                    defaultValue="1"
                                />
                                </div>
                                <div className="shopping-cart mt-5">
                                <Link
                                    className="btn btn-primary btn-lg"
                                    to="#"
                                >
                                    <i className="fa fa-shopping-basket mr-2"></i>
                                    Add to Basket
                                </Link>
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
   );
};

export default VariantDetails;
