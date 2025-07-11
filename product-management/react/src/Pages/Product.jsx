import axios from 'axios';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Product = () => {
    const navigate = useNavigate();
    const [ product, setProduct ] = useState(null);
    const { gtin } = useParams();
    const [ formData, setFormData ] = useState();

    console.log(product);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            if (gtin !== "create") {
                axios.get(`http://127.0.0.1:8000/api/product/${gtin}.json`).then(res => {
                    setProduct(res.data);
                    setFormData(res.data);
                }).catch(e => {

                })
            } else {
                setFormData({
                    'brand': "",
                    'countryOfOrigin': "",
                    'name': {
                        'en': "",
                        'fr': "",
                    },
                    'description': {
                        'en': "",
                        'fr': "",
                    },
                    'weight': {
                        'gross': 0,
                        'net': 0,
                        'unit': 'g'
                    }
                })
            }
        } else {
            navigate("/login");
        }
    }, []);

    function updateProduct(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        axios.post(`http://127.0.0.1:8000/api/product/${gtin}.json`, {
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
                <h1>Product</h1>
                <form onSubmit={updateProduct}>
                    <h2>Product info</h2>
                    <div>
                        <label htmlFor="brand">Brand</label>
                        <input type="text" id="brand" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
                    </div>
                    <div>
                        <label htmlFor="countryOfOrigin">Country of Origin</label>
                        <input type="text" id="countryOfOrigin" value={formData.countryOfOrigin} onChange={(e) => setFormData({...formData, countryOfOrigin: e.target.value})} />
                    </div>
                    <h3>Name</h3>
                    <div>
                        <label htmlFor="name.en">En</label>
                        <input type="text" id="name.en" value={formData.name.en} onChange={(e) => setFormData({...formData, name: {...formData.name, en: e.target.value}})} />
                    </div>
                    <div>
                        <label htmlFor="name.fr">Fr</label>
                        <input type="text" id="name.fr" value={formData.name.fr} onChange={(e) => setFormData({...formData, name: {...formData.name, fr: e.target.value}})} />
                    </div>
                    <h3>Description</h3>
                    <div>
                        <label htmlFor="description.en">En</label>
                        <input type="text" id="description.en" value={formData.description.en} onChange={(e) => setFormData({...formData, description: {...formData.description, en: e.target.value}})} />
                    </div>
                    <div>
                        <label htmlFor="description.fr">Fr</label>
                        <input type="text" id="description.fr" value={formData.description.fr} onChange={(e) => setFormData({...formData, description: {...formData.description, fr: e.target.value}})} />
                    </div>
                    <h3>Weight</h3>
                    <div>
                        <label htmlFor="weight.gross">Gross</label>
                        <input type="number" step={0.01} id="weight.gross" value={formData.weight.gross} onChange={(e) => setFormData({...formData, weight: {...formData.weight, gross: e.target.value}})} />
                    </div>
                    <div>
                        <label htmlFor="weight.net">Net</label>
                        <input type="number" step={0.01} id="weight.net" value={formData.weight.net} onChange={(e) => setFormData({...formData, weight: {...formData.weight, net: e.target.value}})} />
                    </div>
                    <div>
                        <label htmlFor="weight.unit">Unit</label>
                        <input type="text" id="weight.unit" value={formData.weight.unit} onChange={(e) => setFormData({...formData, weight: {...formData.weight, unit: e.target.value}})} />
                    </div>
                    
                    <button type="submit">{product ? "Update" : "Create"} product</button>
                </form>

            </> : <>
                <h1>Loading...</h1>
            </>}
        </>
    )
}

export default Product