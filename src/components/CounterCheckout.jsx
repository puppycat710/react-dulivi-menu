import { useState, useEffect } from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'

export function CounterCheckout({ onChange, onRemove, quantity }) {
	const [count, setCount] = useState(quantity)

	useEffect(() => {
		setCount(quantity)
	}, [quantity])

	function update(val) {
		const newVal = Math.max(1, val) // não deixa ir para 0
		setCount(newVal)
		onChange && onChange(newVal)
	}

	return (
		<div className='flex items-center text-sm text-black bg-transparent border border-[#0000001F] rounded transition active:scale-95'>
			{/* Botão de diminuir / remover */}
			<button
				className='w-8 h-8 flex items-center justify-center rounded-md'
				onClick={() => {
					if (count === 1) {
						onRemove && onRemove()
					} else {
						update(count - 1)
					}
				}}
			>
				{count === 1 ? (
					<Trash2 strokeWidth={2} color='red' className='w-5 h-5 cursor-pointer' />
				) : (
					<Minus strokeWidth={2} color='#1CAA60' className='w-5 h-5 cursor-pointer' />
				)}
			</button>

			{/* Valor */}
			<span className='w-4 text-center font-medium'>{count}</span>

			{/* Aumentar */}
			<button className='w-8 h-8 flex items-center justify-center rounded-md' onClick={() => update(count + 1)}>
				<Plus strokeWidth={2} color='#1CAA60' className='w-5 h-5 cursor-pointer' />
			</button>
		</div>
	)
}
