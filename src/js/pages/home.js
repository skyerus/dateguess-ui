import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Grid, Typography, Paper} from '@material-ui/core'
import HistoryIcon from '@material-ui/icons/History'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import TimelineIcon from '@material-ui/icons/Timeline'

import Link from '../components/link'

const styles = makeStyles(theme => ({
  cardContainer: {
    textAlign: "center",
    borderRadius: "5px",
    margin: "0 10px 0 10px",
  },
  card: {
    padding: "30px 30px 30px 30px",
    "&:hover": {
      backgroundColor: "rgba(66, 66, 66, 0.9)"
    }
  },
  icon: {
    fontSize: 40,
    marginTop: "15px",
    marginBottom: "10px",
  },
}))

function Home(props) {
  const classes = styles()

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={4} md={3} style={{minWidth: '100%'}}>
        <Grid container justify="center">
          <Grid item xs={5} md={3} className={classes.cardContainer}>
            <Link to={"/historical_events"}>
              <Paper elevation={1} className={classes.card}>
                <Typography variant="h5">
                  Historical Events
                </Typography>
                <HistoryIcon className={classes.icon}/>
                <Typography variant="h6">
                  0000 - now
                </Typography>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={5} md={3} className={classes.cardContainer}>
            <Link to={"/articles"}>
              <Paper elevation={1} className={classes.card}>
                <Typography variant="h5">
                  News Articles
                </Typography>
                <LibraryBooksIcon className={classes.icon}/>
                <Typography variant="h6">
                  1900 - now
                </Typography>
              </Paper>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4} md={3} style={{minWidth: '100%', marginTop: "20px"}}>
        <Grid container justify="center">
          <Grid item xs={5} md={3} className={classes.cardContainer}>
            <Link to={"/historical_events/order"}>
              <Paper elevation={1} className={classes.card}>
                <Typography variant="h5">
                  Order of Events
                </Typography>
                <TimelineIcon className={classes.icon}/>
                <Typography variant="h6">
                  0000 - now
                </Typography>
              </Paper>
            </Link>
          </Grid>
        </Grid>
      </Grid>   
    </Grid>
  )
}

export default Home
