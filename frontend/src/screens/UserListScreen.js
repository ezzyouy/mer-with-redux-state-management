import React, { useEffect } from "react";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listUser } from "../actions/userActions";

function UserListScreen() {
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listUser());
  }, [dispatch]);


  return (
    <div>
      <h1>Users</h1>
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
                <td>{user.isSeller ? "Yes" : "No"}</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
                <td>
                  <button>edit</button>
                  <button>delete</button>
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
