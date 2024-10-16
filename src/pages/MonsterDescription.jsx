import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import GET_MONSTER from '../api/getMonster';
import { capitalize } from '../utils/text-utils';
import { formatInteger, formatChallengeRating } from '../utils/number-utils';

export default function MonsterDescription() {
  const { monster: index } = useParams();
  const { loading, data } = useQuery(GET_MONSTER, { variables: { index }});

  if(loading) return (<h3>On the hunt for the monster...</h3>);

  if(!data) return false;
  const { monster } = data;

  const modifierFromAbilityScore = (abilityScore) => {
    const mod = Math.floor((abilityScore - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod;
  }

  const renderSenses = () => {
    const senses = Object.keys(monster.senses)
      .map(key => ({ type: key, value: monster.senses[key] }))
      .filter(sense => sense.value !== null && sense.type !== 'passive_perception' && sense.type !== '__typename');
    return [
      ...senses.map((sense, i) => `${capitalize(sense.type)} ${sense.value}, `),
      `Passive Perception ${monster.senses.passive_perception}`,
    ]
  }

  const renderSkillsAndSaves = () => {
    let skills = [];
    let savingThrows = [];

    const manipulateLabel = (string) => {
      return string.split(': ')[1];
    }

    monster.proficiencies.forEach(({ proficiency, value }) => {
      if(proficiency.type === 'SAVING_THROWS') {
        savingThrows.push({ name: manipulateLabel(proficiency.name), value });
      }
      if(proficiency.type === 'SKILLS') {
        skills.push({ name: manipulateLabel(proficiency.name), value });
      }
    })

    return (<>
      {savingThrows.length > 0 && (<>
        <dt>Saving Throws</dt>
        <dd>{savingThrows.map((save, i) => (
          i < savingThrows.length - 1
            ? `${save.name} +${save.value}, `
            : `${save.name} +${save.value}`
        ))}</dd>
      </>)}

      {skills.length > 0 && (<>
        <dt>Skills</dt>
        <dd>{skills.map((skill, i) => (
          i < skills.length - 1
            ? `${skill.name} +${skill.value}, `
            : `${skill.name} +${skill.value}`
        ))}</dd>
      </>)}
    </>)
  }

  const renderSpeed = () => {
    const nonWalkSpeeds = Object.keys(monster.speed)
      .map(key => ({ type: key, value: monster.speed[key] }))
      .filter(speed => speed.value !== null && speed.type !== 'walk' && speed.type !== '__typename');

    return (<>
      <dt>Speed</dt>
      <dd>
        {monster.speed.walk}
        {(nonWalkSpeeds.length > 0 && monster.speed.walk) && ', '} {/* if there is a walk speed and nonwalk speeds, display comma */}
        {nonWalkSpeeds.map((speed, i) => (
          (i < nonWalkSpeeds.length - 1)
            ? `${speed.type} ${speed.value}, `
            : `${speed.type} ${speed.value}`
        ))}
      </dd>
    </>)
  }

  const renderArmorClassValue = () => {
    const { type, value } = monster.armor_class[0];
    if (type === 'dex') return value;
    if (type === 'armor') return `${value} (${monster.armor_class[0].armor[0].name})`;
    return `${value} (${capitalize(`${type} armor`)})`;
  }

  return (<>
    <h3 className="mb-0">{monster.name}</h3>
    <p>{capitalize(monster.size)} {capitalize(monster.type)}, {monster.alignment}</p>

    <hr className="stat-separator" />

    <dl>
      <dt>Armor Class</dt>
      <dd>{renderArmorClassValue()}</dd>

      <dt>Hit Points</dt>
      <dd>{monster.hit_points} ({monster.hit_points_roll})</dd>

      {renderSpeed()}
    </dl>

    <hr className="stat-separator" />

    <dl className="d-flex gap-3">
      <div className="text-center">
        <dt>Str</dt>
        <dd>{monster.strength} ({modifierFromAbilityScore(monster.strength)})</dd>
      </div>

      <div className="text-center">
        <dt>Dex</dt>
        <dd>{monster.dexterity} ({modifierFromAbilityScore(monster.dexterity)})</dd>
      </div>

      <div className="text-center">
        <dt>Con</dt>
        <dd>{monster.constitution} ({modifierFromAbilityScore(monster.constitution)})</dd>
      </div>

      <div className="text-center">
        <dt>Int</dt>
        <dd>{monster.intelligence} ({modifierFromAbilityScore(monster.intelligence)})</dd>
      </div>

      <div className="text-center">
        <dt>Wis</dt>
        <dd>{monster.wisdom} ({modifierFromAbilityScore(monster.wisdom)})</dd>
      </div>

      <div className="text-center">
        <dt>Cha</dt>
        <dd>{monster.charisma} ({modifierFromAbilityScore(monster.charisma)})</dd>
      </div>
    </dl>

    <hr className="stat-separator" />
    
    <dl>
      {renderSkillsAndSaves()}

      {monster.damage_vulnerabilities.length > 0 && (<>
        <dt>Damage Vulnerabilities</dt>
        <dd>{monster.damage_vulnerabilities.map(vulnerability => capitalize(vulnerability))}</dd>
      </>)}

      {monster.damage_resistances.length > 0 && (<>
        <dt>Damage Resistances</dt>
        <dd>{capitalize(monster.damage_resistances.join(', '))}</dd>
      </>)}
      
      {monster.damage_immunities.length > 0 && (<>
        <dt>Damage Immunities</dt>
        <dd>{capitalize(monster.damage_immunities.join(', '))}</dd>
      </>)}

      {monster.condition_immunities.length > 0 && (<>
        <dt>Condition Immunities</dt>
        <dd>
          {monster.condition_immunities.map((immunity, i) => (
            (i === 0) 
              ? `${immunity.name}, `
              : (i < monster.condition_immunities.length - 1)
                ? `${immunity.name.toLowerCase()}, `
                : `${immunity.name.toLowerCase()}`
          ))}
        </dd>
      </>)}

      <dt>Senses</dt>
      <dd>{renderSenses()}</dd>

      {monster.languages && (<>
        <dt>Languages</dt>
        <dd>{monster.languages}</dd>
      </>)}

      <div className="d-flex gap-5">
        <div>
          <dt>Challenge Rating</dt>
          <dd>{formatChallengeRating(monster.challenge_rating)} ({formatInteger(monster.xp)} XP)</dd>
        </div>
        {/* todo: proficency bonus? see DndBeyond. it may not be in the API though, and it's not present on Roll20*/}
      </div>
    </dl>

    <hr className="stat-separator" />

    {/* Special Abilities */}
    {monster.special_abilities && (<>
      <ul className="list-unstyled">
        {monster.special_abilities.map(ability => (
          <li key={ability.name}>
            <p>
              <strong>{ability.name}. </strong>
              {ability.desc}
            </p>
          </li>
        ))}
      </ul>
    </>)}

    <h4 style={{ borderBottom: '1px solid #a52a2a' }}>Actions</h4>
    <ul className="list-unstyled">
      {monster.actions.map(action => (
        <li key={action.name}>
          <p>
            <strong>{action.name}. </strong>
            {action.desc}
          </p>
        </li>
      ))}
    </ul>

    {monster.legendary_actions && (<>
      <h4 style={{ borderBottom: '1px solid #a52a2a' }}>Legendary Actions</h4>
      <ul className="list-unstyled">
        {monster.legendary_actions.map(action => (
          <li key={action.name}>
            <p>
              <strong>{action.name}. </strong>
              {action.desc}
            </p>
          </li>
        ))}
      </ul>
    </>)}
  </>);
}