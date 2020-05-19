import React from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import App from "./js/app"

axios.defaults.baseURL = process.env.API_DOMAIN
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

const wrapper = document.getElementById("app")

ReactDOM.render(<App/>, wrapper)
