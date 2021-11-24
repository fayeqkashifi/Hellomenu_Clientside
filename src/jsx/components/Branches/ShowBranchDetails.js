import React, { useEffect, useState, Fragment } from "react";

import axios from "axios";
import { useTranslation } from "react-i18next";
import { Navbar, Nav } from "react-bootstrap";
import { Link as RLink } from "react-router-dom"

import 'react-awesome-slider/dist/styles.css';
import { Row, Modal, Form, Col, Card, Tab, Button } from "react-bootstrap";

import { CContainer, CFooter, CLink, CNavbar, CNavbarBrand, CNavbarToggler, CCollapse, CNavbarNav, CNavItem, CNavLink } from '@coreui/react'

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InfiniteScroll from 'react-infinite-scroll-component';
// import InfiniteScroll from 'react-infinite-scroller';
import Slider from "react-slick";
import { Link } from 'react-scroll'
// import Button from "@restart/ui/esm/Button";
import Counter from './Counter'
import swal from "sweetalert"
import ReactWhatsapp from 'react-whatsapp';


var hold = 1;

const ShowBranchDetails = (props) => {
   const { t } = useTranslation();
   const branchId = atob(props.match.params.id);
   const [modalCentered, setModalCentered] = useState(false);

   // atob(branchNameId)
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState([])
   const [categories, setCategories] = useState([])
   const [subcategories, setSubCategories] = useState([])
   // const [products, setProducts]= useState([])
   const [products, setProducts] = useState([])
   const [activeCategory, setActiveCategory] = useState(0)
   const [activeSubCategory, setActiveSubCategory] = useState(0)
   const [activeVariant, setActiveVariant] = useState(0)
   const [grandTotal, setGrandTotal] = useState(0)

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
                  console.log(res.data.fetchData);
                  setProducts(res.data.fetchData);

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
                        setProducts(products.concat(res.data.fetchData))

                     }


                  }

               });

               setSubCategories(res.data.fetchData);


            }
         });
      } else {
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
   // this function called by child (counter)
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
   // this function called by child (counter)

   const activeVariants = (item) => {
      setActiveVariant(item);

   }
   const getGrandTotal = (item) => {
      setGrandTotal(grandTotal + item);
   }
   const clearSession= (e)=>{
      swal({
         title: "Are you sure?",
         text: "Once cleared, you will not be able to recover this files!",
         icon: "warning",
         buttons: [t('cancel'), t('confirm')],
         dangerMode: true,
     })
         .then((willDelete) => {
             if (willDelete) {
               sessionStorage.clear();
               setModalCentered(false);
             } else {
                 swal("Your Data is safe now!");
             }
         });
      
   }
   const [orderInsert, setOrderInsert ]= useState([])
   // const [orderDetails, setOrderDetails ]= useState([])
   const handleInput = (e) => {
      e.persist();
      setOrderInsert({ ...orderInsert, [e.target.name]: e.target.value });
  };
//   const handleOrderDetails= (vID,e) => {
//    e.persist();
//    setOrderDetails({ ...orderDetails,
      
//          [e.target.name]: e.target.value 
//       });
//   }
  const saveOrder= (e)=>{
     e.preventDefault();
     axios.post(`/api/InsertOrder`, orderInsert).then(res => {
      if (res.data.status === 200) {
         setOrderInsert([])
         setModalCentered(false);
          swal("Success", res.data.message, "success");
      } else if (res.data.status === 404) {
          swal("Success", res.data.message, "success");
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

   // const [quantity, setQuantity] = useState(1);
   // const [show, setShow] = useState(false);
   // const showFunction = (e, variant_id)=>{

   //    setShow(!show);
   //    console.log(e.currentTarget.id);
   // }
   // const handleDecrement = (e,variant_id) => {
   //    e.preventDefault();

   //    if (quantity > 1) {
   //       setQuantity(prevCount => prevCount - 1);
   //    } else if (quantity === 1) {
   //       setShow(false)
   //    }
   // }
   // const handelIncrement = (e,variant_id) => {
   //    e.preventDefault();
   //       variants.map((item) =>{
   //        return (item.variantID === variant_id ? setQuantity(prevCount => prevCount + 1): item)
   //       }
   //    )

   //    // setQuantity(prevCount => prevCount + 1);
   // }
   

   const [visible, setVisible] = useState(false)
   var viewShow_HTMLTABLE = "";
   if (loading) {
      return <div className="spinner-border text-primary " role="status" style={{ position: 'fixed', top: '50%', left: '50%' }}><span className="sr-only">{t('loading')}</span></div>
   } else {
      var value;
      viewShow_HTMLTABLE =
         products.map((item, i) => {

            return (
               <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-4 col-half-offset" key={i} id={item.SubCategoryName} >
                  {item.ProductName === value ? <h5 className="row mt-2 mx-3 invisible">{item.ProductName}</h5> : <h5 className="row mt-2 mx-3 text-uppercase font-weight-bold text-black">{item.ProductName}</h5>}
                  <h6 className="d-none">{value = item.ProductName}</h6>
                  <div>
                     <div className={`card ${activeVariant === item.variantID ? "border border-success" : ""} `}>
                        <div className="card-body">
                           <div className="new-arrival-product">

                              <div className="text-center bg-white">
                                 <img className="img-fluid w-100 img-thumbnail" style={{ height: '100px', objectFit: 'contain' }} src={`http://192.168.1.103/yesilik1/public/images/products/${item.image}`} alt="" />
                              </div>
                              {/* <Counter item={item} activeVariants={activeVariant => setActiveVariant(activeVariant)}
                                 // getGrandTotal={grandTotal => setGrandTotal(grandTotal)} 
                                 /> */}
                              <RLink to={`/product/${item.product_id}`} className="text-black">
                                 <div className="new-arrival-content text-center mt-3">
                                    <h4>
                                       {item.ProductName}
                                       <p className="text-success">{item.UnitName}</p>
                                    </h4>

                                    {/* <span className="price">{item.CurrentPrice + ' ' + item.currency_code}</span>
                                    <s className="ms-2">{item.OldPrice + ' ' + item.currency_code}</s> */}
                                 </div>
                              </RLink>


                              {/* <div id={item.variantID}  className={`input-group`}>
                                 <RLink  onClick={(e)=>handleDecrement(e,item.variantID)} className="input-group-text ">{quantity === 1 ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                 </svg> : t('minus')} </RLink>
                                 <div className="input-group-text bg-white "> {quantity}</div>
                                 <RLink  onClick={(e)=>handelIncrement(e,item.variantID)} className="input-group-text" disabled={item.Buyingquantity - item.SellingQuantity === quantity ? 'disabled' : ''}>{t('plus')} </RLink>
                              </div>
                              
                              {item.Buyingquantity - item.SellingQuantity === quantity
                                 ?
                                 <div className="text-danger">
                                    {t('not_available')}
                                 </div>
                                 : ""
                              } */}
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

   var sum=0;
   var message='';

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
            <CNavbar colorScheme="light" className="bg-white" placement="sticky-top" >

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
         <div className="row mt-2 mx-2">

            {viewShow_HTMLTABLE}
         </div>
         <InfiniteScroll
            dataLength={products.length} //This is important field to render the next data
            next={fetchMoreData}
            hasMore={changeState}
            loader={<p className="text-center pt-5" style={{ height: 120 }}><b>{t('loading')}</b></p>}
            endMessage={
               <p style={{ textAlign: 'center ', height: 120 }} >
                  <b>{t('yay_you_have_seen_it_all')}</b>
               </p>
            }
         >

         </InfiniteScroll>
         
         <Modal className="fade bd-example-modal-lg" show={modalCentered} size="lg">
            <Form onSubmit={saveOrder} method="POST">
               <Modal.Header>
                  <Modal.Title>{t('basket')}</Modal.Title>
                  <Button
                     onClick={() => setModalCentered(false)}
                     variant=""
                     className="close"
                  >
                     <span>&times;</span>
                  </Button>
               </Modal.Header>
               <Modal.Body>
                  {products.map((item, i) => {

                     { var variant = JSON.parse(sessionStorage.getItem(`variant${item.variantID}`)) }
                     if (variant != null) {
                        { var quantity = sessionStorage.getItem(`quantity${item.variantID}`) }
                        sum = sum + (variant?.CurrentPrice * quantity)
                        message=  `${message} *Product Name*: ${variant.ProductName} \n *Variant Name*: ${variant.VariationName} \n *QTY*: ${quantity} \n *Unit*: ${variant.UnitName} \n *Price*: ${variant.CurrentPrice} \n *Total Price*: ${quantity * variant.CurrentPrice} *${variant.currency_code}* \n\n\n`
                        return (
                           <div className="row border-bottom text-capitalize my-2" key={i} style={{ color: "black" }} >
                              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-4 mb-2 align-self-center ">
                                 <div className="text-center bg-white">
                                    <img className="img-fluid w-100 img-thumbnail" style={{ height: '100px', objectFit: 'contain' }} src={`http://192.168.1.103/yesilik1/public/images/variants_pics/${variant?.PicturesLocation}`} alt="" />
                                 </div>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-4 align-self-center font-weight-bold">
                                 <span >{variant?.VariationName}</span>
                              </div>

                              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-4 align-self-center">

                                 {variant?.CurrentPrice} {variant?.currency_code}
                              </div>
                              <div className="col-xl-3 col-lg-2 col-md-4 col-sm-4 col-xs-4 align-self-center">
                                 {/* <Counter item={item} show={true} quantity={quantity} activeVariants={activeVariant => setActiveVariant(activeVariant)}
                              /> */}
                              {quantity}
                              </div>
                              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-4 align-self-center font-weight-bold">
                                 {variant?.CurrentPrice * quantity} {variant?.currency_code}
                              </div>
                              {/* <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-4 align-self-center">
                             
                              </div>
                              <div className="col-xl-10 col-lg-10 col-md-4 col-sm-4 col-xs-4 mb-3">
                                 <textarea className="form-control col-xl-12" type="text"

                                    name="note" placeholder={t('note')} onChange={(e)=>handleOrderDetails(variant.variantID,e)}
                                    value={orderDetails.note}
                                    ></textarea>
                              </div> */}
                           </div>
                        )
                     }
                  }
                  )
                  }
                 
                  <p className="d-none">{ message =  `\n\n\n${message} *Grand Total*: ${sum}`}</p>
                  <div className="row" style={{ color: "black" }}>
                  <div className="col-xl-12 col-lg-12 col-md-4 col-sm-4 col-xs-4 mb-3 align-self-center text-center font-weight-bolder ">
                     <p> {t('grand_total')}</p>
                     <span>
                     {sum} 
                     </span>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-4 col-sm-4 col-xs-4 mb-3">
                     <div className="form-group">
                        <label className="mb-1"> {t('phone_number')} </label>
                        <input
                           type="text"
                           className="form-control"
                           placeholder={t('phone_number')}
                           name="phoneNumber"
                           onChange={handleInput}
                                value={orderInsert.phoneNumber}
                        />

                     </div>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-4 col-sm-4 col-xs-4">
                     <div className="form-group">
                        <textarea className="form-control col-xl-12" type="text"

                           name="generalNote" placeholder={t('general_note')}
                           onChange={handleInput}
                                value={orderInsert.generalNote}
                           ></textarea>

                     </div>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-4 col-sm-4 col-xs-4 mb-3 align-self-center text-center font-weight-bolder ">
                     <p> {t('Address')}</p>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-4 col-sm-4 col-xs-4">
                     <div className="form-group">
                        <textarea className="form-control col-xl-12" type="text"

                           name="address" placeholder={t('address')}
                           onChange={handleInput}
                                value={orderInsert.address}
                           ></textarea>

                     </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4 mb-3">
                     <div className="form-group">
                        <label className="mb-1"> {t('buildingNo')} </label>
                        <input
                           type="text"
                           className="form-control"
                           placeholder={t('buildingNo')}
                           name="buildingNo"
                           onChange={handleInput}
                                value={orderInsert.buildingNo}
                        />

                     </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4 mb-3">
                     <div className="form-group">
                        <label className="mb-1"> {t('floor')} </label>
                        <input
                           type="text"
                           className="form-control"
                           placeholder={t('floor')}
                           name="floor"
                           onChange={handleInput}
                                value={orderInsert.floor}
                        />

                     </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4 mb-3">
                     <div className="form-group">
                        <label className="mb-1"> {t('flat')} </label>
                        <input
                           type="text"
                           className="form-control"
                           placeholder={t('flat')}
                           name="flat"
                           onChange={handleInput}
                                value={orderInsert.flat}
                        />

                     </div>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-4 col-sm-4 col-xs-4">
                     <div className="form-group">
                        <textarea className="form-control col-xl-12" type="text"

                           name="directions" placeholder={t('directions')}
                           onChange={handleInput}
                                value={orderInsert.directions}
                           
                           
                           ></textarea>

                     </div>
                  </div>
                  
                  </div>

               </Modal.Body>
               <Modal.Footer>
                  <Button
                     onClick={() => setModalCentered(false)}
                     variant="danger light"
                  >
                     {t('close')}
                  </Button>
                  <Button variant="danger" onClick={(e)=>clearSession(e)}> {t('clear_basket')} </Button>
                  {/* <Button variant="success" type="submit"> {t('send_order')} </Button> */}
                  <ReactWhatsapp  className="btn btn-success" number="905411251310" message={message} type="submit" >{t('send_order')} </ReactWhatsapp>

               </Modal.Footer>
            </Form>
         </Modal>
         <CNavbar expand="lg" colorScheme="light" className="row bg-light text-center" placement="fixed-bottom" >

            {/* <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-4 ">
               <strong>{t('grand_total')}</strong>
               <p className="text-dark">{sum}</p>

            </div>
            <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-4 ">
               <strong>{t('delivery_fee')}</strong>
               <p className="text-dark">Free</p>
            </div> */}
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 ">
               <Button variant="outline-success" onClick={() => setModalCentered(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
               </svg> 
                {t('order_now_by_whatsapp')}
               </Button>

            </div>
         </CNavbar>

      </div>


   );

};

export default ShowBranchDetails;
