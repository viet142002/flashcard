export const Tag = ({ children, className }: { children: React.ReactNode, className?: string }) => {

    return (
        <span className={`p-2 rounded-full ${className}`} >
            {children}
        </span>
    )
}