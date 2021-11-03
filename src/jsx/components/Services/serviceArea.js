import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";

const ServiceArea = (props) => {
    // for localization
    const { t } = useTranslation();
    //ID
    const id =props.match.params.id;

    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section
    const [serviceAreaInsert, setServiceAreaInsert] = useState({
        AreaName: '',
        BranchID: id
    });
    const handleInput = (e) => {
        e.persist();
        setServiceAreaInsert({...serviceAreaInsert, [e.target.name]: e.target.value});
    };
   
    const saveServiceAreas=  (e) => {
        e.preventDefault();
        axios.post("/api/InsertServicAreas", serviceAreaInsert).then(res=>{
            if(res.data.status === 200){
                setServiceAreaInsert({
                    AreaName: '',
                    BranchID: id
                });
                swal("Success",res.data.message,"success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
    };
    // edit code
    const [editServiceAreas, setEditServiceAreas] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditServiceAreas({...editServiceAreas, [e.target.name]: e.target.value});
    };
    const fetchServiceArea = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditServiceAreas/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditServiceAreas(res.data.menu);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }

        });

    }
    const updateServiceArea =  (e) => {
        e.preventDefault();
        axios.post("/api/UpdateServiceAreas", editServiceAreas).then(res=>{
            if(res.data.status === 200){
                console.log(res.data.status);
                setEditServiceAreas('');
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
        axios.get(`/api/GetServiceAreas/${id}`).then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
      }, [serviceAreaInsert,editServiceAreas,id]);

    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>{t('loading')}</h4>
    }else{
        viewProducts_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <tr key={item.id}>
                    <td>{i+1}</td>
                   
                    <td> {item.AreaName}</td>
                    <td>
                        <button type="button"   onClick={(e)=>fetchServiceArea(e,item.id)} className="btn btn-outline-danger btn-sm">{t('edit')}</button>&nbsp;&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>deleteServiceArea(e,item.id)} className="btn btn-outline-warning btn-sm">{t('delete')}</button>
                    </td> 
                </tr>
            )
        })

    }
    // delete section 
    const deleteServiceArea= (e,id)=>{
        e.preventDefault();
        axios.delete(`/api/DeleteServiceAreas/${id}`).then(res=>{
            if(res.data.status === 200){
                swal("Success",res.data.message,"success");
                // thisClicked.closest("tr").remove();
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }
        });
    }
    return (
      <Fragment>
         <PageTItle headingPara={t('services_area')} activeMenu={t('add_service_area')} motherMenu={t('services_area')} />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={saveServiceAreas} method= "POST" encType="multipart/form-data">
                <Modal.Header>
                    <Modal.Title>{t('add_service_area')}</Modal.Title>
                    <Button
                        onClick={() => setModalCentered(false)}
                        variant=""
                        className="close"
                    >
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('branch_name')}: {props.location.branchName}</strong> </label>
                        </div>
                        
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('service_area')}</strong> </label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder={t('service_area')}
                                name="AreaName"
                                required
                                onChange={handleInput}  
                                value={serviceAreaInsert.AreaName}
                            />
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setModalCentered(false)}
                        variant="danger light"
                    >
                        {t('close')}
                    </Button>
                    <Button variant="primary" type="submit">{t('save')}</Button>

                </Modal.Footer>
            </Form>
        </Modal>
         {/* Edit Modal */}
         <Modal className="fade" show={editmodalCentered}>
            <Form onSubmit={updateServiceArea} method= "POST" >
                <Modal.Header>
                    <Modal.Title>{t('edit_service_area')}</Modal.Title>
                    <Button
                        onClick={() => setEditModalCentered(false)}
                        variant=""
                        className="close"
                    >
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('service_area')}</strong> </label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder={t('service_area')}
                                name="AreaName"
                                required
                                onChange={editHandleInput}  
                                value={editServiceAreas.AreaName}
                            />
                        </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setEditModalCentered(false)}
                        variant="danger light"
                    >
                        {t('close')}
                    </Button>
                    <Button variant="primary" type="submit">{t('update')} </Button>

                </Modal.Footer>
            </Form>
        </Modal>
         <div className="row" >
            <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
				<div className="card">
					<div className="card-header border-0">
						<div>
							<h4 className="card-title mb-2">{t('service_area')}</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								{t('add_service_area')}
							</Button>
						</div>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <tr>
                                        <th>{t('number')}</th>
                                        <th>{t('service_area')}</th>
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

export default ServiceArea;
