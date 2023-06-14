import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@apollo/client';
import GET_MONSTERS from '../api/getMonsters';
import TextField from './TextField';

export default function MonsterList() {
  const [searchQuery, setSearchQuery] = useState('');
  const { loading, data: { monsters }, refetch } = useQuery(GET_MONSTERS);
  
  if(loading) return (<h3>On the hunt for monsters...</h3>);

  const handleSubmit = (e) => {
    e.preventDefault();
    refetch({ name: searchQuery });
  }

  return (
    <div className="mt-3 mb-4">
      <Helmet>
        <title>Monster List</title>
        <meta name="description" content="Peruse the monsters of the multiverse with these easy-to-use filters." />
      </Helmet>
      <h1>Monsters</h1>

      <form onSubmit={handleSubmit}>
        <TextField 
          label="Look up a monster"
          id="monsterSearchQuery"
          className="mb-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {/* todo: paginate */}
      {(monsters.length > 0) ? (
        <ul className="list-unstyled mt-3">
          {monsters.map((monster) => (
            <li key={monster.index}>
              <h2>{monster.name}</h2>
            </li>
          ))}
        </ul>
      ): (
        <p>No monsters found.</p>
      )}
    </div>
  )
}