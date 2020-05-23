import axios from 'axios'

const api = {
  randomEvent: () => {
    return axios({
      method: "get",
      url: "/api/random_historical_event",
    })
  },
  randomEvents: (qty) => {
    return axios({
      method: "get",
      url: `/api/random_historical_events?qty=${qty}`
    })
  }
}

export default api
