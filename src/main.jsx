import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import './i18n';
import { useTranslation } from 'react-i18next';

function Main() {
    const { i18n } = useTranslation();
    const language = localStorage.getItem('language') || 'en';
    const [theme, setTheme] = useState(extendTheme({
        direction: i18n.dir(language),
    }));

    useEffect(() => {
        if (i18n.dir() == 'rtl') {
            import('./styles/directions/rtl.css')
        } else {
            import('./styles/directions/ltr.css')
        }
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
