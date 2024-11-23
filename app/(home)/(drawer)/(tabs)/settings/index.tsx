import { COLORS } from '@/app/COLORS'
import AboutUsSN from '@/components/AboutUsSN'
import BugIconSN from '@/components/BugIconSN'
import { actuatedNormalize, actuatedNormalizeVertical } from '@/components/Dimension'
import HelpAndSupportSN from '@/components/HelpAndSupportSN'
import IconRightSM from '@/components/IconRightSM'
import LogoutSN from '@/components/LogoutSN'
import PrivacyLogo from '@/components/PrivacyIconSN'
import SecurityLogo from '@/components/SecurityLogoSM'
import VersionIcon from '@/components/VersionIcon'
import WalletLogoSN from '@/components/WalletLogoSN'
import {
  Poppins_200ExtraLight,
  Poppins_500Medium,
  useFonts
} from "@expo-google-fonts/poppins"
import { router, Stack } from 'expo-router'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

const SEMVER_VERSON = `1.0.0`
const VERSION_TAG = `Beta`

const Settings = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_200ExtraLight
  })

  return (
    <ScrollView
      style={styles.settingsContainer}
      contentContainerStyle={styles.contentContainerStyle}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Wallet Settings Nav item */}
      <Pressable
        onPress={() => {
          router.push({ pathname: '/(drawer)/(tabs)/wallet-settings' })
        }}
        style={styles.navItemContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <View style={{ width: actuatedNormalize(40), height: actuatedNormalizeVertical(40), backgroundColor: COLORS.WHITE, justifyContent: 'center', borderRadius: actuatedNormalize(20), alignItems: 'center' }}>
              <WalletLogoSN />
            </View>
            <Text style={{ paddingLeft: actuatedNormalize(14) }}>Wallet</Text>
          </View>
        </View>
        <View>
          <IconRightSM />
        </View>
      </Pressable>
      {/* End Wallet Nav Settings item */}

      {/* Security Nav Item */}
      <Pressable
        onPress={() => {
          router.push({ pathname: '/(drawer)/(tabs)/security' })
        }}
        style={styles.navItemContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <View style={{ width: actuatedNormalize(40), height: actuatedNormalizeVertical(40), backgroundColor: COLORS.WHITE, justifyContent: 'center', borderRadius: actuatedNormalize(20), alignItems: 'center' }}>
              <SecurityLogo />
            </View>
            <Text style={{ paddingLeft: actuatedNormalize(14) }}>
              Security
            </Text>
          </View>
        </View>
        <View>
          <IconRightSM />
        </View>
      </Pressable>

      {/*End Security Nav Item */}

      {/* Report A Problem Nav Item */}
      <Pressable
        onPress={() => {
          router.push({ pathname: '/(drawer)/(tabs)/report-a-problem' })
        }}
        style={styles.navItemContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <View style={{ width: actuatedNormalize(40), height: actuatedNormalizeVertical(40), backgroundColor: COLORS.WHITE, justifyContent: 'center', borderRadius: actuatedNormalize(20), alignItems: 'center' }}>
              <BugIconSN />
            </View>
            <Text style={{ paddingLeft: actuatedNormalize(14) }}>
              Report An Issue
            </Text>
          </View>
        </View>
        <View>
          <IconRightSM />
        </View>
      </Pressable>
      {/*End Report A problem Nav Item */}

      {/* Help & Support Nav Item */}
      <Pressable
        onPress={() => {
          router.push({ pathname: '/(drawer)/(tabs)/help-and-support' })
        }}

        style={styles.navItemContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <View style={{ width: actuatedNormalize(40), height: actuatedNormalizeVertical(40), backgroundColor: COLORS.WHITE, justifyContent: 'center', borderRadius: actuatedNormalize(20), alignItems: 'center' }}>
              <HelpAndSupportSN />
            </View>
            <Text style={{ paddingLeft: actuatedNormalize(14) }}>
              Help & Support
            </Text>
          </View>
        </View>
        <View>
          <IconRightSM />
        </View>
      </Pressable>
      {/*End Help & Support Nav Item */}

      {/* Help & Support Nav Item */}
      <Pressable
        onPress={() => {
          router.push({ pathname: '/(drawer)/(tabs)/about-us' })
        }}
        style={styles.navItemContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <View style={{ width: actuatedNormalize(40), height: actuatedNormalizeVertical(40), backgroundColor: COLORS.WHITE, justifyContent: 'center', borderRadius: actuatedNormalize(20), alignItems: 'center' }}>
              <AboutUsSN />
            </View>
            <Text style={{ paddingLeft: actuatedNormalize(14) }}>
              About Us
            </Text>
          </View>
        </View>
        <View>
          <IconRightSM />
        </View>
      </Pressable>
      {/*About Us Nav Item */}

      {/* Privacy Policy Nav Item */}
      <Pressable
        onPress={() => {
          router.push({ pathname: '/(drawer)/(tabs)/privacy-policy' })
        }}
        style={styles.navItemContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <View style={{ width: actuatedNormalize(40), height: actuatedNormalizeVertical(40), backgroundColor: COLORS.WHITE, justifyContent: 'center', borderRadius: actuatedNormalize(20), alignItems: 'center' }}>
              <PrivacyLogo />
            </View>
            <Text style={{ paddingLeft: actuatedNormalize(14) }}>
              Privacy Policy
            </Text>
          </View>
        </View>
        <View>
          <IconRightSM />
        </View>
      </Pressable>
      {/*Privacy Policy Nav Item */}

      {/* Software Version Info Nav Item */}
      <View style={styles.navItemContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <View style={{ width: actuatedNormalize(40), height: actuatedNormalizeVertical(40), backgroundColor: COLORS.WHITE, justifyContent: 'center', borderRadius: actuatedNormalize(20), alignItems: 'center' }}>
              <VersionIcon />
            </View>
            <Text style={{ paddingLeft: actuatedNormalize(14) }}>
              Software Version {SEMVER_VERSON}-{VERSION_TAG}
            </Text>
          </View>
        </View>
        <View>

        </View>
      </View>
      {/*Software Version Info& Support Nav Item */}

      {/* Log out Button */}
      <View style={{ width: '100%', paddingEnd: actuatedNormalize(20), paddingStart: actuatedNormalize(20), paddingTop: actuatedNormalize(20) }}>
        <Pressable
          onPress={() => { router.replace('/open-wallet/') }}
          style={{
            backgroundColor: COLORS.ACCENT,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
            borderRadius: actuatedNormalize(13),
            height: actuatedNormalizeVertical(60)
          }}>
          <LogoutSN />
          <Text
            style={[styles.footerButtonText, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default Settings

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: actuatedNormalize(20),
  },
  navItemContainer: {
    width: '100%',
    backgroundColor: COLORS.WHITEOO1,
    paddingStart: actuatedNormalize(20),
    paddingEnd: actuatedNormalize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: actuatedNormalizeVertical(70),
    borderRadius: actuatedNormalize(10),
    marginBottom: actuatedNormalizeVertical(25)
  },
  footerButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    paddingStart: 10
  },
  contentContainerStyle: {
    paddingBottom: actuatedNormalizeVertical(100)
  },
})