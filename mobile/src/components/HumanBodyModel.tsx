import { View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

type MuscleStatus = {
  name: string;
  status: 'Recovered' | 'Active' | 'Sore';
  color: string;
};

type HumanBodyModelProps = {
  muscleStatus: MuscleStatus[];
};

const getColor = (name: string, statuses: MuscleStatus[]) => {
  const match = statuses.find((muscle) => muscle.name.toLowerCase() === name.toLowerCase());
  return match?.color ?? '#1f2937';
};

export function HumanBodyModel({ muscleStatus }: HumanBodyModelProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={180} height={360} viewBox="0 0 180 360">
        <Circle cx={90} cy={30} r={20} fill={getColor('Head', muscleStatus)} />
        <Rect x={60} y={55} width={60} height={90} rx={20} fill={getColor('Chest', muscleStatus)} />
        <Rect x={50} y={150} width={80} height={60} rx={16} fill={getColor('Core', muscleStatus)} />
        <Rect x={20} y={60} width={25} height={90} rx={12} fill={getColor('Shoulders', muscleStatus)} />
        <Rect x={135} y={60} width={25} height={90} rx={12} fill={getColor('Shoulders', muscleStatus)} />
        <Rect x={30} y={210} width={45} height={120} rx={18} fill={getColor('Legs', muscleStatus)} />
        <Rect x={105} y={210} width={45} height={120} rx={18} fill={getColor('Legs', muscleStatus)} />
      </Svg>
    </View>
  );
}
