import { useEffect, useState } from "react"
import { BASE_URL, getColors, getDesignSymbols, getProducts } from "../Handlers/APIHandler";
import ProductView from "../Components/ProductView";

const Home = () => {
    const [designSymbols, setDesignSymbols] = useState([]);
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [chosenDesignSymbol, setChosenDesignSymbol] = useState(null);
    const [chosenProduct, setChosenProduct] = useState(null);
    const [chosenColor, setChosenColor] = useState(null);

    useEffect(() => {
        getDesignSymbols(setDesignSymbols);
        getProducts(setProducts);
        getColors(setColors);
    }, []);

    return (
        <>
            {chosenDesignSymbol ? <>
                {chosenProduct ? <>
                    {chosenColor ? <>
                        <button className="btn" onClick={() => { setChosenColor(null) }}>Back</button>
                        <ProductView product={chosenProduct} symbol={chosenDesignSymbol} color={chosenColor} />
                    </> : <>
                        <button className="btn" onClick={() => { setChosenProduct(null) }}>Back</button>
                        <h1 className="title">Choose a color</h1>
                        <div className="product-grid">
                            {colors.map(color => {
                                return <button className="item" key={color.name} onClick={() => { setChosenColor(color) }}>
                                    <div className="wrapper">
                                        <img className="product-image" src={`${BASE_URL}/storage/products/${chosenProduct.imgname}-${color.name}.png`} alt={color.name} />
                                        <img className="symbol-image" src={`${BASE_URL}/storage/designsymbols/${chosenDesignSymbol.img}`} alt={chosenDesignSymbol.img} />
                                    </div>
                                </button>
                            })}
                        </div>
                    </>}
                </> : <>
                    <button className="btn" onClick={() => { setChosenDesignSymbol(null) }}>Back</button>
                    <h1 className="title">Choose a product</h1>
                    <div className="product-grid">
                        {products.map(product => {
                            return <button className="item" key={product.id} onClick={() => { setChosenProduct(product) }}>
                                <div className="wrapper">
                                    <img className="product-image" src={`${BASE_URL}/storage/products/${product.imgname}-white.png`} alt={product.name} />
                                    <img className="symbol-image" src={`${BASE_URL}/storage/designsymbols/${chosenDesignSymbol.img}`} alt={chosenDesignSymbol.img} />
                                </div>
                            </button>
                        })}
                    </div>
                </>}
            </> :
                <>
                    <h1 className="title">Choose a symbol</h1>
                    <div className="symbol-grid">
                        {designSymbols.map(designSymbol => {
                            return <button className="item" key={designSymbol.id} onClick={() => { setChosenDesignSymbol(designSymbol) }}>
                                <img src={`${BASE_URL}/storage/designsymbols/${designSymbol.img}`} alt={designSymbol.img} />
                            </button>
                        })}
                    </div>
                </>
            }
        </>
    )
}

export default Home