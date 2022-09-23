import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@apollo/client';
import TextField from './TextField';
import GET_SPELLS from '../api/getSpells';
import GET_SCHOOLS from '../api/getSchools';
import GET_CLASSES from '../api/getClasses';
import SpellBrief from './SpellBrief';
import SelectField from './SelectField';

export default function SpellList () {
  const [searchQuery, setSearchQuery] = useState('');
  const [spellSchool, setSpellSchool] = useState('');
  const [spellClass, setSpellClass] = useState('');
  const [spellLevel, setSpellLevel] = useState('');
  const [spellConcentration, setSpellConcentration] = useState('');
  const { loading: schoolLoading, data: schoolData } = useQuery(GET_SCHOOLS);
  const { loading: classLoading, data: classData } = useQuery(GET_CLASSES);
  const { loading: spellLoading, data: spellData, refetch } = useQuery(GET_SPELLS);

  useEffect(() => {
    /* todo: update results when changing school or class list? */
    // updateResults();
  }, [spellSchool, spellClass]);

  if(spellLoading || schoolLoading || classLoading) return (
    <h3>Peering through the weave...</h3>
  );
  // todo: error handling
  if(!spellData || !schoolData || !classData) return false;
  const { spells } = spellData;
  const { magicSchools: schools } = schoolData;
  const { classes } = classData;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateResults();
  }

  const handleReset = (e) => {
    e.preventDefault();

    setSpellClass('');
    setSpellSchool('');
    setSpellLevel('');
    setSpellConcentration('');
    setSearchQuery('');

    updateResults(); // todo: this refetches with the old data... I think cause the above is all promises, so this fires using old data?
  }

  const updateResults = () => {
    /* todo: clean up */

    debugger;
    let concentration;
    if (spellConcentration === 'true') concentration = true;
    if (spellConcentration === 'false') concentration = false;

    const spellVars = {
      name: searchQuery,
      school: spellSchool ? spellSchool : null,
      class: spellClass ? spellClass : null,
      level: spellLevel ? parseInt(spellLevel) : null,
    }

    if(concentration !== null) {
      spellVars.concentration = concentration;
    }

    refetch(spellVars);
  }

  const handleChange = (value, type) => {
    /* todo: cleanup */
    if (type === 'school') {
      return setSpellSchool(value);
    }
    if (type === 'class') {
      return setSpellClass(value);
    }
    if (type === 'level') {
      return setSpellLevel(value);
    }
    if (type === 'concentration') {
      return setSpellConcentration(value);
    }
    return console.error('change request not understood');
  }

  return (<>
    <div className="mt-3 mb-4">
      <Helmet>
        <title>Spell List</title>
      </Helmet>
      <h1>Play With Magic</h1>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="mb-2 col-3">
            <SelectField
              id="spellSearchSchool"
              label="Spell School"
              value={spellSchool}
              onChange={(e) => handleChange(e.target.value, 'school')}
              options={[
                { value: '', label: 'Any Spell School' },
                ...schools.map(school => ({ value: school.index, label: school.name }))
              ]}
            />
          </div>
          <div className="mb-2 col-3">
            <SelectField
              id="spellSearchClass"
              label="Class"
              value={spellClass}
              onChange={(e) => handleChange(e.target.value, 'class')}
              options={[
                {value: '', label: 'Any Class'},
                ...classes,
              ]}
            />
          </div>
          <div className="mb-2 col-3">
            <SelectField
              id="spellSearchLevel"
              label="Spell Level"
              value={spellLevel}
              onChange={(e) => handleChange(e.target.value, 'level')}
              options={[
                {value: '', label: 'Any Spell Level'},
                ...Array.from(Array(10)).map((_, i) => {
                  const label = (i === 0) ? 'Cantrip': `${i}`;
                  return {value: i, label}
                })
              ]}
            />
          </div>
          <div className="mb-2 col-3">
            <SelectField
              id="spellConcentration"
              label="Concentration?"
              value={spellConcentration}
              onChange={(e) => handleChange(e.target.value, 'concentration')}
              options={[
                {value: '', label: 'Either'},
                {value: 'true', label: 'Yes'},
                {value: 'false', label: 'No'},
              ]}
            />
          </div>
        </div>
        <TextField
          id="spellSearchQuery"
          className="mb-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          label="Look up a spell"
          autoFocus
        />
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={(e) => handleReset(e)}>Reset</button>
      </form>

      {/* todo: paginate */}
      {(spells.length > 0) ? (
        <ul className="list-unstyled mt-3">
          {spells.map((spell) => (
            <li key={spell.index}>
                <SpellBrief
                  className="mt-3"
                  id={spell.index}
                  name={spell.name}
                  level={spell.level}
                  lists={spell.classes}
                  school={spell.school.name}
                  concentration={spell.concentration}
                />
            </li>
          ))}
        </ul>
      ) : <h3 className="mt-3">No spells found.</h3>}
    </div>
  </>
  )
}