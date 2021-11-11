import React, { useEffect, useState, Fragment } from "react";

import axios from "axios";
import { useTranslation } from "react-i18next";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom"

import 'react-awesome-slider/dist/styles.css';
import { Row, Col, Card, Tab } from "react-bootstrap";


// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
const ShowBranchDetails = (props) => {
   const { t } = useTranslation();
   const branchId = atob(props.match.params.id);
   // atob(branchNameId)
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState([])
   const [categories, setCategories] = useState([])
   const [subcategories, setSubCategories] = useState([])
   // const [products, setProducts]= useState([])
   const [variants, setVariants] = useState([])

   useEffect(() => {

      axios.get(`/api/GetBranchForShow/${branchId}`).then(res => {
         if (res.data.status === 200) {
            setData(res.data.data);
         }
         setLoading(false);
      });
      axios.get(`/api/GetCategories/${branchId}`).then(res => {
         if (res.data.status === 200) {
            setCategories(res.data.fetchData);
         }
      });
      axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then(res => {
         if (res.data.status === 200) {
            // console.log(res.data.fetchData);
            setSubCategories(res.data.fetchData);
            // setProducts([]);
            // setVariants([]);
         }
      });
      axios.get(`/api/GetVariationsBasedOnBranch/${branchId}`).then(res => {
         if (res.data.status === 200) {
            setVariants(res.data.fetchData);
            // console.log(res.data.fetchData);
         }
      });
   }, [branchId])
   const filterCategory = (cateId) => {
      axios.get(`/api/GetSubCategories/${cateId}`).then(res => {
         if (res.data.status === 200) {
            // console.log(res.data.fetchData);
            setSubCategories(res.data.fetchData);
            console.log(subcategories.length);
            // setProducts([]);
            // setVariants([]);
         }
      });
   }
   const filterProducts = (subCateID) => {
      //  const updateItem=variants.filter((curElem) => {
      //    return curElem.sub_category_id===subCateID;
      // })
      // setVariants(updateItem);

      axios.get(`/api/GetProductsBasedOnSubCategory/${subCateID}`).then(res => {
         if (res.data.status === 200) {
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

   var viewShow_HTMLTABLE = "";
   if (loading) {
      return <div className="spinner-border text-primary " role="status"><span className="sr-only">{t('loading')}</span></div>
   } else {
      var value;
      viewShow_HTMLTABLE =
         variants.map((item, i) => {

            return (
               <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-4 col-half-offset" key={i}>
                  {item.ProductName === value ? <h5 className="row mt-2 mx-3 invisible">{item.ProductName}</h5> : <h5 className="row mt-2 mx-3">{item.ProductName}</h5>}
                  <h6 className="d-none">{value = item.ProductName}</h6>
                  <div>

                     <div className="card">
                        <div className="card-body">
                           <div className="new-arrival-product">
                              <div className="new-arrivals-img-contnent">
                                 <img className="img-fluid" style={{ with: '100px', height: '180px', objectFit: 'contain' }} src={`http://192.168.1.103/yesilik1/public/images/variants_pics/${item.PicturesLocation}`} alt="" />
                              </div>
                              <div className="new-arrival-content text-center mt-3">
                                 <h4>
                                    <Link to={`/variant-details/${item.variantID}`} className="text-black "> {item.VariationName}</Link>
                                 </h4>
                                 <span className="price">{item.CurrentPrice + ' ' + item.currency_code}</span>
                                 <s className="ms-2">{item.OldPrice + ' ' + item.currency_code}</s>
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
      centerMode: true,
      infinite: true,
      swipeToSlide: true,
      centerPadding: "10px",
      slidesToShow: subcategories.length,
      slidesToScroll: 1,
      speed: 1000,
      responsive: [
         {
            breakpoint: 1024,
            settings: {
               slidesToShow: subcategories.length,
               slidesToScroll: 1,
               infinite: true,
               dots: true,
               speed: 1000,

            }
         },
         {
            breakpoint: 600,
            settings: {
               slidesToShow: subcategories.length >= 2 ? 2 : 1,
               slidesToScroll: 1,
               initialSlide: 1,
               speed: 1000

            }
         },
         {
            breakpoint: 480,
            settings: {
               speed: 1000,

               slidesToShow: subcategories.length >= 2 ? 2 : 1,
               slidesToScroll: 1
            }
         }
      ]
   };

   return (

      <div >
         <Fragment>
            <Row>
               <Col xl={12}>
                  <Card>
                     <Card.Header>
                        {data.map((item, i) => (
                           <Card.Title className="text-center text-uppercase font-weight-bold " key={i}>{item.BrancheName}</Card.Title>

                        ))}
                     </Card.Header>
                     <Card.Body>
                        {/* <!-- Nav tabs --> */}
                        <div className="custom-tab-1">
                           <Tab.Container
                           // defaultActiveKey={categories[0].CategoryName.toLowerCase()}
                           >

                              <Nav as="ul" className="nav-tabs">

                                 {categories.map((data, i) => (
                                    <Nav.Item as="li" key={i}>
                                       <Nav.Link
                                          onClick={() => filterCategory(data.id)}
                                          eventKey={data.CategoryName.toLowerCase()}
                                       >
                                          {data.CategoryName}
                                       </Nav.Link>
                                    </Nav.Item>
                                 ))}
                              </Nav>
                           </Tab.Container>
                        </div>

                        <Tab.Content className="" >
                           <div className="custom-tab-1">

                              <Tab.Container
                              // defaultActiveKey={subcategories[0].SubCategoryName.toLowerCase()}
                              >
                                 <div >

                                    <Slider {...settings}>
                                       {subcategories.map((item, i) => (
                                          <div key={i} className="px-1 text-center text-capitalize" >
                                             <Nav.Item as="li" >
                                                <Nav.Link
                                                   onClick={() => filterProducts(item.sub_id)}
                                                   eventKey={item.SubCategoryName.toLowerCase()}
                                                >
                                                   <div>
                                                      <img className="w-100 img-thumbnail mt-1 mx-1" style={{ with: '100px', height: '150px', objectFit: 'contain' }} src={`http://192.168.1.103/yesilik1/public/images/sub_catagories/${item.SubCategoryIcon}`} alt="" />
                                                   </div>
                                                   <div className="mt-2">
                                                      {item.SubCategoryName}
                                                   </div>
                                                </Nav.Link>
                                             </Nav.Item>
                                          </div>
                                       )
                                       )}
                                    </Slider>
                                 </div>

                              </Tab.Container>
                           </div>
                        </Tab.Content>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </Fragment>

         {/* <div className="text-center text-uppercase font-weight-bold " >
            {data.map((item,i)=>{
                  return(
                     <Navbar.Brand className="text-primary" to="#" key={i}>{item.BrancheName}</Navbar.Brand>
                  )
               }) }
         </div> */}

         {/* <Navbar bg="primary" variant="dark" >
           
            <Nav className="me-auto">
               {categories.map((item,i)=>{
                  return(
                     <Nav.Link  key={i} className="text-white bg-primary text-capitalize" to={item.CategoryName}  onClick={()=>filterCategory(item.id)}>{item.CategoryName}</Nav.Link>
                  )
               }) }
            </Nav>
         </Navbar>
         */}

         {/* <Slider {...settings}>
               {subcategories.map((item, i) => {
                  return (
                     <div key={i} className="px-1 text-center text-capitalize " >
                        <NavLink className="mt-1 mx-1 " to="#" onClick={() => filterProducts(item.sub_id)}
                        >
                           <div>
                              <img className="w-100 img-thumbnail mt-1 mx-1" style={{ with: '100px', height: '150px', objectFit: 'contain' }} src={`http://192.168.1.103/yesilik1/public/images/sub_catagories/${item.SubCategoryIcon}`} alt="" />
                           </div>
                           <div className="mt-2">
                              {item.SubCategoryName}
                           </div>
                        </NavLink>
                     </div>
                  )
               })}
            </Slider>
     */}
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
