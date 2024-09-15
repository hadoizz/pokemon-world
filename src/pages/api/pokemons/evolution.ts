import { NextApiRequest, NextApiResponse } from 'next';
import { PokemonEvolution } from '@/types/pokemon';
import evolutions from '~/generated/pokemon-evolution.json';

// Ensure evolutions is a flat array of PokemonEvolution objects
const flattenEvolutions = (data: any): PokemonEvolution[] => {
  // Assuming the original data is nested
  return data.flat();
};

export type PokemonEvolutionFilter = {
  generationId?: number;
  type?: string;
};

const LIMIT = 25;

export const getEvolutions = (
  { generationId, type }: PokemonEvolutionFilter,
  page: number = 0,
): PokemonEvolution[] => {
  let data = flattenEvolutions(evolutions);

  if (generationId) {
    data = data.filter((pokemon: PokemonEvolution) => pokemon.generationId === generationId);
  }

  if (type) {
    data = data.filter((pokemon: PokemonEvolution) => pokemon.types.includes(type));
  }

  const start = LIMIT * page;
  return data.slice(start, start + LIMIT);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;
  const data = getEvolutions(
    {
      generationId: Number(query.generationId || 0),
      type: query.type as string,
    },
    Number(query.page || 0),
  );
  res.status(200).json(data);
}
