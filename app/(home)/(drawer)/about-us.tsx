import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

const AboutUs = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Main Header */}
      {/* <Text style={styles.header}>About Sevault</Text> */}

      {/* Section 1 */}
      <Text style={styles.subHeader}>Who We Are</Text>
      <Text style={styles.bodyText}>
        Sevault is a secure, easy-to-use cryptocurrency wallet designed to help you manage your digital assets safely. Our mission is to provide users with a non-custodial solution that ensures they have complete control over their cryptocurrencies without compromising on convenience or security.
      </Text>

      {/* Section 2 */}
      <Text style={styles.subHeader}>Our Vision</Text>
      <Text style={styles.bodyText}>
        At Sevault, we believe in a decentralized future where everyone has the power to control their financial freedom. We aim to simplify cryptocurrency management for everyone, from beginners to experienced users, with a focus on usability, reliability, and security.
      </Text>

      {/* Section 3 */}
      <Text style={styles.subHeader}>What We Do</Text>
      <Text style={styles.bodyText}>
        Sevault allows users to send, receive, and manage various cryptocurrencies with ease. We currently support the following assets:
      </Text>
      <Text style={styles.listItem}>• Bitgesell (BGL)</Text>
      <Text style={styles.listItem}>• Ethereum (ETH)</Text>
      <Text style={styles.listItem}>• USDT (Ethereum)</Text>
      <Text style={styles.listItem}>• USDT (BNB)</Text>
      <Text style={styles.listItem}>• USDT</Text>

      <Text style={styles.bodyText}>
        As a non-custodial wallet, Sevault ensures that only you have access to your private keys and seed phrases, giving you complete control over your assets.
      </Text>

      {/* Section 4 */}
      <Text style={styles.subHeader}>Our Commitment to Security</Text>
      <Text style={styles.bodyText}>
        We prioritize your security by implementing features such as PIN-based access and multi-step transaction confirmations. Although Sevault does not currently support biometric security, we maintain strict encryption standards to protect your data.
      </Text>

      {/* Section 5 */}
      <Text style={styles.subHeader}>Why Choose Sevault?</Text>
      <Text style={styles.bodyText}>
        We believe that managing your cryptocurrency should be simple, secure, and stress-free. Sevault is built with you in mind—whether you're looking to store Bitcoin alternatives like Bitgesell or simply need an all-in-one wallet for your Ethereum and USDT assets. Our clean, intuitive interface and secure architecture make it easy to manage your portfolio anytime, anywhere.
      </Text>

      {/* Section 6 */}
      <Text style={styles.subHeader}>Get Involved</Text>
      <Text style={styles.bodyText}>
        Interested in learning more or contributing to the Sevault community? Reach out to us at sevault@bitgesell.dev or follow us on social media for updates and announcements. Together, we can make cryptocurrency more accessible for everyone.
      </Text>

      {/* Section 7 */}
      <Text style={styles.subHeader}>Contact Us</Text>
      <Text style={styles.bodyText}>
        If you have any questions or need assistance, our team is always here to help. Contact us through the app's support section or via email at sevault@bitgesell.dev.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 12,
    color: '#333',
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 22,
    marginVertical: 8,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 16,
    marginVertical: 4,
  },
});

export default AboutUs;
