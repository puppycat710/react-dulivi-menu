export default function StoreInfoCard({ store }) {
	// Função para converter minutos em formato "1h20" ou "30min"
	const formatTime = (minutes) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60

		if (hours > 0 && mins > 0) return `${hours}h${mins}`
		if (hours > 0 && mins === 0) return `${hours}h`
		return `${mins}min`
	}

	return (
		<div className='w-full border border-[#EAEDF4] rounded-xl p-2 text-[#747E91] text-[.725rem]'>
			<div className='w-full flex justify-evenly'>
				{/* Tempo de entrega */}
				<div className='flex flex-col items-center justify-center'>
					<span className='text-[.65rem]'>Entrega</span>
					<span className='font-semibold'>
						{formatTime(store.delivery_time_min)} -{' '}
						{formatTime(store.delivery_time_max)}
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
			</div>
		</div>
	)
}
