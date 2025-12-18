import { ChangeEvent } from "react"

interface SwitchProps {
    checked: boolean,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    name?: string
    id?: string
}

export function Switch({ checked, name, id, onChange }: SwitchProps) {

    return (
        <label className="relative w-8 h-4 bg-slate-500/60 rounded-full has-checked:bg-sky-500 cursor-pointer">
            <input className="invisible peer" type="checkbox" name={name} id={id} checked={checked} onChange={onChange} />
            <div className="bg-white size-4 absolute left-0 top-0 rounded-full peer-checked:translate-x-full transition-all duration-300" />
        </label>
    )
}