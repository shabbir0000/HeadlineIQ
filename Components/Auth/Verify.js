import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import Screensheader from '../Universal/Screensheader';
import tw from 'twrnc';
import { height, Input, width } from '../Universal/Input';
import { Buttonnormal } from '../Universal/Buttons';
import { OtpInput } from 'react-native-otp-entry';

const Verify = ({ navigation }) => {
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  // const [entry, setentry] = useState(false);

  const [otp, setOtp] = useState('');

  const handleChange = code => {
    setOtp(code);

    if (code.length === 4) {
      // Auto submit or verify
      Alert.alert('OTP Entered', code);
    }
  };

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'VERIFY'}
        left={5}
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View
          style={[
            {
              width: width,
              height: height * 0.85,
              borderTopLeftRadius: 60,
              borderTopRightRadius: 60,
            },
            tw`mt-5 self-center  bg-white `,
          ]}
        >
          <View
            style={[
              { width: width * 0.98 },
              tw`items-center justify-center h-35`,
            ]}
          >
            <Text style={tw`text-3xl mt-8 font-semibold`}>
              Email Verification
            </Text>

            <Text
              style={[
                { width: width * 0.9 },
                tw`text-base mt-2 text-center font-light`,
              ]}
            >
              Enter the verification code we send you on mudas******@gmail.com
            </Text>
          </View>

          <View
            style={[{ width: width * 0.9 }, tw`mt-5 self-center items-start  `]}
          >
            <Text style={tw`text-gray-400`}>Email Address</Text>
            {/* <Input
              value={email}
              onchangetext={setEmail}
              source={require('../../Images/emailcolor.png')}
              placeholder={'Enter Email'}
            /> */}

            <OtpInput
              numberOfDigits={4}
              //   onChange={() => handleChange()}
              onTextChange={text => console.log(text)}
              onFilled={text => setOtp(text)}
              value={otp}
              autoFocus
              keyboardType="number-pad"
              theme={{
                containerStyle: tw`mt-5`,
                pinCodeContainerStyle: tw`w-12 h-15 rounded-md`,
              }}
              //   otpCellStyle={styles.otpBox}
              //   autoSubmit={false}
            />
          </View>

          {loading ? (
            <ActivityIndicator size={'large'} color={'#00b9e2'} />
          ) : (
            <View style={tw`justify-between self-center w-80 h-15 mt-5`}>
              <Buttonnormal
                // onPress={handleLogin}
                onPress={() => navigation.navigate('Newpass')}
                // onPress={()=>{
                //     console.log("my otp :",otp)
                // }}
                c1={'#F16767'}
                c2={'#F16767'}
                style={tw`text-white text-xl`}
                title={'Continue'}
              />
            </View>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <View style={tw`mt-5 self-center`}>
              <Text style={tw`text-black`}>
                {'Did Not Recive Code?'}
                <Text style={{ color: '#FBAE17' }}> {'Resend'}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Verify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  otpBox: {
    borderColor: '#F16767',
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 20,
    color: '#000',
  },
  info: {
    fontSize: 16,
    marginTop: 10,
  },
});
