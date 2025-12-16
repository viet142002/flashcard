import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { LoadingView } from './components/LoadingView'
import { Header } from './components/Header'
import { FlashCardView } from './views/FlashCardView'
import { ResizeHandle } from './components/ResizeHandle'

function App(): React.JSX.Element {
    
    return (
        <div className='relative bg-black/20 rounded-xl shadow-lg overflow-hidden group/flashcard pb-6 mt-1.25'>
            <Header />
            <ResizeHandle />
            <Routes>
                <Route index element={<LoadingView />} />
                <Route path='flash-card' element={<FlashCardView />} />
            </Routes>
        </div>
    )
}

export default App
