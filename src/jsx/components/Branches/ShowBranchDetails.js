import React, { useEffect, useState, Fragment } from "react";

import axios from "axios";
import { useTranslation } from "react-i18next";
import { Navbar, Nav } from "react-bootstrap";
// import { Link } from "react-router-dom"

import 'react-awesome-slider/dist/styles.css';
import { Row, Col, Card, Tab } from "react-bootstrap";

import { CContainer, CNavbar, CNavbarBrand, CNavbarToggler, CCollapse, CNavbarNav, CNavItem, CNavLink } from '@coreui/react'

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InfiniteScroll from 'react-infinite-scroll-component';
// import InfiniteScroll from 'react-infinite-scroller';
import Slider from "react-slick";
import { Link } from 'react-scroll'

var hold = 1;

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
   const [activeCategory, setActiveCategory] = useState(0)
   const [activeSubCategory, setActiveSubCategory] = useState(0)

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

            // setActiveCategory(res.data.fetchData[0].id);
         }

      });
      axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then(res => {
         if (res.data.status === 200) {
            // console.log(res.data.fetchData);
            axios.get(`/api/GetProductsBasedOnSubCategory/${res.data.fetchData[0].sub_id}`).then(res => {
               if (res.data.status === 200) {
                  setVariants(res.data.fetchData);

                  setActiveSubCategory(res.data.fetchData[0].sub_category_id)
               }
            });
            setSubCategories(res.data.fetchData);
            // setProducts([]);
            // setVariants([]);
         }
      });

   }, [branchId])
   const [changeState, setChangeState] = useState(true)
   const fetchMoreData = () => {
      if (hold < subcategories.length) {
         axios.get(`/api/getSubCateBasedOnBranch/${branchId}`).then(res => {
            if (res.data.status === 200) {
               // console.log(res.data.fetchData);
               setActiveSubCategory(res.data.fetchData[hold].sub_id)
               axios.get(`/api/GetProductsBasedOnSubCategory/${res.data.fetchData[hold].sub_id}`).then(res => {
                  if (res.data.status === 200) {
                     if (res.data.fetchData.length === 0) {
                        hold = hold + 1
                        // console.log(res.data.fetchData);
                        fetchMoreData()
                     } else {
                        hold = hold + 1
                        setVariants(variants.concat(res.data.fetchData))

                     }


                  }

               });

               setSubCategories(res.data.fetchData);


            }
         });
      }else{
         setChangeState(false);
      }
      // console.log(hold);


   }
   const filterCategory = (cateId) => {
      axios.get(`/api/GetSubCategories/${cateId}`).then(res => {
         if (res.data.status === 200) {
            // console.log(res.data.fetchData);
            setSubCategories(res.data.fetchData);
            // console.log(subcategories.length);
            // setProducts([]);
            // setVariants([]);
         }
      });
      setActiveCategory(cateId);

   }
   const filterProducts = (subCateID) => {
      //  const updateItem=variants.filter((curElem) => {
      //    return curElem.sub_category_id===subCateID;
      // })
      // setVariants(updateItem);

      // axios.get(`/api/GetProductsBasedOnSubCategory/${subCateID}`).then(res => {
      //    if (res.data.status === 200) {
      //       setVariants(res.data.fetchData)
      //    }
      // });
      setActiveSubCategory(subCateID);
   }
   // const filterVariants = (productID)=>{
   //    axios.get(`/api/Getvariations/${productID}`).then(res => {
   //       if(res.data.status === 200){
   //          setVariants(res.data.fetchData);
   //       }
   //     });

   // }
   const [visible, setVisible] = useState(false)
   var viewShow_HTMLTABLE = "";
   if (loading) {
      return <div className="spinner-border text-primary " role="status" style={{position: 'fixed',top: '50%',  left: '50%'}}><span className="sr-only">{t('loading')}</span></div>
   } else {
      var value;
      viewShow_HTMLTABLE =
         variants.map((item, i) => {

            return (
               <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-4 col-half-offset" key={i} id={item.SubCategoryName} >
                  {item.ProductName === value ? <h5 className="row mt-2 mx-3 invisible">{item.ProductName}</h5> : <h5 className="row mt-2 mx-3 text-uppercase font-weight-bold text-black">{item.ProductName}</h5>}
                  <h6 className="d-none">{value = item.ProductName}</h6>
                  <div>
                     <div className="card">
                        <div className="card-body">
                           <div className="new-arrival-product">
                              <div className="new-arrivals-img-contnent">
                                 <img className="img-fluid w-100" style={{ height: '100px', objectFit: 'contain' }} src={`http://192.168.1.103/yesilik1/public/images/variants_pics/${item.PicturesLocation}`} alt="" />
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
      slidesToShow: subcategories.length >= 7 ? 7 : subcategories.length,
      slidesToScroll: 1,
      speed: 1000,
      responsive: [
         {
            breakpoint: 1024,
            settings: {
               slidesToShow: subcategories.length >= 5 ? 5 : subcategories.length,
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

               slidesToShow: subcategories.length >= 1 ? 1 : 1,
               slidesToScroll: 1
            }
         }
      ]
   };


   return (

      <div style={{ marginTop: 5 }}>
         <Fragment>

            <CNavbar expand="lg" colorScheme="light" className="bg-light" placement="sticky-top" >
               {/* <Row> */}
                  {/* <Col lg={12}> */}
                     <CContainer fluid>
                        {data.map((item, i) => (
                           <CNavbarBrand className="text-center text-uppercase font-weight-bold text-primary" key={i}>{item.BrancheName}</CNavbarBrand>
                        ))}
                        <CNavbarToggler
                           aria-label="Toggle navigation"
                           aria-expanded={visible}
                           onClick={() => setVisible(!visible)}
                        />
                        <CCollapse className="navbar-collapse" visible={visible}>
                           <CNavbarNav>
                              {categories.map((data, i) => (
                                 <CNavItem as="li" key={i} >
                                    <CNavLink href="#"
                                       onClick={() => filterCategory(data.id)}

                                       className={`text-capitalize font-weight-bold ${activeCategory === data.id ? "active bg-primary text-white" : " "}`}
                                    >
                                       {data.CategoryName}
                                    </CNavLink>
                                 </CNavItem>
                              ))}
                           </CNavbarNav>
                        </CCollapse>
                     </CContainer>
                  {/* </Col> */}
                  
               {/* </Row> */}
            </CNavbar>
            <CNavbar expand="lg" colorScheme="light" className="bg-light" placement="sticky-top" >

            <Col lg={12}>
                     <Card  >
                        <Card.Body>
                           <Slider {...settings}>
                              {subcategories.map((item, i) => (
                                 <div key={i} className="px-1 text-center text-capitalize" >
                                    <Nav.Item as="li"  >
                                       <Link
                                          onClick={() => filterProducts(item.sub_id)}
                                          smooth={true}
                                          duration={1000}
                                          to={`${item.SubCategoryName}`}
                                          // eventKey={item.SubCategoryName.toLowerCase()}
                                          className={`text-capitalize font-weight-bold ${activeSubCategory === item.sub_id ? "active border border-primary text-primary   " : " "}`}
                                       >
                                          <div>
                                             <img className={`w-100 img-thumbnail mt-1 mx-1 ${activeSubCategory === item.sub_id ? "border border-primary" : " "}`} style={{ height: '60px', objectFit: 'contain' }} src={`http://192.168.1.103/yesilik1/public/images/sub_catagories/${item.SubCategoryIcon}`} alt="" />
                                          </div>
                                          <div className="mt-2">
                                             {item.SubCategoryName}
                                          </div>
                                       </Link>
                                    </Nav.Item>
                                 </div>
                              )
                              )}
                           </Slider>
                        </Card.Body>
                     </Card>
                  </Col>
            </CNavbar>

         </Fragment>

         <InfiniteScroll
            dataLength={variants.length} //This is important field to render the next data
            next={fetchMoreData}
            hasMore={changeState}
            loader={<p className="text-center"><b>{t('loading')}</b></p>}
            endMessage={
               <p style={{ textAlign: 'center' }}>
                  <b>{t('yay_you_have_seen_it_all')}</b>
               </p>
            }
         >
            <div className="row mt-2 mx-2">

               {viewShow_HTMLTABLE}
            </div>
         </InfiniteScroll>
      </div>
   );

};

export default ShowBranchDetails;
