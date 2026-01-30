import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import Screensheader from '../Universal/Screensheader';
import tw from 'twrnc';
import { height, Input, showToast, width } from '../Universal/Input';
import { Buttonnormal } from '../Universal/Buttons';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../../firebase/FIrebase';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Forget = ({ navigation }) => {
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  // const [entry, setentry] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setEmail('');
      };
    }, []),
  );

  const auth = getAuth(app);

  const RESETemail = async () => {
    email
      ? sendPasswordResetEmail(auth, email.toLowerCase().trim())
          .then(() => {
            // Alert.alert("RESET EMAIL SEND IN YOUR SPAM SECTION IN EMAIL BOX"),

            Alert.alert(
              'Success',
              'Rsest Email Send To YOur Inbox/Spam Box\n' +
                'Please Login Again With New Password',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ],
            );
          })
          .catch(error => {
            Alert.alert('some error', error.message);
          })
      : showToast('error', 'Error', 'Please Fill The Email', true, 3000);
  };

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'FORGET'}
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
              Forget Password?
            </Text>

            <Text
              style={[
                { width: width * 0.9 },
                tw`text-base mt-2 text-center font-light`,
              ]}
            >
              Enter your email address and we’ll send you confirmation code to
              reset your password
            </Text>
          </View>

          <View
            style={[{ width: width * 0.9 }, tw`mt-5 self-center items-start  `]}
          >
            <Text style={tw`text-gray-400`}>Email Address</Text>
            <Input
              value={email}
              onchangetext={setEmail}
              source={require('../../Images/emailcolor.png')}
              placeholder={'Enter Email'}
            />
          </View>

          {loading ? (
            <ActivityIndicator size={'large'} color={'#00b9e2'} />
          ) : (
            <View style={tw`justify-between self-center w-80 h-15 mt-5`}>
              <Buttonnormal
                // onPress={handleLogin}
                onPress={() => RESETemail()}
                c1={'#F16767'}
                c2={'#F16767'}
                style={tw`text-white text-xl`}
                title={'Continue'}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <Toast/>
    </View>
  );
};

export default Forget;
