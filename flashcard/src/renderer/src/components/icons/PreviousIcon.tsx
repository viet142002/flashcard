export const PreviousIcon = ({
    width = 24,
    height = 24,
}: {
    width?: number
    height?: number
}) => {
    return (
        <svg
            fill="currentColor"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            id="previous"
            data-name="Flat Color"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                id="primary"
                d="M17.45,2.11a1,1,0,0,0-1.05.09l-12,9a1,1,0,0,0,0,1.6l12,9a1,1,0,0,0,1.05.09A1,1,0,0,0,18,21V3A1,1,0,0,0,17.45,2.11Z"
                fill="currentColor"
            ></path>
        </svg>
    )
}
