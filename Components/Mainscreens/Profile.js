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
import Options from '../Universal/Options';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../../firebase/FIrebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const Profile = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const [entry, setentry] = useState(false);
  const [token, settoken] = useState('');
  const [role, setrole] = useState('');
  const [name, setname] = useState('');
  const [Getdata, setGetdata] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        AsyncStorage.getItem('Guest').then(guest => {
          AsyncStorage.getItem('name').then(name => {
            setname(name);
            AsyncStorage.getItem('role').then(role => {
              setrole(role);
              settoken(guest);
              console.log('guest : ', guest);

              const coll = collection(db, 'subs_users');
              const q = query(coll, where('email', '==', email));
              const unSubscribe = onSnapshot(q, snapshot => {
                setGetdata(
                  snapshot.docs.map(doc => ({
                    selecteduser: doc.data(),
                  })),
                );
              });
              return () => {
                unSubscribe();
              };
            });
          });
        });
      });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'PROFILE'}
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
          <View style={tw`mt-10`}>
            {token === 'No' && (
              <>
                <Options
                  logo={require('../../Images/userc.png')}
                  text={'My Profile'}
                  top={1}
                  top1={5}
                  flag={true}
                  left={44}
                  onPress={() => {
                    navigation.navigate('Updateprofile', {
                      url:
                        Getdata[0]?.selecteduser.image[0] !== null
                          ? Getdata[0]?.selecteduser.image[0]
                          : 'https://firebasestorage.googleapis.com/v0/b/rice-42276.appspot.com/o/allsubscriptionfiles%2F1000414785.jpg?alt=media&token=e9a31ded-8bfb-46af-86c9-4d6846eae223',
                      pid: Getdata[0]?.selecteduser.uid,
                      rfname: Getdata[0]?.selecteduser.fname,
                      rlname: Getdata[0]?.selecteduser.lname,
                      phonee: Getdata[0]?.selecteduser.phoneNumber,
                      addresss: Getdata[0]?.selecteduser.address,
                      emaill: Getdata[0]?.selecteduser.email,
                    });
                  }}
                />
                {Getdata[0]?.selecteduser.role === 'User' && (
                  <Options
                    logo={require('../../Images/map.png')}
                    text={'Manage Delivery Address'}
                    top={7}
                    top1={5}
                    flag={true}
                    left={51}
                    onPress={() =>
                      navigation.navigate('ManageAddress', {
                        flag: true,
                      })
                    }
                  />
                )}
              </>
            )}

            <Options
              logo={require('../../Images/policy.png')}
              text={'Privacy Policy'}
              top={7}
              top1={5}
              flag={true}
              left={51}
              // onPress={() => navigation.navigate('Aboutus')}
            />

            <Options
              logo={require('../../Images/terms.png')}
              text={'Term & Condition'}
              top={7}
              top1={5}
              flag={true}
              left={51}
              // onPress={() => navigation.navigate('Aboutus')}
            />

            <Options
              logo={require('../../Images/door.png')}
              // text={token === 'No' ? t('logout') : t('loginu')}
              text={token === 'No' ? 'Logout' : 'Login As User'}
              top={7}
              top1={5}
              flag={true}
              left={65}
              onPress={() => {
                token === 'No'
                  ? AsyncStorage.removeItem('role').then(() => {
                      // AsyncStorage.removeItem('mobileid').then(() => {
                        AsyncStorage.removeItem('email').then(() => {
                          AsyncStorage.setItem('Guest','Yes').then(() => {
                            AsyncStorage.removeItem('userid').then(() => {
                              AsyncStorage.removeItem('name').then(() => {
                                navigation.reset({
                                  index: 0,
                                  routes: [{ name: 'Tabbar' }],
                                });
                              });
                            });
                          });
                        });
                      // });
                    })
                  : AsyncStorage.removeItem('role').then(() => {
                      // AsyncStorage.removeItem('mobileid').then(() => {
                        AsyncStorage.removeItem('email').then(() => {
                          AsyncStorage.setItem('Guest','Yes').then(() => {
                            // AsyncStorage.removeItem('catl').then(() => {
                            navigation.reset({
                              index: 0,
                              routes: [{ name: 'Onboard' }],
                            });
                            // });
                          });
                        });
                      // });
                    });
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
