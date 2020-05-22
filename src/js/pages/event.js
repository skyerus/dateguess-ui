import React, {useEffect} from 'react'
import { Paper, Grid, Backdrop, CircularProgress, Typography, TextField, InputAdornment, Button } from '@material-ui/core'
import DateIcon from '@material-ui/icons/DateRange'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'

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

function Home(props) {
  const classes = styles()
  const [event, setEvent] = React.useState(null)
  const [pageLoading, setPageLoading] = React.useState(true)
  const [date, setDate] = React.useState("")
  const [dateDifference, setDateDifference] = React.useState(null)
  const [eventDate, setEventDate] = React.useState(null)

  useEffect(() => {
    fetchEvent()
    document.title = "Guess the date"
  }, [])

  const fetchEvent = () => {
    eventApi.randomEvent().then((r) => {
      setEvent(r.data)
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
    if (event != null) {
      setPageLoading(false)
    }
  }, [event])

  const guessDate = () => {
    let guessedDate = moment(date.trim() ,'YYYY-MM-DD', true)
    if (!guessedDate.isValid()) {
      props.snack("error", "Please provide a valid date in the format YYYY-MM-DD")
      return
    }
    let aDate = moment(event.date)
    let years = aDate.diff(guessedDate, 'year')
    guessedDate.add(years, 'years')
    let months = aDate.diff(guessedDate, 'months')
    guessedDate.add(months, 'months')
    var days = aDate.diff(guessedDate, 'days')

    setEventDate(aDate.format("YYYY-MM-DD"))
    setDateDifference(`${Math.abs(years)} years, ${Math.abs(months)} months, ${Math.abs(days)} days`)
  }

  const nextEvent = () => {
    setPageLoading(true)
    setDate("")
    setEvent(null)
    setDateDifference(null)
    setEventDate(null)
    fetchEvent()
  }

  return !pageLoading ? (
    <div>
      <Link to="/">
        <ArrowBackIcon style={{marginLeft: "10px", marginTop: "5px", fontSize: "40"}}/>
      </Link>
      <Grid container>
        <Grid item className={classes.root} xs={11} md={8} lg={6}>
          <Paper className="paper-padding">
            <Typography variant="h5" gutterBottom className={classes.header}>
              {event.fact}
            </Typography>
            <div className={classes.dateContainer}>
              <TextField  label="YYYY-MM-DD"
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DateIcon />
                              </InputAdornment>
                            ),
                          }}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
              />
              {!eventDate && !dateDifference && (
                <Button variant="contained" color="primary" style={{marginLeft: "5px", height: "40px"}} onClick={guessDate}>
                  Guess
                </Button>
              )}
            </div>
            {
              eventDate && (
                <Typography variant="subtitle1" gutterBottom style={{marginTop: "15px"}}>
                  Date: {eventDate}
                </Typography>
              )
            }
            {
              dateDifference && (
                <Typography variant="subtitle1" gutterBottom>
                  {dateDifference} difference
                </Typography>
              )
            }
            {
              eventDate && dateDifference && (
                <div style={{textAlign: "end"}}>
                  <Button variant="contained" color="primary" onClick={nextEvent}>
                    Next Event
                  </Button>
                </div>
              )
            }
          </Paper>
        </Grid>
      </Grid>
    </div>
  ) : (<Backdrop open={true} className="backdrop">
  <CircularProgress style={{color: "#fff"}} />
</Backdrop>)
}

export default Home
