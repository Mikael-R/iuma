import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from "@material-ui/core/index";
import { createTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import 'styles/css/index.css';
import App from 'js/components/App';
import { store, persistor } from 'js/core/configureStore';
import { PersistGate } from 'redux-persist/lib/integration/react';

const theme = createTheme({
    palette: {
        primary: {
            main: '#cc0000'
        },
        secondary: {
            main: '#444'
        }
    },
    typography: {
        useNextVariants: true,
        fontFamily: [
            'DM Sans',
            'sans-serif',
        ].join(','),
        fontSize: 15,
        color: {
            primary: '#fff',
            secondary: '#444',
        }
    }
});
ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>
                    <App />
                </MuiThemeProvider>
            </BrowserRouter>
        </PersistGate>
    </Provider>
    , document.getElementById('clubMapfre')
);