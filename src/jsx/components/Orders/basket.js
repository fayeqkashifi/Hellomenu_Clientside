import React,{Fragment,useEffect, useState } from 'react';

import { Table, Badge, Dropdown } from "react-bootstrap";

import axios from "axios";

const Basket = () => {

    
    
    //for retriving data using laravel API
    const [fetchData,setFetchData]=useState([]);
    const [loading, setLoading]=useState(true);
    
    useEffect( () => {
        axios.get('/api/GetBaskets').then(res => {
            if(res.data.status === 200){
                setFetchData(res.data.fetchData);
            }
            setLoading(false);
          });
      }, []);

    var viewProducts_HTMLTABLE = "";
    if(loading){
        return <h4>Loading...!</h4>
    }else{
        viewProducts_HTMLTABLE = 
        fetchData.map((item,i)=>{
            return (
                <tr key={item.id}>
                    <td>{i+1}</td>
                    <td>{item.VariationName}</td>
                    <td>{item.ProductName}</td>
                    <td>{item.VariantQuantity}</td>
                    <td>{item.CountryName}</td>
                    <td>{item.CityName}</td>
                    <td>{item.user_ip}</td>
                    <td>{item.BrowserName}</td>
                    <td>
                            {item.Status===0 ? <Badge variant="danger light">
                            <i className="fa fa-circle text-danger mr-1"></i> Pendding</Badge> : <Badge variant="success light">
                            <i className="fa fa-circle text-success mr-1"></i>
                            Completed
                        </Badge>}
                        </td>
                    <td>
                    <Dropdown>
                        <Dropdown.Toggle
                        variant
                        className="icon-false table-dropdown"
                        >
                        <svg
                            width="24px"
                            height="24px"
                            viewBox="0 0 24 24"
                            version="1.1"
                        >
                            <g
                                stroke="none"
                                stroke-width="1"
                                fill="none"
                                fill-rule="evenodd"
                            >
                                <rect
                                    x="0"
                                    y="0"
                                    width="24"
                                    height="24"
                                ></rect>
                                <circle
                                    fill="#000000"
                                    cx="5"
                                    cy="12"
                                    r="2"
                                ></circle>
                                <circle
                                    fill="#000000"
                                    cx="12"
                                    cy="12"
                                    r="2"
                                ></circle>
                                <circle
                                    fill="#000000"
                                    cx="19"
                                    cy="12"
                                    r="2"
                                ></circle>
                            </g>
                        </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item to="#">
                                Accept Patient
                            </Dropdown.Item>
                            <Dropdown.Item to="#">
                                Reject Order
                            </Dropdown.Item>
                            <Dropdown.Item to="#">
                                View Details
                            </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        </td>
                </tr>
            )
        })
    }
  
	return (
		<Fragment>
			<div className="col-12">
                <div className="card">
                    <div className="card-header">
                    <h4 className="card-title">Orders</h4>
                    </div>
                    <div className="card-body">
                    <Table responsive className="w-100">
                        <div id="example_wrapper" className="dataTables_wrapper">
                            <table id="example" className="display w-100 dataTable">
                                <thead>
                                    <tr>
                                        <th>#NO</th>
                                        <th>Variation Name</th>
                                        <th>Product Name</th>
                                        <th>Variant Quantity</th>
                                        <th>Country Name</th>
                                        <th>City Name</th>
                                        <th>user ip </th>
                                        <th>Browser Name</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewProducts_HTMLTABLE}
                                </tbody>
                            </table>
                        </div>
                    </Table>
                    </div>
                </div>
            </div>
		</Fragment>
					
	);
}
export default Basket;