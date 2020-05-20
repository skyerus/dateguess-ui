import axios from 'axios'

const api = {
  randomArticle: () => {
    return axios({
      method: "get",
      url: "/api/random_article",
    })
  }
}

export default api
