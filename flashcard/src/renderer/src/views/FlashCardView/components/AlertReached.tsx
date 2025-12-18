import CONGRATS from '@renderer/assets/images/congrats.png';
import { Button } from '@renderer/components/Buttons/Button';

interface AlertReachedProps {
    onFetchNewList: () => void
    onReplay: () => void
}

export function AlertReached({ onFetchNewList, onReplay }: AlertReachedProps) {

    return (
        <div className='flex justify-center items-center h-full flex-col'>
            <img src={CONGRATS} alt="" className="object-cover w-1/4" />
            <div className='text-white'>
                <p className='text-xl text-center mb-2'>Giỏi quá ku!</p>
                <p className='text-center max-w-4/5 mx-auto'>Bạn đã hoàn thành 100% lộ trình học của ngày hôm nay.</p>
                <div className='flex justify-between gap-4 mt-4'>
                    <Button className='w-full' onClick={onReplay}>Ôn lại</Button>
                    <Button className='w-full' onClick={onFetchNewList}>Tiếp đê</Button>
                </div>
            </div>
        </div>
    )
}