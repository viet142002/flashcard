import { HTMLAttributes } from "react"

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    showOnHoverFlashCard?: boolean
    isAlwaysTopZ?: boolean,
    isCircle?: boolean,
    hasBorder?: boolean
}

const classNameObj = {
    base: 'no-drag cursor-pointer size-6 text-white flex items-center justify-center',
    showOnHoverFlashCard: 'opacity-0 group-hover/flashcard:opacity-100 duration-400',
    isAlwaysTopZ: 'z-9999999 relative',
    circle: 'rounded-full',
    border: 'border border-slate-500'
}

export const Button = ({ showOnHoverFlashCard, className, children, isAlwaysTopZ, isCircle, hasBorder, ...props }: ButtonProps) => {
    const _classNames: string[] = [];
    
    _classNames.push(classNameObj.base);
    if (className) _classNames.push(className);
    if (isAlwaysTopZ) _classNames.push(classNameObj.isAlwaysTopZ);
    if (showOnHoverFlashCard) _classNames.push(classNameObj.showOnHoverFlashCard);
    if (isCircle) _classNames.push(classNameObj.circle);
    if (hasBorder) _classNames.push(classNameObj.border);
    const _className = _classNames.join(' ');

    return (
        <button
            className={_className}
            {...props}
        >
            {children}
        </button>
    )
}