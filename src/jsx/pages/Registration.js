import React, {useState} from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const Registration = () => {
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
      e.preventDefault();
      // const data={
      //    name:branchstate.BrancheName
      //    name:branchstate.BrancheName
      //    name:branchstate.BrancheName
      // }
      axios.get('sanctum/csrf-cookie').then(response=>{
         axios.post("/api/register", registerstate).then(res=>{
            if(res.data.status === 200){
                // console.log(res.data.status);
                localStorage.setItem('auth_token', res.data.token)
                localStorage.setItem('auth_name', res.data.user)
                setRegisterstate({
                    name: '',
                    phone_number:'',
                    email:'',
                    password:''
                 });
                 swal("Success",res.data.message,"success");
                 history.push("/login")
            }
            // else{
            //    setRegisterstate({...registerstate,error_list: res.data.validation_errors})
            // }
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
                          <h4 className="text-center mb-4">Sign up your account</h4>
                        </div>
                        
                        <form
                           method="POST"
                           onSubmit={saveRegister}
                           encType="multipart/form-data"

                        >
                           <div className="form-group">
                              <label className="mb-1 "> <strong>Full Name</strong> </label>
                              <input
                                 type="text"
                                 className="form-control"
                                 placeholder="Full name"
                                 name="name"
                                 onChange={handleInput}  
                                 value={registerstate.name}
                                 required
                                 
                              />
                              {/* <span>{registerstate.error_list.name}</span> */}
                           </div>
                           <div className="form-group">
                              <label className="mb-1 "> <strong>Phone</strong> </label>
                              <input
                                 type="text"
                                 className="form-control"
                                 placeholder="phone"
                                 name="phone_number"
                                 onChange={handleInput}  value={registerstate.phone_number}
                                 required
                                 
                              />
                              {/* <span>{registerstate.error_list.phone_number}</span> */}

                           </div>
                           <div className="form-group">
                              <label className="mb-1 ">   <strong>Email</strong>  </label>
                              <input  
                              type="email"
                              className="form-control"  
                              placeholder="hello@example.com"  
                              required
                              name="email"
                              onChange={handleInput}  value={registerstate.email}
                              />
                              {/* <span>{registerstate.error_list.email}</span> */}

                           </div>
                           <div className="form-group">
                              <label className="mb-1 ">   <strong>Password</strong>  </label>
                              <input type="password" 
                              className="form-control" 
                              name="password" 
                              onChange={handleInput}  value={registerstate.password}
                              required

                              />
                              {/* <span>{registerstate.error_list.password}</span> */}

                           </div>
                           <div className="text-center mt-4">
                              <button type="submit" className="btn btn-primary btn-block"   >  Sign me up  </button>
                           </div>
                        </form>
                        <div className="new-account mt-3">
                           <p className="">
                              Already have an account?{" "}
                              <Link className="text-primary" to="/">
                                 Sign in
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
