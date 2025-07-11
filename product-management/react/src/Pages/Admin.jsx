import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Admin = () => {
    const navigate = useNavigate();
    const [ companies, setCompanies ] = useState([]);
    const [ products, setProducts ] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            axios.get(`http://127.0.0.1:8000/api/admin/companies?token=${token}`).then(res => {
                setCompanies(res.data);
            }).catch(e => {
                localStorage.removeItem("token");
                navigate("/login");
            });

            axios.get(`http://127.0.0.1:8000/api/products.json`).then(res => {
                setProducts(res.data);
            })
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <>
            {companies ? <>
                <h1>Admin</h1>
                <div>
                    <h2>Companies</h2>
                    <Link to="/admin/company/create">Create</Link>
                    <ul>
                        {companies.map(company => {
                            return <li key={company.id}><Link to={`/admin/company/${company.id}`}>
                                {company.companyName}
                            </Link></li>
                        })}
                    </ul>
                </div>
                <div>
                    <h2>Products</h2>
                    <div>
                        {products.map(product => {
                            return <Link to={`/admin/product/${product.gtin}`}>
                                <h3>{product.name.en}</h3>
                            </Link>
                        })}
                    </div>
                </div>

            </> : <>
                <h1>Logging in...</h1>
            </>}
        </>
    )
}

export default Admin