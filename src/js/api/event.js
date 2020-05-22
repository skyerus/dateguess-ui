import axios from 'axios'

const api = {
  randomEvent: () => {
    return axios({
      method: "get",
      url: "/api/random_historical_event",
    })
  }
}

export default api
