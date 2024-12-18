import React, { useEffect } from "react";
import { listProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import Product from "../component/Product";

function SearchScreen() {
  const { name = "all", category = "all" } = useParams();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = productCategoryList;

  
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("name effect : ", name);
    
    dispatch(
      listProducts({
        name: name !== "all" ? name : "",
        category: category !== "all" ? category : "",
      })
    );
  }, [dispatch, name, category]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    return `/search/category/${filterCategory}/name/${filterName}`;
  };
  return (
    <div>
      <div className="row">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>{products.length} Results</div>
        )}
      </div>
      <div className="row top">
        <div className="col-1">
          <h3>Departement</h3>
          {loadingCategory ? (
            <LoadingBox />
          ) : errorCategory ? (
            <MessageBox variant="danger">{errorCategory}</MessageBox>
          ) : (
            <ul>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? "active" : ""}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-3">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
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
      </div>
    </div>
  );
}

export default SearchScreen;
