import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Header } from './components/Header'
import { FlashCardView } from './views/FlashCardView'
import { ResizeHandle } from './components/ResizeHandle'
import FlashScreen from './views/FlashScreen'
import { ROUTES } from './utils/constants'
import { HelperView } from './views/HelperView'
import { BackgroundService } from './components/BackgroundService'

function App(): React.JSX.Element {

    return (
        <div className='flex flex-col relative h-full bg-black/60 rounded-xl shadow-lg overflow-hidden group/flashcard pb-6'>
            <Header />
            <ResizeHandle />
            <BackgroundService />
            <div className='flex-1'>
                <Routes>
                    <Route index element={<FlashScreen />} />
                    <Route path={ROUTES.FLASHCARD} element={<FlashCardView />} />
                    <Route path={ROUTES.HELPER} element={<HelperView />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
