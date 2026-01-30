import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import { Buttonnormal } from '../Universal/Buttons';

const Findrider = ({ navigation, route }) => {
  const { id } = route.params;
  const [GetData2, setGetData2] = useState([]);
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);

  useEffect(() => {
    getorders();
  }, []);

  const getorders = async () => {
    console.log('id :', id);

    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(
        coll,
        where('id', '==', id),
        // where('ordertype', '==', category),
        // where('orderstatus', '==', status),
      );

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData2(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
      return () => {
        unSubscribe();
      };
    });
  };

  const updateCat = async catid => {
    setloading(true);
    updateDoc(doc(db, 'Orders', catid), {
      ridercall: 'online',
    })
      .then(() => {
        setloading(false);
      })
      .catch(error => {
        setloading(false);
        Alert.alert('Error:', error.message);
      });
  };

  const Dispatch = async catid => {
    setloading1(true);
    updateDoc(doc(db, 'Orders', catid), {
      orderstatus: 'dispatch',
    })
      .then(() => {
        setloading1(false);
        navigation.goBack();
      })
      .catch(error => {
        setloading1(false);
        Alert.alert('Error:', error.message);
      });
  };

  return (
    <View
      style={[
        tw`flex-1 items-center justify-center `,
        { backgroundColor: '#ffffff' },
      ]}
    >
      {GetData2.map(
        (item, index) =>
          // <View style={tw`border h-10 w-30`} key={index}>

          item.selecteduser.ridercall === 'conform' ? (
            <>
              <View
                style={[
                  tw`border flex-col justify-center items-center w-80 h-40 rounded-md self-center mt-5`,
                  { borderColor: '#241977' },
                ]}
              >
                <View
                  style={tw`h-30 w-70 flex-row items-center justify-between `}
                >
                  <View>
                    <Text style={tw`font-light w-40 text-base`}>
                      The Rider{'\n'}
                      <Text
                        numberOfLines={1}
                        style={tw`font-bold w-40 text-base`}
                      >
                        {/* {data.selecteduser.doctorname} */}
                        {item.selecteduser.ridername.toUpperCase()}
                      </Text>{' '}
                      Has Been Accepted The Order For Delivery
                    </Text>
                    <TouchableOpacity>
                      <Text
                        numberOfLines={1}
                        style={tw`font-normal underline w-40 text-gray-400 text-sm`}
                      >
                        {/* {data.selecteduser.doctortypelabel} */}
                        Contact: {item.selecteduser.ridernum}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Image
                    style={tw`h-20 w-20 `}
                    resizeMode="contain"
                    // source={{ uri: data.selecteduser.profile }}
                    source={require('../../Images/rider.png')}
                  />
                </View>
              </View>
              <>
                {item.selecteduser.orderstatus == 'dispatch' ||
                item.selecteduser.orderstatus == 'completed' ? (
                  <></>
                ) : (
                  <>
                    <Text style={tw`mt-5 text-red-300`}>
                      Click Dispatch When Rider Will Come And Pick Order
                    </Text>
                    {loading1 ? (
                      <>
                        <ActivityIndicator
                          style={{
                            // flex: 1,
                            marginTop: 10,
                            justifyContent: 'center',
                            alignSelf: 'center',
                          }}
                          size={'large'}
                        />
                      </>
                    ) : (
                      <View
                        style={tw`justify-between self-center w-80 h-15 mt-5`}
                      >
                        <Buttonnormal
                          // onPress={handleLogin}
                          onPress={() => Dispatch(item.selecteduser.id)}
                          c1={'#F16767'}
                          c2={'#F16767'}
                          style={tw`text-white text-xl`}
                          title={'Dispath Order'}
                        />
                      </View>
                    )}
                  </>
                )}
              </>
            </>
          ) : (
            <>
              {item.selecteduser.ridercall === 'online' ? (
                <>
                  <View style={tw`h-30 w-80 items-center justify-center `}>
                    <Text style={tw`text-red-500 text-center font-bold`}>
                      The Order Has Been Send To The Riders When Anyone Accept
                      The Order The Rider Detail Has Been Appeared In This
                      Screen
                    </Text>
                  </View>

                  <View
                    style={tw`h-30 w-30 items-center justify-center rounded-full bg-green-500`}
                  >
                    <Text style={tw`text-white font-bold`}>Searching....</Text>
                  </View>
                </>
              ) : (
                <>
                  {loading ? (
                    <>
                      <ActivityIndicator
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}
                        size={'large'}
                      />
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        updateCat(item.selecteduser.id);
                      }}
                    >
                      <View
                        style={tw`h-35 w-35 items-center justify-center rounded-full bg-green-500`}
                      >
                        <Text
                          style={tw`text-white text-center text-lg font-bold`}
                        >
                          {' '}
                          Click To {'\n'} Find Rider
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          ),

        // </View>
      )}
    </View>
  );
};

export default Findrider;
