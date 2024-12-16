import React, { useEffect } from "react";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, listUser } from "../actions/userActions";
import { USER_DELETE_RESET } from "../constants/userConstants";

function UserListScreen() {
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: succesDelete,
  } = userDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    if (succesDelete) {
      dispatch({ type: USER_DELETE_RESET });
    }
    dispatch(listUser());
  }, [dispatch, succesDelete]);

  const deleteHandler = (user) => {
    if (window.confirm("Are you sure to delete the user?"))
      dispatch(deleteUser(user));
  };
  return (
    <div>
      <h1>Users</h1>
      {loadingDelete && <LoadingBox />}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {succesDelete && (
        <MessageBox variant="success">User deleted success</MessageBox>
      )}
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
              <th>EMAIL</th>
              <th>IS SELLER</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isSeller ? "Yes" : "No"}</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
                <td>
                  <button type="button" className="small">
                    edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(user)}
                  >
                    delete
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

export default UserListScreen;
