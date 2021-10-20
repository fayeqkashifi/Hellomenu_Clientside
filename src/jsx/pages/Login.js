import React, {useState} from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert"

const Login = () => {
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
               localStorage.setItem('auth_token', res.data.token)
               localStorage.setItem('auth_name', res.data.user)
               history.push("/home")
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
                           <h4 className="text-center mb-4 "> Sign in your account  </h4>
                           <form onSubmit={checkAuth}>
                            
                              <div className="form-group">    <label className="mb-1 ">  <strong>Email</strong> </label>
                                 <input type="email"
                                    onChange={handleInput}  
                                    value={loginstate.email}
                                    className="form-control"
                                    name="email"  />
                              </div>
                              <div className="form-group">
                                 <label className="mb-1 "> <strong>Password</strong>  </label>
                                 <input type="password" 
                                    onChange={handleInput}  
                                    value={loginstate.password}
                                    className="form-control" 
                                    name="password"   />
                              </div>
                              <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                 <div className="form-group">
                                    <div className="custom-control custom-checkbox ml-1 ">
                                       <input  type="checkbox" className="custom-control-input"   id="basic_checkbox_1"  />
                                       <label    className="custom-control-label" htmlFor="basic_checkbox_1"  >  Remember my preference </label>
                           </div>
                                 </div>
                                 <div className="form-group">
                                    <Link  className=""  to="/forgot-password" > Forgot Password?  </Link>
                                 </div>
                              </div>
                              <div className="text-center">
                                 <button  type="submit"  className="btn btn-primary btn-block"   > Sign Me In </button>
                              </div>
                           </form>
                           <div className="new-account mt-3">
                              <p className=""> Don't have an account?{" "}  
                               <Link className="text-primary" to="/user-register">  Sign up   </Link>  </p>
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
