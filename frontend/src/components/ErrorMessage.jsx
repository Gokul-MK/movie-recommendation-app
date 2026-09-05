import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorMessage({ message = 'Unable to load movies, please try again.', onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
            <div className="w-16 h-16 bg-red-900/30 rounded-2xl flex items-center justify-center border border-red-500/30">
                <AlertTriangle size={28} className="text-red-400" />
            </div>
            <div className="text-center">
                <p className="text-gray-300 font-medium mb-1">Something went wrong</p>
                <p className="text-gray-500 text-sm max-w-sm">{message}</p>
            </div>
            {onRetry && (
                <button onClick={onRetry} className="btn-secondary flex items-center gap-2 text-sm mt-2">
                    <RefreshCw size={14} />
                    Try Again
                </button>
            )}
        </div>
    )
}
