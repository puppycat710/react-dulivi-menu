import { useContext, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { StoreContext } from '../context/StoreContext'
import { api } from '../services/api'

export default function ProductList({ store }) {
	const [categories, setCategories] = useState([])
	const [products, setProducts] = useState([])
	//Navigate
	const navigate = useNavigate()
	//Session
	const { fk_store_id } = useContext(StoreContext)
	// Get all categories
	useEffect(() => {
		const fetchCategories = async () => {
			const res = await api.get(`/category/all?fk_store_id=${fk_store_id}`)
			if (res.status == 200) {
				const data = res.data.data
				setCategories(data)
			}
		}
		fetchCategories()
	}, [fk_store_id])
	// Get all products
	useEffect(() => {
		const fetchProducts = async () => {
			const res = await api.get(`/product/all?fk_store_id=${fk_store_id}`)
			if (res.status == 200) {
				const data = res.data.data
				setProducts(data)
			}
		}
		fetchProducts()
	}, [fk_store_id])

	return (
		<div className='max-w-[730px] w-full mx-auto px-4 mt-8 flex flex-col gap-10'>
			{categories.map((category) => (
				<section key={category.id} className='flex flex-col gap-3'>
					{/* Título da categoria */}
					<h2 className='font-bold text-[#20293b] text-center mb-4 mt-2'>{category.title}</h2>
					{/* Lista de produtos dessa categoria */}
					{products
						.filter((prod) => prod.fk_store_categories_id === category.id)
						.map((prod) => (
							<div
								key={prod.id}
								className='flex justify-between w-full border-b border-[#CFD6E570] pb-4 cursor-pointer'
								onClick={() => navigate(`/${store.slug}/produto/${prod.slug}`)}
							>
								<main className='flex flex-col justify-between'>
									<header className='flex flex-col md:gap-3 gap-2'>
										<span className='text-[#20293b] text-sm font-semibold'>{prod.title}</span>
										<span className='text-xs text-[#525866] md:max-w-lg max-w-[258px]'>{prod.description}</span>
									</header>

									<span className='text-xs text-[#20293b] mt-4'>
										A partir de <span className='text-sm font-semibold'>R$ {prod.price}</span>
									</span>
								</main>

								<aside>
									<img
										width={120}
										height={120}
										className='rounded-xl w-[120px] h-[120px] object-cover'
										src={prod.image || '/assets/image.png'}
										alt={prod.title}
									/>
								</aside>
							</div>
						))}
				</section>
			))}
		</div>
	)
}
