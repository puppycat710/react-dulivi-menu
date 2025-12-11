'use client'

import { useState, useEffect } from 'react'
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerClose,
} from '../../components/ui/drawer'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import SelectAddress from './selectedAddress'
import { api } from '../services/api.js'
import { useParams } from 'react-router-dom'
import { X, Trash2, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import SvgCity from './svg/SvgCity'
import { ChevronLeft } from 'lucide-react'

export default function SelectCityAndDistrict({ selectedAddress, setSelectedAddress }) {
	const [form, setForm] = useState({
		rua: '',
		bairro: '',
		numero: '',
		complemento: '',
		referencia: '',
		cidade: '',
		estado: '',
	})
	const [enderecos, setEnderecos] = useState([])
	const [enderecoSelecionado, setEnderecoSelecionado] = useState(null)
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const [storeCities, setStoreCities] = useState([])
	const [storeBairros, setStoreBairros] = useState([])
	const [step, setStep] = useState('cidades')
	const { storeSlug } = useParams()
	const fk_store_id = sessionStorage.getItem('fk_store_id')

	useEffect(() => {
		const fetchStore = async () => {
			try {
				const res = await api.get(`/store/slug/${storeSlug}`)
				const store_data = res.data.data
				if (store_data.password) delete store_data.password

				const state = store_data.store_state
				setForm((prev) => ({
					...prev,
					estado: state,
				}))
			} catch (err) {
				console.error('Erro ao buscar loja:', err)
			}
		}
		if (storeSlug) fetchStore()
	}, [storeSlug])

	useEffect(() => {
		const saved = localStorage.getItem('enderecos')
		if (saved) setEnderecos(JSON.parse(saved))
	}, [])

	const handleSaveAddress = () => {
		if (!form.rua || !form.bairro || !form.numero) {
			toast.warning('Campos obrigatórios')
			return
		}

		const novoEndereco = { ...form }
		const atualizado = [...enderecos, novoEndereco]

		setEnderecos(atualizado)
		localStorage.setItem('enderecos', JSON.stringify(atualizado))
		setIsDrawerOpen(false)
	}
	// PEGAR CIDADES DA LOJA QUANDO ABRIR O DRAWER
	useEffect(() => {
		if (isDrawerOpen) {
			setStep('cidades') // reset
			api
				.get(`/city/all?fk_store_id=${fk_store_id}`)
				.then((res) => setStoreCities(res.data.data))
				.catch((err) => console.log('Erro ao carregar cidades', err))
		}
	}, [isDrawerOpen])
	// QUANDO CLICA NA CIDADE → CARREGA BAIRROS
	const handleSelectCidade = async (cidade) => {
		setForm((p) => ({ ...p, cidade: cidade.name }))
		try {
			const res = await api.get(`/deliveryarea/all?fk_store_id=${fk_store_id}`)
			const bairrosDaCidade = res.data.data.filter((b) => b.fk_store_cities_id === cidade.id)
			setStoreBairros(bairrosDaCidade)
			setStep('bairros')
		} catch (e) {
			console.log(e)
			toast.error('Erro ao carregar bairros')
		}
	}
	// QUANDO CLICA NO BAIRRO → MOSTRAR FORMULÁRIO
	const handleSelectBairro = (bairro) => {
		setForm((p) => ({ ...p, bairro: bairro.name }))
		setStep('form')
	}

	const handleSelect = (index) => {
		setEnderecoSelecionado(index)
		setSelectedAddress(enderecos[index])
	}

	return (
		<div>
			<Drawer
				open={isDrawerOpen}
				onOpenChange={(open) => {
					setIsDrawerOpen(open)
					if (open) {
						setForm((prev) => ({
							rua: '',
							bairro: '',
							numero: '',
							complemento: '',
							referencia: '',
							cidade: '',
							estado: prev.estado, // MANTÉM O ESTADO DA LOJA
						}))
						setStep('cidades')
					}
				}}
			>
				<DrawerTrigger asChild>
					<Button className='text-dulivi font-semibold border-dulivi border-[1px] rounded-xl px-4 py-5 hover:opacity-90 transition w-full flex items-center gap-1 cursor-pointer mb-6'>
						<MapPin />
						Adicionar endereço
					</Button>
				</DrawerTrigger>

				<DrawerContent className='px-4 py-6 bg-white rounded-t-3xl shadow-xl max-w-[560px] mx-auto montserrat'>
					<DrawerClose className='absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100'>
						<X className='w-5 h-5 text-gray-500' />
					</DrawerClose>
					{/* --------------------------- */}
					{/*  1) LISTA DE CIDADES */}
					{/* --------------------------- */}
					{step === 'cidades' && (
						<div className='space-y-2 mb-108 text-[#20293b]'>
							<DrawerTitle className='mb-5 text-sm font-semibold'>Escolha a cidade para entrega</DrawerTitle>
							{storeCities.map((c) => (
								<button
									key={c.id}
									onClick={() => handleSelectCidade(c)}
									className='w-full cursor-pointer border-[#CFD6E5] px-4 py-3 border-[1px] rounded flex items-center justify-start gap-6'
								>
									<SvgCity width={18} height={18} fill='#525866' />
									<span className='w-fit text-sm font-medium'>
										{c.name} - {form.estado}
									</span>
								</button>
							))}
						</div>
					)}
					{/* --------------------------- */}
					{/* 2) LISTA DE BAIRROS */}
					{/* --------------------------- */}
					{step === 'bairros' && (
						<div className='space-y-2 mb-108 text-[#20293b]'>
							<header className='flex items-center gap-3 mb-5'>
								<i onClick={() => setStep('cidades')} className='cursor-pointer text-dulivi'>
									<ChevronLeft />
								</i>
								<DrawerTitle className='text-sm font-semibold'>Escolha a região para entrega</DrawerTitle>
							</header>
							{storeBairros.map((b) => (
								<button
									key={b.id}
									onClick={() => handleSelectBairro(b)}
									className='w-full cursor-pointer border-[#CFD6E5] px-4 py-3 border-[1px] rounded flex items-center justify-start gap-6'
								>
									<SvgCity width={18} height={18} fill='#525866' />
									<span className='w-fit text-sm font-medium'>{b.name}</span>
								</button>
							))}
						</div>
					)}
					{/* --------------------------- */}
					{/* 3) FORMULÁRIO NORMAL          */}
					{/* --------------------------- */}
					{step === 'form' && (
						<div className='space-y-1 mb-72'>
							<DrawerHeader className='px-0 text-start w-fit flex items-start'>
								<DrawerTitle className='text-sm text-[#20293b] leading-[8px] font-semibold'>
									{form.bairro ? `${form.bairro}, ${form.cidade}` : 'Preencha os dados corretamente.'}
								</DrawerTitle>
							</DrawerHeader>

							<div className='space-y-5'>
								{/* Rua */}
								<div className='relative'>
									<input
										type='text'
										value={form.rua}
										onChange={(e) => setForm((p) => ({ ...p, rua: e.target.value }))}
										className='
        peer
        border border-[#c2c2c2]
        text-sm
        px-3 pb-1 pt-3.5 w-full rounded
        placeholder-transparent
        outline-none
        hover:border-black
        focus:border-dulivi
        transition
      '
										placeholder='Rua'
									/>

									<label
										className='
        absolute left-3 pointer-events-none text-gray-400 transition-all duration-200
        top-2 text-sm
        peer-focus:-top-[-4px] peer-focus:text-xs peer-focus:text-dulivi
        peer-[:not(:placeholder-shown)]:-top-[-4px] peer-[:not(:placeholder-shown)]:text-xs
      '
									>
										Rua
									</label>
								</div>

								{/* Número + Complemento */}
								<div className='flex gap-4'>
									{/* Número */}
									<div className='relative w-2/4'>
										<input
											value={form.numero}
											type='number'
											onChange={(e) => setForm((p) => ({ ...p, numero: e.target.value }))}
											className='
												[&::-webkit-inner-spin-button]:appearance-none
												[&::-webkit-outer-spin-button]:appearance-none
												[&::-webkit-inner-spin-button]:m-0
												[&::-webkit-outer-spin-button]:m-0
												[appearance:textfield]
												peer
												border border-[#c2c2c2]
												text-sm
												px-3 pb-1 pt-3.5 w-full rounded
												placeholder-transparent
												outline-none
												hover:border-black
												focus:border-dulivi
												transition
        '
											placeholder='Número'
										/>

										<label
											className='
												absolute left-3 pointer-events-none text-gray-400 transition-all duration-200
												top-2 text-sm
												peer-focus:-top-[-4px] peer-focus:text-xs peer-focus:text-dulivi
												peer-[:not(:placeholder-shown)]:-top-[-4px] peer-[:not(:placeholder-shown)]:text-xs
        '
										>
											Número
										</label>
									</div>

									{/* Complemento */}
									<div className='relative w-full'>
										<input
											value={form.complemento}
											onChange={(e) => setForm((p) => ({ ...p, complemento: e.target.value }))}
											className='
          peer
          border border-[#c2c2c2]
          text-sm
          px-3 pb-1 pt-3.5 w-full rounded
          placeholder-transparent
          outline-none
          hover:border-black
          focus:border-dulivi
          transition
        '
											placeholder='Complemento'
										/>

										<label
											className='
          absolute left-3 pointer-events-none text-gray-400 transition-all duration-200
          top-2 text-sm
          peer-focus:-top-[-4px] peer-focus:text-xs peer-focus:text-dulivi
          peer-[:not(:placeholder-shown)]:-top-[-4px] peer-[:not(:placeholder-shown)]:text-xs
        '
										>
											Complemento
										</label>
									</div>
								</div>

								{/* Referência */}
								<div className='relative w-full'>
									<input
										value={form.referencia}
										onChange={(e) => setForm((p) => ({ ...p, referencia: e.target.value }))}
										className='
        peer
        border border-[#c2c2c2]
        text-sm
        px-3 pb-1 pt-3.5 w-full rounded
        placeholder-transparent
        outline-none
        hover:border-black
        focus:border-dulivi
        transition
      '
										placeholder='Ponto de referência'
									/>

									<label
										className='
        absolute left-3 pointer-events-none text-gray-400 transition-all duration-200
        top-2 text-sm
        peer-focus:-top-[-4px] peer-focus:text-xs peer-focus:text-dulivi
        peer-[:not(:placeholder-shown)]:-top-[-4px] peer-[:not(:placeholder-shown)]:text-xs
      '
									>
										Ponto de referência
									</label>
								</div>
							</div>

							<Button onClick={handleSaveAddress} className='mt-6 bg-dulivi text-white w-full py-5 rounded-xl'>
								Salvar endereço
							</Button>
						</div>
					)}
				</DrawerContent>
			</Drawer>
			{/* LISTA DE ENDEREÇOS SALVOS */}
			<span className='text-xs text-[#747e91] font-semibold px-2'>Selecione o endereço de entrega</span>
			<div className='mt-3 space-y-4 text-xs'>
				{enderecos.map((item, index) => (
					<div
						key={index}
						onClick={() => handleSelect(index)}
						className={`border rounded p-4 cursor-pointer transition relative
							${enderecoSelecionado === index ? 'border-dulivi bg-dulivi/10' : 'border-gray-300 bg-white'}`}
					>
						<div className='flex justify-between items-start'>
							<div className='flex flex-col gap-1'>
								<p className='font-semibold text-black'>
									{item.rua}, {item.numero}
								</p>
								<p className='text-black'>{item.bairro}</p>
								<p className='text-black'>
									{item.cidade} - {item.estado}
								</p>
							</div>

							<div className='flex flex-col items-center gap-4'>
								<input type='radio' checked={enderecoSelecionado === index} readOnly className='w-5 h-5 accent-dulivi' />
								<Trash2
									className='w-5 h-5 text-gray-400 cursor-pointer hover:text-red-700'
									onClick={(e) => {
										e.stopPropagation()
										const novos = enderecos.filter((_, i) => i !== index)
										setEnderecos(novos)
										localStorage.setItem('enderecos', JSON.stringify(novos))
										if (enderecoSelecionado === index) setEnderecoSelecionado(null)
									}}
								/>
							</div>
						</div>

						{enderecoSelecionado === index && <SelectAddress />}
					</div>
				))}
			</div>
		</div>
	)
}
