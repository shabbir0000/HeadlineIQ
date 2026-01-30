import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Screensheader from '../Universal/Screensheader';
import tw from 'twrnc';
import { height, Input, width } from '../Universal/Input';
import { Buttonnormal } from '../Universal/Buttons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';

const Favorite = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  // const [entry, setentry] = useState(false);
  const [entry, setentry] = useState(true);
  const [GetData2, setGetData2] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const coll = collection(db, 'Restaurentstatus');

      AsyncStorage.getItem('role').then(role => {
        AsyncStorage.getItem('Guest').then(guest => {
          if (guest === 'Yes') {
            onSnapshot(coll, snapshot => {
              snapshot.docs.map(doc => {
                const mystatus = doc.data();

                if (mystatus.Status === false) {
                  setentry(false);
                  // Alert.alert(
                  //   'Restaurant Offline',
                  //   'Restaurant is currently offline.',
                  //   [
                  //     {
                  //       text: 'OK',
                  //       onPress: () => {
                  //         // BackHandler.exitApp(); // app close kar deta hai
                  //         setentry(false);
                  //       },
                  //     },
                  //   ],
                  //   { cancelable: false },
                  // );
                }
              });
            });
          } else {
            if (role === 'Admin') {
              return;
            } else {
              onSnapshot(coll, snapshot => {
                snapshot.docs.map(doc => {
                  const mystatus = doc.data();

                  if (mystatus.Status === false) {
                    setentry(false);
                    // Alert.alert(
                    //   'Restaurant Offline',
                    //   'Restaurant is currently offline.',
                    //   [
                    //     {
                    //       text: 'OK',
                    //       onPress: () => {
                    //         // BackHandler.exitApp(); // app close kar deta hai
                    //         setentry(false);
                    //       },
                    //     },
                    //   ],
                    //   { cancelable: false },
                    // );
                  }
                });
              });
            }
          }
        });
      });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     AsyncStorage.getItem('userid').then(id => {
  //       const coll = collection(db, 'sub_favorites');
  //       const q = query(coll, where('vendorid', '==', id));
  //       const unSubscribe = onSnapshot(q, snapshot => {
  //         setGetData2(
  //           snapshot.docs.map(doc => ({
  //             selecteduser: doc.data(),
  //           })),
  //         );
  //       });
  //       return () => {
  //         unSubscribe();
  //       };
  //     });
  //     return () => {};
  //   }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  // );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // let unsubscribeFavorites;

  //     // const fetchFavorites = async () => {
  //     AsyncStorage.getItem('userid').then(id => {
  //       if (!id) return;

  //       const favColl = collection(db, 'sub_favorites');
  //       const q = query(favColl, where('vendorid', '==', id));

  //       // 🔹 Real-time listener (active while screen is focused)
  //       unsubscribeFavorites = onSnapshot(q, async snapshot => {
  //         const favDocs = snapshot.docs;

  //         const filteredFavorites = await Promise.all(
  //           favDocs.map(async fdoc => {
  //             const favData = fdoc.data();
  //             const productRef = doc(db, 'Products', favData.itemId);
  //             const productSnap = await getDoc(productRef);

  //             if (productSnap.exists() && productSnap.data().active === true) {
  //               return { selecteduser: favData };
  //             }
  //             return null;
  //           }),
  //         );

  //         setGetData2(filteredFavorites.filter(item => item !== null));
  //       });
  //       // };
  //       return () => {
  //         if (unsubscribeFavorites) unsubscribeFavorites();
  //       };
  //     });
  //     // fetchFavorites();

  //     // 🔹 Cleanup: stop listening when screen unfocused
  //   }, []),
  // );

  useFocusEffect(
    React.useCallback(() => {
      let unsubscribeFavorites;

      const fetchFavorites = async () => {
        const id = await AsyncStorage.getItem('userid');
        if (!id) return;

        const favColl = collection(db, 'sub_favorites');
        const q = query(favColl, where('vendorid', '==', id));

        unsubscribeFavorites = onSnapshot(q, snapshot => {
          const favDocs = snapshot.docs;

          // 🔹 Temporary array to store active favorites
          const activeFavs = [];

          // Har favorite ke liye ek listener lagao
          favDocs.forEach(fdoc => {
            const favData = fdoc.data();
            const productRef = doc(db, 'Products', favData.itemId);

            // 🔹 Listen to product changes in real-time
            onSnapshot(productRef, productSnap => {
              if (productSnap.exists() && productSnap.data().active === true) {
                // agar product active hai to list me add karo
                if (
                  !activeFavs.find(
                    a => a.selecteduser.itemId === favData.itemId,
                  )
                ) {
                  activeFavs.push({ selecteduser: favData });
                }
              } else {
                // agar inactive ho gaya to remove karo
                const index = activeFavs.findIndex(
                  a => a.selecteduser.itemId === favData.itemId,
                );
                if (index !== -1) activeFavs.splice(index, 1);
              }

              // Update state har change par
              setGetData2([...activeFavs]);
            });
          });
        });
      };

      fetchFavorites();

      return () => {
        if (unsubscribeFavorites) unsubscribeFavorites();
      };
    }, []),
  );

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'FAVOURITES'}
        left={5}
        onPress={() => navigation.goBack()}
      />

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
        {entry ? (
          <>
            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center flex-row  justify-between items-start  `,
              ]}
            >
              <Text style={tw`text-black font-bold text-xl`}>
                Your Favourites
              </Text>
              {/* <Text style={tw`text-black text-lg`}>View All</Text>  */}
            </View>
            <ScrollView>
              <View
                style={[
                  { width: width * 0.95 },
                  tw` mb-10 self-center justify-center h-full mt-5  items-center  `,
                ]}
              >
                {/* <View style={tw`mb-5 w-90 mt-5 justify-center rounded-md`}> */}
                {/* <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              > */}
                {GetData2.length ? (
                  <View
                    style={[
                      { width: width * 0.98 },
                      tw`mb-5 mt-2 h-full  self-center justify-center items-center  rounded-md`,
                    ]}
                  >
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal={false}
                    >
                      {GetData2.map((data, index) => (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('Productdetail', {
                              userid: data.selecteduser.postid,
                              type: 'Fixed',
                              discount: 0,
                            });
                          }}
                        >
                          <View
                            key={index}
                            style={[
                              tw`  h-60  self-center    rounded-md`,
                              { width: width * 0.9 },
                            ]}
                          >
                            <Image
                              style={[
                                { width: width * 0.9 },
                                tw` h-30  rounded-tl-2xl rounded-tr-2xl`,
                              ]}
                              source={{ uri: data.selecteduser.link[0] }}
                            />

                            <View
                              style={[
                                { width: width * 0.9 },
                                tw`border  rounded-b-md  h-25 border-gray-300 `,
                              ]}
                            >
                              <Text
                                numberOfLines={1}
                                style={tw`text-lg ml-2 font-bold`}
                              >
                                {data.selecteduser.name}
                              </Text>
                              <Text
                                numberOfLines={1}
                                style={tw`text-sm ml-2 w-75 font-light`}
                              >
                                {data.selecteduser.dis}
                              </Text>

                              <View
                                style={[
                                  { width: width * 0.5 },
                                  tw` h-12 justify-around  flex-row items-center`,
                                ]}
                              >
                                <TouchableOpacity>
                                  <View
                                    style={[
                                      tw`w-20 h-8  items-center justify-center rounded-full bg-red-500`,
                                    ]}
                                  >
                                    <Text style={tw`text-white font-bold`}>
                                      Buy Now
                                    </Text>
                                  </View>
                                </TouchableOpacity>

                                <Text style={[tw`font-semibold text-lg`]}>
                                  {data.selecteduser.price} PKR
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={tw`mt-40 mb-5 self-center`}>
                    <Text style={tw`text-base font-bold`}>
                      No Fav Products Available Right Now
                    </Text>
                  </View>
                )}

                {/* </View> */}
              </View>
            </ScrollView>
          </>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Text
              style={tw`text-red-500 text-center text-lg font-bold justify-center`}
            >
              Restaurent Is Currently Offline
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Favorite;
