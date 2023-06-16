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

  return (<>
    <h3>{monster.name}</h3>
    {/* todo: monster alignment */}
    <p>{capitalize(monster.size)} {capitalize(monster.type)}</p>

    <dl>
      {/* todo: AC is an array... what are some cases where it has more than one? */}
      <dt>Armor Class</dt>
      <dd>{monster.armor_class[0].value}</dd>

      <dt>Hit Points</dt>
      <dd>{monster.hit_points} ({monster.hit_dice})</dd>

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
    {/* todo: senses */}
    {/* todo: langauges and the rest */}

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