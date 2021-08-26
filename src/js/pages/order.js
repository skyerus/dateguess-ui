import React, {useEffect} from 'react'
import { Paper, Grid, Backdrop, CircularProgress, Typography, Button } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import { makeStyles } from '@material-ui/core/styles'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import eventApi from '../api/event'
import Link from '../components/link'

const styles = makeStyles({
  root: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "40px",
    marginBottom: "40px",
  },
  header: {
    marginTop: "15px",
  },
  bodyText: {
    marginTop: "13px",
  },
  dateContainer: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
  },
})

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const EventCard = (value, correctPosition) => (
    <div style={{backgroundColor: correctPosition ? "#4caf50": "#3b3a3a", padding: "10px 10px 10px 10px", boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)", borderRadius: "2px",}}>
      <Typography variant="h6">
        {value}
      </Typography>
    </div>
)

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  margin: "0 0 10px 0",
  ...draggableStyle
})

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  return {
    "source": sourceClone,
    "destination": destClone,
  }
}

function Order(props) {
  const classes = styles()
  const [events, setEvents] = React.useState([])
  const [orderedEvents, setOrderedEvents] = React.useState(null)
  const [pageLoading, setPageLoading] = React.useState(true)
  const [gameCompleted, setGameCompleted] = React.useState(false)

  useEffect(() => {
    fetchEvents()
    document.title = "Guess the date"
  }, [])

  const onDragEnd = (result) => {
    const { source, destination } = result

    // dropped outside the list
    if (!destination) {
      return
    }
    let es = [...events]
    if (source.droppableId === destination.droppableId) {
      let eventsIndex = parseInt(source.droppableId[source.droppableId.length-1], 10)
      const items = reorder(
        events[eventsIndex],
        source.index,
        destination.index
      )
      
      es[eventsIndex] = items
    } else {
      let sourceEventsIndex = parseInt(source.droppableId[source.droppableId.length-1], 10)
      let destEventsIndex = parseInt(destination.droppableId[destination.droppableId.length-1], 10)
      const result = move(
        events[sourceEventsIndex],
        events[destEventsIndex],
        source,
        destination
      )
      es[sourceEventsIndex] = result.source
      es[destEventsIndex] = result.destination
    }
    setEvents(es)
  }

  const fetchEvents = () => {
    eventApi.randomEvents(5, true).then((r) => {
      let eventResults = [...r.data]
      setOrderedEvents([...eventResults])
      setEvents([shuffleEvents(eventResults)])
    }).catch((e) => {
      if (e.response.status == 401) {
        props.loggedIn(false)
        props.snack("error", "Invalid session")
      } else {
        props.snack("error", e.response.data.message)
      }
    })
  }

  const shuffleEvents = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }

  useEffect(() => {
    if (events != null) {
      setPageLoading(false)
    }
  }, [events])

  const nextEvents = () => {
    setPageLoading(true)
    setEvents([])
    fetchEvents()
    setGameCompleted(false)
  }

  const guess = () => {
    let orderedIndex = 0
    let newEvents = []
    let correctAnswers = 0
    for (let i=0;i<events.length;i++) {
      if (Array.isArray(events[i])) {
        for (let j=0;j<events[i].length;j++) {
          if (events[i][j].id === orderedEvents[orderedIndex].id) {
            newEvents.push(orderedEvents[orderedIndex])
            correctAnswers++
          } else {
            if (!Array.isArray(newEvents[newEvents.length-1])) {
              newEvents.push([events[i][j]])
            } else {
              newEvents[newEvents.length-1][newEvents[newEvents.length-1].length] = events[i][j]
            }
          }
          orderedIndex++
        }
      } else {
        if (events[i].id === orderedEvents[orderedIndex].id) {
          newEvents.push(orderedEvents[orderedIndex])
          correctAnswers++
        } else {
          if (!Array.isArray(newEvents[newEvents.length-1])) {
            newEvents.push([events[i]])
          } else {
            newEvents[newEvents.length-1][newEvents[newEvents.length-1].length] = events[i]
          }
        }
        orderedIndex++
      }
    }
    setEvents(newEvents)
    if (correctAnswers != orderedEvents.length) {
      props.snack("info", `${correctAnswers}/${orderedEvents.length} events are correctly ordered`)
    } else {
      setGameCompleted(true)
    }
  }

  return !pageLoading ? (
    <div>
      <Link to="/">
        <ArrowBackIcon style={{marginLeft: "10px", marginTop: "5px", fontSize: "40"}}/>
      </Link>
      <Grid container>
        <Grid item className={classes.root} xs={11} md={8} lg={6}>
          <Paper className="paper-padding">
            <div style={{textAlign: "center"}}>
              <ArrowUpwardIcon />
            </div>
            <Typography style={{textAlign: "center"}} variant="subtitle1">0000</Typography>
            <DragDropContext onDragEnd={onDragEnd}>
              {
                events.map((list, index) => (
                  Array.isArray(list) ? <Droppable droppableId={`droppable${index}`} key={`droppable${index}`}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{marginTop: "10px"}}
                      >
                        {list.map((event, index) => (
                          <Draggable key={event.id.toString()} draggableId={event.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {EventCard(event.fact, false)}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable> : <div key={`card_${list.id}`} style={{marginTop: "10px"}}>{EventCard(list.fact, true)}</div>
                ))
              }
            </DragDropContext>
            <Typography style={{textAlign: "center"}} variant="subtitle1">{new Date().getFullYear()}</Typography>
            <div style={{textAlign: "center"}}>
              <ArrowDownwardIcon />
            </div>
            <div style={{textAlign: "end"}}>
              {
              !gameCompleted ? (
                <Button variant="contained" color="primary" onClick={guess}>
                  Guess
                </Button>) : (
                <Button variant="contained" color="primary" onClick={nextEvents}>
                  Play Again
                </Button>
              )
              }
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  ) : (<Backdrop open={true} className="backdrop">
  <CircularProgress style={{color: "#fff"}} />
</Backdrop>)
}

export default Order
