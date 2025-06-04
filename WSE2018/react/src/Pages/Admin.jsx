import { useEffect, useState } from "react"
import { getUserData, loginUser, getAdminData, BASE_URL, updateOrderStatus } from "../Handlers/AdminAPIHandler"

const Admin = () => {
    const [user, setUser] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });
    const [errors, setErrors] = useState([]);
    const [adminData, setAdminData] = useState();
    const [selectedOrder, setSelectedOrder] = useState();
    const [statusRadio, setStatusRadio] = useState();
    const [remark, setRemark] = useState();

    useEffect(() => {
        getUserData((data) => {
            setUser(data)
        })
    }, []);

    useEffect(() => {
        getAdminData(setAdminData);
    }, [user]);

    useEffect(() => {
        setStatusRadio(selectedOrder && selectedOrder.status);
        if(selectedOrder) setRemark(selectedOrder.remark);
    }, [selectedOrder]);

    function handleLogin(e) {
        e.preventDefault();

        loginUser(formData, (data, err) => {
            if (data) setUser(data);
            setErrors(err);
        })
    }

    function onLogout() {
        localStorage.removeItem("AdminLoginToken");
        setUser(null);
    }

    function handleStatusChange(e) {
        e.preventDefault();

        updateOrderStatus(selectedOrder.id, statusRadio, remark, () => {
            getAdminData(setAdminData);
            setSelectedOrder(null);
        });
    }

    return (
        <>
            {user ? <>
                <button className="btn" onClick={onLogout}>Logout</button>
                <h1 className="title">Admin panel</h1>
                {adminData && <>
                    {selectedOrder ? <>
                        <button className="btn" onClick={() => { setSelectedOrder(null) }}>Back</button>
                        <h2>Order Detail for #ORDER{selectedOrder.id}</h2>
                        <div className="statuswrapper">
                            <div className={`status ${selectedOrder.status === "open" ? 'selected' : ''}`}>Opened</div>
                            <div className={`status ${selectedOrder.status === "prepared" ? 'selected' : ''}`}>Prepared</div>
                            <div className={`status ${selectedOrder.status === "closed" ? 'selected' : ''}`}>Closed/Delivered</div>
                        </div>
                        <div>
                            <p>Lastname: {selectedOrder.lastname}</p>
                            <p>Firstname: {selectedOrder.firstname}</p>
                            <p>Email: {selectedOrder.email}</p>
                            <table className="carttable">
                                <thead>
                                    <tr>
                                        <th>Preview</th>
                                        <th>Name</th>
                                        <th>Color</th>
                                        <th>Design Symbol ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item, index) => {
                                        return <tr key={index}>
                                            <td>
                                                <div className="wrapper">
                                                    <img className="product-image" src={`${BASE_URL}/storage/products/${item.product.imgname}-${item.color.name}.png`} alt={item.color.name} />
                                                    <img className="symbol-image" src={`${BASE_URL}/storage/designsymbols/${item.symbol.img}`} alt={item.symbol.img} />
                                                </div>
                                            </td>
                                            <td>{item.product.name}</td>
                                            <td>{item.color.name}</td>
                                            <td>{item.symbol.id}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            <div>
                                <h2>Status:</h2>
                                <form onSubmit={handleStatusChange}>
                                    <div>
                                        <input checked={statusRadio === "open"} id="openradio" type="radio" name="status" value={"open"} onChange={(e) => {setStatusRadio("open")}} />
                                        <label htmlFor="openradio">Opened</label>
                                    </div>
                                    <div>
                                        <input checked={statusRadio === "prepared"} id="preparedradio" type="radio" name="status" value={"prepared"} onChange={(e) => {setStatusRadio("prepared")}} />
                                        <label htmlFor="preparedradio">Prepared</label>
                                    </div>
                                    <div>
                                        <input checked={statusRadio === "closed"} id="closedradio" type="radio" name="status" value={"closed"} onChange={(e) => {setStatusRadio("closed")}} />
                                        <label htmlFor="closedradio">Closed/Delivered</label>
                                    </div>
                                    <div>
                                        <label htmlFor="remark">Remark</label>
                                        <textarea value={remark} id="remark" cols={50} rows={4} onChange={(e) => {setRemark(e.target.value)}}></textarea>
                                    </div>
                                    <button type="submit" className="btn">Update</button>
                                </form>
                            </div>
                        </div>
                    </> : <>
                        <div>
                            <h2 className="title">Orders</h2>
                            {adminData.orders.map((order, index) => {
                                return <div key={index} onClick={() => { setSelectedOrder(order) }} className="order-view">
                                    <div className="order-top">
                                        <h3>{index + 1}. #ORDER{order.id}</h3>
                                        <p>{order.status}</p>
                                    </div>
                                    <div className="items">
                                        {order.items.map((item, index) => {
                                            return <div key={index} className="wrapper">
                                                <img className="product-image" src={`${BASE_URL}/storage/products/${item.product.imgname}-${item.color.name}.png`} alt={item.color.name} />
                                                <img className="symbol-image" src={`${BASE_URL}/storage/designsymbols/${item.symbol.img}`} alt={item.symbol.img} />
                                            </div>
                                        })}
                                    </div>
                                </div>
                            })}
                        </div>
                    </>}
                </>}
            </> : <>
                <form onSubmit={handleLogin} className="loginform">
                    {errors && <p className="error">{errors[1]}</p>}
                    <div>
                        <label htmlFor="name">Firstname</label>
                        <input type="text" id="name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }} required />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }} required />
                    </div>
                    <button type="submit" className="btn" disabled={(formData.name.length < 1 || formData.password.length < 1)}>Login</button>
                </form>
            </>}
        </>
    )
}

export default Admin