import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function StoreHours({ store }) {
	const [isOpen, setIsOpen] = useState(false)
	const [closeDisplay, setCloseDisplay] = useState('23:50')
	const [isDayOpen, setIsDayOpen] = useState(true)
	const [nextOpenDay, setNextOpenDay] = useState(null)

	// Day Open
	useEffect(() => {
		const fetchDays = async () => {
			try {
				const res = await api.get(`/store-day/all?fk_store_id=${store.id}`)
				const dias = res.data.data
				const hoje = new Date().getDay()
				const diaDeHoje = dias.find((d) => d.weekday === hoje)
				setIsDayOpen(diaDeHoje ? diaDeHoje.is_open === 1 : false)
				// 🔹 Se hoje estiver fechado, procura o próximo dia aberto
				if (!diaDeHoje || diaDeHoje.is_open === 0) {
					for (let i = 1; i <= 7; i++) {
						const proximoDia = dias.find((d) => d.weekday === (hoje + i) % 7 && d.is_open === 1)
						if (proximoDia) {
							setNextOpenDay(proximoDia)
							break
						}
					}
				} else {
					setNextOpenDay(null)
				}
			} catch (err) {
				console.error('Erro ao buscar dias da loja:', err)
			}
		}

		if (store?.id) fetchDays()
	}, [store?.id])

	// Open?
	useEffect(() => {
		const checkOpen = () => {
			if (store.is_closed === 1 || !isDayOpen) {
				setIsOpen(false)
				return
			}

			const now = new Date()
			const [openH, openM] = store.open_time.split(':').map(Number)
			const openDate = new Date()
			openDate.setHours(openH, openM, 0, 0)

			let closeH = 23
			let closeM = 59
			if (store.close_time) {
				;[closeH, closeM] = store.close_time.split(':').map(Number)
			}
			const closeDate = new Date()
			closeDate.setHours(closeH, closeM, 0, 0)

			setCloseDisplay(`${closeH.toString().padStart(2, '0')}:${closeM.toString().padStart(2, '0')}`)
			setIsOpen(now >= openDate && now <= closeDate)
		}
		checkOpen()
		const interval = setInterval(checkOpen, 60 * 1000)
		return () => clearInterval(interval)
	}, [store.open_time, store.close_time, store.is_closed, isDayOpen])

	// 🔹 Render final
	let text = ''
	if (store.is_closed === 1) {
		text = 'Fechado'
	} else if (!isDayOpen) {
		if (nextOpenDay) {
			const weekdayNames = [
				'domingo',
				'segunda-feira',
				'terça-feira',
				'quarta-feira',
				'quinta-feira',
				'sexta-feira',
				'sábado',
			]
			text = `Abre ${weekdayNames[nextOpenDay.weekday]} às ${store.open_time.slice(0, 5)}`
		} else {
			text = 'Fechado hoje'
		}
	} else if (isOpen) {
		text = `Aberto até ${closeDisplay}`
	} else {
		text = `Abre hoje às ${store.open_time.slice(0, 5)}`
	}

	return (
		<>
			<span
				className='text-[.675rem]'
				style={{
					color: isOpen ? '#19c235' : '#000000',
				}}
			>
				{text}{' '}
			</span>
			<span
				style={{
					marginTop: '2px',
					color: isOpen ? '#20293b' : '#9ca5b8',
				}}
			>
				{store.name}
			</span>
			<span
				style={{
					marginTop: '2px',
					color: isOpen ? '#20293b' : '#9ca5b8',
				}}
				className='font-normal mt-1 text-xs'
			>
				{store.store_location}
			</span>
		</>
	)
}
