import { actuatedNormalize } from '@/components/Dimension';
import DrawerBackIcon from '@/components/DrawerBackIcon';
import { router, useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyPolicy = () => {

  const navigation = useNavigation()

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: `Privacy Policy`,
      headerTitleAlign: 'center',
      backBehavior: 'history',
      // goBack hack: goBack doesn't work: so we push previous route+initial params
      headerLeft: () => (
        <View style={{ marginLeft: actuatedNormalize(19) }}>
          <DrawerBackIcon onpress={() => router.push('settings')} />
        </View>)
    });
  })

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Effective Date: 10th November, 2024</Text>
      <Text style={styles.text}>
        Your privacy is important to us. This policy outlines how we handle your data and ensure your information stays secure.
      </Text>

      <Text style={styles.sectionTitle}>1. Data We Do Not Collect</Text>
      <Text style={styles.text}>
        We do not store or have access to your seed phrases, private keys, or passwords. All sensitive information is stored directly on your device.
      </Text>

      <Text style={styles.sectionTitle}>2. Personal Data</Text>
      <Text style={styles.text}>
        We do not collect personal information such as your name, email address, or contact details.
      </Text>

      <Text style={styles.sectionTitle}>3. Usage Data</Text>
      <Text style={styles.text}>
        Limited, anonymized usage data may be collected to improve functionality. This does not include any identifiable information.
      </Text>

      <Text style={styles.sectionTitle}>4. Third-Party Services</Text>
      <Text style={styles.text}>
        Our app may interact with third-party services like blockchain explorers. Review their privacy policies for more details.
      </Text>

      <Text style={styles.sectionTitle}>5. Security</Text>
      <Text style={styles.text}>
        We prioritize security, but it’s your responsibility to keep your device secure and backup any recovery phrases.
      </Text>

      <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
      <Text style={styles.text}>
        We may update this policy periodically. Continued use signifies acceptance of any updates.
      </Text>

      <Text style={styles.reminder}>Remember: Keep your recovery phrase secure and never share it with anyone. You are in full control of your wallet.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  reminder: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    color: '#d9534f',
    textAlign: 'center',
  },
});

export default PrivacyPolicy;
