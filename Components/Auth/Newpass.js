import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import Screensheader from '../Universal/Screensheader';
import tw from 'twrnc';
import { height, Input, width } from '../Universal/Input';
import { Buttonnormal } from '../Universal/Buttons';

const Newpass = ({ navigation }) => {
  const [newpass, setnewpass] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const [entry, setentry] = useState(false);

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'NEW PASSWORD'}
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
            <Text style={tw`text-3xl mt-8 font-semibold`}>Reset Password</Text>

            <Text
              style={[
                { width: width * 0.9 },
                tw`text-base mt-2 text-center font-light`,
              ]}
            >
              Your new password must be different from the previously used
              password
            </Text>
          </View>

          {/* <View
            style={[{ width: width * 0.9 }, tw`mt-5 self-center items-start  `]}
          >
            <Text style={tw`text-gray-400`}>Email Address</Text>
            <Input
              value={email}
              onchangetext={setEmail}
              source={require('../../Images/emailcolor.png')}
              placeholder={'Enter Email'}
            />
          </View> */}

          <View
            style={[{ width: width * 0.9 }, tw`mt-5 self-center items-start  `]}
          >
            <Text style={tw`text-gray-400`}>New Password</Text>
            <View
              style={[
                { width: width * 0.9 },
                tw`flex-row text-black justify-between rounded-lg items-center border border-gray-400    mt-3 `,
              ]}
            >
              <TextInput
                placeholder={'Enter New Password'}
                onChangeText={setPassword}
                placeholderTextColor={'black'}
                value={password}
                secureTextEntry={entry}
                style={[
                  tw`h-12 w-70 rounded-xl text-black
                text-start pl-5  `,
                ]}
              ></TextInput>
              <TouchableOpacity
                onPress={() => {
                  setentry(!entry);
                }}
              >
                <Image
                  source={
                    entry
                      ? require('../../Images/lockcolor.png')
                      : require('../../Images/visible.png')
                  }
                  style={tw`h-5 w-5 -left-5  justify-end`}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[{ width: width * 0.9 }, tw`mt-5 self-center items-start  `]}
          >
            <Text style={tw`text-gray-400`}>Conform Password</Text>
            <View
              style={[
                { width: width * 0.9 },
                tw`flex-row text-black justify-between rounded-lg items-center border border-gray-400    mt-3 `,
              ]}
            >
              <TextInput
                placeholder={'Enter Password Again'}
                onChangeText={setnewpass}
                placeholderTextColor={'black'}
                value={newpass}
                secureTextEntry={entry}
                style={[
                  tw`h-12 w-70 rounded-xl text-black
                text-start pl-5  `,
                ]}
              ></TextInput>
              <TouchableOpacity
                onPress={() => {
                  setentry(!entry);
                }}
              >
                <Image
                  source={
                    entry
                      ? require('../../Images/lockcolor.png')
                      : require('../../Images/visible.png')
                  }
                  style={tw`h-5 w-5 -left-5  justify-end`}
                />
              </TouchableOpacity>
            </View>
          </View>

          
          {loading ? (
            <ActivityIndicator size={'large'} color={'#00b9e2'} />
          ) : (
            <View style={tw`justify-between self-center w-80 h-15 mt-5`}>
              <Buttonnormal
                // onPress={handleLogin}
                // onPress={()=> navigation.navigate('Tabbar')}

                c1={'#F16767'}
                c2={'#F16767'}
                style={tw`text-white text-xl`}
                title={'Continue'}
              />
            </View>
          )}
         
        </View>
      </ScrollView>
    </View>
  );
};

export default Newpass;
