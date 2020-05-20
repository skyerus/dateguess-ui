import React, {useEffect} from 'react'
import { Paper, Grid, Backdrop, CircularProgress, Typography, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import articleApi from '../api/article'

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
})

function Home(props) {
  const classes = styles()
  const [article, setArticle] = React.useState(null)
  const [bodyParagraphs, setBodyParagraphs] = React.useState([])
  const [pageLoading, setPageLoading] = React.useState(true)
  const [date, setDate] = React.useState("")

  useEffect(() => {
    articleApi.randomArticle().then((r) => {
      hydrateBodyParagraphs(r.data.fields.bodyText)
      setArticle(r.data)
    }).catch((e) => {
      if (e.response.status == 401) {
        props.loggedIn(false)
        props.snack("error", "Invalid session")
      } else {
        props.snack("error", e.response.data.message)
      }
    })
  }, [])

  useEffect(() => {
    if (article != null) {
      setPageLoading(false)
    }
  }, [article])

  const hydrateBodyParagraphs = (text) => {
    let splitText = text.split(".")
    if (splitText.length <= 6) {
      setBodyParagraphs([text])
      return
    }
    let randInt = getRandomInt(2, 5)
    let paras = []
    let para = ""
    for (let i=0;i<splitText.length;i++) {
      if (i <= randInt) {
        para += splitText[i] + "."
      } else {
        paras.push(para)
        para = ""
        randInt = i + getRandomInt(3, 6)
      }
    }
    if (para != "") {
      paras.push(para)
    }

    setBodyParagraphs(paras)
  }

  const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  return !pageLoading ? (
    <Grid container>
      <Grid item className={classes.root} xs={11} md={8} lg={6}>
        <Paper className="paper-padding">
          <Typography variant="h5" gutterBottom className={classes.header}>
            {article.webTitle}
          </Typography>
          {
            bodyParagraphs.map((para, i) => 
              <Typography variant="body1" gutterBottom className={classes.bodyText} key={i}>
                {para}
              </Typography>
            )
          }
          <div>
            <TextField  label="Date"
                        variant="outlined"
                        size="small"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </Paper>
      </Grid>
    </Grid>
  ) : (<Backdrop open={true} className="backdrop">
  <CircularProgress style={{color: "#fff"}} />
</Backdrop>)
}

export default Home
