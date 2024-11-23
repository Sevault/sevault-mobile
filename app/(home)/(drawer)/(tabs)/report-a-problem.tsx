import { actuatedNormalize } from '@/components/Dimension';
import DrawerBackIcon from '@/components/DrawerBackIcon';
import { router, useNavigation } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const ReportIssue = () => {
  const navigation = useNavigation()
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: `Report A Problem`,
      headerTitleAlign: 'center',
      backBehavior: 'history',
      // goBack hack: goBack doesn't work: so we push previous route+initial params
      headerLeft: () => (
        <View style={{ marginLeft: actuatedNormalize(19) }}>
          <DrawerBackIcon onpress={() => router.push({ pathname: 'settings' })} />
        </View>)
    });
  })

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={styles.text}>
        If you encounter any issues while using the app, please reach out to our support team at:
      </Text>

      <Text style={styles.email}>it@bitgesell.dev</Text>

      <Text style={styles.text}>
        Please include a description of the issue, steps to reproduce it, and any relevant screenshots or details.
      </Text>

      <Text style={styles.cautionTitle}>Important Notice</Text>
      <Text style={styles.cautionText}>
        We cannot assist with issues involving loss of funds due to private key exposure or compromised seed phrases.
        Always keep your private keys and seed phrases secure, and do not share them with anyone.
      </Text>
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
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e90ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  cautionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d9534f',
    marginTop: 20,
    marginBottom: 5,
  },
  cautionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
});

export default ReportIssue;
