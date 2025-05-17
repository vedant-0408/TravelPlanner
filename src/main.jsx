import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {NextUIProvider} from '@nextui-org/react'
import App from './App.jsx'
import './index.css'
import store from './reducers/store.js'
import {Provider} from 'react-redux';
import AppProtector from './components/AppProtector.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
  <NextUIProvider>
    <App />
    <AppProtector />
  </NextUIProvider>
  </Provider>
  </StrictMode>,
)
