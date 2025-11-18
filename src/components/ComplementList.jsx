import { useEffect, useState } from 'react'
import { CounterButton } from './CounterButton'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'

export default function ComplementList({ product_id, onSelectChange }) {
	const [groups, setGroups] = useState([])
	const [storeId, setStoreId] = useState([])
	const [selected, setSelected] = useState({}) // guarda seleções
	const { storeSlug } = useParams()

	useEffect(() => {
		const fetchStore = async () => {
			try {
				const res = await api.get(`/store/slug/${storeSlug}`)
				const store_data = res.data.data
				if (store_data.password) delete store_data.password
				setStoreId(store_data.id)
			} catch (err) {
				console.error('Erro ao buscar loja:', err)
			}
		}
		if (storeSlug) fetchStore()
	}, [storeSlug])
	useEffect(() => {
		const fetchData = async () => {
			const res = await api.get(`/store/${storeId}/product/${product_id}/complements`)
			setGroups(res.data.data || [])
		}
		fetchData()
	}, [product_id, storeId])
	// Seleção tipo RADIO / CHECKBOX
	const toggleSelect = (groupId, complementId, limit) => {
		setSelected((prev) => {
			const current = prev[groupId] || []

			if (limit === 1) {
				return { ...prev, [groupId]: [complementId] }
			}

			if (current.includes(complementId)) {
				return {
					...prev,
					[groupId]: current.filter((id) => id !== complementId),
				}
			}

			if (current.length < limit) {
				return {
					...prev,
					[groupId]: [...current, complementId],
				}
			}

			return prev
		})
	}
	// Seleção tipo COUNTER
	const handleCounterChange = (groupId, complementId, value, limit) => {
		setSelected((prev) => {
			const current = prev[groupId] || {}
			const updated = { ...current, [complementId]: value }

			// Remove itens com valor 0
			Object.keys(updated).forEach((key) => {
				if (updated[key] === 0) delete updated[key]
			})

			// Não ultrapassar limite total
			const total = Object.values(updated).reduce((a, b) => a + b, 0)
			if (total > limit) return prev

			return { ...prev, [groupId]: updated }
		})
	}
	// Atualiza componente pai
	useEffect(() => {
		onSelectChange && onSelectChange(selected, groups)
	}, [selected])

	return (
		<div className='flex flex-col gap-6 px-4'>
			{groups.map((group) => {
				const limit = group.option_limit || 1
				const multiple = group.multiple_selection === 1

				// Normaliza selectedGroup
				const selectedGroup = multiple ? selected[group.id] || {} : selected[group.id] || []

				return (
					<div key={group.id} className='flex flex-col gap-3'>
						<div>
							<span className='font-bold text-xl'>{group.title}</span>
							<span className='bg-[#CFD6E5] px-2 py-0.5 rounded w-fit text-sm ml-2'>
								{limit === 1 ? 'Escolha 1' : `Escolha até ${limit}`}
							</span>
						</div>

						{group.complements.map((item) => {
							let isSelected = false

							if (multiple && typeof selectedGroup === 'object') {
								isSelected = !!selectedGroup[item.id]
							} else if (Array.isArray(selectedGroup)) {
								isSelected = selectedGroup.includes(item.id)
							}

							const groupTotal =
								multiple && typeof selectedGroup === 'object' ? Object.values(selectedGroup).reduce((a, b) => a + b, 0) : 0

							const disablePlus = groupTotal >= limit

							return (
								<div key={item.id} className='flex justify-between w-full border-b border-[#CFD6E570] pb-4'>
									<main className='flex flex-col justify-center'>
										<span className='text-[#20293b] font-medium'>{item.title}</span>
										<span className='text-sm'>{item.price > 0 ? `+ R$ ${item.price.toFixed(2)}` : 'Grátis'}</span>
									</main>

									<aside className='flex items-center gap-3'>
										<img
											width={70}
											height={70}
											className='rounded-xl w-[70px] h-[70px] object-cover'
											src={item.image || '/assets/image.png'}
											alt={item.title}
										/>

										{multiple ? (
											<CounterButton
												value={selectedGroup[item.id] || 0}
												disabledPlus={disablePlus}
												onChange={(value) => handleCounterChange(group.id, item.id, value, group.option_limit)}
											/>
										) : limit === 1 ? (
											<input
												type='radio'
												name={`group-${group.id}`}
												checked={isSelected}
												onChange={() => toggleSelect(group.id, item.id, limit)}
												className='w-5 h-5'
											/>
										) : (
											<input
												type='checkbox'
												checked={isSelected}
												onChange={() => toggleSelect(group.id, item.id, limit)}
												disabled={!isSelected && selectedGroup.length >= limit}
												className='w-5 h-5'
											/>
										)}
									</aside>
								</div>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}
