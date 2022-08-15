import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Helmet } from 'react-helmet';
import SelectField from './SelectField';

export default function SpellScroll() {
  const [spellLevel, setSpellLevel] = useState(null);
  const [role, setRole] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  // const { data: classesData, loading: classesLoading, error: classesError } = useQuery(GET_CLASSES);

  // if (classesLoading) return <p>Loading...</p>;
  // if (classesError) return <p>Error</p>;

  // const { classes } = classesData;

  const handleScrollGenerator = (e) => {
    /* todo: force a remount? */
    e.preventDefault();
    setIsGenerated(true);
  }

  /* todo: prevent re-rendering when form fields are updated */
  
  return (
    <div>
      <Helmet>
        <title>Random Spell Scroll</title>
      </Helmet>
      <h1>Generate a Random Spell Scroll</h1>

      <form onSubmit={(e) => handleScrollGenerator(e)}>
        <div className="row mb-2">
          {/* <div className="col-6">
            <SelectField
              id="scrollClassSelect"
              label="Select a Class"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                {value: 'any', label: 'Any Class'},
                ...classes,
              ]}
            />
          </div> */}
          <div className="col-6">
            <SelectField
              id="scrollLevelSelect"
              label="Select a Spell Level"
              value={spellLevel}
              onChange={(e) => setSpellLevel(e.target.value)}
              options={[
                {value: 'any', label: 'Any Spell Level'},
                {value: 0, label: 'Cantrip'},
                ...Array.from({length: 9}, (_, i) => ({ value: i + 1, label: `${i + 1}` }))
              ]}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Generate</button>
        <button 
          type="reset"
          className="btn btn-outline-secondary ms-1"
          onClick={() => {
            setRole(null);
            setSpellLevel(null);
            setIsGenerated(false);
          }}
        >
          Clear
        </button>
      </form>

      {isGenerated && <RandomSpell role={role} level={spellLevel} />}
    </div>
  );
}

const RandomSpell = ({ role, level }) => {
  /* todo: class filter is not working */
  const GET_SPELLS = gql`
    query Spells {
      spells (class: {index: ${role}}, level: ${level}) {
        index
        name
        desc
        school {
          name
        }
        level
        classes {
          name
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_SPELLS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const { spells } = data;
  const spell = spells[Math.floor(Math.random() * spells.length)];

  return (
    <div className="mt-3">
      <h3>{spell.name}</h3>
      <div className="d-flex gap-1">
        <span className="badge bg-info text-dark">Level {spell.level}</span>
        {spell.classes.map(role => <span key={role.name} className="badge bg-secondary">{role.name}</span>)}
      </div>
      <div dangerouslySetInnerHTML={{ __html: spell.desc }} />
    </div>
  )
}

/* const GET_CLASSES = gql`
  query Classes {
    classes {
      value: index
      label: name
    }
  }
` */