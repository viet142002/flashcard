import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Header } from './components/Header'
import { FlashCardView } from './views/FlashCardView'
import { ResizeHandle } from './components/ResizeHandle'
import FlashScreen from './views/FlashScreen'
import { ROUTES } from './utils/constants'

function App(): React.JSX.Element {
    
    return (
        <div className='relative h-full bg-black/30 rounded-xl shadow-lg overflow-hidden group/flashcard pb-6'>
            <Header />
            <ResizeHandle />
            <Routes>
                <Route index element={<FlashScreen />} />
                <Route path={ROUTES.FLASHCARD} element={<FlashCardView />} />
            </Routes>
        </div>
    )
}

export default App
