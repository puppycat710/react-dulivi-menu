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
import SvgMap from './svg/SvgMap'
import { api } from '../services/api.js'
import { X, Trash2, MapPin } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from 'sonner'
import axios from 'axios'
import statesMap from '../config/states.json'

export default function EntregaComponent() {
	const [form, setForm] = useState({
		rua: '',
		bairro: '',
		numero: '',
		cep: '',
		complemento: '',
		referencia: '',
		cidade: '',
		estado: '',
	})
	const [enderecos, setEnderecos] = useState([])
	const [enderecoSelecionado, setEnderecoSelecionado] = useState(null)
	const [estados, setEstados] = useState([])
	const [cidades, setCidades] = useState([])
	const [estadoSelecionado, setEstadoSelecionado] = useState('')
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)

	useEffect(() => {
		const saved = localStorage.getItem('enderecos')
		if (saved) {
			setEnderecos(JSON.parse(saved))
		}
	}, [])

	useEffect(() => {
		const saved = localStorage.getItem('enderecos')
		if (saved) {
			setEnderecos(JSON.parse(saved))
		}
	}, [])
	const handleSaveAddress = () => {
		// Basic validation
		if (!form.rua || !form.bairro || !form.numero || !form.cidade || !form.estado) {
			toast.warning('Campos obrigatórios', {
				description: 'Por favor, preencha todos os campos obrigatórios.',
			})
			return
		}
		const novoEndereco = { ...form }
		const atualizado = [...enderecos, novoEndereco]

		setEnderecos(atualizado)
		localStorage.setItem('enderecos', JSON.stringify(atualizado))

		setIsDrawerOpen(false) // fecha o drawer
	}

	const handleUseMyLocation = () => {
		if (!navigator.geolocation) {
			toast.warning('Seu navegador não suporta geolocalização')
			return
		}

		navigator.permissions?.query({ name: 'geolocation' })

		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const { latitude, longitude } = pos.coords

				try {
					const { data } = await axios.get(`https://us1.locationiq.com/v1/reverse`, {
						params: {
							key: 'pk.c580af6eca6d51b9702609058a52970b',
							lat: latitude,
							lon: longitude,
							format: 'json',
						},
						timeout: 8000,
					})
					const addr = data.address || {}

					const estadoConvertido = statesMap[addr.state] || ''
					setForm((prev) => ({
						...prev,
						rua: addr.road || '',
						bairro: addr.suburb || addr.neighbourhood || '',
						cidade: addr.city || addr.town || addr.village || '',
						estado: addr.state,
						cep: addr.postcode?.replace(/\D/g, '') || '',
					}))
					setEstadoSelecionado(estadoConvertido)
				} catch (err) {
					console.error(err)
					toast.error('Erro ao buscar endereço.')
				}
			},
			() => toast.error('Não foi possível obter sua localização.')
		)
	}
	// Carrega estados
	useEffect(() => {
		const fetchEstados = async () => {
			try {
				const res = await api.get('/estados')
				setEstados(res.data.data)
			} catch (error) {
				console.error('Erro ao carregar estados:', error)
			}
		}

		fetchEstados()
	}, [])
	// Carrega cidades quando muda estado
	useEffect(() => {
		const fetchCidades = async () => {
			if (estadoSelecionado) {
				try {
					const res = await api.get(`/cidades/${estadoSelecionado}`)
					setCidades(res.data.data)
				} catch (error) {
					console.error('Erro ao carregar cidades:', error)
				}
			}
		}

		fetchCidades()
	}, [estadoSelecionado])

	return (
		<div>
			<Drawer
				open={isDrawerOpen}
				onOpenChange={(open) => {
					setIsDrawerOpen(open)
					if (open) {
						setEstadoSelecionado('')
						setForm({
							rua: '',
							bairro: '',
							numero: '',
							cep: '',
							complemento: '',
							referencia: '',
							cidade: '',
							estado: '',
						})
					}
				}}
			>
				<DrawerTrigger asChild>
					<Button className='text-dulivi font-semibold border-dulivi border-[1px] rounded-xl px-4 py-5 hover:opacity-90 transition w-full flex items-center gap-1 cursor-pointer mb-6'>
						<MapPin />
						Adicionar endereço
					</Button>
				</DrawerTrigger>

				<DrawerContent className='px-6 py-6 bg-white rounded-t-3xl shadow-xl max-w-[560px] mx-auto montserrat'>
					{/* Botão de fechar */}
					<DrawerClose className='absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100'>
						<X className='w-5 h-5 text-gray-500' />
					</DrawerClose>
					<DrawerHeader className='px-0 text-start w-fit flex items-start'>
						<DrawerTitle className='text-sm text-[#20293b] leading-[8px] font-semibold'>
							{form.rua?.trim() ? form.rua : 'Adicionar endereço'}
						</DrawerTitle>
						<DrawerDescription className='text-xs text-[#20293b]'>
							{form.bairro ? `${form.bairro}, ${form.cidade} - ${estadoSelecionado}` : 'Preencha os dados corretamente.'}
						</DrawerDescription>
					</DrawerHeader>
					{/* Inputs */}
					<div className='space-y-4 mt-4'>
						{/* Rua */}
						<div className='flex flex-col gap-1'>
							<Input
								value={form.rua}
								onChange={(e) => setForm((prev) => ({ ...prev, rua: e.target.value }))}
								placeholder='Rua'
								className='border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary/40'
							/>
						</div>
						{/* Bairro */}
						<div className='flex flex-col gap-1'>
							<Input
								value={form.bairro}
								placeholder='Bairro'
								onChange={(e) => setForm((prev) => ({ ...prev, bairro: e.target.value }))}
								className='border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary/40'
							/>
						</div>
						{/* Cidade + Estado (mesma linha) */}
						<div className='flex gap-4'>
							<Select
								value={estadoSelecionado}
								onValueChange={(value) => {
									setEstadoSelecionado(value)
									setForm((prev) => ({ ...prev, cidade: '' }))
									setForm((prev) => ({ ...prev, estado: value }))
								}}
							>
								<SelectTrigger className='border-[#0000001F] rounded' id='estado'>
									<SelectValue placeholder='Selecione o estado' />
								</SelectTrigger>
								<SelectContent className='bg-white border-none'>
									{estados.map((e) => (
										<SelectItem key={e.id} value={e.sigla}>
											{e.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={form.cidade}
								onValueChange={(value) => setForm((prev) => ({ ...prev, cidade: value }))}
								disabled={!estadoSelecionado}
							>
								<SelectTrigger className='border-[#0000001F] rounded' id='cidade'>
									<SelectValue placeholder='Selecione a cidade' />
								</SelectTrigger>
								<SelectContent className='bg-white border-none'>
									{cidades.map((c) => (
										<SelectItem key={c.id} value={c.nome}>
											{c.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{/* Número + Complemento (mesma linha) */}
						<div className='flex gap-4'>
							{/* Número (30%) */}
							<div className='flex flex-col gap-1 w-[30%]'>
								<Input
									value={form.numero}
									placeholder='Número'
									onChange={(e) => setForm((prev) => ({ ...prev, numero: e.target.value }))}
									className='border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary/40'
								/>
							</div>
							{/* Complemento (70%) */}
							<div className='flex flex-col gap-1 flex-1'>
								<Input
									value={form.complemento}
									placeholder='Complemento'
									onChange={(e) => setForm((prev) => ({ ...prev, complemento: e.target.value }))}
									className='border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary/40'
								/>
							</div>
						</div>
						{/* Ponto de referência */}
						<div className='flex flex-col gap-1'>
							<Input
								value={form.referencia}
								placeholder='Ponto de referência'
								onChange={(e) => setForm((prev) => ({ ...prev, referencia: e.target.value }))}
								className='border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary/40'
							/>
						</div>
					</div>

					<Button
						onClick={handleUseMyLocation}
						className='w-full border-dulivi border-[1px] mt-32 text-dulivi font-medium py-5 rounded-xl cursor-pointer hover:bg-dulivi/10 transition'
					>
						<i className='!text-dulivi'>
							<SvgMap />
						</i>
						Usar minha localização
					</Button>
					<Button
						onClick={handleSaveAddress}
						className='mt-3 cursor-pointer bg-dulivi font-bold text-white w-full py-5 rounded-xl hover:opacity-90 transition'
					>
						Salvar endereço
					</Button>
				</DrawerContent>
			</Drawer>
			{/* Listar endereços salvos */}
			<span className='text-xs text-[#747e91] font-semibold px-2'>Selecione o endereço de entrega</span>
			<div className='mt-3 space-y-4 text-xs'>
				{enderecos.map((item, index) => (
					<div
						key={index}
						onClick={() => setEnderecoSelecionado(index)}
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
								<input
									type='radio'
									checked={enderecoSelecionado === index}
									readOnly
									className='w-5 h-5 text-dulivi accent-dulivi cursor-pointer'
								/>
								<Trash2
									strokeWidth={3}
									className='w-5 h-5 text-[#9CA5B8] cursor-pointer hover:text-red-700'
									onClick={(e) => {
										e.stopPropagation() // evita selecionar o endereço ao clicar na lixeira
										const novosEnderecos = enderecos.filter((_, i) => i !== index)
										setEnderecos(novosEnderecos)
										localStorage.setItem('enderecos', JSON.stringify(novosEnderecos))

										// Se o endereço deletado era o selecionado, limpar seleção
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
