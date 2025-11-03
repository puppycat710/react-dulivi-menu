import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '../../components/ui/drawer'
import { Button } from '../../components/ui/button'

export function CategoryMenu() {
	const [categories, setCategories] = useState([])
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const scrollRef = useRef(null)

	useEffect(() => {
		const fetchCategories = async () => {
			const response = await api.get(`/category/all?fk_store_id=${fk_store_id}`, {
				validateStatus: () => true,
			})
			if (response.status === 200) {
				setCategories(response.data.data)
			} else {
				setCategories([])
			}
		}
		fetchCategories()
	}, [fk_store_id])

	const scroll = (direction) => {
		if (!scrollRef.current) return
		const scrollAmount = 200
		scrollRef.current.scrollBy({
			left: direction === 'left' ? -scrollAmount : scrollAmount,
			behavior: 'smooth',
		})
	}

	return (
		<div className='flex items-center gap-1'>
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant='ghost' className='h-full hover:bg-gray-200'>
						<Menu className='w-16 h-16 text-slate-700' />
					</Button>
				</DrawerTrigger>
				<DrawerContent className='bg-white shadow-lg data-[state=open]:bg-white [&>.fixed]:hidden border-none lg:w-[96%] w-full mx-auto'>
					<div className='flex flex-col space-y-3 p-4'>
						{categories?.map((cat) => (
							<DrawerClose asChild key={cat.id}>
								<button className='text-slate-700 hover:text-slate-900 text-left text-base'>{cat.title}</button>
							</DrawerClose>
						))}
					</div>
				</DrawerContent>
			</Drawer>
			<div className='relative sticky top-0 bg-white px-20 w-full'>
				{/* Botão seta esquerda */}
				<button
					onClick={() => scroll('left')}
					className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow rounded-full p-1.5 transition hidden md:block'
				>
					<ChevronLeft className='w-5 h-5 text-slate-700' />
				</button>
				{/* Container de rolagem */}
				<div
					ref={scrollRef}
					className='flex overflow-x-auto space-x-6 px-10 py-3 no-scrollbar scroll-smooth justify-center w-full'
				>
					{categories?.map((cat) => (
						<>
							<button key={cat.id} className='text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap'>
								{cat.title}
							</button>
							<hr className='bg-[#E0E0E0] w-[1px] h-auto border-none' />
						</>
					))}
				</div>
				{/* Botão seta direita */}
				<button
					onClick={() => scroll('right')}
					className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow rounded-full p-1.5 transition hidden md:block'
				>
					<ChevronRight className='w-5 h-5 text-slate-700' />
				</button>
			</div>
		</div>
	)
}
