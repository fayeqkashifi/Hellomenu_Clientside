import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Navbar,   Nav } from "react-bootstrap";
import {Link} from "react-router-dom"

const ShowBranchDetails = (props) => {
	const { t } = useTranslation();
   const branchId =atob(props.match.params.id);
   // atob(branchNameId)
   const [loading, setLoading]= useState(true); 
   const [data, setData]= useState([])
   const [categories, setCategories]= useState([])
   const [subcategories, setSubCategories]= useState([])
   const [products, setProducts]= useState([])
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
   //     axios.get(`/api/Getvariations`).then(res => {
   //       if(res.data.status === 200){
   //          setVariants(res.data.fetchData);
   //          //  console.log(res.data.fetchData);
   //       }
   //   });
      

   },[branchId])
   const filterCategory=(cateId)=>{
      axios.get(`/api/GetSubCategories/${cateId}`).then(res => {
         if(res.data.status === 200){
            // console.log(res.data.fetchData);
            setSubCategories(res.data.fetchData);
            setProducts([]);
            setVariants([]);
         }
       });


      // const updateItem=data.filter((curElem) => {
      //    return curElem.id===cateId;
      // })
      // setData(updateItem)
   }
   const filterProducts=(subCateID)=>{
      axios.get(`/api/GetProducts/${subCateID}`).then(res => {
         if(res.data.status === 200){
             setProducts(res.data.fetchData)
         }
       });
   }
   const filterVariants = (productID)=>{
      axios.get(`/api/Getvariations/${productID}`).then(res => {
         if(res.data.status === 200){
            setVariants(res.data.fetchData);
         }
       });

   }

   var viewShow_HTMLTABLE="";
   if(loading){
      return <h4>{t('loading')}</h4>
  }else{
      viewShow_HTMLTABLE = 
      variants.map((item,i)=>{
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
                              <Link to={`/variant-details/${item.variantID}`}  className="text-black"> {item.VariationName}</Link>
                           </h4>
                           <h5>{item.ProductName}</h5>
                           <span className="price">{item.CurrentPrice+' '+ item.currency_code}</span>
                           <s className="ms-2">{item.OldPrice +' '+ item.currency_code}</s>
                     </div>
                  </div>
                  </div>
               </div>
            </div>
          )
      })
  }
   
   return (
      <div className="row">

         <Navbar bg="primary" variant="dark">
            {data.map((item,i)=>{
               return(
                  <Navbar.Brand to="#" key={i}>{item.BrancheName}</Navbar.Brand>
               )
            }) }
            <Nav className="me-auto">
               {categories.map((item,i)=>{
                  return(
                     <Nav.Link to="" key={i} onClick={()=>filterCategory(item.id)}>{item.CategoryName}</Nav.Link>
                  )
               }) }
            </Nav>
         </Navbar>
         <div className="row">
            {subcategories.map((item,i)=>{
               return(
                  <div className="col-4 pt-3 pb-3 " key={i}>
                     <button type="button" className="btn btn-primary"  onClick={()=>filterProducts(item.id)}>{item.SubCategoryName}</button>
                  </div>
               )
            }) }
         </div>
         <div className="row">
            {products.map((item,i)=>{
               return(
                  <div className="col-4 pt-3 pb-3 " key={i}>
                     <button type="button" className="btn btn-primary" onClick={()=>filterVariants(item.id)}>{item.ProductName}</button>
                  </div>
                  
               )
            }) }
         </div>
         <div className="row py-5">
            {viewShow_HTMLTABLE}
         </div>


      </div>
   );

};

export default ShowBranchDetails;
