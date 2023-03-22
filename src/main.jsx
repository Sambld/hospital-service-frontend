import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


ReactDOM.createRoot(document.getElementById('root')).render(

    <ChakraProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </ChakraProvider>
)
