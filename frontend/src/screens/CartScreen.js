import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

function CartScreen() {
    const params = useParams();
    const { id: productId } = params;
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const qty = sp.get('qty') || 1;


    return (
        <div>
            <h1>Cart Screen</h1>
            <p>ADD TO CART : ProductID : {productId} | Qty : {qty}</p>
        </div>
    )
}

export default CartScreen
