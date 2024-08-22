import { css } from '@emotion/css'
import {
  COMPONENT_DEFAULT_TYPE,
  DiagramContext,
  DigramInner,
  DragAndDropContainer,
  LINK_CREATION_COMPONENT_TYPE,
  LinkState,
  NodeState,
  createArrowMarker,
  createCircleMarker,
  createLinkDefault,
  createNodeOnDrop,
  createPortInnerDefault,
} from 'react-easy-diagram'
import './aaa.css'

import LoaderContainer from '../../loader/Loader'
import PaginationContainer from '../../pagination/Pagination'

import { reaction } from 'mobx'
import { useEffect, useRef, useState } from 'react'
const WorkflowCanvas = (props) => {
  const [startId, setStartId] = useState('')
  const [pageInfo, setPageInfo] = useState(1)
  const item = props.taskData.map((value) => {
    return {
      draggable: <NodeTemplate label={value.name} />,
      onDrop: createNodeOnDrop({
        type: 'input_output_horizontal',
        label: value.name,
        id: value.id,
        data: { ...value, type: 'task' },
      }),
    }
  })
  const initState = {
    nodes: props.nodes,
    links: props.links,
  }

  const storeRef = useRef(null)
  const settings = {
    readOnly: props.diagramReadOnly,
    ports: {
      components: {
        default: createPortInnerDefault({
          style: {
            base: {
              opacity: 10,
            },
          },
        }),
      },
    },
    links: {
      components: {
        [COMPONENT_DEFAULT_TYPE]: createLinkDefault({
          mainLine: {
            style: {
              base: {
                markerEnd: 'url(#default_arrow_marker)', // There 6 built-in markers: 'default_{circle|arrow}_marker', 'default_{circle|arrow}_marker_selected', 'default_{circle|arrow}_marker_hovered'
                markerStart: 'url(#default_circle_marker)',
              },
              hovered: {
                markerEnd: 'url(#default_arrow_marker_hovered)',
              },
              selected: {
                markerEnd: 'url(#default_circle_marker)',
              },
            },
          },
          // If you use markers it can be more attractive to disable hover effect, but hidden secondary line
          secondaryLine: {
            style: {
              base: {
                opacity: 0,
              },
            },
          },
        }),
        custom_arrow_link: createLinkDefault({
          mainLine: {
            style: {
              base: {
                stroke: 'red',
                markerEnd: 'url(#custom_arrow)', // There 6 built-in markers: 'default_{circle|arrow}_marker', 'default_{circle|arrow}_marker_selected', 'default_{circle|arrow}_marker_hovered'
                markerStart: 'url(#custom_circle)',
              },
              hovered: {
                markerStart: 'url(#custom_circle_hovered)',
              },
              selected: {
                markerStart: 'url(#custom_circle_selected)',
              },
            },
          },
        }),
        // Link component that will be used while connecting ports
        [LINK_CREATION_COMPONENT_TYPE]: createLinkDefault({
          mainLine: {
            style: {
              base: {
                stroke: 'red',
                markerEnd: 'url(#default_arrow_marker_hovered)',
              },
            },
          },
        }),
      },
      // You can define your own markers
      svgMarkers: [
        // With built-in marker creators
        createCircleMarker({
          id: 'custom_circle',
          radius: 6,
          style: {
            fill: 'grey',
          },
        }),
        createCircleMarker({
          id: 'custom_circle_selected',
          radius: 6,
          style: {
            fill: 'yellow',
          },
        }),
        createCircleMarker({
          id: 'custom_circle_hovered',
          radius: 6,
          style: {
            fill: 'yellow',
            opacity: 0.5,
          },
        }),
        createArrowMarker({
          id: 'custom_arrow',
          style: {
            fill: 'red',
          },
        }),
        // Or by providing any marker you like
        () => (
          <marker id='my_circle_marker' overflow='visible' markerUnits='userSpaceOnUse'>
            <circle r={5} style={{ fill: 'red' }} />
          </marker>
        ),
      ],
    },
    callbacks: {
      onLinkingStarted(info, rootStore) {
        setStartId(info.sourcePort.nodeId)
        props.onLinkStarted()
      },
      onLinkingEnded(info, rootStore) {
        if (info.linked) {
          // console.log('onLinkingEnded', info)
          props.onLinkEnd(startId, info.targetPort?.nodeId)
        } else {
          props.onLinkEnded()
          setStartId('')
        }
      },
    },
  }

  // To react on changes in the diagram state, in addition to callbacks the library provides,
  // you can also use mobx functions like reaction, autorun and when. More info here: https://mobx.js.org/reactions.html
  // Here is example that will help you to do some work when selection changed.
  useEffect(
    () =>
      reaction(
        () => {
          if (storeRef.current) {
            return storeRef.current.selectionState.selectedItems.map((i) => i)
          }
        },
        (selectedItems, prevSelectedItems) => {
          const data = selectedItems
            ?.filter((i) => i instanceof NodeState)
            .map((n) => JSON.parse(JSON.stringify(n.data)))

          const result = selectedItems
            ?.filter((i) => i instanceof LinkState)
            .map((n) => {
              return { startWorkflowStageId: n.source.nodeId, endWorkflowStageId: n.target.nodeId }
            })
          props.selectedFormTask(data)
          props.selectedLink(result)
        },
      ),
    [storeRef],
  )
  const searchText = (event) => {
    props.getTaskList({
      ...props.taskFilter,
      pageOffset: 0,
      search: event?.target?.value,
    })
  }
  const loaderProperty = {
    type: 'Circles',
    height: 100,
    width: 100,
    color: '#186881',
    visible: true,
  }
  const handleClick = (pageNumber) => {
    const pageOffset = (pageNumber - 1) * props?.taskFilter?.itemPerPage
    props.getTaskList({
      ...props.taskFilter,
      pageOffset,
    })
    setPageInfo(pageNumber)
  }
  return (
    <>
      <div className='mb-2'>
        <button
          onClick={(e) => props.handleDraggable()}
          className='btn btn-primary btn-sm d-block'
          style={{ color: 'white' }}
        >
          {' '}
          {props.draggable ? 'dragabble off' : 'dragabble on'}{' '}
        </button>
      </div>
      <div className='card' style={{ height: '85vh', width: '100%' }}>
        <DiagramContext
          ref={storeRef}
          settings={settings}
          style={{ position: '' }}
          storeRef={storeRef}
          initState={initState}
        >
          {props.diagramReadOnly ? (
            <DigramInner />
          ) : (
            <div className={container_class}>
              <DigramInner />
              <div style={{ textAlign: 'center' }}>
                <div className='searchBar' style={{ alignItems: 'center' }}>
                  <i className='fa fa-search search-icon'></i>
                  <input
                    onKeyUp={(e) => searchText(e)}
                    type='text'
                    className='form-control border searchBar-input'
                    placeholder='Search'
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                  ></input>
                  {/* <span className="left-pan"><i className="fa fa-microphone"></i></span> */}
                </div>
                {props.taskSearchLoader ? (
                  <LoaderContainer {...loaderProperty}></LoaderContainer>
                ) : (
                  <div className='items-container'>
                    <DragAndDropContainer items={item} />
                  </div>
                )}
                <PaginationContainer
                  className='mt-3'
                  activePage={pageInfo}
                  count={props.taskTotalCount}
                  handleClick={handleClick}
                ></PaginationContainer>
              </div>
            </div>
          )}
        </DiagramContext>
      </div>
    </>
  )
}

const container_class = css`
  width: 100%;
  height: 100%;
  display: flex;

  > :last-child {
    border: 0 solid rgb(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  @media (min-width: 800px) {
    flex-direction: row-reverse;

    > :last-child {
      border-right-width: 1px;
      width: 300px;
    }
  }

  @media (max-width: 800px) {
    flex-direction: column;

    > :last-child {
      border-top-width: 1px;
      width: 100%;
      height: 150px;
    }
  }
`

function NodeTemplate(props) {
  return (
    <div
      className={'react_fast_diagram_NodeDefault'}
      style={{
        width: 250,
        height: 30,
      }}
    >
      {props.label}
    </div>
  )
}

export default WorkflowCanvas
