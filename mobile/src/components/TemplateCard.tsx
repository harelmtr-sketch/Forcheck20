import { View, Text, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { exerciseMenuColors as C } from '../theme/exerciseMenuColors';

type TemplateCardProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
};

export function TemplateCard({ title, subtitle, onPress }: TemplateCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: C.cardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: pressed ? C.cardBorderPressed : C.cardBorder,
        padding: 20,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        transform: [{ scale: pressed ? 0.985 : 1 }]
      })}
    >
      <View style={{ flex: 1, paddingRight: 14 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: C.white,
            marginBottom: 6
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            color: C.gray400
          }}
        >
          {subtitle}
        </Text>
      </View>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 1,
          borderColor: 'rgba(59, 130, 246, 0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Plus size={18} color={C.buttonBlue} strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}
