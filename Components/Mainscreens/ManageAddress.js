import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ImageBackground,
  TextInput,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
// import Screensheader from '../../Screens/Universal/Screensheader';
import tw from 'twrnc';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import { FAB } from '@rneui/themed';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../../AppContext';
import { height, width } from '../Universal/Input';
import Screensheader from '../Universal/Screensheader';
// import { width } from '../../Screens/Universal/Input';

const ManageAddress = ({ navigation, route }) => {
  const { flag } = route.params;
  const { darkMode, setdadddress, setdphone } = useContext(AppContext);
  const [Getdata, setGetdata] = React.useState([]);
  const [value1, setValue1] = useState(null);
  const [label1, setlabel1] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);
  const [showPicker, setShowPicker] = useState(false); // To show/hide the date picker
  const [datename, setdatename] = useState(''); // To store the selected date
  const [selectedDate, setSelectedDate] = useState(new Date()); // To store the selected date
  // const user = getAuth(app)

  const [Getdata2, setGetdata2] = React.useState([
    { label: 'accept', value: '1' },
    { label: 'reject', value: '2' },
    { label: 'pending', value: '3' },
    { label: 'returned', value: '4' },
  ]);

  const onChange = (event, date) => {
    setShowPicker(false); // Hide the picker when a date is selected
    if (date) setSelectedDate(date); // Update the state with the selected date
    // Format the date to 'YYYY-MM-DD' using local time
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${month}:${day}:${year}`;
    console.log('formatted date', formattedDate);
    setdatename(formattedDate);
    fetchstatusDatabydate(formattedDate);
  };

  // const user = getAuth(app)

  fetchstatusDatabydate = async status => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Sub_Orders');
      const q = query(
        coll,
        where('customeremail', '==', email),
        where('date', '==', status),
      );
      const unSubscribe = onSnapshot(q, snapshot => {
        setGetdata(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
    });
  };

  fetchstatusData = async status => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Sub_Orders');
      const q = query(
        coll,
        where('customeremail', '==', email),
        where('orderstatus', '==', status),
      );
      const unSubscribe = onSnapshot(q, snapshot => {
        setGetdata(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
    });
  };

  useFocusEffect(
    useCallback(() => {
      console.log('chala');
      let unSubscribe;
      AsyncStorage.getItem('email').then(email => {
        const coll = collection(db, 'address');
        const q = query(
          coll,
          where('role', '==', 'Rider'),
          // where('orderstatus', '==', 'pending'),
        );
        const unSubscribe = onSnapshot(coll, snapshot => {
          setGetdata(
            snapshot.docs.map(doc => ({
              selecteduser: doc.data(),
            })),
          );
        });
      });

      return () => {
        setlabel1(null);
        setValue1(null);
        setdatename('');
      };
    }, []),
  );

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'MANAGE ADDRESS'}
        left={5}
        onPress={() => navigation.goBack()}
      />
      <View
        style={[
          {
            width: width,
            height: height * 0.85,
            // borderTopLeftRadius: 60,
            // borderTopRightRadius: 60,
          },
          tw`mt-5 self-center  bg-white `,
        ]}
      >
        <EvenOddColumns
          flag={flag}
          data={Getdata}
          uuid={uuid}
          navigation={navigation}
        />
      </View>
    </View>
  );
};

export default ManageAddress;

const EvenOddColumns = ({ flag, data, navigation, uuid }) => {
  const {
    darkMode,
    setdadddress,
    setdphone,
    setdfuel,
    orderarea,
    setorderarea,
  } = useContext(AppContext);
  const [userflag, setuserflag] = React.useState(false);
  const [loading1, setloading1] = useState(false);
  const [visible, setVisible] = useState(true);

  const [value5, setValue5] = useState(null);
  const [label5, setlabel5] = useState(null);
  const [isFocus5, setIsFocus5] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [loading, setloading] = React.useState(false);

  const [bookingid, setbookingid] = useState('');
  const [useruid, setuseruid] = useState('');
  const [vendorprofile, setvendorprofile] = useState('');
  const [vendorname, setvendorname] = useState('');
  const [vendorcat, setvendorcat] = useState('');
  const [Getdata, setGetdata] = useState([]);
  const [ratingcomment, setratingcomment] = useState('');

  const [rating, setRating] = useState(0);

  const ratingCompleted = ratingValue => {
    setRating(ratingValue);
    console.log('User ne rating di:', ratingValue);
  };

  const toggleModal3 = () => {
    setModalVisible3(!isModalVisible3);
  };

  const ratingg = [
    { label: 'pending', value: 1 },
    { label: 'active', value: 2 },
  ];

  const comment = [
    { label: 'Poor', value: 1 },
    { label: 'Normal', value: 2 },
    { label: 'Active', value: 3 },
    { label: 'Average', value: 4 },
    { label: 'Good', value: 5 },
    { label: 'Very Good', value: 6 },
    { label: 'Excellent', value: 7 },
  ];

  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      if (role === 'employee') {
        setuserflag(true);
        a;
      } else {
        setuserflag(false);
      }
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        const coll = collection(db, 'users');
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
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  const Addrating = async (bookingid, useruid) => {
    // const walletamount = await AsyncStorage.getItem('walletamount');
    if (!bookingid || !useruid || !ratingcomment || !rating || !value5) {
      Alert.alert('Error:', 'Please Fill All Fields');
    } else {
      try {
        setloading(true);
        const userid = uuid.v4();
        const now = new Date();
        // Extract Date
        const date = `${now.getFullYear()}-${(now.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

        const ratings = {
          rating: rating,
          date: date,
          commentslabel: label5,
          commentsvalue: value5,
          useruid: useruid,
          ratingcomment: ratingcomment,
          userimg: Getdata[0].selecteduser.image,
          userrole: Getdata[0].selecteduser.role,
          username: Getdata[0].selecteduser.name,

          bookingid: bookingid,
          createdAt: new Date().toISOString(),
          userid,
        };

        updateDoc(doc(db, 'Booking', bookingid), {
          rating: true,
        })
          .then(() => {
            const docRef1 = doc(db, 'ratings', userid); // Create a document with the bidId
            setDoc(docRef1, ratings)
              .then(() => {
                setloading(false);
                toggleModal3();
              })
              .catch(error => {
                setloading(false);
                toggleModal3();
                Alert.alert('Error:', error.message);
              });
          })
          .catch(error => {
            setloading(false);
            toggleModal3();
            Alert.alert('Error:', error.message);
          });
      } catch (error) {
        setloading(false);
        toggleModal3();
        console.error(error);
      }
    }
  };

  const deleteproduct = async docId => {
    // setloading(true);
    deleteDoc(doc(db, 'Materials', docId))
      .then(() => {
        // setLoading(false);
        console.log('delete done');
      })
      .catch(error => {
        // setLoading(false);
        Alert.alert('Error:', error.message);
      });
  };

  const deleteUserProfile = async userid => {
    try {
      // setloading(true);

      const userRef = doc(db, 'subs_users', userid); // `userid` ya document ID
      await deleteDoc(userRef);

      // setloading(false);
      Alert.alert('Success', 'User profile deleted successfully', [
        { text: 'OK', onPress: () => console.log('deleted') },
      ]);
    } catch (error) {
      // setloading(false);
      Alert.alert('Error', error.message);
      console.log('Delete Error:', error);
    }
  };

  const renderItem = ({ item }) => (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          disabled={flag ? true : false}
          onPress={() => {
            setdfuel(parseInt(item?.selecteduser.fuel_area));
            setdphone(item?.selecteduser.phoneNumber);
            setdadddress(item?.selecteduser.fulladdress);
            setorderarea(item?.selecteduser.area_l);
            navigation.goBack();
          }}
        >
          <View
            style={[
              { width: width * 0.96 },
              tw` flex-row justify-center items-center self-center mt-5 `,
            ]}
          >
            <View style={tw`mb-5 flex-row  items-center justify-center`}>
              <View
                style={[
                  tw` w-85 items-center justify-center  bg-${
                    darkMode ? 'black' : 'gray-50'
                  } border border-${
                    darkMode ? 'white' : 'gray-200'
                  } bg-white shadow-lg  rounded-2xl`,
                  // {backgroundColor: '#f4ece3'},
                ]}
              >
                <View style={tw`mb-3 w-75 `}>
                  {flag ? (
                    <View
                      style={tw`w-75 h-15   flex-row justify-between items-center `}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('AddAddress', {
                            pid: item.selecteduser.uid,
                            rfname: item.selecteduser.addresstitle,
                            rlname: item.selecteduser.fulladdress,
                            phonee: item.selecteduser.phoneNumber,
                            area_l: item.selecteduser.area_l,
                            area_v: item.selecteduser.area_v,
                            fuel_area: item.selecteduser.fuel_area,
                          });
                        }}
                      >
                        <Image
                          source={require('../../Images/edit.png')}
                          style={tw`w-6  h-6`}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Alert',
                            'Are you sure you want to delete this ?',
                            [
                              {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'NO',
                              },
                              {
                                text: 'YES',
                                onPress: () =>
                                  deleteUserProfile(item.selecteduser.uid),
                              },
                            ],
                          );
                        }}
                      >
                        <Image
                          source={require('../../Images/delete.png')}
                          style={tw`w-6 h-6`}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <></>
                  )}

                  {/* <Text style={tw`mt-1 w-70 text-gray-400  text-base`}>
                    <Text style={tw` text-gray-400 font-bold  text-base`}>
                      ORDER :
                    </Text>
                    {'\n'}
                    {item?.selecteduser.orders}
                  </Text> */}

                  <Text
                    style={tw`mt-1 w-70 text-${
                      darkMode ? 'white' : 'black'
                    }  text-base`}
                  >
                    <Text
                      style={tw` text-${
                        darkMode ? 'white' : 'black'
                      } font-bold  text-base`}
                    >
                      ADDRESS ID :
                    </Text>
                    {'\n'}
                    {item?.selecteduser.usernum}
                  </Text>

                  <Text
                    style={tw`mt-1 w-70 text-${
                      darkMode ? 'white' : 'black'
                    }  text-base`}
                  >
                    <Text
                      style={tw` text-${
                        darkMode ? 'white' : 'black'
                      } font-bold  text-base`}
                    >
                      ADDRESS TITLE :
                    </Text>
                    {'\n'}
                    {item?.selecteduser.addresstitle.toUpperCase()}
                  </Text>

                  <Text
                    style={tw`mt-1 w-70 text-${
                      darkMode ? 'white' : 'black'
                    }  text-base`}
                  >
                    <Text
                      style={tw` text-${
                        darkMode ? 'white' : 'black'
                      } font-bold  text-base`}
                    >
                      FULL ADDRESS :
                    </Text>
                    {'\n'}
                    {item?.selecteduser.fulladdress}
                  </Text>

                  <Text
                    style={tw`mt-1 w-70 text-${
                      darkMode ? 'white' : 'black'
                    }  text-base`}
                  >
                    <Text
                      style={tw` text-${
                        darkMode ? 'white' : 'black'
                      } font-bold  text-base`}
                    >
                      PHONE :
                    </Text>
                    {'\n'}
                    {item?.selecteduser.phoneNumber}
                  </Text>

                  <Text
                    style={tw`mt-1 w-70 text-${
                      darkMode ? 'white' : 'black'
                    }  text-base`}
                  >
                    <Text
                      style={tw` text-${
                        darkMode ? 'white' : 'black'
                      } font-bold  text-base`}
                    >
                      AREA :
                    </Text>
                    {'\n'}
                    {item?.selecteduser.area_l}
                  </Text>

                  {/* <TouchableOpacity
                  onPress={() => {
                    if (item.selecteduser.materialtypel === 'Text Material') {
                      navigation.navigate('TextViewer', {
                        img: item?.selecteduser.link[0],
                        name: item.selecteduser.categoryl,
                        uniqueid: item?.selecteduser.vendorid,
                        linktype: item.selecteduser.linktype,
                        postid: item?.selecteduser.id,
                        novelname: item?.selecteduser.name,
                        viewcount: item?.selecteduser.viewcount,
                        content: item.selecteduser.content,
                        categoryl: item.selecteduser.categoryl,
                        materialtypel: item.selecteduser.materialtypel,
                      });
                    } else {
                      navigation.navigate('Subscriptionslip', {
                        img: item?.selecteduser.link[0],
                        name: item.selecteduser.categoryl,
                        uniqueid: item?.selecteduser.vendorid,
                        linktype: item.selecteduser.linktype,
                        postid: item?.selecteduser.id,
                        novelname: item?.selecteduser.name,
                        viewcount: item?.selecteduser.viewcount,
                        content: '',
                        categoryl: item.selecteduser.categoryl,
                        materialtypel: item.selecteduser.materialtypel,
                      });
                    }
                  }}>
                  <View
                    style={[
                      tw`w-75 h-12 mt-3 rounded-md items-center justify-center self-center`,
                      {backgroundColor: '#00b9e2'},
                    ]}>
                    <Text style={[tw`  text-white text-center  text-base`]}>
                      {`View ${item?.selecteduser.subcatl} ${item?.selecteduser.categoryl}`}
                    </Text>
                  </View>
                </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderItem}
      />

      <FAB
        visible={visible}
        onPress={() => {
          navigation.navigate('AddAddress', {
            pid: '',
            rfname: '',
            rlname: '',
            phonee: '',
            area_l: '',
            area_v: '',
            fuel_area: '',
          });
        }}
        placement="right"
        title="Add"
        icon={{ name: 'add', color: 'white' }}
        color="#F16767"
      />

      <Modal
        style={tw`w-80 self-center `}
        onDismiss={toggleModal3}
        animationIn={'bounceInUp'}
        isVisible={isModalVisible3}
      >
        <View style={{ borderRadius: 50, backgroundColor: '#ffffff' }}>
          <View style={[{ height: 400, backgroundColor: '#ffffff' }]}>
            <TouchableOpacity
              onPress={() => {
                toggleModal3();
                setlabel5(null);
                setValue5(null);
              }}
            >
              <View style={tw`items-end self-center justify-end w-310px`}>
                <Image
                  style={{ height: 30, width: 30 }}
                  source={require('../../Images/close.png')}
                />
              </View>
            </TouchableOpacity>

            <View style={tw` flex-col   h-85 justify-around`}>
              <View style={tw`self-center`}>
                <View
                  style={tw` w-60 h-15 mt-2 justify-start items-center flex-row`}
                >
                  <Image
                    style={tw`h-12 w-12 rounded-full`}
                    source={{ uri: vendorprofile }}
                  />
                  <View>
                    <Text
                      numberOfLines={2}
                      style={tw`font-bold text-gray-400  ml-5  text-2xl  `}
                    >
                      {vendorname.toUpperCase()}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={tw`font-bold text-gray-400  ml-5  text-xs  `}
                    >
                      {vendorcat}
                    </Text>
                  </View>
                </View>

                <Rating
                  type="star"
                  ratingCount={5}
                  startingValue={0}
                  imageSize={40}
                  showRating
                  onFinishRating={ratingCompleted}
                />

                <Dropdown
                  style={tw`h-10 w-60 mt-5  bg-white border `}
                  placeholderStyle={tw`ml-3 text-gray-400  `}
                  selectedTextStyle={tw`ml-3 text-gray-400  `}
                  containerStyle={tw`h-55 w-80  mt-7 bg-gray-100 rounded-md`}
                  data={comment}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={'Select The Comment'}
                  mode="modal"
                  value={value5}
                  onFocus={() => setIsFocus5(true)}
                  onBlur={() => setIsFocus5(false)}
                  onChange={item => {
                    // getsubadmin('catl', item.label);

                    setValue5(item.value);
                    setlabel5(item.label);
                    console.log('ddd', item.value);

                    // fetchcities1(item.value)
                    setIsFocus5(false);
                  }}
                />
              </View>

              <TextInput
                multiline={true}
                style={tw`w-60 h-12 self-center border mt-5 `}
                placeholder={'Add Comments'}
                value={ratingcomment}
                onChangeText={setratingcomment}
              />

              {loading ? (
                <ActivityIndicator
                  style={tw`mt-5`}
                  size="large"
                  color="#00BF62"
                />
              ) : (
                <View style={tw` mt-5 `}>
                  <TouchableOpacity
                    onPress={() => {
                      Addrating(bookingid, useruid);
                      // getdatabyprovince('provincel', label4, 'catl', label5);
                    }}
                  >
                    <View
                      style={[
                        {
                          marginTop: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          height: 40,
                          width: 200,
                          backgroundColor: '#00b9e2',
                        },
                      ]}
                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>
                        {'ADD RATING'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <Toast />
        </View>
      </Modal>
    </View>
  );
};
