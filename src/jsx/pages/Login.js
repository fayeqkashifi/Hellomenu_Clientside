import React, {useState} from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert"
import { useTranslation } from "react-i18next";

const Login = () => {
   // for localization
   const { t } = useTranslation();

   const history = useHistory();
   const [loginstate, setLoginstate] = useState({
      email:'',
      password:'',
   });
  const handleInput = (e) => {
      e.persist();
      setLoginstate({...loginstate, [e.target.name]: e.target.value});
  };
  const checkAuth =  (e) => {
      e.preventDefault();
      axios.get('sanctum/csrf-cookie').then(response=>{
         axios.post("/api/login", loginstate).then(res=>{
            if(res.data.status === 200){
               localStorage.setItem('auth_token', res.data.token);
               localStorage.setItem('auth_name', res.data.user);
               localStorage.setItem('auth_id', res.data.id);
               history.push("/dashboard");
            }
            else{
               swal("Warning",res.data.message,"warning");
            }
        });
      });   
     
   };  
   return (
         <div className="row justify-content-center h-100 align-items-center h-80">
            <div className="col-md-4 ">
               <div className="authincation-content">
                  <div className="row no-gutters">
                     <div className="col-xl-12">
                        <div className="auth-form">
                           <h4 className="text-center mb-4 ">{t('sign_in_your_account')}   </h4>
                           <form onSubmit={checkAuth}>
                            
                              <div className="form-group">    <label className="mb-1 ">  <strong>{t('email')} </strong> </label>
                                 <input type="text"
                                    onChange={handleInput}  
                                    value={loginstate.email}
                                    className="form-control"
                                    placeholder={t('email_msg')}
                                    name="email"  />
                              </div>
                              <div className="form-group">
                                 <label className="mb-1 "> <strong>{t('password')}</strong>  </label>
                                 <input type="password" 
                                    onChange={handleInput}  
                                    value={loginstate.password}
                                    className="form-control" 
                                    placeholder={t('password_msg')}
                                    name="password"   />
                              </div>
                              <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                 <div className="form-group">
                                    <div className="custom-control custom-checkbox ml-1 ">
                                       <input  type="checkbox" className="custom-control-input"   id="basic_checkbox_1"  />
                                       <label    className="custom-control-label" htmlFor="basic_checkbox_1"  > {t('remember_me')}  </label>
                           </div>
                                 </div>
                                 <div className="form-group">
                                    <Link  className=""  to="/forgot-password" > {t('forgot_password')}   </Link>
                                 </div>
                              </div>
                              <div className="text-center">
                                 <button  type="submit"  className="btn btn-primary btn-block"   > {t('sign_in')} </button>
                              </div>
                           </form>
                           <div className="new-account mt-3">
                              <p className=""> {t('have_not_account')}{" "}  
                               <Link className="text-primary" to="/user-register">  {t('sign_up')}    </Link>  </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
             

         </div>

         
         
   );
};

export default Login;
