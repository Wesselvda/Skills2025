import { useNavigate } from "react-router-dom";
import { addToCart, BASE_URL, getCart } from "../Handlers/APIHandler"
import { useContext } from "react";
import AppContext from "../Contexts/AppContext";

const ProductView = ({ product, symbol, color }) => {
    const navigate = useNavigate();
    const [navItems, setNavItems, cart, setCart] = useContext(AppContext);

    function handleAddToCart(e) {
        e.preventDefault();

        addToCart({ product, symbol, color });
        setCart(getCart());

        navigate('/cart');
    }

    return (
        <div className="product-view">
            <div className="product-preview">
                <div className="wrapper">
                    <img className="product-image" src={`${BASE_URL}/storage/products/${product.imgname}-${color.name}.png`} alt={color.name} />
                    <img className="symbol-image" src={`${BASE_URL}/storage/designsymbols/${symbol.img}`} alt={symbol.img} />
                </div>
            </div>
            <div className="product-data">
                <h1>{product.name}</h1>
                <p>Color: {color.name}</p>
                <h2>€{product.price}</h2>
                <button onClick={handleAddToCart} className="btn">Add to cart</button>
            </div>
        </div>
    )
}

export default ProductView