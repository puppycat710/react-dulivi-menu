import { Plus, Minus } from 'lucide-react'

export function CounterButton({ value = 0, onChange, disabledPlus, max = 999 }) {
	function update(val) {
		const newVal = Math.max(0, Math.min(val, max))
		onChange && onChange(newVal)
	}

	return (
		<div className='flex items-center gap-1 bg-white shadow-md border border-gray-200 rounded-md transition active:scale-95'>
			<button
				className='w-8 h-8 flex items-center justify-center rounded-md'
				onClick={() => update(value - 1)}
				disabled={value === 0}
			>
				<Minus strokeWidth={2.5} className='text-red-600 w-4 h-4' />
			</button>

			<span className='w-4 text-center font-semibold'>{value}</span>

			<button
				className='w-8 h-8 flex items-center justify-center rounded-md'
				disabled={disabledPlus || value >= max}
				onClick={() => update(value + 1)}
			>
				<Plus strokeWidth={2.5} className='text-green-600 w-4 h-4' />
			</button>
		</div>
	)
}
