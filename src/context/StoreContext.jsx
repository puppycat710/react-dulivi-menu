// StoreContext.jsx
import { createContext, useState } from 'react'

export const StoreContext = createContext()

export function StoreProvider({ children }) {
	const [fk_store_id] = useState(() => sessionStorage.getItem('fk_store_id'))

	return <StoreContext.Provider value={{ fk_store_id }}>{children}</StoreContext.Provider>
}
