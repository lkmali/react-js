import { useLoadScript } from '@react-google-maps/api'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { isNil } from 'lodash'
import * as React from 'react'
import { memo, useEffect, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import { MapContainer, TileLayer } from 'react-leaflet'
import ReactLeafletKml from 'react-leaflet-kml'
import { Document, Page, pdfjs } from 'react-pdf'
import ReactToPrint from 'react-to-print'
import restActions from '../../../actions/rest'
import { googleConfig } from '../../../config'
import { MarkerWithPath } from '../../../googleMap/MarkerWithPath'
import { RestUrlHelper, canAccessByUser, getAuthorizationHeaders } from '../../../helper'
import './Add.css'
import { fontAnswerStyle, fontStyle } from './style'
const { googleMapsApiKey } = googleConfig
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

const GetSelectElement = memo(function SelectElement({ item }) {
  return (
    <div className='ps-4 mt-4'>
      <ol className='switches'>
        {item &&
          item.children.map((children, index) => {
            return (
              <li key={index}>
                <input
                  type='checkbox'
                  id={children.id}
                  disabled
                  // style={{ display: 'none' }}
                  className='switch-checkbox'
                  checked={item.fieldValue.some((item) => item.value === children.title)}
                />
                <label htmlFor={children.id} className='style-label'>
                  <span>{children.title}</span>
                  <span></span>
                </label>
              </li>
            )
          })}
      </ol>
    </div>
  )
})

const setStatusHtml = (props) => {
  const canAccess = canAccessByUser('form-data', ['edit']) && props?.formData?.status != 1
  if (canAccess) {
    return (
      <div className='col-12 mt-1 mb-5'>
        <div className='row mt-2'>
          <div className='col-md-3 col-sm-6 col-xs-12 mt-2'>
            <button
              onClick={() => {
                props.submitStatus(props?.formDataId, 'Verified')
              }}
              className='btn btn-primary btn-lg d-block w-100'
              style={{ color: 'white' }}
            >
              Approve
            </button>
          </div>
          <div className='col-md-3 col-sm-6 col-xs-12 mt-2'>
            <button
              onClick={() => {
                props.submitStatus(props?.formDataId, 'Rejected')
              }}
              className='btn btn-primary btn-lg d-block w-100'
              style={{ color: 'white' }}
            >
              Reject
            </button>
          </div>
          <div className='col-md-3 col-sm-6 col-xs-12 mt-2'>
            <button
              onClick={() => {
                props.submitStatus(props?.formDataId, 'Draft')
              }}
              className='btn btn-primary btn-lg d-block w-100'
              style={{ color: 'white' }}
            >
              Resend
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}

const GetRangeElement = memo(function RangeElement({ item }) {
  let minValue =
    item.fieldValue &&
    item.fieldValue.length &&
    item.fieldValue.find((x) => x.valueName === 'minValue') &&
    item.fieldValue.find((x) => x.valueName === 'minValue').value
      ? item.fieldValue.find((x) => x.valueName === 'minValue').value
      : 0
  let maxValue =
    item.fieldValue &&
    item.fieldValue.length &&
    item.fieldValue.find((x) => x.valueName === 'maxValue') &&
    item.fieldValue.find((x) => x.valueName === 'maxValue').value
      ? item.fieldValue.find((x) => x.valueName === 'maxValue').value
      : null
  return (
    <div className='ps-4'>
      <div className='col-6'>
        <span className='me-5'>
          <b> minValue:</b> {minValue}
        </span>
        <span className='ms-5' style={{ display: 'inline-flex' }}>
          <b>maxValue:</b> {maxValue ? maxValue : <p className='ms-1'> &infin; </p>}
        </span>
      </div>
    </div>
  )
})

const GetLabelElement = memo(function LabelElement({ item }) {
  return (
    <div className='ps-4'>
      <label style={fontAnswerStyle}>
        {'- '}
        {item?.fieldValue[0]?.value}
      </label>
    </div>
  )
})
const GetUnsupportedElement = memo(function UnsupportedElement({ item }) {
  return (
    <div className='ps-4'>
      <label style={{ ...fontAnswerStyle, color: 'red' }}>
        {'- '}
        {item}
      </label>
    </div>
  )
})
const GetMapElement = memo(function MapElement({ item }) {
  const [libraries] = useState(['drawing', 'places', 'geometry', 'localContext', 'visualization'])
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries, // ['drawing', 'places', 'geometry'],
  })
  return isLoaded ? (
    <div className='ps-4'>
      {/* <LoadScript
          googleMapsApiKey={googleMapsApiKey}
          libraries={['drawing', 'places', 'geometry']}
        > */}
      {item.fieldType === 'geoPoint' ? (
        <>
          {item?.fieldValue[0]?.point ? (
            <div className='col-6 mb-2'>
              <span className='me-5'>
                <b> latitude:</b> {item?.fieldValue[0]?.point[0]}
              </span>
              <span className='ms-5'>
                <b>longitude:</b> {item?.fieldValue[0]?.point[1]}
              </span>
            </div>
          ) : (
            ''
          )}
          <MarkerWithPath key={item.id} markerData={item?.fieldValue[0]?.point} />
        </>
      ) : item.fieldType === 'geoTrace' ? (
        <MarkerWithPath key={item.id} multiMarkerData={item?.fieldValue[0]?.point} />
      ) : item.fieldType === 'geoShape' ? (
        <MarkerWithPath key={item.id} polygonShapeData={item?.fieldValue[0]?.point} />
      ) : (
        <MarkerWithPath key={item.id} pathData={item?.fieldValue[0]?.point} />
      )}
      {/* </LoadScript> */}
    </div>
  ) : null
})
const fetchData = async (value) => {
  const imageURL = `${RestUrlHelper.GET_PROJECT_FORM_IMAGE}?key=${value}`
  const res = await restActions.GET(imageURL, getAuthorizationHeaders())
  return res.data
}
const GetImageElement = memo(function GetImageElement({ item }) {
  const [images, setImages] = useState([])
  useEffect(() => {
    const urls = item.fieldValue.map((x) => x.value)
    const fetchImages = async () => {
      try {
        const imageData = await Promise.all(urls.map((url) => fetchData(url)))
        setImages(imageData)
      } catch (err) {
        // console.log(err);
      }
    }
    fetchImages()
  }, [item.fieldValue])

  return (
    <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      {images.length > 0 && (
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(191px, 1fr))',
            gridGap: '2rem',
            listStyle: 'none',
          }}
        >
          {images.map((image, i) => (
            <li key={i}>
              <div className='imgwrap'>
                <img
                  crossOrigin='true'
                  style={{ width: '100%', height: 'auto' }}
                  src={image}
                  alt={item.title}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})
const GetVideoElement = memo(function VideoElement({ item }) {
  const [image, setImage] = useState([])
  const id = item?.fieldValue[0]?.value
  useEffect(() => {
    ;(async function fetchData() {
      try {
        const imageURL = `${RestUrlHelper.GET_PROJECT_FORM_IMAGE}?key=${id}`
        const userProfileImageUrl = await restActions.GET(imageURL, getAuthorizationHeaders())
        setImage(userProfileImageUrl.data)
      } catch (err) {
        // console.log(err)
      }
    })()
  }, [id])
  return (
    <div className='ps-4 mt-2'>
      <video src={image} type='video/mp4' className='imageStyle' controls></video>
    </div>
  )
})
const GetPdfElement = memo(function PdfElement({ item }) {
  const id = item?.fieldValue[0]?.value
  const [pdfUrl, setPdfUrl] = useState([])
  const [numPages, setNumPages] = useState(null)
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }
  useEffect(() => {
    ;(async function fetchData() {
      try {
        const URLs = `${RestUrlHelper.GET_PROJECT_FORM_IMAGE}?key=${id}`
        const pdfUrl = await restActions.GET(URLs, getAuthorizationHeaders())
        setPdfUrl(pdfUrl.data)
      } catch (err) {
        // console.log(err)
      }
    })()
  }, [id])
  return (
    <div className='ps-4 mt-4'>
      <div className='card all-page-container'>
        <Document
          file={pdfUrl}
          // options={{ workerSrc: "/pdf.worker.js" }}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      </div>
    </div>
  )
})
const GetKmlElement = memo(function PdfElement({ item }) {
  const [kmlLink, setKmlLink] = useState([])
  const [kml, setKml] = useState()
  let urls = item?.fieldValue[0]?.value
  const kmlLength = urls && urls.length ? urls : ''
  React.useMemo(() => {
    try {
      ;(async () => {
        const kmlData = await fetchData(urls)
        setKmlLink(kmlData)
      })()
    } catch (err) {
      // console.log(err)
    }
  }, [kmlLength])
  React.useEffect(() => {
    if (kmlLink && kmlLink.length > 0) {
      fetch(kmlLink)
        .then((res) => res.text())
        .then((kmlText) => {
          const parser = new DOMParser()
          const kmls = parser.parseFromString(kmlText, 'text/xml')
          setKml(kmls)
        })
    }
  }, [kmlLink])
  return (
    <div className='ps-4 mt-4'>
      <div className='card all-page-container'>
        <MapContainer
          style={{ height: '400px', width: '100%', zIndex: 2 }}
          zoom={4}
          center={[21.7679, 78.8718]}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {kml && <ReactLeafletKml kml={kml} />}
        </MapContainer>
      </div>
    </div>
  )
})
const GetAudioElement = memo(function AudioElement({ item }) {
  const id = item?.fieldValue[0]?.value
  const [audioUrl, setAudioUrl] = useState([])
  useEffect(() => {
    ;(async function fetchData() {
      try {
        const URL = `${RestUrlHelper.GET_PROJECT_FORM_IMAGE}?key=${id}`
        const audioUrls = await restActions.GET(URL, getAuthorizationHeaders())
        setAudioUrl(audioUrls.data)
      } catch (err) {
        // console.log(err)
      }
    })()
  }, [id])
  return (
    <div className='ps-4 mt-4'>
      <ReactAudioPlayer src={audioUrl} controls />
    </div>
  )
})
const GetFormField = memo(function AudioElement({ item, props }) {
  return (
    <div className='ps-4'>
      <AdminFormViewContainers
        {...props}
        formData={{ ...props.formData, fields: item.children }}
        rintChildren={props.printChildren}
        isExport={props.isExport}
      />
    </div>
  )
})
const RenderComponent = memo(function RenderComponent({
  element,
  exportSwitchChildren,
  pdfhideChildren,
  props,
}) {
  const id =
    !isNil(element?.fieldValue) &&
    element?.fieldValue.length > 0 &&
    !isNil(element?.fieldValue[0]?.value)
      ? element?.fieldValue[0]?.value
      : null
  if (
    (pdfhideChildren || exportSwitchChildren) &&
    (element.fieldType === 'audio' || element.fieldType === 'video' || element.fieldType === 'pdf')
  ) {
    if (isNil(id)) {
      return <GetUnsupportedElement item={'export format not supported'} />
    } else {
      return <GetLabelElement item={element} />
    }
  }
  if (['audio', 'image', 'video', 'pdf', 'audio'].indexOf(element.fieldType) >= 0 && isNil(id)) {
    return <div className='ps-4 mt-4'> </div>
  }
  switch (element.fieldType) {
    case 'subForm':
    case 'group':
    case 'rank':
      return <GetFormField item={element} props={props} />
    case 'multiSelect':
    case 'select':
      return <GetSelectElement item={element} />
    case 'range':
      return <GetRangeElement item={element} />
    case 'geoPoint':
    case 'geoShape':
    case 'geoTrace':
      return <GetMapElement item={element} />
    case 'image':
      return <GetImageElement item={element} />
    case 'video':
      return <GetVideoElement item={element} />
    case 'pdf':
      return <GetPdfElement item={element} />
    case 'kml':
      return <GetKmlElement item={element} />
    case 'audio':
      return <GetAudioElement item={element} />
    default:
      return <GetLabelElement item={element} />
  }
})
const AdminFormViewContainers = (props) => {
  let { fields: formDataFields } = props.formData
  const [displayChildren, setDisplayChildren] = useState({})
  const arr = []
  return (
    <>
      {formDataFields && formDataFields.length
        ? formDataFields.map((element, index) => (
            <div key={index} className='form-group mt-2'>
              <div
                style={{
                  display: 'flex',
                  // justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                <label style={fontStyle}>
                  Q -{element.sequence}) {element.title}
                </label>
                {element?.childRequire && !props.isExport && (
                  <button
                    className='btn btn-primary'
                    onClick={() => {
                      setDisplayChildren({
                        ...displayChildren,
                        [element.id]: !displayChildren[element.id],
                      })
                    }}
                  >
                    {element.fieldType === 'subForm' || element.fieldType === 'group' ? (
                      <>
                        <i className='fa fa-arrow-circle-down'></i>
                        <span>{displayChildren[element.id] ? ' - ' : ' + '}</span>
                      </>
                    ) : (
                      <>
                        <i className='fa fa-pencil-alt'></i>
                        <span>{displayChildren[element.id] ? ' - ' : ' + '} | Field Options</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {element?.childRequire ? (
                props.printChildren || props.isExport || displayChildren[element.id] ? (
                  <div className='mt-4'>
                    <RenderComponent
                      key={element.id}
                      element={element}
                      pdfhideChildren={props.printChildren}
                      exportSwitchChildren={props.isExport}
                      props={props}
                    />
                  </div>
                ) : (
                  ''
                )
              ) : (
                <div className=''>
                  <RenderComponent
                    key={element.id}
                    element={element}
                    pdfhideChildren={props.printChildren}
                    exportSwitchChildren={props.isExport}
                    props={props}
                  />
                </div>
              )}
            </div>
          ))
        : ''}
    </>
  )
}

const AdminViewFormDataContainer = (props) => {
  let { formData } = props
  const componentRef = React.useRef(null)
  const onBeforeGetContentResolve = React.useRef(null)
  const [printChildren, setPrintChildren] = useState(false)
  const [isExport, setIsExport] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  const handleAfterPrint = React.useCallback(() => {
    setPrintChildren(false)
    setIsExport(false)
    setDropdown(false)
  }, [])

  const handleBeforePrint = React.useCallback(() => {
    // setPrintChildren(true);
  }, [])

  const handleOnBeforeGetContent = React.useCallback(() => {
    setPrintChildren(true)
    setLoading(true)
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve
      setTimeout(() => {
        setLoading(false)
        resolve()
      }, 2000)
    })
  }, [])

  useEffect(() => {
    if (!didMount.current && isExport) {
      html2canvas(document.getElementById('divToPrint'), {
        useCORS: true,
        proxy: '',
        crossOrigin: true,
        logging: true,
        letterRendering: 1,
        allowTaint: true,
        ignoreElements: (node) => node.nodeName === 'IFRAME',
      })
        .then((canvas) => {
          const doc = new jsPDF('p', 'mm')
          const imgData = canvas.toDataURL('image/png')
          const margin = 0.02
          const imgWidth = doc.internal.pageSize.width
          const pageHeight = doc.internal.pageSize.height * (1 - margin)
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          let heightLeft = imgHeight
          let position = 0
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
          while (heightLeft > 0) {
            position = heightLeft - imgHeight
            doc.addPage()
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }
          doc.save('file.pdf')
        })
        .then(() => {
          setIsExport(false)
        })
    }
  }, [isExport])

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current
  }, [componentRef.current, printChildren])

  const status =
    props?.formData?.status === 1
      ? 'Drafted'
      : props?.formData?.status === 2
      ? 'Submitted'
      : props?.formData?.status === 3
      ? 'Verified'
      : props?.formData?.status === 4
      ? 'Rejected'
      : 'Pending'
  const handleExport = () => {
    setIsExport(!isExport)
    setDropdown(false)
  }

  const didMount = React.useRef(false)
  return (
    <>
      <div className='row'>
        <div className='col-md-8 col-sm-8 col-xs-12'>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'>
                <a href='#' style={{ textDecoration: 'none' }}>
                  {formData && formData.title}
                </a>
              </li>
              <li className='breadcrumb-item'>
                <a href='#' style={{ textDecoration: 'none' }}>
                  {formData && formData.ProjectForm && formData.ProjectForm.name}
                </a>
              </li>
              <li className='breadcrumb-item'>
                <a href='#' style={{ textDecoration: 'none' }}>
                  {formData &&
                    formData.ProjectForm &&
                    formData.ProjectForm.Project &&
                    formData.ProjectForm.Project.name}
                </a>
              </li>
            </ol>
          </nav>
        </div>
        <div
          className='btn-group col-md-4 col-sm-4 col-xs-12  mb-3 rounded'
          style={{ display: 'block' }}
        >
          <button className='btn btn-primary btn-sm' type='button'>
            {props?.formData?.status === 1 ? (
              <i className='fa fa-envelope status' style={{ color: 'white' }}>
                {' Drafted'}
              </i>
            ) : props?.formData?.status === 2 ? (
              <i className='fa fa-check-circle status' style={{ color: 'white' }}>
                {' Submitted'}
              </i>
            ) : props?.formData?.status === 3 ? (
              <i className='fa fa-check status' style={{ color: 'white' }}>
                {' Verified'}
              </i>
            ) : props?.formData?.status === 4 ? (
              <i className='fa fa-ban status' style={{ color: 'white' }}>
                {' Rejected'}
              </i>
            ) : (
              <i className='fa fa-clock-o status' style={{ color: 'white' }}>
                {' Pending'}
              </i>
            )}
          </button>
          <button
            type='button'
            className='btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split'
            data-bs-toggle='dropdown'
            onClick={() => setDropdown(!dropdown)}
            aria-expanded='false'
          >
            <span className='visually-hidden'>Toggle Dropdown</span>
          </button>
          <ul className={`${dropdown ? 'show' : ''} dropdown-menu dropdown-menu-right`}>
            <li
              className='list-group-item py-0 list-group-item-action p-2'
              // onClick={() => this.form('item.id')}
            >
              <ReactToPrint
                content={reactToPrintContent}
                documentTitle={formData.title}
                onAfterPrint={handleAfterPrint}
                onBeforeGetContent={handleOnBeforeGetContent}
                onBeforePrint={handleBeforePrint}
                removeAfterPrint
                trigger={() => (
                  <i className='fas fa-print  pointer me-3 dropdown-item'>
                    <span className='ms-2'>print</span>
                  </i>
                )}
              />
            </li>
            <li>
              <hr className='dropdown-divider' />
            </li>
            <li
              className='list-group-item py-0 list-group-item-action p-2'
              // onClick={() => this.form('item.id')}
            >
              <i className=' fas fa-file-pdf pointer dropdown-item' onClick={() => handleExport()}>
                <span className='ms-2'>download</span>
              </i>
            </li>
          </ul>
        </div>
      </div>
      {loading && <p className='indicator'>WAIT A SEC...</p>}
      <div
        id='divToPrint'
        className={`${isExport || printChildren ? 'p-2' : 'card-background'}`}
        ref={componentRef}
      >
        <AdminFormViewContainers {...props} printChildren={printChildren} isExport={isExport} />
      </div>
      {setStatusHtml(props)}
    </>
  )
}
export default AdminViewFormDataContainer
