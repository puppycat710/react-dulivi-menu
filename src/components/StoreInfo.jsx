import { useEffect, useState } from "react"
import { api } from "../services/api"

export default function StoreInfoCard({ store }) {
	const [hasCustomAreas, setHasCustomAreas] = useState(false)
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	// Função para converter minutos em formato "1h20" ou "30min"
	const formatTime = (minutes) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60

		if (hours > 0 && mins > 0) return `${hours}h${mins}`
		if (hours > 0 && mins === 0) return `${hours}h`
		return `${mins}min`
	}
	// Buscar bairros
	useEffect(() => {
		const fetchDeliveryAreas = async () => {
			try {
				const res = await api.get(`/deliveryarea/all?fk_store_id=${fk_store_id}`)
				const data = res.data.data
				if (data?.length > 0) {
					setHasCustomAreas(true)
				}
			} catch (err) {
			}
		}

		fetchDeliveryAreas()
	}, [store.id])

	return (
		<div className='w-full border border-[#EAEDF4] rounded-xl p-2 text-[#747E91] text-[.725rem]'>
			<div className='w-full flex justify-evenly'>
				{/* Tempo de entrega */}
				<div className='flex flex-col items-center justify-center'>
					<span className='text-[.65rem]'>Entrega</span>
					<span className='font-semibold'>
						{formatTime(store.delivery_time_min)} - {formatTime(store.delivery_time_max)}
					</span>
				</div>
				<hr className='bg-[#E0E0E0] w-[1px] h-auto' />
				{/* Pedido mínimo */}
				<div className='flex flex-col items-center justify-center'>
					<span className='text-[.65rem]'>Pedido mínimo</span>
					<span className='font-semibold'>
						{store.minimum_order.toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'BRL',
						})}
					</span>
				</div>
				{/* Só mostra a taxa padrão se não tiver bairros personalizados */}
				{!hasCustomAreas && (
					<>
						<hr className='bg-[#E0E0E0] w-[1px] h-auto' />
						<div className='flex flex-col items-center justify-center'>
							<span className='text-[.65rem]'>Taxa de entrega</span>
							<span className='font-semibold text-[#19c235]'>
								{store.default_delivery_fee.toLocaleString('pt-BR', {
									style: 'currency',
									currency: 'BRL',
								})}
							</span>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
