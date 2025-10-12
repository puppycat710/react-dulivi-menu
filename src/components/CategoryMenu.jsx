import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area"

const categories = [
  "Mais Pedidos",
  "Perguntas e Avisos!",
  "O melhor que Temos <3",
  "Combos!",
  "Tunados",
  "Burgers Clássicos",
  "Ultrasmash",
  "Acompanhamentos!",
  "Maio Moot :)",
  "Sobremesas",
]

export function CategoryMenu() {
  return (
    <div className="sticky top-0 z-50 bg-white border-b">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center space-x-6 px-4 py-3 text-sm font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              className="text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
