import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
	*, *::before, *::after {
    box-sizing: border-box;
  }

  html, #root, body {
		height: 100%;
	}
  button {
    all: unset;
    padding: 0;
    box-sizing: content-box;
  }
`



ReactDOM.render(
  <React.StrictMode>
    <App />
    <GlobalStyles />
  </React.StrictMode>,
  document.getElementById('root')
)
