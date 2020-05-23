import axios from 'axios'

const api = {
  randomEvent: () => {
    return axios({
      method: "get",
      url: "/api/random_historical_event",
    })
  },
  randomEvents: (qty, order) => {
    return axios({
      method: "get",
      url: `/api/random_historical_events?qty=${qty}&order=${order}`
    })
  }
}

export default api
