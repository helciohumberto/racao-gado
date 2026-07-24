export interface Animal {
    id: number
    nome: string
    raca?: string
    sexo: string
    pesoInicial: number
    estado: string
    loteId: number
    lote?: { id: number; nome: string }
    pesagens?: { id: number; peso: number; data: string }[]
    createdAt: string
}

export interface Lote {
    id: number
    nome: string
    descricao?: string
}

export interface Usuario {
    id: number
    email: string
}