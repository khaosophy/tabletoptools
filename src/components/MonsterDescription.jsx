import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import GET_MONSTER from '../api/getMonster';
import { capitalize } from '../utils/text-utils';

export default function MonsterDescription() {
  const { monster: index } = useParams();
  const { loading, data } = useQuery(GET_MONSTER, { variables: { index }});

  if(loading) return (<h3>On the hunt for the monster...</h3>);

  if(!data) return false;
  const { monster } = data;
  console.log(monster);

  const renderSenses = () => {
    const senses = Object.keys(monster.senses)
      .map(key => ({ type: key, value: monster.senses[key] }))
      .filter(sense => sense.value !== null && sense.type !== 'passive_perception' && sense.type !== '__typename');
    return [
      ...senses.map((sense, i) => `${capitalize(sense.type)} ${sense.value}, `),
      `Passive Perception ${monster.senses.passive_perception}`,
    ]
  }

  return (<>
    <h3>{monster.name}</h3>
    {/* todo: monster alignment */}
    <p>{capitalize(monster.size)} {capitalize(monster.type)}</p>

    <dl>
      {/* todo: AC is an array... what are some cases where it has more than one? */}
      <dt>Armor Class</dt>
      <dd>{monster.armor_class[0].value}</dd>

      <dt>Hit Points</dt>
      <dd>{monster.hit_points} ({monster.hit_points_roll})</dd>

      <dt>Speed</dt>
      <dd>
        {monster.speed.walk}
        {Object.keys(monster.speed)
          .map(key => ({ type: key, value: monster.speed[key] }))
          .filter(speed => speed.value !== null && speed.type !== 'walk' && speed.type !== '__typename')
          .map((speed, i) => {
            if(i === 0) return `, ${speed.type} ${speed.value}`
            return `${speed.type} ${speed.value}`
          })}
        </dd>
    </dl>

    <dl className="d-flex gap-3">
      {/**
       * todo: modifiers
       * these aren't in the API. I'll have to calculate them myself.
       */}
      <div className="text-center">
        <dt>Str</dt>
        <dd>{monster.strength}</dd>
      </div>

      <div className="text-center">
        <dt>Dex</dt>
        <dd>{monster.dexterity}</dd>
      </div>

      <div className="text-center">
        <dt>Con</dt>
        <dd>{monster.constitution}</dd>
      </div>

      <div className="text-center">
        <dt>Int</dt>
        <dd>{monster.intelligence}</dd>
      </div>

      <div className="text-center">
        <dt>Wis</dt>
        <dd>{monster.wisdom}</dd>
      </div>

      <div className="text-center">
        <dt>Cha</dt>
        <dd>{monster.charisma}</dd>
      </div>
    </dl>

    {/* todo: skills / saving throws*/}
    {/* todo: vulnerabilities & resistances */}

    
    <dl>
      <dt>Senses</dt>
      <dd>{renderSenses()}</dd>

      {monster.languages && (<>
        <dt>Languages</dt>
        <dd>{monster.languages}</dd>
      </>)}

      <div className="d-flex gap-5">
        <div>
          <dt>Challenge Rating</dt>
          <dd>{monster.challenge_rating} ({monster.xp} XP)</dd>
        </div>
        {/* todo: proficency bonus? see DndBeyond. it may not be in the API though, and it's not present on Roll20*/}
      </div>
    </dl>

    {/* Special Abilities */}
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

    <h4>Actions</h4>
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
  </>);
}