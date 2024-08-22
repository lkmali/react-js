import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  PolygonF,
  PolylineF,
  StandaloneSearchBox,
  useLoadScript,
} from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import { env, googleConfig } from '../config'
const { googleMapsApiKey } = googleConfig
const mapContainerStyle = {
  height: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column-reverse',
}
export const MarkerWithPath = (props) => {
  const [activeMarker, setActiveMarker] = useState(null)
  const [pathData] = useState(
    props.pathData?.map((coordinate, index) => ({
      id: index++,
      position: {
        lat: Number(coordinate && coordinate[0], 10),
        lng: Number(coordinate && coordinate[1], 10),
      },
    })),
  )
  const [polygonShapeData] = useState(props.polygonShapeData)
  const [markerData] = useState(props.markerData)
  const [multiMarkerData] = useState(props.multiMarkerData)
  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      setActiveMarker(null)
    }
    setActiveMarker(marker)
  }

  let renderElement = () => {
    if (pathData && pathData.length) {
      const handleOnLoad = (map) => {
        const bounds = new window.google.maps.LatLngBounds()
        pathData.forEach(({ position }) => bounds.extend(position))
        map.fitBounds(bounds)
      }
      return (
        <GoogleMap
          onLoad={handleOnLoad}
          onClick={() => setActiveMarker(null)}
          mapContainerStyle={{ width: '100%', height: '50vh' }}
          defaultCenter={{ lat: 25.798939, lng: -80.291409 }}
          defaultZoom={0}
        >
          <PolylineF
            path={pathData.map((item) => ({
              lat: Number(item && item.position.lat, 10),
              lng: Number(item && item.position.lng, 10),
            }))}
            options={{
              // geodesic: true,
              strokeColor: '#1b03a3',
              strokeOpacity: 1,
              strokeWeight: 2,
              icons: [
                {
                  icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
                  offset: '50%',
                  repeat: '50px',
                },
                // {
                //     icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
                //     offset: '50%',
                //     repeat: '50px'
                // }
              ],
            }}
          />

          {/* <MapDirectionsRenderer
                    places={markers}
                    travelMode={window.google.maps.TravelMode.DRIVING}
                /> */}
        </GoogleMap>
      )
    } else if (markerData && markerData.length) {
      const handleOnLoad = (map) => {
        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend({ lat: markerData[0], lng: markerData[1] })
        map.fitBounds(bounds)
      }
      const id = 1

      return (
        <GoogleMap
          onLoad={handleOnLoad}
          onClick={() => setActiveMarker(null)}
          mapContainerStyle={{ width: '100%', height: '50vh' }}
          defaultCenter={{ lat: markerData[0], lng: markerData[1] }}
        >
          <MarkerF
            zIndex={0}
            draggable={true}
            position={{ lat: markerData[0], lng: markerData[1] }}
            onClick={() => handleActiveMarker(id)}
          >
            {activeMarker === id ? (
              <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                <div> Empty data</div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        </GoogleMap>
      )
    } else if (multiMarkerData && multiMarkerData.length) {
      const handleOnLoad = (map) => {
        const bounds = new window.google.maps.LatLngBounds()
        multiMarkerData.forEach((x) => bounds.extend({ lat: x[0], lng: x[1] }))
        map.fitBounds(bounds)
      }

      return (
        <GoogleMap
          onLoad={handleOnLoad}
          onClick={() => setActiveMarker(null)}
          mapContainerStyle={{ width: '100%', height: '50vh' }}
          defaultCenter={multiMarkerData.map((x) => {
            return { lat: x[0], lng: x[1] }
          })}
          // defaultZoom={0}
        >
          {multiMarkerData.map((x, i) => (
            <MarkerF
              zIndex={0}
              draggable={true}
              position={{ lat: x[0], lng: x[1] }}
              key={i}
              onClick={() => handleActiveMarker(i)}
            >
              {activeMarker === i ? (
                <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                  <div> Empty data</div>
                </InfoWindowF>
              ) : null}
            </MarkerF>
          ))}
        </GoogleMap>
      )
    } else if (polygonShapeData) {
      const handleOnLoad = (map) => {
        const bounds = new window.google.maps.LatLngBounds()
        polygonShapeData.forEach((x) => bounds.extend({ lat: x[0], lng: x[1] }))
        map.fitBounds(bounds)
        // var ne = bounds.getNorthEast();
        // var sw = bounds.getSouthWest();
        // var nw = new window.google.maps.LatLng(ne.lat(), sw.lng());
        // var se = new window.google.maps.LatLng(sw.lat(), ne.lng());
        // var latLngList = window.google.maps.LatLng = [ne, nw, sw, se];
        // console.log("Area is", window.google.maps.geometry.spherical.computeArea(latLngList));
      }

      return (
        <GoogleMap
          onLoad={handleOnLoad}
          onClick={() => setActiveMarker(null)}
          mapContainerStyle={{ width: '100%', height: '50vh' }}
          defaultCenter={polygonShapeData.map((x) => {
            return { lat: x[0], lng: x[1] }
          })}
          defaultZoom={0}
        >
          {props.isMarkerShown && <MarkerF position={{ lat: 41.015137, lng: 28.97953 }} />}
          <PolygonF
            options={{
              fillColor: '#7a7aff',
              // strokeColor: "red",
              // strokeOpacity: 1,
              fillOpacity: 0.5,
              strokeWeight: 0,
              clickable: false,
              draggable: false,
              editable: false,
              geodesic: false,
              zIndex: 1,
            }}
            // icons =
            path={polygonShapeData.map((x, i) => {
              return { lat: x[0], lng: x[1] }
            })}
          ></PolygonF>
          {polygonShapeData.map((x, i) => (
            <MarkerF
              zIndex={0}
              draggable={true}
              position={{ lat: x[0], lng: x[1] }}
              key={i}
              onClick={() => handleActiveMarker(i)}
              icon={{
                url: env.REACT_APP_PUBLIC_URL + '/images/markergreen.webp',
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            ></MarkerF>
          ))}
        </GoogleMap>
      )
    }
  }
  return renderElement()
}
const libraries = ['drawing', 'places', 'geometry', 'localContext', 'visualization']
export const SelectLatLng = ({ handelMap, clickedLatLng, handleChanges, addressType }) => {
  const [SelectedPlace, setSelectedPlace] = useState(null)
  const [MarkerMap, setMarkerMap] = useState({})
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  })
  const [zoom, setZoom] = useState(5)
  const [infoOpen, setInfoOpen] = useState(false)
  let myPlaces = [
    { id: 'place1', pos: { lat: 19.66328, lng: 75.300293 } },
    { id: 'place2', pos: { lat: 27.391277, lng: 73.432617 } },
  ]
  const fitBounds = (map) => {
    const bounds = new window.google.maps.LatLngBounds()
    myPlaces.map((place) => {
      bounds.extend(place.pos)
      return place.id
    })
    map.fitBounds(bounds)
  }

  const loadHandler = (map) => {
    fitBounds(map)
  }
  const markerLoadHandler = (marker, place) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker }
    })
  }

  const markerClickHandler = (event, place) => {
    if (addressType === 'sourceAddress') {
      setSelectedPlace(place)
    } else if (addressType === 'destinationAddress') {
      setSelectedPlace(place)
    } else {
      setSelectedPlace(place)
    }
    if (infoOpen) {
      setInfoOpen(false)
    }
    setInfoOpen(true)
    if (zoom < 13) {
      setZoom(13)
    }
  }
  const [searchBox, setSearchBox] = useState(null)
  const onPlacesChanged = () => {
    let places = searchBox.getPlaces()
    if (places.length === 1) {
      let place = places[0]
      handleChanges(place.geometry.location.lat(), 'latitude', null, true)
      handleChanges(place.geometry.location.lng(), 'longitude', null, true)
      handleChanges(place.formatted_address, 'taskAddress', null, true)
    }
  }
  const onClickChanged = (latLng) => {
    let formatted_address = ''
    try {
      let geocoder = new window.google.maps.Geocoder()
      return new Promise((resolve, reject) => {
        geocoder.geocode({ latLng: latLng }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              formatted_address = results[0].formatted_address
            }
          } else {
            // x.innerHTML = "Geocoder failed due to: " + status;
          }
          handleChanges(latLng.lat, 'latitude', null, true)
          handleChanges(latLng.lng, 'longitude', null, true)
          handleChanges(formatted_address, 'taskAddress', null, true)
        })
      })
    } catch (error) {
      if (error) {
        let a = null
      }
    }
  }
  const onSBLoad = (ref) => {
    setSearchBox(ref)
  }
  const cancel = () => {
    handelMap()
  }
  const renderMap = () => {
    return (
      <>
        {isLoaded ? (
          <GoogleMap
            onLoad={loadHandler}
            keyboardShortcuts={false}
            onClick={(e) => onClickChanged(e.latLng.toJSON())}
            center={clickedLatLng}
            zoom={13}
            mapContainerStyle={{
              height: '80vh',
              width: '100%',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
            mapElementStyle={{ height: '100%' }}
          >
            <StandaloneSearchBox onPlacesChanged={onPlacesChanged} onLoad={onSBLoad}>
              <input
                type='text'
                placeholder='Enter location name'
                style={{
                  height: '35px',
                  padding: '0px 7px',
                  borderRadius: ' 17px',
                  boxShadow: 'rgb(0 0 0 / 30%) 0px 2px 6px',
                  fontSize: '13px',
                  outline: 'none',
                  position: 'absolute',
                  top: '2px',
                  marginLeft: '38%',
                }}
              />
            </StandaloneSearchBox>

            {clickedLatLng && clickedLatLng.lat !== '' && clickedLatLng.lng !== '' ? (
              <MarkerF
                position={clickedLatLng}
                onLoad={(marker) => markerLoadHandler(marker, clickedLatLng)}
                onClick={(event) => markerClickHandler(event, clickedLatLng)}
                //   icon={{
                //     path:
                //       "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                //     fillColor: "#0000ff",
                //     fillOpacity: 1.0,
                //     strokeWeight: 0,
                //     scale: 1.25
                //   }}
              />
            ) : (
              ''
            )}
          </GoogleMap>
        ) : (
          ''
        )}
        <div style={{ position: 'absolute', right: '0px', marginBottom: '5px' }} className='mt-3'>
          <Button color='primary' className='confirmButton' onClick={cancel} type='submit'>
            close
          </Button>
          {/* <Button color="primary" className='confirmButton' onClick={cancel} type="submit">Ok</Button> */}
        </div>
      </>
    )
  }
  return renderMap()
}

export const MapWithCustomImage = (props) => {
  const [locationData, setLocationData] = useState(props.userEvents)
  const [activeMarker, setActiveMarker] = useState(null)
  const [center, setCenter] = useState({ lat: 0, lng: 0 })

  useEffect(() => {
    setLocationData(props.userEvents)
    const latSum =
      props?.userEvents &&
      props?.userEvents.length &&
      props?.userEvents.reduce((acc, data) => acc + data?.coordinates?.coordinates[0], 0)
    const lngSum =
      props?.userEvents &&
      props?.userEvents.length &&
      props?.userEvents.reduce((acc, data) => acc + data?.coordinates?.coordinates[1], 0)
    const latCenter = latSum / props?.userEvents.length
    const lngCenter = lngSum / props?.userEvents.length
    setCenter({ lat: latCenter, lng: lngCenter })
  }, [props.userEvents])

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  })

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      setActiveMarker(null)
    } else {
      setActiveMarker(marker)
    }
  }

  if (loadError) return 'Error loading maps'
  if (!isLoaded) return 'Loading maps'
  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={17} center={center}>
      {locationData && locationData.length
        ? locationData.map((data, i) => {
            // Find all other events with the same coordinates as the current event
            const sameLocationEvents = locationData.filter(
              (event, index) =>
                index !== i &&
                event.coordinates[0] === data.coordinates.coordinates[0] &&
                event.coordinates[1] === data.coordinates.coordinates[1],
            )

            return (
              <MarkerF
                zIndex={0}
                // draggable={true}
                onClick={() => handleActiveMarker(i)}
                key={i}
                position={{
                  lat: data.coordinates.coordinates[0],
                  lng: data.coordinates.coordinates[1],
                }}
                icon={{
                  url: data.profileImage,
                  scaledSize: sameLocationEvents.length
                    ? new window.google.maps.Size(60, 60)
                    : new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(0, 0),
                  strokeWeight: 4,
                  strokeColor: '#FF0000',
                }}
              >
                {activeMarker === i ? (
                  <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                    <div style={{ maxWidth: '40vw' }}>
                      <h2> {data.name} </h2>
                      {/* <p>{desc}</p> */}
                    </div>
                  </InfoWindowF>
                ) : null}
              </MarkerF>
            )
          })
        : ''}
    </GoogleMap>
  )
}
