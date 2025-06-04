import { useContext, useEffect, useState } from "react"
import { BASE_URL, getCart, orderCart } from "../Handlers/APIHandler"
import AppContext from "../Contexts/AppContext";

const Cart = () => {
    const [navItems, setNavItems, cart, setCart] = useContext(AppContext);
    const [items, setItems] = useState([]);
    const [step, setStep] = useState(1);
    const [contactInformation, setContactInformation] = useState({
        firstname: '',
        lastname: '',
        email: ''
    })

    useEffect(() => {
        setItems(getCart());
    }, []);

    var totalPrice = 0;

    items.forEach(item => {
        totalPrice += item.product.price;
    });

    function handleCheckout(e) {
        e.preventDefault();
        orderCart(items, contactInformation);
        setCart([]);
        setStep(3)
    }

    return (
        <>
            <h1 className="title">Cart</h1>
            {step === 1 && <>
                <table className="carttable">
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Name</th>
                            <th>Color</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            return <tr key={index}>
                                <td>
                                    <div className="wrapper">
                                        <img className="product-image" src={`${BASE_URL}/storage/products/${item.product.imgname}-${item.color.name}.png`} alt={item.color.name} />
                                        <img className="symbol-image" src={`${BASE_URL}/storage/designsymbols/${item.symbol.img}`} alt={item.symbol.img} />
                                    </div>
                                </td>
                                <td>{item.product.name}</td>
                                <td>{item.color.name}</td>
                                <td>€{item.product.price}</td>
                            </tr>
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}></td>
                            <td>Total: €{totalPrice}</td>
                        </tr>
                    </tfoot>
                </table>
                <button className="btn" onClick={() => { setStep(2) }}>Checkout</button>
            </>}
            {step === 2 && <>
                <form onSubmit={handleCheckout}>
                    <div>
                        <label htmlFor="lastname">Lastname</label>
                        <input type="text" id="lastname" value={contactInformation.lastname} onChange={(e) => { setContactInformation({ ...contactInformation, lastname: e.target.value }) }} required />
                    </div>
                    <div>
                        <label htmlFor="firstname">Firstname</label>
                        <input type="text" id="firstname" value={contactInformation.firstname} onChange={(e) => { setContactInformation({ ...contactInformation, firstname: e.target.value }) }} required />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={contactInformation.email} onChange={(e) => { setContactInformation({ ...contactInformation, email: e.target.value }) }} required />
                    </div>
                </form>
                <button className="btn" onClick={handleCheckout} disabled={(contactInformation.lastname.length < 1) || (contactInformation.firstname.length < 1) || (contactInformation.email.length < 1)}>Place pre-order</button>
            </>}
            {step === 3 && <>
                <h2 className="title">Thank you for ordering!</h2>
            </>}
        </>
    )
}

export default Cart