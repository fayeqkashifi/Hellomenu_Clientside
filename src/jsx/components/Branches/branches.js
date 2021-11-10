import React, { Fragment,useState,useEffect } from "react";
import PageTItle from "../../layouts/PageTitle";

import { Button, Modal,  Form } from "react-bootstrap";
import {Link} from "react-router-dom"
// import profile from "../../../images/hellomenu/logo.svg";
import { useTranslation } from "react-i18next";
import axios from "axios";
import swal from "sweetalert"
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const schema = yup.object().shape({
    BrancheName: yup.string().required("This field is a required field"),
    currencyID: yup.string().required("This field is a required field"),
}).required();
const Branches = () => {
    // validation
  
    const { register, handleSubmit, reset, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
    });
    // localization
	const { t } = useTranslation();
    // insert modal
    const [modalCentered, setModalCentered] = useState(false);
    // edit modal
    const [editmodalCentered, setEditModalCentered] = useState(false);
    // insert a branch
    const [branchstate, setBranchstate] = useState([]);
    const handleInput = (e) => {
        e.preventDefault();
        setBranchstate({...branchstate, [e.target.name]: e.target.value});
    };
    const saveBranch =  (e) => {
        // e.preventDefault();
        axios.post("/api/InsertBranches", branchstate).then(res=>{
            if(res.data.status === 200){
                setBranchstate([]);
                reset();
                swal("Success",res.data.message,"success");
                setModalCentered(false)
            }
        });
    };
    // edit code
    const [editBranchstate, setEditBranchstate] = useState([]);
    const editHandleInput = (e) => {
        e.persist();
        setEditBranchstate({...editBranchstate, [e.target.name]: e.target.value});
    };
    const editBranch = (e,id)=>{
        e.preventDefault();
        axios.get(`/api/EditBranches/${id}`).then(res=>{
            if(res.data.status === 200){
                setEditBranchstate(res.data.branch);
                setEditModalCentered(true);
            }else if(res.data.status === 404){
                swal("Error",res.data.message,"error");
            }
        });

    }
    const updateBranch =  (e) => {
        e.preventDefault();
        console.log(editBranchstate);
        
        axios.post("/api/UpdateBranches", editBranchstate).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                setEditBranchstate([]);
                swal("Success",res.data.message,"success");
                setEditModalCentered(false)
                //  this.props.history.push("/")
            }
        });
        
    };
    //for retriving data using laravel API
    const [branchdata,setBranchdata]=useState([]);
    const [currency,setCurrency]=useState([]);
    const [loading, setLoading]=useState(true);
    
    useEffect( () => {
        axios.get('/api/GetBranches').then(res => {
            if(res.data.status === 200){
            setBranchdata(res.data.branches);
            }
            setLoading(false);
          });
          axios.get('/api/GetCurrencies').then(res => {
            if(res.data.status === 200){
                setCurrency(res.data.fetchData);
            }
          });
        
      }, [branchstate,editBranchstate]);

    var viewBranches_HTMLTABLE = "";
    if(loading){
        return <h4>{t('loading')}</h4>
    }else{
        viewBranches_HTMLTABLE = 
        branchdata.map((item,i)=>{
            return (
                <div className="col-xl-4 col-lg-6 col-sm-6" key={item.id}>
                    <div className="card overflow-hidden">
                        <div className="card-body">
                            <div className="text-center">
                            <div className="profile-photo">
                                <div  className="primary">
                                    <Link
                                        to={`show-branch-details/${btoa(item.id)}`}
                                        target="_blank"
                                    >
                                        <QRCode value={`http://192.168.1.103:3000/show-branch-details/${btoa(item.id)}`} className="primary"/>
                                    </Link>
                                
                                </div>
                                {/* <img
                                    src={profile}
                                    width="100"
                                    className="img-fluid rounded-circle"
                                    alt=""
                                /> */}
                            </div>
                            <h3 className="mt-4 mb-1"><Link to={{
                            pathname: `/category/${item.id}`,
                            branchName:item.BrancheName }} > {item.BrancheName}</Link></h3>
                            <p className="text-muted"></p>
                            <Link
                                to=""
                                onClick={(e)=>editBranch(e,item.id)}
                                className="btn btn-primary btn-xxs shadow"
                            >
                                {t('edit')}
                            </Link>
                            <Link
                                to=""
                                onClick={(e)=>deleteBranch(e,item.id)}
                                className="btn btn-outline-danger btn-xxs ml-1"
                            >
                              {t('delete')}

                            </Link>
                            </div>
                        </div>
        
                        <div className="card-footer pt-0 pb-0 text-center">
                            <div className="row">
                            
                            <div className="col-4 pt-3 pb-3 border-right">
                                <Link
                                    to={{
                                    pathname: `/service-area/${item.id}`,
                                    branchName:item.BrancheName }}
                                >
                                    <span>{t('services')}</span>
                                </Link>
                            </div>
                            <div className="col-3 pt-3 pb-3 border-right">
                                <Link
                                    to={{
                                        pathname: `/unit/${item.id}`,
                                        branchName:item.BrancheName }} 
                                >
                                    <span>{t('units')}</span>
                                </Link>
                            </div>
                            <div className="col-5 pt-3 pb-3">
                                <Link
                                    to={{
                                        pathname: `/inventory/${item.id}`,
                                        branchName:item.BrancheName }}
                                >
                                    <span>{t('inventory')}</span>
                                </Link>
                            </div>
                            {/* <div className="col-2 pt-3 pb-3">
                                <Link
                                    to={`show-branch-details/${btoa(item.id)}`}
                                    target="_blank"
                                >
                                    <span>{t('demo')}</span>
                                </Link>
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

    }
    // delete branch 
    const deleteBranch= (e,id)=>{
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
                axios.delete(`/api/DeleteBranches/${id}`).then(res=>{
                    if(res.data.status === 200){
                        swal("Success",res.data.message,"success");
                        // thisClicked.closest("tr").remove();
                    }else if(res.data.status === 404){
                        swal("Success",res.data.message,"success");
                    }
                    setBranchstate([]);
                });
            } else {
              swal("Your Data is safe now!");
            }
          });
    }
    return (
      <Fragment>
         <PageTItle headingPara={t('Branches')} activeMenu={t('add_branch')} motherMenu={t('Branches')} />
        {/* <!-- Insert  Modal --> */}
        <Modal className="fade" show={modalCentered}>
            <Form onSubmit={handleSubmit(saveBranch)} method= "POST" >
                <Modal.Header>
                    <Modal.Title>{t('add_branch')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('branch_name')}</strong> </label>
                            <input
                                type="text"
                                {...register("BrancheName")}
                                className="form-control"
                                placeholder={t('branch_name')}
                                name="BrancheName"
                                onChange={handleInput}  
                                value={branchstate.BrancheName}
                            />
                             <div className="text-danger">
                                {errors.BrancheName?.message}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('currency')}</strong> </label>
                            <select type="text"
                                {...register("currencyID")}

                                className="form-control"
                                placeholder="currencyID"
                                
                                name="currencyID"
                                onChange={handleInput}  
                                value={branchstate.currencyID}>
                                <option value=''>{t('select_currency')}</option> )
                                {
                                currency.map( (item) => 
                                <option value={item.id} key={item.id}>{item.currency_name +' / '+ item.currency_code}</option> )
                            }</select>
                            <div className="text-danger">
                                {errors.currencyID?.message}
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
                    <Button variant="primary" type="submit">{t('save')} </Button>

                </Modal.Footer>
            </Form>
        </Modal>
         {/* Edit Modal */}
         <Modal className="fade" show={editmodalCentered}>
            <Form onSubmit={updateBranch} method= "POST" >
                <Modal.Header>
                    <Modal.Title>{t('edit_branch')}</Modal.Title>
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
                            <label className="mb-1 "> <strong>{t('id')}</strong> </label>
                            <input
                                type="text"
                                disabled="disabled"
                                className="form-control"
                                // placeholder="Branch Name"
                                name="id"
                                required
                                onChange={editHandleInput}  
                                value={editBranchstate.id}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('branch_name')}</strong> </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('branch_name')}
                                name="BrancheName"
                                required
                                onChange={editHandleInput}  
                                value={editBranchstate.BrancheName}
                            />
                        </div>
                        <div className="form-group">
                            <label className="mb-1 "> <strong>{t('currency')}</strong> </label>
                            <select type="text"
                                className="form-control"
                                placeholder="currencyID"
                                name="currencyID"
                                required
                                onChange={editHandleInput}  
                                value={editBranchstate.currencyID}>
                                <option value=''>{t('select_currency')}</option> )
                                {
                                currency.map( (item) => 
                                <option value={item.id} key={item.id}>{item.currency_name +' / '+ item.currency_code}</option> )
                            }</select>
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
							<h4 className="card-title mb-2">{t('branches')}</h4>
						</div>
						<div className="dropdown">
							<Button 
                            variant="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={() => setModalCentered(true)} >
								{t('add_branch')}
							</Button>
						</div>
					</div>
				</div>
			</div>
         </div>
         <div className="row" >
            {viewBranches_HTMLTABLE}
        </div>
        {}
        
      </Fragment>
      
   );
};

export default Branches;
