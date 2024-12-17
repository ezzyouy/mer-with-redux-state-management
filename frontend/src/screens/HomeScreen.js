import React, { useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Product from "../component/Product";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { listTopSellers } from "../actions/userActions";
import { Link } from "react-router-dom";

function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const userTopSellersList = useSelector((state) => state.userTopSellersList);
  const {
    loading: loadingSeller,
    error: errorSeller,
    users: sellers,
  } = userTopSellersList;

  useEffect(() => {
    dispatch(listProducts({}));
    dispatch(listTopSellers());
  }, [dispatch]);
  return (
    <div>
      <h2>Top Seller</h2>
      {loadingSeller ? (
        <LoadingBox />
      ) : errorSeller ? (
        <MessageBox variant="danger">{errorSeller}</MessageBox>
      ) : (
        <>
          {sellers.length === 0 && (
            <MessageBox variant="danger">No Seller Found</MessageBox>
          )}
          <Carousel showArrows autoPlay showThumbs={false}>
            {sellers.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
                  <p className="legend">{seller.seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </>
      )}
      <h2>Featured Products</h2>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error.message}</MessageBox>
      ) : (
        <>
          {products.length === 0 && (
            <MessageBox variant="danger">No Products Found</MessageBox>
          )}

          <div className="row center">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HomeScreen;
