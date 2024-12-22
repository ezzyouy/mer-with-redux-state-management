import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { detailsProduct, updateProduct } from "../actions/productActions";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import Axios from "axios";

function ProductEditScreen() {
  const navigate = useNavigate();

  const params = useParams();
  const { id: productId } = params;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [countInStock, setCountInStock] = useState("");

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successUpdate) {
      navigate(`/productlist`);
    }
    if (!product || product._id !== productId || successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(detailsProduct(productId));
    } else {
      setName(product.name);
      setSlug(product.slug);
      setPrice(product.price);
      setBrand(product.brand);
      setCategory(product.category);
      setImage(product.image);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [dispatch, productId, product, successUpdate, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        slug,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
      })
    );
  };
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    setLoadingUpload(true);
    for(const value of bodyFormData.values()){
        console.log(
            "body format data"
        );
        
        console.log(value);
    }
    try {
      const { data } = await Axios.post("/api/uploads/s3", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log("data-->",data);
      
      setLoadingUpload(false);
      setImage(data);
      console.log("ana hna ");
    } catch (error) {
      console.log("3lach ana hna");

      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edit Product {productId}</h1>
        </div>
        {loadingUpdate && <LoadingBox />}
        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                type="text"
                placeholder="Enter slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="image">Image</label>
              <input
                id="image"
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="imageFile">Image File</label>
              <input
                type="file"
                id="imageFile"
                label="Chose Image"
                onChange={uploadFileHandler}
              ></input>
            </div>
            {loadingUpload && <LoadingBox />}
            {errorUpload && (
              <MessageBox variant="danger">{errorUpload}</MessageBox>
            )}
            <div>
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="countInStock">Count In Stock</label>
              <input
                id="countInStock"
                type="text"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="3"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label></label>
              <button type="submit" className="primary">
                Update
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default ProductEditScreen;
