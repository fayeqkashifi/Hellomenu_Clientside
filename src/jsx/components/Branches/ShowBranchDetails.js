import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Navbar,   Nav } from "react-bootstrap";
import {Link} from "react-router-dom"
import PerfectScrollbar from "react-perfect-scrollbar";
import { Scrollbars } from 'react-custom-scrollbars';
import HorizontalScroll from 'react-scroll-horizontal'
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
const ShowBranchDetails = (props) => {
	const { t } = useTranslation();
   const branchId =atob(props.match.params.id);
   // atob(branchNameId)
   const [loading, setLoading]= useState(true); 
   const [data, setData]= useState([])
   const [categories, setCategories]= useState([])
   const [subcategories, setSubCategories]= useState([])
   // const [products, setProducts]= useState([])
   const [variants, setVariants]= useState([])
   
   useEffect(()=>{

      axios.get(`/api/GetBranchForShow/${branchId}`).then(res => {
         if(res.data.status === 200){
            setData(res.data.data);
         }
         setLoading(false);
       });
      axios.get(`/api/GetCategories/${branchId}`).then(res => {
         if(res.data.status === 200){
            setCategories(res.data.fetchData);
         }
       });
       axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then(res => {
         if(res.data.status === 200){
            // console.log(res.data.fetchData);
            setSubCategories(res.data.fetchData);
            // setProducts([]);
            // setVariants([]);
         }
       });
       axios.get(`/api/GetVariationsBasedOnBranch/${branchId}`).then(res => {
         if(res.data.status === 200){
            setVariants(res.data.fetchData);
            // console.log(res.data.fetchData);
         }
     });
   },[branchId])
   const filterCategory=(cateId)=>{
      axios.get(`/api/GetSubCategories/${cateId}`).then(res => {
         if(res.data.status === 200){
            // console.log(res.data.fetchData);
            setSubCategories(res.data.fetchData);
            // setProducts([]);
            // setVariants([]);
         }
       });
   }
   const filterProducts=(subCateID)=>{
      //  const updateItem=variants.filter((curElem) => {
      //    return curElem.sub_category_id===subCateID;
      // })
      // setVariants(updateItem);

      axios.get(`/api/GetProductsBasedOnSubCategory/${subCateID}`).then(res => {
         if(res.data.status === 200){
            setVariants(res.data.fetchData)
         }
       });
   }
   // const filterVariants = (productID)=>{
   //    axios.get(`/api/Getvariations/${productID}`).then(res => {
   //       if(res.data.status === 200){
   //          setVariants(res.data.fetchData);
   //       }
   //     });

   // }

   var viewShow_HTMLTABLE="";
   if(loading){
      return <div className=""><h4>{t('loading')}</h4></div>
  }else{
      var value;
      viewShow_HTMLTABLE = 
      variants.map((item,i)=>{
         
          return (
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-4 col-half-offset"  key={i}>
              {item.ProductName===value ? <h5 className="row mt-2 mx-3 invisible">{ item.ProductName}</h5> : <h5 className="row mt-2 mx-3">{item.ProductName}</h5>}
                  <h6 className="d-none">{value=item.ProductName}</h6>
               <div>
                  
                  <div className="card">
                     <div className="card-body">
                     <div className="new-arrival-product">
                        <div className="new-arrivals-img-contnent">
                              <img className="img-fluid" style={{with:'100px', height:'180px' ,objectFit: 'contain'}} src={`http://192.168.1.103/yesilik1/public/images/variants_pics/${item.PicturesLocation}`} alt="" />
                        </div>
                        <div className="new-arrival-content text-center mt-3">
                              <h4>
                                 <Link to={`/variant-details/${item.variantID}`}  className="text-black "> {item.VariationName}</Link>
                              </h4>
                              <span className="price">{item.CurrentPrice+' '+ item.currency_code}</span>
                              <s className="ms-2">{item.OldPrice +' '+ item.currency_code}</s>
                        </div>
                     </div>
                     </div>
                  </div>
               </div>
            </div>
          )
         
           
      })
  }
  const settings = {
   dots: false,
   // className: "center",
   centerMode: false,
   infinite: true,
   centerPadding: "20px",
   slidesToShow: 6,
   speed: 500,
   responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
 }; 
   return (
      
      <div >
          
         <div className="text-center text-uppercase font-weight-bold " >
            {data.map((item,i)=>{
                  return(
                     <Navbar.Brand className="text-primary" to="#" key={i}>{item.BrancheName}</Navbar.Brand>
                  )
               }) }
         </div>

         <Navbar bg="primary" variant="dark" >
           
            <Nav className="me-auto">
               {categories.map((item,i)=>{
                  return(
                     <Nav.Link  key={i} className="text-white bg-primary" to={item.CategoryName}  onClick={()=>filterCategory(item.id)}>{item.CategoryName}</Nav.Link>
                  )
               }) }
            </Nav>
         </Navbar>
        

         <Slider {...settings}>
            {/* <div > */}
               {subcategories.map((item,i)=>{
                  return(
                     <div key={i} className="px-1">
                        <img  className="img-thumbnail mt-1 mx-1" style={{with:'100px', height:'100px' ,objectFit: 'contain'}} src={`http://192.168.1.103/yesilik1/public/images/sub_catagories/${item.SubCategoryIcon}`} alt="" />
                        <button type="button"   className="btn btn-outline-primary mt-1 mx-1"  onClick={()=>filterProducts(item.sub_id)}>{item.SubCategoryName}</button>
                     </div>
                  )
               }) }
            {/* </div> */}
         </Slider>

         {/* <div className="mt-1">
            {products.map((item,i)=>{
               return(
                  // <div className="col-4 pt-3 pb-3 " key={i}>
                     <button type="button" key={i} className="btn btn-outline-primary  mt-1 mx-2" onClick={()=>filterVariants(item.id)}>{item.ProductName}</button>
                  // </div>
                  
               )
            }) }
         </div> */}

         <div className="row mt-2 mx-3">
            {viewShow_HTMLTABLE}
         </div>

         {/* <div  className="" style={{Overflow: "auto"}}>
            <h1>fjsaklfjlakjflkjfldksjafslksfddjksjaflsjakjfsalkjfkslajlkfsa;ljlfaklfsdkdslfajlk</h1>
         </div>  */}
        
      </div>
      
   );

};

export default ShowBranchDetails;
