import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

const MAPPING = { "gearshape.fill": "settings", "calendar": "calendar-month", "chart.bar.fill": "bar-chart", "checkmark.circle.fill": "check-circle", "chevron.right": "chevron-right", "cloud.sun.fill": "partly-cloudy", "heart.fill": "favorite", "house.fill": "home", "location.fill": "my-location", "plus": "add", "trash": "delete" } as const;
type IconSymbolName = keyof typeof MAPPING;
export function IconSymbol({ name, size = 24, color, style }: { name: IconSymbolName; size?: number; color: string | OpaqueColorValue; style?: StyleProp<TextStyle>; weight?: string }) { return <MaterialIcons color={color} size={size} name={MAPPING[name] as ComponentProps<typeof MaterialIcons>["name"]} style={style} />; }
