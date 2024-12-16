import React, { useEffect, useState } from "react";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

function UserEditScreen() {
  const navigate = useNavigate();

  const params = useParams();
  const { id: userId } = params;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate("/userlist");
    }
    if (!user?.name) {
      dispatch(detailsUser(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsSeller(user.isSeller);
      setIsAdmin(user?.isAdmin);
    }
  }, [dispatch, userId, user, navigate, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: user._id, name, email, isSeller, isAdmin }));
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edit User {name}</h1>
        </div>
        {loadingUpdate && <LoadingBox></LoadingBox>}
        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                placeholder="enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="isSeller">Is Seller</label>
              <input
                id="isSeller"
                type="checkbox"
                checked={!!isSeller}
                onChange={(e) => setIsSeller(!isSeller)}
              ></input>
            </div>
            <div>
              <label htmlFor="isAdmin">Is Admin</label>
              <input
                id="isAdmin"
                type="checkbox"
                checked={!!isAdmin}
                onChange={(e) => setIsAdmin(!isAdmin)}
              ></input>
            </div>
            <div>
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

export default UserEditScreen;
