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
  }
})

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const EventCard = (value) => (
    <Typography variant="h6">{value}</Typography>
)

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: "10px 10px 10px 10px",
  margin: "0 0 10px 0",
  background: isDragging ? "rgba(59, 58, 58, 0.8)" : "#3b3a3a",
  boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  borderRadius: "2px",
  ...draggableStyle
})

function Order(props) {
  const classes = styles()
  const [events, setEvents] = React.useState([])
  const [pageLoading, setPageLoading] = React.useState(true)

  useEffect(() => {
    fetchEvents()
    document.title = "Guess the date"
  }, [])

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const es = reorder(
      events,
      result.source.index,
      result.destination.index
    )

    setEvents(es)
  }

  const fetchEvents = () => {
    eventApi.randomEvents(5).then((r) => {
      setEvents(r.data)
    }).catch((e) => {
      if (e.response.status == 401) {
        props.loggedIn(false)
        props.snack("error", "Invalid session")
      } else {
        props.snack("error", e.response.data.message)
      }
    })
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
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {events.map((event, index) => (
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
                            {EventCard(event.fact)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Typography style={{textAlign: "center"}} variant="subtitle1">{new Date().getFullYear()}</Typography>
            <div style={{textAlign: "center"}}>
              <ArrowDownwardIcon />
            </div>
            <div style={{textAlign: "end"}}>
              <Button variant="contained" color="primary">
                Guess
              </Button>
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
