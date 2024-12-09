import React, { useEffect } from 'react'
import { Link, useParams } from "react-router-dom";
import Rating from '../component/Rating'
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { detailsProduct } from '../actions/productActions';

function ProductScreen() {
    const dispatch = useDispatch();
    const params = useParams();
    const { id: productId } = params;

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails;
 
    console.log(product);
    
    useEffect(() => {
        dispatch(detailsProduct(productId))
    }, [dispatch, productId]);

    return (
        <div>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger">{error.message}</MessageBox>
            ) : (
                <div>
                    <Link to={"/"}>Back to result</Link>
                    <div className='row top'>
                        <div className='col-2'>
                            <img className='large' src={product.image} alt={product.name} />
                        </div>
                        <div className='col-1'>
                            <ul>
                                <li>
                                    <h1>{product.name}</h1>
                                </li>
                                <li>
                                    <Rating
                                        rating={product.rating}
                                        numReviews={product.numReviews}
                                    />
                                </li>
                                <li>
                                    Price : ${product.price}
                                </li>
                                <li>
                                    Description : ${product.description}
                                </li>
                            </ul>
                        </div>
                        <div className='col-1'>
                            <div className='card card-body'>
                                <ul>
                                    <li>
                                        <div className='row'>
                                            <div>Price</div>
                                            <div className='price'>${product.price}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='row'>
                                            <div>Status</div>
                                            <div>
                                                {
                                                    product.countInStock > 0
                                                        ? (<span className='success'>In Stock</span>)
                                                        : (<span className='danger'>Unavailable</span>)
                                                }
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <button className="primary block">Add to Cart</button >
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductScreen
