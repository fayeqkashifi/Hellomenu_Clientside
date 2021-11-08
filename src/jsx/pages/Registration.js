import React, {useState} from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Registration = () => {
   const schema = yup.object().shape({
      name: yup.string().required(),
      phone_number: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(6),
   }).required();
   const { register, handleSubmit,reset, formState:{ errors } } = useForm({
      resolver: yupResolver(schema)
    });
   // for localization
   const { t } = useTranslation();

   const history = useHistory();
   const [registerstate, setRegisterstate] = useState({
      name:'',
      phone_number:'',
      email:'',
      password:'',
      // error_list:[],
   });
  const handleInput = (e) => {
      e.persist();
      setRegisterstate({...registerstate, [e.target.name]: e.target.value});
  };
  const saveRegister =  (e) => {
      axios.get('sanctum/csrf-cookie').then(response=>{
         axios.post("/api/register", registerstate).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                localStorage.setItem('auth_token', res.data.token);
                localStorage.setItem('auth_name', res.data.user);
                localStorage.setItem('auth_id', res.data.id);

                setRegisterstate({
                    name: '',
                    phone_number:'',
                    email:'',
                    password:''
                 });
                reset();
                 swal("Success",res.data.message,"success");
                 history.push("/page-login")
            }
        });
      });
     
   };  
   return (
      <div className="row justify-content-center  h-200 align-items-center h-80">
         <div className="col-md-4">
            <div className="authincation-content">
               <div className="row no-gutters">
                  <div className="col-xl-12">
                     <div className="auth-form">
                        <div className="text-center mb-3">
                          <h4 className="text-center mb-4">{t('sign_up_your_account')}</h4>
                        </div>
                        
                        <form
                           method="POST"
                           onSubmit={handleSubmit(saveRegister)}
                           encType="multipart/form-data"

                        >
                           <div className="form-group">
                              <label className="mb-1 "> <strong>{t('full_name')}</strong> </label>
                              <input
                                 type="text"
                                 {...register("name")}
                                 className="form-control"
                                 placeholder={t('full_name')}
                                 name="name"
                                 onChange={handleInput}  
                                 value={registerstate.name}
                                 
                              />
                              <div className="text-danger">
                                 {errors.name?.message}
                              </div>
                           </div>
                           <div className="form-group">
                              <label className="mb-1 "> <strong>{t('phone')}</strong> </label>
                              <input
                                 type="text"
                                 {...register("phone_number")}
                                 className="form-control"
                                 placeholder={t('phone')}
                                 name="phone_number"
                                 onChange={handleInput}  value={registerstate.phone_number}
                              />
                               <div className="text-danger">
                                 {errors.phone_number?.message}
                              </div>
                           </div>
                           <div className="form-group">
                              <label className="mb-1 ">   <strong>{t('email')}</strong>  </label>
                              <input  
                              type="email"
                              {...register("email")}

                              className="form-control"  
                              placeholder={t('email_example')} 
                              name="email"
                              onChange={handleInput}  value={registerstate.email}
                              />
                              <div className="text-danger">
                                 {errors.email?.message}
                              </div>
                           </div>
                           <div className="form-group">
                              <label className="mb-1 ">   <strong>{t('password')}</strong>  </label>
                              <input type="password" 
                              {...register("password")}

                              className="form-control" 
                              name="password" 
                              placeholder={t('password_msg')}
                              onChange={handleInput}  value={registerstate.password}
                              />
                              <div className="text-danger">
                                 {errors.password?.message}
                              </div>
                           </div>
                           <div className="text-center mt-4">
                              <button type="submit" className="btn btn-primary btn-block"   >  {t('sign_me_up')}  </button>
                           </div>
                        </form>
                        <div className="new-account mt-3">
                           <p className="">
                           {t('already_have_an_account')}  {" "}
                              <Link className="text-primary" to="/page-login">
                              {t('sign_in')}  
                              </Link>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

};

export default Registration;
