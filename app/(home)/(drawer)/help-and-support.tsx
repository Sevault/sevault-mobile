import { actuatedNormalize, actuatedNormalizeVertical } from '@/components/Dimension';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

const HelpAndSupport = () => {

  return (
    <ScrollView style={styles.container}>
      {/* Subsection 1 */}
      <Text style={styles.subHeader}>1. Getting Started</Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Creating a Wallet:</Text> To begin using Sevault, download the app and select “Create New Wallet.” You’ll be prompted to generate a unique seed phrase. Keep this phrase safe—it’s the only way to recover your wallet if needed.
      </Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Importing an Existing Wallet:</Text> If you already have a wallet, select “Import Wallet,” then enter your existing seed phrase or private key to restore your funds.
      </Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Understanding Your Dashboard:</Text> After logging in, your dashboard will display your current balances, transaction history, and options for sending and receiving cryptocurrency.
      </Text>

      {/* Subsection 2 */}
      <Text style={styles.subHeader}>2. Managing Your Wallet</Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Backup & Recovery:</Text> In case you need to restore your wallet, Sevault uses a secure backup system based on your seed phrase. Go to Settings &gt; Wallet to view or re-save your seed phrase.
      </Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Sending Cryptocurrency:</Text> To send funds, click the “Send” button, enter the recipient’s address, the amount, and confirm the transaction. Always double-check addresses for accuracy.
      </Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Receiving Cryptocurrency:</Text> Use the “Receive” button to generate a QR code or a wallet address. Share this code or address with the sender to receive funds.
      </Text>

      {/* Subsection 3 */}
      <Text style={styles.subHeader}>3. Security Features</Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Password Security:</Text> Password protects your wallet all the time. Keep the password safe and secure all the time.
      </Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Transaction Confirmation:</Text> Sevault ensures secure transactions with multi-step confirmation processes and push notifications to confirm outgoing payments.
      </Text>

      {/* Subsection 4 */}
      <Text style={styles.subHeader}>4. Supported Cryptocurrencies</Text>
      <Text style={styles.bodyText}>
        Sevault supports the following cryptocurrencies:
        <Text style={styles.listItem}>• Bitgesell (BGL)</Text>
        <Text style={styles.listItem}>• Ethereum (ETH)</Text>
        <Text style={styles.listItem}>• USDT (Ethereum)</Text>
        <Text style={styles.listItem}>• USDT (BNB)</Text>
        <Text style={styles.listItem}>• USDT</Text>
      </Text>

      {/* Subsection 5 */}
      <Text style={styles.subHeader}>5. Troubleshooting</Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Transaction Pending:</Text> If your transaction is stuck, it may be due to network congestion or low gas fees. Check your transaction status on the blockchain or consider increasing the gas fee for quicker confirmation.
      </Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Recovering Lost Funds:</Text> If you have lost access to your wallet, you can recover it using your seed phrase. If you didn’t back it up, unfortunately, recovery is not possible due to the non-custodial nature of Sevault.
      </Text>

      {/* Subsection 6 */}
      <Text style={styles.subHeader}>6. Contact Support</Text>
      <Text style={styles.bodyText}>
        For further assistance, feel free to reach out to our support team via support@bitgesell.dev
      </Text>

      {/* Subsection 7 */}
      <Text style={styles.subHeader}>7. FAQ</Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>How do I update my app?</Text> You can update Sevault through the App Store or Google Play Store when a new version is available.
      </Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>What happens if I lose my device?</Text> As long as you have your seed phrase/private keys for respective networks, you can restore your wallet on any new device by reinstalling Sevault and selecting “Import Wallet.”
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: actuatedNormalize(20),
    paddingRight: actuatedNormalize(20),
    backgroundColor: '#f9f9f9',
    paddingBottom: actuatedNormalizeVertical(150)
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
    fontSize: actuatedNormalize(16),
    lineHeight: actuatedNormalize(22),
    marginVertical: actuatedNormalize(8),
  },
  boldText: {
    fontWeight: 'bold',
  },
  listItem: {
    marginVertical: actuatedNormalize(16),
    marginLeft: actuatedNormalize(16),
  },
});

export default HelpAndSupport;
