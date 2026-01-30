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
// import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
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
import { showToast, width } from '../Universal/Input';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from 'firebase/app';
import { keepLocalCopy, pick } from '@react-native-documents/picker';
// import { width } from '../../Screens/Universal/Input';

const Managepromotion = ({ navigation }) => {
  const { darkMode } = useContext(AppContext);
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
    // fetchstatusDatabydate(formattedDate);
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
        const coll = collection(db, 'Companypromotion');
        const q = query(
          coll,
          where('email', '==', email),
          // where('orderstatus', '==', 'pending'),
        );
        const unSubscribe = onSnapshot(q, snapshot => {
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
    <View style={[tw`flex-1 bg-white`]}>
      <EvenOddColumns data={Getdata} uuid={uuid} navigation={navigation} />
    </View>
  );
};

export default Managepromotion;

const EvenOddColumns = ({ data, navigation, uuid }) => {
  const userid = uuid.v4();
  const { darkMode } = useContext(AppContext);
  const [userflag, setuserflag] = React.useState(false);
  const [loading1, setloading1] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [loading, setloading] = React.useState(false);
  const [filedata1, setfiledata1] = useState(null);
  const [Getdata, setGetdata] = useState([]);
  const [mname, setmname] = React.useState('');
  const [fuel, setfuel] = React.useState('');
  const [imglink1, setimglink1] = useState('');
  const [name1, setimgname1] = useState('');
  const [type1, setimgtype1] = useState(null);
  const [images, setImages] = useState([null]);
  const [GetData1, setGetData1] = useState([]);
  const [email, setemail] = React.useState('');
  const [catid, setcatid] = React.useState('');
  const [value2, setValue2] = useState('');
  const [label2, setlabel2] = useState('');
  const [isFocus2, setIsFocus2] = useState(false);

  const [value3, setValue3] = useState('');
  const [label3, setlabel3] = useState('');
  const [isFocus3, setIsFocus3] = useState(false);

  const all = [
    { label: 'Fixed', value: 'Fixed' },
    { label: 'Percent', value: 'Percent' },
  ];

  const toggleModal3 = () => {
    setModalVisible3(!isModalVisible3);
  };

  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      if (role === 'employee') {
        setuserflag(true);
      } else {
        setuserflag(false);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      setemail(email);
      const coll = collection(db, 'subs_users');
      const q = query(coll, where('email', '==', email));

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData1(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });

      return () => {
        unSubscribe();
      };
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('chala');
      let unSubscribe;

      AsyncStorage.getItem('email').then(email => {
        const coll = collection(db, 'Products');
        const q = query(coll, where('email', '==', email));

        unSubscribe = onSnapshot(q, snapshot => {
          const data = snapshot.docs.map(doc => ({
            label: doc.data().name, // product name
            value: doc.id, // product id
          }));
          setGetdata(data);
        });
      });

      return () => {
        if (unSubscribe) unSubscribe(); // unsubscribe Firestore listener
      };
    }, []),
  );

  const updateCat = async () => {
    if (!catid) {
      showToast('error', 'Error', 'Please Fill The All Field', true, 2000);
    } else {
      setloading(true);

      const uploadPromises = images.map(async (image, index) => {
        if (image?.uri) {
          const reference = storage().ref(`products/${image.name}`);
          await reference.putFile(image.path);
          const url = await storage()
            .ref(`products/${image.name}`)
            .getDownloadURL();
          return url;
        } else {
          console.log('ma chala update ma no image', images[index]);

          return images[index];
        }
        // return null;
      });
      console.log('upload ho chuki ha images ya pdf');

      const unfilterurls = await Promise.all(uploadPromises);
      const filterimages = unfilterurls.filter(url => url !== undefined);
      // setloading(false)
      console.log('Uploaded image URLs:', filterimages);

      updateDoc(doc(db, 'Companypromotion', catid), {
        // company: comapny.trim().toLowerCase(),
        email: email ? email : '',
        // timestamp: serverTimestamp(),
        img: filterimages,
        discount_charges: fuel,
        product_l: label3,
        product_v: value3,
        chargetype_l: value2,
        chargetype_v: label2,
        name: GetData1[0] ? GetData1[0]?.selecteduser.name : '',
        city: GetData1[0] ? GetData1[0]?.selecteduser.city : '',
        //  catl: label2,
        // catv:[0] value2,
      })
        .then(() => {
          setlabel2(null);
          setlabel3(null);
          setValue2(null);
          setValue3(null);
          setfuel(null);
          setImages([null]);
          setloading(false);
          toggleModal3();
          console.log('update done');
          // setcompany('');

          // setCurrentDocId(null); // Reset the currentDocId after update
        })
        .catch(error => {
          toggleModal3();
          setloading(false);
          Alert.alert('Error:', error);
        });
    }
  };

  const addcat = async () => {
    if (images[0] === null || !label2 || !label3 || !fuel) {
      console.log('image nahi ha ');

      showToast('error', 'Error', 'Please Fill The All Field', true, 2000);
      return null;
    }
    setloading(true);
    const uploadPromises = images.map(async (image, index) => {
      try {
        if (images[index] !== null && image?.name && image?.path) {
          console.log('Image OK:', image.name, image.path);
          console.log('step 1');
          console.log('name', image.name);
          const reference = storage().ref(`products/${image.name}`);
          console.log('step 2');
          console.log('path', image.path);
          const filePath = `file://${image.path}`;
          await reference.putFile(image.path, {
            cacheControl: 'no-store', // disable caching
          });
          console.log('step 3');
          const url = await reference.getDownloadURL();
          console.log('step 4');
          return url;
        } else {
          setloading(true);
          console.log('Invalid or null image at index:', index);
          return null;
        }
      } catch (error) {
        setloading(true);
        console.log(`Upload failed at index ${index}:`, error.message);
        return null;
      }
    });

    const unfilterurls = await Promise.all(uploadPromises);
    const filterimages = unfilterurls.filter(url => url !== null);
    // setloading(false)
    console.log('Uploaded image URLs:', filterimages);
    setDoc(doc(db, 'Companypromotion', userid), {
      // company: comapny.trim().toLowerCase(),
      email: email,
      userid,
      timestamp: serverTimestamp(),
      img: filterimages,
      discount_charges: fuel,
      product_l: label3,
      product_v: value3,
      chargetype_l: value2,
      chargetype_v: label2,
      name: GetData1[0] ? GetData1[0]?.selecteduser.name : '',
      city: GetData1[0] ? GetData1[0]?.selecteduser.city : '',

      // catl: label2,
      // catv: value2,
    })
      .then(() => {
        setlabel2(null);
        setlabel3(null);
        setValue2(null);
        setValue3(null);
        setfuel(null);
        setImages([null]);
        setloading(false);

        toggleModal3();
        console.log('done');
        //   setcompany('');
      })
      .catch(error => {
        toggleModal3();
        setloading(false);
        // console.log(error);
        Alert.alert('this :', error.message);
      });
    // }
  };

  const deleteproduct = async docId => {
    // setloading(true);
    deleteDoc(doc(db, 'Companypromotion', docId))
      .then(() => {
        // setLoading(false);
        console.log('delete done');
      })
      .catch(error => {
        // setLoading(false);
        Alert.alert('Error:', error.message);
      });
  };

  const renderItem = ({ item }) => (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate('Viewuserbids', {
                uid: item.selecteduser.userid,
              });
            }}> */}
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
              <View style={[{ width: width * 0.95 }, tw`mb-3  `]}>
                <View
                  style={tw`w-75 h-15  self-center flex-row justify-between items-center `}
                >
                  <TouchableOpacity
                    onPress={() => {
                      // navigation.navigate('Addplan', {
                      //   pid: item.selecteduser.id,
                      //   link: item.selecteduser.link,
                      // });
                      toggleModal3(), setmname('UPDATE PROMOTION');
                      // setcompany(item.selecteduser.company.toUpperCase());
                      setcatid(item.selecteduser.userid);
                      setImages(item.selecteduser.img);
                      setlabel2(item.selecteduser.chargetype_l);
                      setValue2(item.selecteduser.chargetype_v);
                      setlabel3(item.selecteduser.product_l);
                      setValue3(item.selecteduser.product_v);
                      setfuel(item.selecteduser.discount_charges);
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
                              deleteproduct(item.selecteduser.userid),
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

                {/* <Text style={tw`mt-1 w-70 text-gray-400  text-base`}>
                    <Text style={tw` text-gray-400 font-bold  text-base`}>
                      ORDER :
                    </Text>
                    {'\n'}
                    {item?.selecteduser.orders}
                  </Text> */}

                <Image
                  style={[
                    { width: width * 0.85 },
                    tw`h-50 self-center rounded-xl`,
                  ]}
                  resizeMode="contain"
                  source={{ uri: item.selecteduser.img[0] }}
                />
                {/* <Text
                  style={tw`mt-1 w-70 text-${
                    darkMode ? 'white' : 'black'
                  }  text-base`}
                >
                  <Text
                    style={tw` text-${
                      darkMode ? 'white' : 'black'
                    } font-bold  text-base`}
                  >
                    NAME :
                  </Text>
                  {'\n'}
                  {item?.selecteduser.name.toUpperCase()}
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
                    Category :
                  </Text>
                  {'\n'}
                  {item?.selecteduser.categoryl.toUpperCase()}
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
                    Product Amount :
                  </Text>
                  {'\n'}
                  {item?.selecteduser.planamount}
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
                    Product Description :
                  </Text>
                  {'\n'}
                  {item?.selecteduser.plandes.toUpperCase()}
                </Text> */}

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
        {/* </TouchableOpacity> */}
      </ScrollView>
    </>
  );

  const choosefileimg = async index => {
    try {
      const [file] = await pick({
        type: ['image/*'], // restrict to images only
      }); // Custom picker, returns [{ uri, name, size, type }]

      if (!file) return;

      if (file.size / 1000 / 1000 >= 5.0) {
        Alert.alert('Alert', 'Select Image Max 5 MB');
        return;
      }

      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: file.uri,
            fileName: file.name ?? 'fallbackName',
          },
        ],
        destination: 'documentDirectory',
      });

      const newImage = {
        uri: localCopy.localUri,
        path: localCopy.localUri.replace('file://', ''),
        name: file.name ?? 'fallbackName',
        type: file.type ?? 'image/jpeg',
      };

      const newlink = localCopy.localUri.replace('file://', '');
      setfiledata1(localCopy.localUri);
      setimglink1(newlink);
      setimgname1(file.name);
      setimgtype1(file.type);
      console.log('images :', localCopy);
      console.log('images for object :', newImage);

      setImages(prevImages => {
        const updatedImages = [...prevImages];
        updatedImages[index] = newImage;
        return updatedImages;
      });
    } catch (error) {
      if (error?.message?.includes('cancel')) {
        console.log('User canceled the picker');
      } else {
        console.log('Error image:', error);
      }
    }
  };

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
          //   navigation.navigate('Addplan', {
          //     pid: '',
          //     planname: '',
          //     planamount: '',
          //     plandess: '',
          //     subcat: '',
          //     subcatv: '',
          //     link: [null],
          //     content: '',
          //   });
          toggleModal3();
          setlabel2(null);
          setlabel3(null);
          setValue2(null);
          setValue3(null);
          setfuel(null);
          setImages([null]);
          setmname('ADD PROMOTION');
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
                // setcompany('');
                // navigation.goBack()
              }}
            >
              <View style={tw`items-end  self-center justify-end w-310px`}>
                <Image
                  style={{ height: 30, width: 30 }}
                  source={require('../../Images/close.png')}
                />
              </View>
            </TouchableOpacity>

            <View style={tw` flex-col items-center self-center  h-70 `}>
              <View style={tw`w-75 self-center flex-row mt-5 justify-around`}>
                {images.map((image, index) => (
                  <View
                    style={tw`flex flex-col w-75 h-25 self-center justify-around`}
                  >
                    <TouchableOpacity
                      key={index}
                      onPress={() => choosefileimg(index)}
                    >
                      {/* <View style={tw`flex w-10 items-center  mt-5 flex-col`}> */}
                      <View
                        style={tw`  h-25 border-2 border-${
                          darkMode ? 'white' : 'black'
                        } rounded-md w-75 justify-center items-center border-dotted`}
                      >
                        {images[index] !== null ? (
                          <Image
                            source={{ uri: image.uri ? image.uri : image }}
                            resizeMode="contain"
                            style={tw`h-25 w-75  self-center rounded-lg`}
                          />
                        ) : (
                          <Text style={tw`font-bold text-lg`}>+</Text>
                        )}
                      </View>
                      {/* </View> */}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Dropdown
                style={tw`h-10 w-75 mt-5 self-center border border-${
                  darkMode ? 'white' : 'black'
                } `}
                placeholderStyle={tw`ml-3 text-black  `}
                selectedTextStyle={tw`ml-3 text-black  `}
                containerStyle={tw`h-60 w-70  mt-7  rounded-md`}
                data={all}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Charges Type'}
                // search
                // searchPlaceholder="Search Category"
                mode="modal"
                value={value2}
                onFocus={() => setIsFocus2(true)}
                onBlur={() => setIsFocus2(false)}
                onChange={item => {
                  setValue2(item.value);
                  setlabel2(item.label);
                  // fetchcities1(item.value)
                  setIsFocus2(false);
                }}
              />

              <TextInput
                value={fuel}
                keyboardType="number-pad"
                onChangeText={value => setfuel(value)}
                placeholderTextColor={darkMode ? 'white' : 'black'}
                style={tw`pl-3 h-10  text-${
                  darkMode ? 'white' : 'black'
                } w-75 mt-5 self-center border-${
                  darkMode ? 'white' : 'black'
                }  border`}
                placeholder="Enter Charges Amount"
              />

              <Dropdown
                style={tw`h-10 w-75 mt-5 self-center border border-${
                  darkMode ? 'white' : 'black'
                } `}
                placeholderStyle={tw`ml-3 text-black  `}
                selectedTextStyle={tw`ml-3 text-black  `}
                containerStyle={tw`h-60 w-70  mt-7  rounded-md`}
                data={Getdata}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Select Product'}
                // search
                // searchPlaceholder="Search Category"
                mode="modal"
                value={value3}
                onFocus={() => setIsFocus3(true)}
                onBlur={() => setIsFocus3(false)}
                onChange={item => {
                  setValue3(item.value);
                  setlabel3(item.label);
                  // fetchcities1(item.value)
                  setIsFocus3(false);
                }}
              />

              {/* <View style={tw`self-center`}>
                <Text
                  style={[
                    tw`text-center font-normal text-lg`,
                    {color: '#000000'},
                  ]}>
                  {mname}
                </Text>
              </View> */}

              {loading ? (
                <ActivityIndicator
                  style={tw`mt-3`}
                  size="large"
                  color="#000000"
                />
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      mname === 'ADD PROMOTION' ? addcat() : updateCat();
                    }}
                  >
                    <View
                      style={[
                        {
                          marginTop: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          height: 40,
                          width: 300,
                          backgroundColor: '#F16767',
                        },
                      ]}
                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>
                        {mname}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        <Toast />
      </Modal>
    </View>
  );
};
