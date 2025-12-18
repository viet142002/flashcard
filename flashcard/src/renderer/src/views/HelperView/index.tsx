import { Quality } from "@renderer/utils/types"
import { Fragment } from "react/jsx-runtime"

const helpList = {
    CONTROLLER: {
        title: 'Controller',
        children: {
            NEXT: {
                icon: 'arrow-right',
                des: 'Từ tiếp theo',
                cmd: 'ArrowRight',
                key: 'next'
            },
            PREV: {
                icon: 'arrow-left',
                des: 'Quay lại từ trước',
                cmd: 'ArrowLeft',
                key: 'prev'
            },
            FLIP: {
                icon: 'refresh',
                des: 'Lật thé',
                cmd: 'Space',
                key: 'flip'
            },
        }
    },
    REVIEW: {
        title: 'Review',
        children: {
            BLACKOUT: {
                icon: 'star',
                des: 'Hoàn toàn không nhớ',
                cmd: String(Quality.BLACKOUT),
                key: 'blackout'
            },
            INCORRECT: {
                icon: 'star',
                des: 'Sai, nhưng khi xem đáp án thì quen',
                cmd: String(Quality.INCORRECT),
                key: 'incorrect'
            },
            RECALL_HARD: {
                icon: 'star',
                des: 'Sai, nhưng gần đúng',
                cmd: String(Quality.RECALL_HARD),
                key: 'recallHard'
            },
            RECALL_GOOD: {
                icon: 'star',
                des: 'Đúng, nhưng khó nhớ',
                cmd: String(Quality.RECALL_GOOD),
                key: 'recallGood'
            },
            RECALL_EASY: {
                icon: 'star',
                des: 'Đúng, hơi phân vân',
                cmd: String(Quality.RECALL_EASY),
                key: 'recallEasy'
            },
            PERFECT: {
                icon: 'star',
                des: 'Đúng, dễ dàng',
                cmd: String(Quality.PERFECT),
                key: 'perfect'
            },
        }
    }
}

export function HelperView() {
    return (
        <div className="absolute inset-0 w-full h-full text-white grid grid-rows-[auto,1fr] pt-2">
            <h1 className="text-center text-2xl px-4">Helper</h1>
            <div className="overflow-auto px-4 content">
                {Object.values(helpList).map((item) => (
                    <Fragment key={item.title}>
                        <h2 className="mt-2">{item.title}</h2>
                        <ul className="mt-1 ml-2 pl-2 border-l border-slate-500">
                            {Object.values(item.children).map((i) => (
                                <li key={i.key}>
                                    <span>{i.cmd}: </span>
                                    <span>{i.des}</span>
                                </li>
                            ))}
                        </ul>
                    </Fragment>
                ))}
            </div>
        </div>
    )
}