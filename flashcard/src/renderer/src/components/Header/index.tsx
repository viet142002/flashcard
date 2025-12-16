
export function Header() {
    return (
        <div className="drag-zone flex items-center px-2 duration-300">
            <button
                className="no-drag ml-auto cursor-pointer text-white opacity-0 hover:opacity-100 duration-300 group-hover/flashcard:opacity-100"
                onClick={() => {
                    window.flashcard.hide();
                }}
            >✕</button>
        </div>
    )
}