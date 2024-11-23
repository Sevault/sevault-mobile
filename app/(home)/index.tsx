import { Redirect } from 'expo-router';
import Stack from 'expo-router';
export default function Page() {
  return <Redirect href={"/(drawer)/(tabs)/home"} />
}