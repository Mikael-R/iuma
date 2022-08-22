import React, { useState } from 'react'
import * as S from './style'
import { GoogleMap, useJsApiLoader, Marker} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '80%',
  borderRadius: '5px',
  border: '4px solid #CB0000'
};

const center = {
  lat: -15.925147,
  lng: -56.858421
};
function Maps({listOpt, selectPoint}) {
  const local = listOpt.map((item) => item.establishment.location)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBblP4P9lve-kUEg7x_UhJE0CgAniaIa8s"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const [marker, setMarker] = useState(false);

  if (!isLoaded) return null

  return (  <S.Container>
      <h1>{}</h1>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={4}
            onLoad={onLoad}
            onUnmount={onUnmount}
            clickableIcons={true}
            options= {{ styles: [{ elementType: "labels", featureType: "poi.business", stylers: [{ visibility: "off", }], }], }}
        >
          {local.map((e, index) => (
            <Marker
              key={index}
              onClick={selectPoint}
              position={{
            lat: parseFloat(e.lat),
            lng: parseFloat(e.lon)
            }}
            />
            ))}
        </GoogleMap>
      </S.Container>)
}

export default Maps;
