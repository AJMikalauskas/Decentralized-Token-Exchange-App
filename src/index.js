import React from 'react';
import ReactDOM from 'react-dom';
//Bootstrap import
import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
// Attach Redux Imports
//import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from "./store/configureStore"

const store = configureStore();

ReactDOM.render(
<Provider store={store}>
<App />
</Provider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
