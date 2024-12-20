import React, { useEffect } from "react";
import { listProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import Product from "../component/Product";
import { prices, ratings } from "../utils.js";
import Rating from "../component/Rating.js";

function SearchScreen() {
  const navigate = useNavigate();

  const {
    name = "all",
    category = "all",
    min = 0,
    max = 0,
    rating = 0,
    order = "newest",
    pageNumber = 1,
  } = useParams();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = productCategoryList;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      listProducts({
        pageNumber,
        name: name !== "all" ? name : "",
        category: category !== "all" ? category : "",
        min,
        max,
        rating,
        order,
      })
    );
  }, [dispatch, name, category, min, max, rating, order, pageNumber]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max || max;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
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
        <div>
          Sort by{" "}
          <select
            value={order}
            onChange={(e) => navigate(getFilterUrl({ order: e.target.value }))}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="torated">Avg. Customer Reviews</option>
          </select>
        </div>
      </div>
      <div className="row top">
        <div className="col-1">
          <h3>Departement</h3>
          <div>
            {loadingCategory ? (
              <LoadingBox />
            ) : errorCategory ? (
              <MessageBox variant="danger">{errorCategory}</MessageBox>
            ) : (
              <ul>
                <li>
                  <Link
                    className={"all" === category ? "active" : ""}
                    to={getFilterUrl({ category: "all" })}
                  >
                    Any
                  </Link>
                </li>
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
          <div>
            <h3>Price</h3>
            <ul>
              {prices.map((price) => (
                <li key={price.name}>
                  <Link
                    to={getFilterUrl({ min: price.min, max: price.max })}
                    className={
                      `${price.min}-${price.max}` === `${min}-${max}`
                        ? "active"
                        : ""
                    }
                  >
                    {price.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `rating` ? "active" : ""}
                  >
                    <Rating caption={" & up"} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
              <div className="row center pagination">
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    className={x + 1 === page ? "active" : ""}
                    key={x + 1}
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    {x + 1}
                  </Link>
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
