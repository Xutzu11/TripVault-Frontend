import {ThemeProvider} from '@emotion/react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import theme from './theme.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
);
