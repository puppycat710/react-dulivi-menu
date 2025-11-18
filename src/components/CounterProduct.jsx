import { useState, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'

export function CounterProduct({ onChange, quantity }) {
	const [count, setCount] = useState(quantity)

	// Garante que atualiza quando o valor de quantity mudar no parent
	useEffect(() => {
		setCount(quantity)
	}, [quantity])

	function update(val) {
		const newVal = Math.max(0, val) // só impede valores negativos
		setCount(newVal)
		onChange && onChange(newVal)
	}

	return (
		<div className='flex items-center text-white gap-5 p-1.5 bg-dulivi shadow-md border border-gray-200 rounded-full transition active:scale-95'>
			{/* Diminuir */}
			<button
				className='w-8 h-8 flex items-center justify-center rounded-md'
				onClick={() => update(count - 1)}
				disabled={count === 0}
			>
				<Minus strokeWidth={4} className='w-3 h-3' />
			</button>

			{/* Valor */}
			<span className='w-4 text-center font-medium'>{count}</span>

			{/* Aumentar */}
			<button className='w-8 h-8 flex items-center justify-center rounded-md' onClick={() => update(count + 1)}>
				<Plus strokeWidth={4} className='w-3 h-3' />
			</button>
		</div>
	)
}
