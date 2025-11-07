'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Pokemon {
  name: string
  sprites: {
    front_default: string
  }
  types: Array<{
    type: {
      name: string
    }
  }>
}

export default function PokemonCSR() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPokemon = async () => {
      const randomId = Math.floor(Math.random() * 150) + 1
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      setPokemon(response.data)
      setLoading(false)
    }
    fetchPokemon()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-400 text-center py-3 px-6 rounded-t-xl border-4 border-black">
          <h1 className="text-3xl font-bold">🎮 Pokémon CSR</h1>
          <p className="text-sm mt-1">Client-Side Rendering</p>
        </div>
        
        <div className="bg-white rounded-b-xl shadow-2xl p-8 border-4 border-black border-t-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando Pokémon...</p>
            </div>
          ) : pokemon ? (
            <div className="text-center">
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name}
                className="w-48 h-48 mx-auto"
              />
              <h2 className="text-gray-700 text-4xl font-bold capitalize mt-4">{pokemon.name}</h2>
              <div className="flex gap-2 justify-center mt-4">
                {pokemon.types.map((type) => (
                  <span 
                    key={type.type.name}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>CSR:</strong> Los datos se cargan en el navegador después de que la página se renderiza.
              ¡Mira el Network tab para ver la petición!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
