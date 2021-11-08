import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";

const Inventory = (props) => {
    // for localization
	const { t } = useTranslation();
    const id =props.match.params.id;
    // insert modal
    // const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // edit code
    const [editIventory, setEditInventory] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditInventory({...editIventory, [e.target.name]: e.target.value});
    };
    const fetchUnit = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditInventory/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditInventory(res.data.intenvtory);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }
        });

    }
    const updateInventory =  (e) => {
        e.preventDefault();
        axios.post("/api/UpdateInventory", editIventory).then(res=>{
            if(res.data.status === 200){
                setEditInventory('');
                swal("Success",res.data.message,"success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");

            }
        });     
    };
    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [loading, setLoading]=useState(true);
    
    useEffect( () => {
        axios.get(`/api/GetInventory/${id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
        
      }, [editIventory,id]);

    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>{t('loading')}</h4>
    }else{
        viewProducts_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <tr key={item.id}>
                    <td>{i+1}</td>
                   
                    <td> {item.variant_name}</td>
                    <td> {item.Buyingquantity}</td>
                    <td> {item.SellingQuantity}</td>
                    <td> {item.buyingPrice}</td>
                    <td> {item.sellingPrice}</td>
                    {/* <td> {item.purchase_sell}</td> */}
                    <td>
                        <button type="button"   onClick={(e)=>fetchUnit(e,item.id)} className="btn btn-outline-danger btn-sm">{t('edit')}</button>&nbsp;&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>deleteInventory(e,item.id)} className="btn btn-outline-warning btn-sm">{t('delete')}</button>
                    </td> 
                </tr>
            )
        })

    }
    // delete section 
    const deleteInventory= (e,id)=>{
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: [t('cancel'), t('confirm')],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                axios.delete(`/api/DeleteInventory/${id}`).then(res=>{
                    if(res.data.status === 200){
                        setEditInventory([]);
                        swal("Success",res.data.message,"success");
                    }else if(res.data.status === 404){
                        swal("Error",res.data.message,"error");
                    }
                });
               
            } else {
              swal("Your Data is safe now!");
            }
          });
       
    }
    return (
      <Fragment>
         <PageTItle headingPara={t('inventory')} activeMenu={t('add_variant')} motherMenu={t('inventory')} />
        
         {/* Edit Modal */}
         <Modal className="fade bd-example-modal-lg" show={editmodalCentered} size="lg">
            <Form onSubmit={updateInventory} method= "POST" >
                <Modal.Header>
                    <Modal.Title> {t('edit_inventory')} </Modal.Title>
                    <Button
                        onClick={() => setEditModalCentered(false)}
                        variant=""
                        className="close"
                    >
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="row" >
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('variant_name')}</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('variant_name')}
                                        name="variant_name"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.variant_name}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('buying_quantity')}</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('buying_quantity')}
                                        name="Buyingquantity"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.Buyingquantity}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                               
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('buying_price')}</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('buying_price')}
                                        name="buyingPrice"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.buyingPrice}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>{t('selling_price')}</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('selling_price')}
                                        name="sellingPrice"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.sellingPrice}
                                    />
                                </div>
                            </div>
                            {/* <div className="col-xl-6 col-xxl-6 col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label className="mb-1 "> <strong>SellingQuantity</strong> </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="SellingQuantity"
                                        name="SellingQuantity"
                                        required
                                        onChange={editHandleInput}  
                                        value={editIventory.SellingQuantity}
                                    />
                                </div>
                            </div> */}
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setEditModalCentered(false)}
                        variant="danger light"
                    >
                        {t('close')}
                    </Button>
                    <Button variant="primary" type="submit"> {t('update')} </Button>

                </Modal.Footer>
            </Form>
        </Modal>
         <div className="row" >
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
				<div className="card">
					<div className="card-header border-0">
						<div>
							<h4 className="card-title mb-2">{t('inventory')}</h4>
						</div>
						{/* <div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								{t('add_variant')}
							</Button>
						</div> */}
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <tr>
                                        <th>{t('number')}</th>
                                        <th>{t('variant_name')}</th>
                                        <th>{t('buying_quantity')}</th>
                                        <th>{t('selling_quantity')}</th>
                                        <th>{t('buying_price')}</th>
                                        <th>{t('selling_price')}</th>
                                        {/* <th>{t('purchase_sell')}</th> */}
                                        <th>{t('actions')}</th>
                                    </tr>
                                </thead>
								<tbody>
                                    {viewProducts_HTMLTABLE}
							    </tbody>
                            </table>
						</div>
					</div>
				</div>
			</div>
         </div>
      </Fragment>
   );
};

export default Inventory;
