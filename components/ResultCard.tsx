import type { Character } from '@/lib/types'

interface Props {
  character: Character
  explanation: string
  topTraits: string[]
  runnerUp?: Character | null
}

export default function ResultCard({ character, explanation, topTraits, runnerUp }: Props) {
  return (
    <section className="rounded-3xl card-float border border-white/50 p-5 shadow-xl">
      <div className="text-6xl" aria-hidden>
        {character.image}
      </div>
      <h1 className="text-3xl font-black mt-2">{character.name}</h1>
      <p className="text-lg font-semibold text-slate-700 mt-1">{character.tagline}</p>
      <p className="mt-4 text-base text-slate-700">{character.bio}</p>
      <p className="mt-4 text-lg font-semibold">You got this because you are {explanation}.</p>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Top traits">
        {topTraits.map((trait) => (
          <span key={trait} className="rounded-full bg-accent-sky/15 border border-accent-sky/40 px-3 py-1 font-bold text-accent-sky">
            {trait}
          </span>
        ))}
      </div>
      {runnerUp ? (
        <p className="mt-4 text-base font-semibold text-slate-700">Also close to: {runnerUp.name}</p>
      ) : null}
    </section>
  )
}
