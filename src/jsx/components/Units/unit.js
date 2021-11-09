import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";
import { Button, Modal,  Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const Unit = (props) => {
    // validation
    const schema = yup.object().shape({
        UnitName: yup.string().required("This field is a required field"),
    }).required();
    const { register, handleSubmit, reset, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
    });
    // for localization
    const { t } = useTranslation();
    // ID
    const id =props.match.params.id;
    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a section
    const [unitInsert, setUnitInsert] = useState({
        UnitName: '',
        brancheID: id
    });
    const handleInput = (e) => {
        e.persist();
        setUnitInsert({...unitInsert, [e.target.name]: e.target.value});
    };
   
    const saveUnit=  (e) => {
        // e.preventDefault();
        axios.post("/api/InsertUnits", unitInsert).then(res=>{
            if(res.data.status === 200){
                setUnitInsert({
                    UnitName: '',
                    brancheID: id
                });
                reset();

                swal("Success",res.data.message,"success");
                setModalCentered(false)
                //  this.props.history.push("/")
            }
        });
    };
    // edit code
    const [editUnit, setEditUnit] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditUnit({...editUnit, [e.target.name]: e.target.value});
    };
    const fetchUnit = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditUnits/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditUnit(res.data.unit);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }

        });

    }
    const updateUnit =  (e) => {
        e.preventDefault();
        axios.post("/api/UpdateUnit", editUnit).then(res=>{
            if(res.data.status === 200){
                setEditUnit('');
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
        axios.get(`/api/GetUnits/${id}`).then(res => {
            if(res.data.status === 200){
                // console.log(res.data.fetchData);
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
      }, [unitInsert,editUnit,id]);

    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>{t('loading')}</h4>
    }else{
        viewProducts_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <tr key={item.id}>
                    <td>{i+1}</td>
                   
                    <td> {item.UnitName}</td>
                    <td>
                        <button type="button"   onClick={(e)=>fetchUnit(e,item.id)} className="btn btn-outline-danger btn-sm">{t('edit')}</button>&nbsp;&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>deleteUnit(e,item.id)} className="btn btn-outline-warning btn-sm">{t('delete')}</button>
                    </td> 
                </tr>
            )
        })

    }
    // delete section 
    const deleteUnit= (e,id)=>{
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
                axios.delete(`/api/DeleteUnits/${id}`).then(res=>{
                    if(res.data.status === 200){
                        swal("Success",res.data.message,"success");
                        setUnitInsert({
                            UnitName: '',
                            brancheID: id
                        });
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
         <PageTItle headingPara={t('units')} activeMenu={t('add_unit')} motherMenu={t('units')}/>
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={handleSubmit(saveUnit)} method= "POST" encType="multipart/form-data">
                <Modal.Header>
                    <Modal.Title>{t('add_unit')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('unit_name')} </strong> </label>
                            <input
                                type="text"
                                {...register("UnitName")}

                                className="form-control"
                                placeholder={t('unit_name')}
                                name="UnitName"
                                onChange={handleInput}  
                                value={unitInsert.UnitName}
                            />
                            <div className="text-danger">
                                {errors.UnitName?.message}
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
                    <Button variant="primary" type="submit">{t('save')}</Button>

                </Modal.Footer>
            </Form>
        </Modal>
         {/* Edit Modal */}
         <Modal className="fade" show={editmodalCentered}>
            <Form onSubmit={updateUnit} method= "POST" >
                <Modal.Header>
                    <Modal.Title>{t('edit_unit')} </Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('unit_name')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('unit_name')}
                                name="UnitName"
                                required
                                onChange={editHandleInput}  
                                value={editUnit.UnitName}
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
							<h4 className="card-title mb-2">{t('units')}</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								{t('add_unit')}
							</Button>
						</div>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive ">
							<table className="table ">
                                <thead>
                                    <tr>
                                        <th>{t('number')}</th>
                                        <th>{t('unit_name')}</th>
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

export default Unit;
