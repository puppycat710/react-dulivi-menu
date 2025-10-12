import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PaymentPage from './pages/PaymentPage'
import UploadPage from './pages/UploadPage'
import NotFound from './pages/NotFound'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'

export const RoutesComponent = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<HomePage />} />
				<Route path='/:slug' element={<StorePage />} />
				<Route path='/pay' element={<PaymentPage />} />
				<Route path='/upload' element={<UploadPage />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}
