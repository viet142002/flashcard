import { useState } from "react"



export function Flashcard() {
    const [flipped, setFlipped] = useState(false)

    return (
        <div
            className="w-full h-full
                 flex items-center justify-center text-center
                 cursor-pointer select-none"
            onClick={() => setFlipped(!flipped)}
        >
            {flipped ? (
                <div>
                    <p className="text-lg font-semibold">abandon</p>
                    <p className="text-sm text-gray-600">
                        từ bỏ
                    </p>
                </div>
            ) : (
                <p className="text-2xl font-bold">abandon</p>
            )}
        </div>
    )
}