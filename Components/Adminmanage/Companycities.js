import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
// import Screensheader from '../../Screens/Universal/Screensheader';
import tw from 'twrnc';
import Modal from 'react-native-modal';
import { FAB } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { app, auth, db } from '../../firebase/FIrebase';
import { getAuth } from 'firebase/auth';
import uuid from 'react-native-uuid';
import { showToast } from '../../Components/Universal/Input';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keepLocalCopy, pick } from '@react-native-documents/picker';
import storage from '@react-native-firebase/storage';
import { AppContext } from '../../AppContext';

const Companycities = ({ navigation }) => {
  const { darkMode } = useContext(AppContext);
  const [categories, setCategories] = useState([
    'daal',
    'chawal',
    'gheee',
    'ata',
    'chini',
    'namak',
    'mix item',
    'biscuit',
  ]);

  const [Getdata, setGetdata] = React.useState([]);
  const user = getAuth(app);

  useEffect(() => {
    console.log('chala');
    AsyncStorage.getItem('email').then(email => {
      console.log('chala email :', email);
      const user = auth.currentUser;
      const coll = collection(db, 'Sub_Maincat');
      // const q = query(coll, where('email', '==', email));

      const unSubscribe = onSnapshot(coll, snapshot => {
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
  }, []);

  return (
    <View style={[tw`flex-1 bg-white`]}>
      <EvenOddColumns data={Getdata} navigation={navigation} />
    </View>
  );
};

export default Companycities;

const EvenOddColumns = ({ data, navigation }) => {
  const { darkMode } = useContext(AppContext);
  const userid = uuid.v4();
  const user = getAuth(app);
  const [isModalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = React.useState(true);
  const [mname, setmname] = React.useState('');
  const [comapny, setcompany] = React.useState('');
  const [oldcomapny, setoldcompany] = React.useState('');
  const [userflag, setuserflag] = React.useState(false);
  const [catid, setcatid] = React.useState('');
  const [images, setImages] = useState([null]);
  const [loading, setloading] = React.useState(false);
  const [value2, setValue2] = useState('');
  const [label2, setlabel2] = useState('');
  const [isFocus2, setIsFocus2] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Filter even and odd elements
  const evenElements = data.filter((_, index) => index % 2 === 0);
  const oddElements = data.filter((_, index) => index % 2 !== 0);

  // Combine even and odd elements into one array of objects with type 'even' or 'odd'
  const combinedData = evenElements.map((item, index) => ({
    even: item,
    odd: oddElements[index],
  }));

  const all = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const choosefileimg = async index => {
    try {
      const [file] = await pick(); // Custom picker, returns [{ uri, name, size, type }]

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

      console.log('images :', localCopy);
      console.log('images :', newImage);

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

  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      if (role === 'employee') {
        setuserflag(true);
      } else {
        setuserflag(false);
      }
    });
  }, []);

  const addcat = async () => {
    console.log('====================================');
    console.log('images', images);
    console.log('====================================');
    if (!comapny) {
      showToast('error', 'Error', 'Please Fill The Category Field', true, 2000);
    } else {
      // setloading(true);
      const uploadPromises = images.map(async (image, index) => {
        if (images[index] !== null) {
          setloading(true);
          const reference = storage().ref(`allsubscriptionfiles/${image.name}`);
          await reference.putFile(image.path);
          const url = await storage()
            .ref(`allsubscriptionfiles/${image.name}`)
            .getDownloadURL();
          return url;
        } else {
          showToast(
            'error',
            'Error',
            'Please Fill The Category Image',
            true,
            2000,
          );
          // return null;
        }
        // return null;
      });

      const unfilterurls = await Promise.all(uploadPromises);
      const filterimages = unfilterurls.filter(url => url !== null);
      // setloading(false)
      console.log('Uploaded image URLs:', filterimages);

      AsyncStorage.getItem('email').then(email => {
        setDoc(doc(db, 'Sub_Maincat', userid), {
          company: comapny.trim().toLowerCase(),
          email: email ? email : '',
          userid,
          // premiuml: label2,
          // premiumv: value2,
          catimg: filterimages,
          timestamp: serverTimestamp(),
        })
          .then(() => {
            setloading(false);
            setcompany('');
            setlabel2('');
            setValue2('');
            setImages([null]);
            toggleModal();
            console.log('done');
          })
          .catch(error => {
            toggleModal();
            setloading(false);
            // console.log(error);
            Alert.alert('this :', error.message);
          });
      });
    }
  };

  const updateCat = async () => {
    if (!comapny || !catid) {
      showToast(
        'error',
        'Error',
        'Please Fill The Cat Field and select a category to update',
        true,
        2000,
      );
    } else {
      setloading(true);
      const uploadPromises = images.map(async (image, index) => {
        if (image?.uri) {
          const reference = storage().ref(`allsubscriptionfiles/${image.name}`);
          await reference.putFile(image.path);
          const url = await storage()
            .ref(`allsubscriptionfiles/${image.name}`)
            .getDownloadURL();
          return url;
        } else {
          return images[index];
        }
      });

      const unfilterurls = await Promise.all(uploadPromises);
      const filterimages = unfilterurls.filter(url => url !== undefined);

      try {
        // 🔹 Step 1: Update category doc
        await updateDoc(doc(db, 'Sub_Maincat', catid), {
          company: comapny.trim().toLowerCase(),
          timestamp: serverTimestamp(),
          catimg: filterimages,
        });

        // 🔹 Step 2: Update all Products having this category
        const q = query(
          collection(db, 'Products'),
          where('categoryl', '==', oldcomapny), // 👈 old name ko pass karna hoga
        );
        const querySnapshot = await getDocs(q);

        const batch = writeBatch(db);

        querySnapshot.forEach(docSnap => {
          const docRef = doc(db, 'Products', docSnap.id);
          batch.update(docRef, { categoryl: comapny.trim().toLowerCase() });
        });

        await batch.commit();

        setloading(false);
        setcompany('');
        setlabel2('');
        setValue2('');
        setImages([null]);
        toggleModal();
        console.log('update done');
      } catch (error) {
        toggleModal();
        setloading(false);
        Alert.alert('Error:', error.message);
      }
    }
  };

  const deleteCat = async docId => {
    try {
      // Check if any product exists with this category
      const q = query(
        collection(db, 'Products'),
        where('categoryv', '==', docId),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert(
          'Category Deletion Error',
          'This category is already assigned to one or more products. Please update or delete those products before deleting this category.',
        );
        return;
      }

      // If no product found with this category, then delete category
      await deleteDoc(doc(db, 'Sub_Maincat', docId));
      console.log('Category deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Render an item
  const renderItem = ({ item }) => (
    <>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={tw`h-48 flex-row justify-around mt-5`}>
          <View
            style={[
              tw`h-43 w-40 items-center shadow-xl bg-white justify-${
                userflag ? 'around' : 'between'
              } rounded-2xl border `,
              { borderColor: darkMode ? '#ffffff' : 'lightgray' },
            ]}
          >
            {userflag ? (
              <></>
            ) : (
              <View style={tw`flex-row w-35 mt-2 justify-between`}>
                <TouchableOpacity
                  onPress={() => {
                    toggleModal(), setmname('UPDATE CATEGORY');
                    setcompany(item.even.selecteduser.company.toUpperCase());
                    setoldcompany(item.even.selecteduser.company.toLowerCase());
                    setcatid(item.even.selecteduser.userid);
                    setValue2(item.even.selecteduser.premiumv);
                    setlabel2(item.even.selecteduser.premiuml);
                    setImages([item.even.selecteduser.catimg[0]]);
                  }}
                >
                  <Image
                    source={require('../../Images/edit.png')}
                    style={tw`h-5 w-5`}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Alert',
                      'are you sure you want to delete this ?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'NO',
                        },
                        {
                          text: 'YES',
                          onPress: () =>
                            deleteCat(item.even.selecteduser.userid),
                        },
                      ],
                    );
                    // deleteCat(item.even.selecteduser.userid)
                  }}
                >
                  <Image
                    source={require('../../Images/delete.png')}
                    style={tw`h-5 w-5`}
                  />
                </TouchableOpacity>
              </View>
            )}

            <Image
              source={{ uri: item.even.selecteduser.catimg[0] }}
              style={tw`h-25 mt-2 rounded-xl w-35`}
            />
            <Text
              numberOfLines={2}
              style={[
                {
                  fontSize: 14,

                  textAlign: 'center',
                  marginTop: 5,
                },
                tw`text-${darkMode ? 'white' : 'black'} w-35 font-bold h-10 `,
              ]}
            >
              {item.even.selecteduser.company.toUpperCase()}
            </Text>
          </View>

          {item.odd && (
            <View
              style={[
                tw`h-43 w-40 items-center bg-white shadow-xl justify-${
                  userflag ? 'around' : 'between'
                } border  rounded-2xl`,
                { borderColor: darkMode ? '#ffffff' : 'lightgray' },
              ]}
            >
              {userflag ? (
                <></>
              ) : (
                <View style={tw`flex-row w-35 mt-2 justify-between`}>
                  <TouchableOpacity
                    onPress={() => {
                      toggleModal(), setmname('UPDATE CATEGORY');
                      setcompany(item.odd.selecteduser.company.toUpperCase());
                      setoldcompany(
                        item.odd.selecteduser.company.toLowerCase(),
                      );
                      setcatid(item.odd.selecteduser.userid);
                      setValue2(item.odd.selecteduser.premiumv);
                      setlabel2(item.odd.selecteduser.premiuml);
                      setImages([item.odd.selecteduser.catimg[0]]);
                    }}
                  >
                    <Image
                      source={require('../../Images/edit.png')}
                      style={tw`h-5 w-5`}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Alert',
                        'are you sure you want to delete this ?',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'No',
                          },
                          {
                            text: 'Yes',
                            onPress: () =>
                              deleteCat(item.odd.selecteduser.userid),
                          },
                        ],
                      );
                      // deleteCat(item.odd.selecteduser.userid)
                    }}
                  >
                    <Image
                      source={require('../../Images/delete.png')}
                      style={tw`h-5 w-5`}
                    />
                  </TouchableOpacity>
                </View>
              )}

              <Image
                source={{ uri: item.odd.selecteduser.catimg[0] }}
                style={tw`h-25 mt-2 rounded-lg w-35`}
              />
              <Text
                numberOfLines={2}
                style={[
                  {
                    fontSize: 14,
                    textAlign: 'center',
                    margin: 5,
                  },
                  tw`text-${darkMode ? 'white' : 'black'} w-35 font-bold h-10 `,
                ]}
              >
                {item.odd.selecteduser.company.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderItem}
      />

      {userflag ? (
        <></>
      ) : (
        <FAB
          onPress={() => {
            toggleModal(), setmname('ADD CATEGORY');
          }}
          style={tw`justify-end w-80 -top-20`}
          visible={visible}
          icon={{ name: 'add', color: 'white' }}
          color="#F16767"
        />
      )}

      <Modal
        style={tw`w-80 self-center `}
        onDismiss={toggleModal}
        animationIn={'bounceInUp'}
        isVisible={isModalVisible}
      >
        <View
          style={{
            borderRadius: 50,
            backgroundColor: darkMode ? 'black' : '#ffffff',
          }}
        >
          <View
            style={[
              { height: 350, backgroundColor: darkMode ? 'black' : '#ffffff' },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setcompany('');
                setlabel2('');
                setValue2('');
                setImages([null]);
                toggleModal();
                // setcompany('');
                // navigation.goBack()
              }}
            >
              <View style={tw`items-end self-center justify-end w-310px`}>
                <Image
                  style={{ height: 30, width: 30 }}
                  source={
                    darkMode
                      ? require('../../Images/closew.png')
                      : require('../../Images/close.png')
                  }
                />
              </View>
            </TouchableOpacity>

            <View style={tw` flex-col  h-60 justify-around`}>
              <View style={tw`self-center`}>
                <Text
                  style={[
                    tw`text-center font-normal text-lg`,
                    { color: darkMode ? '#ffffff' : '#000000' },
                  ]}
                >
                  {mname}
                </Text>
              </View>

              <View style={tw`w-60  self-center flex-row mt-5 justify-around`}>
                {images.map((image, index) => (
                  <View
                    style={tw`flex flex-col w-15 self-center justify-around`}
                  >
                    <TouchableOpacity
                      key={index}
                      onPress={() => choosefileimg(index)}
                    >
                      {/* <View style={tw`flex w-10 items-center  mt-5 flex-col`}> */}
                      <View
                        style={tw`  h-15 border-2 border-${
                          darkMode ? 'white' : 'black'
                        } rounded-md w-15 justify-center items-center border-dotted`}
                      >
                        {images[index] !== null ? (
                          <Image
                            source={{ uri: image.uri ? image.uri : image }}
                            resizeMode="cover"
                            style={tw`h-14 w-14  self-center rounded-lg`}
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

              <TextInput
                value={comapny}
                onChangeText={value => setcompany(value)}
                placeholderTextColor={darkMode ? 'white' : 'black'}
                style={tw`pl-3 h-10 text-${
                  darkMode ? 'white' : 'black'
                } w-60 mt-5 self-center border-${
                  darkMode ? 'white' : 'black'
                }  border`}
                placeholder="Enter Category Name"
              />

              {/* <Dropdown
                style={tw`h-10 w-60  mt-12 self-center border border-${
                  darkMode ? 'white' : 'black'
                } `}
                placeholderStyle={tw`ml-3 text-gray-400  `}
                selectedTextStyle={tw`ml-3 text-gray-400  `}
                containerStyle={tw`h-40 w-60  mt-7  rounded-md`}
                data={all}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Premium Category ?'}
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
              /> */}

              {loading ? (
                <ActivityIndicator
                  style={tw`mt-15`}
                  size="large"
                  color="#00BF62"
                />
              ) : (
                <View style={tw`mt-5`}>
                  <TouchableOpacity
                    onPress={() => {
                      mname === 'ADD CATEGORY' ? addcat() : updateCat();
                    }}
                  >
                    <View
                      style={[
                        tw`rounded-full`,
                        {
                          marginTop: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          height: 40,
                          width: 200,

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

          <Toast />
        </View>
      </Modal>
    </View>
  );
};
