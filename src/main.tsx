import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
	html, #root, body {
		height: 100%;
	}
  button {
    padding: 0;
  }
`



ReactDOM.render(
  <React.StrictMode>
    <App />
    <GlobalStyles />
  </React.StrictMode>,
  document.getElementById('root')
)
