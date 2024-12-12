import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, /* useNavigate,*/ useParams } from "react-router-dom";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { detailsOrder, payOrder } from "../actions/orderActions";
import Axios from "axios";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { ORDER_PAY_RESET } from "../constants/orderConstants";

function OrderScreen() {
  //const navigate = useNavigate();

  const params = useParams();
  const { id: orderId } = params;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const dispatch = useDispatch();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  useEffect(() => {
    if (!order || successPay || (order && order._id !== orderId)) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(detailsOrder(orderId));
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await Axios.get("/api/config/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };
      loadPaypalScript();
    }
  }, [dispatch, orderId, order, paypalDispatch, successPay]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      dispatch(payOrder(order,details));
    });
  }
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger"></MessageBox>
  ) : (
    <div>
      <div>
        <h1>Order {order?._id}</h1>
      </div>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong>
                  {order?.shippingAddress?.fullName}
                  <br />
                  <strong>Address: </strong>
                  {order?.shippingAddress?.address},{" "}
                  {order?.shippingAddress?.city},{" "}
                  {order?.shippingAddress?.postalCode},{" "}
                  {order?.shippingAddress?.country}
                </p>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order?.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card body">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong>
                  {order?.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order?.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card body">
                <h2>Order Items</h2>
                <ul>
                  {order?.orderItems?.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item?.image}
                            alt={item?.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item?.product}`}>
                            {item?.name}
                          </Link>
                        </div>

                        <div>
                          {item?.qty} x ${item?.price} = $
                          {item?.qty * item?.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${order?.itemsPrice?.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${order?.shippingPrice?.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${order?.taxPrice?.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>${order?.totalPrice?.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {isPending ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: order.totalPrice,
                                },
                              },
                            ],
                            // application_context: {
                            //   shipping_preference: "NO_SHIPPING" // default is "GET_FROM_FILE"
                            // }
                          });
                        }}
                        onApprove={onApprove}
                      />
                    </>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;
