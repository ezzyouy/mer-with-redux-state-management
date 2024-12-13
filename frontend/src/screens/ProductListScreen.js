import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, listProducts } from "../actions/productActions";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { useNavigate } from "react-router-dom";

function ProductListScreen() {
  const navigate = useNavigate();

  const productlist = useSelector((state) => state.productList);
  const { loading, error, products } = productlist;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate(`/product/${createdProduct._id}/edit`)
    }
    dispatch(listProducts());
  }, [dispatch, successCreate, createProduct, navigate]);

  const createHandler = () => {
    dispatch(createProduct());
  };

  const deleteHandler = () => {};
  const editHandler = () => {};
  return (
    <div>
      <div className="row">
        <h1>Products</h1>
        <button type="button" className="primary" onClick={createHandler}>
          Create Product
        </button>
      </div>
      {loadingCreate&&<LoadingBox/>}
      {errorCreate&& <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                    <button type="button" onClick={editHandler}>
                        Edit
                    </button>
                    <button type="button" onClick={deleteHandler}>
                        Delete
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductListScreen;
