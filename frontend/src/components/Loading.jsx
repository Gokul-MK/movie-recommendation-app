export default function Loading({ message = 'Loading…' }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-dark-600" />
                <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-gray-400 text-sm font-medium">{message}</p>
        </div>
    )
}
