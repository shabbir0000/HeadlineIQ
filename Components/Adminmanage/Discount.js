import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
// import {db} from '../../firebase/';
import uuid from 'react-native-uuid';
import {AppContext} from '../../AppContext';
import {useFocusEffect} from '@react-navigation/native';
import { width } from '../Universal/Input';
import { db } from '../../firebase/FIrebase';
// import {width} from '../../';

const Discount = () => {
  const {darkMode} = useContext(AppContext);
  const [GetData, setGetData] = useState([]);
  const [inputadd, setinputadd] = useState();
  const [images, setImages] = useState([null]);
  const [uimages, setuImages] = useState([null]);
  const [inputaddd, setinputaddd] = useState();
  const [inputadddd, setinputadddd] = useState(0);
  const [loading1, setloading1] = useState(false);
  const useridd = uuid.v4();

  useEffect(() => {
    getspecific();
    return () => {
      setImages([null]);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      getspecific();

      return () => {
        setImages([null]);
      };
    }, []),
  );

  const getspecific = async () => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'others');
      // const q1 = query(coll, where('email', '==', email));

      const unSubscribe = onSnapshot(coll, snapshot => {
        setGetData(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
    });
  };

  const Bookingdata1 = async () => {
    AsyncStorage.getItem('Guest').then(guest => {
      AsyncStorage.getItem('email').then(email => {
        if (guest == 'No') {
          const bookdd = async () => {
            if (inputaddd) {
              setloading1(true);
              updateDoc(doc(db, 'others', GetData[0].selecteduser.id), {
                price: parseFloat(inputaddd),
                // id: useridd,
              })
                .then(() => {
                  console.log('done by discount');
                  setloading1(false);
                  setinputaddd(null);
                })
                .catch(error => {
                  setloading1(false);
                  Alert.alert('this :', error.message);
                });
            } else {
              let missingFields = [];
              if (!inputaddd) missingFields.push('Percentage');
              if (missingFields.length > 0) {
                if (missingFields.length === 1) {
                  Alert.alert('Error', `${missingFields[0]} is required`);
                } else {
                  Alert.alert(
                    'Fill Required Fields:',
                    `${missingFields.join('\n')}`,
                  );
                }
                return;
              }
            }
          };
          bookdd();
        } else {
          Alert.alert('Please Logout As Guest', 'And Login As User', [
            {
              text: 'NO',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'GO TO LOGIN',
              onPress: () => {
                AsyncStorage.removeItem('role').then(() => {
                  AsyncStorage.removeItem('mobileid').then(() => {
                    AsyncStorage.removeItem('email').then(() => {
                      AsyncStorage.removeItem('Guest').then(() => {
                        AsyncStorage.removeItem('catl').then(() => {
                          navigation.reset({
                            index: 0,
                            routes: [{name: 'WelcomeScreen'}],
                          });
                        });
                      });
                    });
                  });
                });
              },
            },
          ]);
        }
      });
    });
  };



  return (
    <View style={tw`bg-${darkMode ? 'black' : 'white'} flex-1`}>
      <ScrollView>
       

        <View style={tw`mb-5 mt-5 flex-row  items-center justify-center`}>
          <View
            style={[
              {width: width * 0.96},
              tw` items-center border-${darkMode ? 'white' : 'black'}  bg-${
                darkMode ? 'black' : 'white'
              }  border justify-center rounded-md`,
              // {backgroundColor: '#'},
            ]}>
            <View style={[{width: width * 0.96}, tw`mb-3 `]}>
              <Text style={tw`mt-1 ml-3 w-80 text-black  text-lg`}>
                <Text
                  style={tw` text-${
                    darkMode ? 'white' : 'black'
                  }  font-bold  text-base`}>
                  Current Discount Percentage :
                </Text>
                {'\n'}
                {GetData[0]?.selecteduser?.price}%
              </Text>

              <TextInput
                multiline={true}
                keyboardType='number-pad'
                style={[
                  {width: width * 0.9},
                  tw` h-10 border text-${
                    darkMode ? 'white' : 'black'
                  }  mt-3 border-${
                    darkMode ? 'white' : 'black'
                  } self-center  rounded-md`,
                ]}
                placeholder={'Enter Percentage *'}
                placeholderTextColor={darkMode ? 'white' : 'black'}
                value={inputaddd}
                onChangeText={setinputaddd}
              />

              <TouchableOpacity
                onPress={() => {
                  Bookingdata1();
                }}>
                <View
                  style={[
                    {width: width * 0.9},
                    tw` h-10 mt-3 rounded-md items-center justify-center self-center`,
                    {backgroundColor: '#F16767'},
                  ]}>
                  <Text style={[tw`  text-white text-center  text-base`]}>
                    UPDATE PRECENTAGE
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

       
      </ScrollView>
    </View>
  );
};

export default Discount;

