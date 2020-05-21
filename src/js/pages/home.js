import React, {useEffect} from 'react'
import { Paper, Grid, Backdrop, CircularProgress, Typography, TextField, InputAdornment, Button, Link } from '@material-ui/core'
import DateIcon from '@material-ui/icons/DateRange'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'

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
  dateContainer: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
  }
})

function Home(props) {
  const classes = styles()
  const [article, setArticle] = React.useState(null)
  const [bodyParagraphs, setBodyParagraphs] = React.useState([])
  const [pageLoading, setPageLoading] = React.useState(true)
  const [date, setDate] = React.useState("")
  const [dateDifference, setDateDifference] = React.useState(null)
  const [articleDate, setArticleDate] = React.useState(null)

  useEffect(() => {
    fetchArticle()
  }, [])

  const fetchArticle = () => {
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
  }

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
        if (splitText[i] == "") {
          if (i == splitText.length - 1) {
            break
          }
          para += "."
          continue
        }
        para += splitText[i] + "."
      } else {
        if (splitText[i] == "") {
          if (i == splitText.length - 1) {
            break
          }
          para += "."
          continue
        }
        paras.push(para)
        para = splitText[i] + "."
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

  const guessDate = () => {
    let guessedDate = moment(date.trim() ,'YYYY-MM-DD', true)
    if (!guessedDate.isValid()) {
      props.snack("error", "Please provide a valid date in the format YYYY-MM-DD")
      return
    }
    let aDate = moment(article.webPublicationDate)
    let years = aDate.diff(guessedDate, 'year')
    guessedDate.add(years, 'years')
    let months = aDate.diff(guessedDate, 'months')
    guessedDate.add(months, 'months')
    var days = aDate.diff(guessedDate, 'days')

    setArticleDate(aDate.format("YYYY-MM-DD"))
    setDateDifference(`${Math.abs(years)} years, ${Math.abs(months)} months, ${Math.abs(days)} days`)
  }

  const nextArticle = () => {
    setPageLoading(true)
    setDate("")
    setArticle(null)
    setBodyParagraphs([])
    setDateDifference(null)
    setArticleDate(null)
    fetchArticle()
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
            {!articleDate && !dateDifference && (
              <Button variant="contained" color="primary" style={{marginLeft: "5px", height: "40px"}} onClick={guessDate}>
                Guess
              </Button>
            )}
          </div>
          {
            articleDate && (
              <Typography variant="subtitle1" gutterBottom style={{marginTop: "15px"}}>
                <Link href={article.webUrl} variant="subtitle1">
                  Article
                </Link>
                &nbsp;published: {articleDate}
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
            articleDate && dateDifference && (
              <div style={{textAlign: "end"}}>
                <Button variant="contained" color="primary" onClick={nextArticle}>
                  Next Article
                </Button>
              </div>
            )
          }
        </Paper>
      </Grid>
    </Grid>
  ) : (<Backdrop open={true} className="backdrop">
  <CircularProgress style={{color: "#fff"}} />
</Backdrop>)
}

export default Home
