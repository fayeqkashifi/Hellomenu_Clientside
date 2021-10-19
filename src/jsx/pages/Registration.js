import React, {Component} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CSRFInput from "@ueaweb/laravel-react-csrf-input";


class Registration extends Component  {
   state=
      {
      name:'',
      phone_number:'',
      email:'',
      password:''
      }
   handleInput = (e)=> {
      this.setState({[e.target.name]: e.target.value});
      
   }
   myToken = document.head.querySelector('meta[name="csrf-token"]').getAttribute('content');
   // console.log(this.my);

   checkTheAuth =  async (e)=> {
      e.preventDefault();
      console.log( this.state);
   //    axios.defaults.headers.common = {
   //       'X-CSRF-TOKEN': window.csrf_token,
   //       'X-Requested-With': 'XMLHttpRequest',
   //   };

       
      const res = await axios.post('http://localhost/yesilik1/public/api/register', this.state);
      console.log( res.data.message);
      
      if(res.data.status === 200){

         this.setState({
            name:'',
            phone_number:'',
            email:'',
            password:''
         });
         this.props.history.push("/");

      }
   }


	
   render() {
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
                           onSubmit={this.checkTheAuth}
                           encType="multipart/form-data"

                        >
                           
                           <CSRFInput token={this.myToken} />

                           <div className="form-group">
                              <label className="mb-1 "> <strong>Full Name</strong> </label>
                              <input
                                 type="text"
                                 className="form-control"
                                 placeholder="Full name"
                                 name="name"
                                 onChange={this.handleInput}  
                                 value={this.state.name}
                                 
                              />
                           </div>
                           <div className="form-group">
                              <label className="mb-1 "> <strong>Phone</strong> </label>
                              <input
                                 type="text"
                                 className="form-control"
                                 placeholder="phone"
                                 name="phone_number"
                                 onChange={this.handleInput}  value={this.state.phone_number}
                                 
                              />
                           </div>
                           <div className="form-group">
                              <label className="mb-1 ">   <strong>Email</strong>  </label>
                              <input  
                              type="email"
                              className="form-control"  
                              placeholder="hello@example.com"  
                              name="email"
                              onChange={this.handleInput}  value={this.state.email}
                              />
                           </div>
                           <div className="form-group">
                              <label className="mb-1 ">   <strong>Password</strong>  </label>
                              <input type="password" 
                              className="form-control" 
                              name="password" 
                              onChange={this.handleInput}  value={this.state.password}
                              />
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
};

export default Registration;
