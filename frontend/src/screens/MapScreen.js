import React, { useEffect, useRef, useState } from "react";
import LoadingBox from "../component/LoadingBox";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import Axios from "axios";
import { USER_ADDRESS_MAP_CONFIRM } from "../constants/userConstants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const libs = ["places"];
const defaultLocation = { lat: 31.628674, lng: -7.992047 };

function MapScreen() {
  const navigate = useNavigate();

  const [googleApiKey, setGoogleApiKey] = useState("");
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolcation is not supported by the browser");
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };
  useEffect(() => {
    const fetch = async () => {
      const { data } = await Axios.get("/api/keys/google", {
        headers: {
          Authorization: `bearer ${userInfo.token}`,
        },
      });
      setGoogleApiKey(data.key);
      getUserCurrentLocation();
    };
    fetch();
  }, [userInfo]);

  const onLoad = (map) => {
    mapRef.current = map;
  };
  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };

  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onPlacesChanged = () => {
    const place = placeRef.current.gePlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };

  const dispatch = useDispatch();

  const onConfirm = () => {
    const places = placeRef.current.gePlaces();
    if (places && places.length === 1) {
      dispatch({
        type: USER_ADDRESS_MAP_CONFIRM,
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });
      alert("location selected successfully");
      navigate("/shipping");
    } else {
      alert("Please emter your address");
    }
  };

  return googleApiKey ? (
    <div className="full-container">
      <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
                <GoogleMap
                    id='sample-map'
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onIdle={onIdle}
                >
                    <StandaloneSearchBox
                        onLoad={onLoadPlaces}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <div className='map-input-box'>
                            <input type='text' placeholder='Enter your address'></input>
                            <button type='button' onClick={onConfirm}>
                                Confirm
                            </button>
                        </div>
                    </StandaloneSearchBox>
                    <Marker position={location} onLoad={onMarkerLoad}></Marker>
                </GoogleMap>
            </LoadScript>
        </div>

  ) : (
    <LoadingBox></LoadingBox>
  );
}

export default MapScreen;
