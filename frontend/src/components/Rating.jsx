import { Star } from 'lucide-react'

export default function Rating({ score, size = 'md' }) {
    const sizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }
    const displayScore = score ? Number(score).toFixed(1) : 'N/A'

    return (
        <span className={`flex items-center gap-1 font-semibold ${sizes[size]}`}>
            <Star
                size={size === 'lg' ? 18 : 14}
                className="fill-accent text-accent shrink-0"
            />
            <span className="text-white">{displayScore}</span>
            <span className="text-gray-500 font-normal">/10</span>
        </span>
    )
}
