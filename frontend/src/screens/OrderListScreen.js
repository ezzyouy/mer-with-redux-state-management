import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listOrders } from "../actions/orderActions";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";

function OrderListScreen() {
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const deleteHandler=(order)=>{

  }

  return (
    <div>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name}</td>
                <td>{order.createdAt?.substring(0, 10)}</td>
                <td>{order.totalPrice?.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt?.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt?.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(order)}
                  >
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

export default OrderListScreen;
