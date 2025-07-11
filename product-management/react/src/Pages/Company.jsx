import axios from 'axios';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Company = () => {
    const navigate = useNavigate();
    const [ company, setCompany ] = useState(null);
    const { company_id } = useParams();
    const [ formData, setFormData ] = useState();

    console.log(company);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            if (company_id !== "create") {
                axios.get(`http://127.0.0.1:8000/api/admin/company/${company_id}?token=${token}`).then(res => {
                    setCompany(res.data);
                    setFormData(res.data);
                }).catch(e => {
                    localStorage.removeItem("token");
                    navigate("/login");
                })
            } else {
                setFormData({
                    'companyName': "",
                    'companyAddress': "",
                    'companyTelephone': "",
                    'companyEmail': "",
                    'owner': {
                        'name': "",
                        'email': "",
                        'mobileNumber': ""
                    },
                    'contact': {
                        'name': "",
                        'email': "",
                        'mobileNumber': ""
                    }
                })
            }
        } else {
            navigate("/login");
        }
    }, []);

    function updateCompany(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        axios.post(`http://127.0.0.1:8000/api/admin/company/${company_id}`, {
            ...formData,
            token: token
        }).then(res => {
            console.log(res);
        }).finally(() => {
            navigate("/admin");
        })

    }

    return (
        <>
            {formData ? <>
                <h1>Company</h1>
                <form onSubmit={updateCompany}>
                    <h2>Company info</h2>
                    <div>
                        <label htmlFor="companyName">Name</label>
                        <input type="text" id="companyName" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                    </div>
                    <div>
                        <label htmlFor="companyAddress">Address</label>
                        <input type="text" id="companyAddress" value={formData.companyAddress} onChange={(e) => setFormData({...formData, companyAddress: e.target.value})} />
                    </div>
                    <div>
                        <label htmlFor="companyTelephone">Telephone</label>
                        <input type="text" id="companyTelephone" value={formData.companyTelephone} onChange={(e) => setFormData({...formData, companyTelephone: e.target.value})} />
                    </div>
                    <div>
                        <label htmlFor="companyEmail">Email</label>
                        <input type="text" id="companyEmail" value={formData.companyEmail} onChange={(e) => setFormData({...formData, companyEmail: e.target.value})} />
                    </div>
                    <h2>Owner</h2>
                    <div>
                        <label htmlFor="owner.name">Name</label>
                        <input type="text" id="owner.name" value={formData.owner.name} onChange={(e) => setFormData({...formData, owner: {...formData.owner, name: e.target.value}})} />
                    </div>
                    <div>
                        <label htmlFor="owner.email">Email</label>
                        <input type="text" id="owner.email" value={formData.owner.email} onChange={(e) => setFormData({...formData, owner: {...formData.owner, email: e.target.value}})} />
                    </div>
                    <div>
                        <label htmlFor="owner.mobileNumber">Mobile Number</label>
                        <input type="text" id="owner.mobileNumber" value={formData.owner.mobileNumber} onChange={(e) => setFormData({...formData, owner: {...formData.owner, mobileNumber: e.target.value}})} />
                    </div>
                    <h2>Contact</h2>
                    <div>
                        <label htmlFor="contact.name">Name</label>
                        <input type="text" id="contact.name" value={formData.contact.name} onChange={(e) => setFormData({...formData, contact: {...formData.contact, name: e.target.value}})} />
                    </div>
                    <div>
                        <label htmlFor="contact.email">Email</label>
                        <input type="text" id="contact.email" value={formData.contact.email} onChange={(e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})} />
                    </div>
                    <div>
                        <label htmlFor="contact.mobileNumber">Mobile Number</label>
                        <input type="text" id="contact.mobileNumber" value={formData.contact.mobileNumber} onChange={(e) => setFormData({...formData, contact: {...formData.contact, mobileNumber: e.target.value}})} />
                    </div>
                    <button type="submit">{company ? "Update" : "Create"} company</button>
                </form>
                {company && <div>
                    <h2>Products</h2>
                    <Link to={`/admin/company/${company.id}/createproduct`}>Create</Link>
                    {company.products.map(product => {
                        return <Link to={`/admin/product/${product.gtin}`}>
                            <h3>{product.name.en}</h3>
                        </Link>
                    })}
                </div>}

            </> : <>
                <h1>Loading...</h1>
            </>}
        </>
    )
}

export default Company