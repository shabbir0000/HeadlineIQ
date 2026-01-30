import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {collection, onSnapshot, query, where} from 'firebase/firestore';
// import {db} from '../../Firebase';

const Customorders = ({navigation}) => {
  const [userflag, setuserflag] = useState('');
  const [GetData2, setGetData2] = useState([]);
  const [GetData3, setGetData3] = useState([]);
  const [cat, setcat] = useState('SORT BY CITY');

  // useEffect(() => {
  //   AsyncStorage.getItem('role').then(role => {
  //     setuserflag(role);
  //     if (role === 'user') {
  //       getorders('completed');
  //     }
  //   });
  //   return () => {
  //     setcat('SORT BY CITY');
  //   };
  // }, []);

  // const getorders = async status => {
  //   AsyncStorage.getItem('email').then(email => {
  //     const coll = collection(db, 'Orders');
  //     const q = query(
  //       coll,
  //       where('customeremail', '==', email),
  //       // where('ordertype', '==', "medicine"),
  //       where('ordertype', '==','techworker'),
  //     );

  //     const unSubscribe = onSnapshot(q, snapshot => {
  //       setGetData2(
  //         snapshot.docs.map(doc => ({
  //           selecteduser: doc.data(),
  //         })),
  //       );
  //     });
  //     return () => {
  //       unSubscribe();
  //     };
  //   });
  // };

  // useEffect(() => {
  //   const coll = collection(db, 'category');
  //   const q1 = query(coll, where('company', '!=', 'FOOD'));
  //   const unSubscribe = onSnapshot(q1, snapshot => {
  //     setGetData3(
  //       snapshot.docs.map(doc => ({
  //         label: doc.data().company, // Set company name as label
  //         value: doc.data().userid, // Set user ID as value
  //       })),
  //     );
  //   });

  //   return () => {
  //     unSubscribe();
  //   };
  // }, []);

  return (
    <View
      style={[
        tw`flex-1 items-center`,
        {
          backgroundColor: '#fed806',
        },
      ]}>
      <>
        <View style={[tw`  flex-1`]}>
          <ScrollView
            style={tw`flex-1 mb-5 self-center `}
            showsVerticalScrollIndicator={false}>
            <View style={[tw`  flex-1`]}>
              <ScrollView
                style={tw`flex-1 mb-5 self-center `}
                showsVerticalScrollIndicator={false}>
                {GetData2.map((data, index) => (
                  <TouchableOpacity disabled={true}>
                    <View
                      style={[
                        tw`border flex-col  justify-center items-center w-80 rounded-md self-center mt-5`,
                        {
                          backgroundColor: '#fbe7a1',
                          borderColor: '#d4af00',
                        },
                      ]}>
                      <View
                        style={tw`h-20 w-70 mt-3 flex-row items-center justify-between `}>
                        <View>
                          <Text
                            numberOfLines={1}
                            style={tw`font-bold w-40 text-sm`}>
                            {data.selecteduser.customername.toUpperCase()}
                          </Text>

                          <TouchableOpacity>
                            <Text
                              numberOfLines={1}
                              style={tw`font-normal underline w-40 text-black text-sm`}>
                              {data.selecteduser.customerphone}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <Image
                          style={tw`h-20 w-20 rounded-full`}
                          resizeMode="cover"
                          source={require('../../Images/shopping-bag.png')}
                        />
                      </View>

                      <Text style={tw`mt-1 w-70 text-black  text-sm`}>
                        <Text style={tw` text-black font-bold  text-sm`}>
                          Order Number :
                        </Text>
                        {'\n'}
                        {data?.selecteduser.ordernum}
                      </Text>

                      <Text style={tw`mt-1 w-70 text-black  text-sm`}>
                        <Text style={tw` text-black font-bold  text-sm`}>
                          Order Categry :
                        </Text>
                        {'\n'}
                        {data?.selecteduser.ordertype.toUpperCase()}
                      </Text>

                      <Text style={tw`mt-1 w-70 text-black  text-sm`}>
                        <Text style={tw` text-black font-bold  text-sm`}>
                          Order Date :
                        </Text>
                        {'\n'}
                        {data?.selecteduser.date}
                      </Text>

                      <Text style={tw`mt-1 w-70 text-black  text-sm`}>
                        <Text style={tw` text-black font-bold  text-sm`}>
                          Order Detail :
                        </Text>
                        {'\n'}
                        {data?.selecteduser.orders}
                      </Text>

                      <Text style={tw`mt-1 mb-5 w-70 text-black  text-sm`}>
                        <Text style={tw` text-black font-bold  text-sm`}>
                          Order Status :
                        </Text>
                        {'\n'}
                        {data?.selecteduser.orderstatus.toUpperCase()}
                      </Text>

                     
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </>
    </View>
  );
};

export default Customorders;
