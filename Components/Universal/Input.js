import {View, TextInput, Text, Image, Dimensions} from 'react-native';
import React, {useContext, useState} from 'react';
import tw from 'twrnc';
import Toast from 'react-native-toast-message';
import {AppContext} from '../../AppContext';

export const showToast = (type, text1, text2, hide, time) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    autoHide: hide,
    visibilityTime: time,
    position: 'top',
  });
};

export const {width, height} = Dimensions.get('window');

export const Input = ({
  source,
  placeholder,
  onchangetext,
  phonepad,
  onblur,
  value,
  entry,
}) => {
  const {darkMode} = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState('');

  // Phone number validation function
  const validatePhoneNumber = text => {
    const phonePattern =
      /^(?:\+1[-.\s]?)?\(?([2-9][0-9]{2})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

    if (phonePattern.test(text)) {
      setErrorMessage('');
      onchangetext(text); // Update the parent state if valid
    } else {
      setErrorMessage('Invalid phone number format');
    }
  };
  return (
    <>
      <View
        style={[
          {width: width * 0.90},
          tw`flex-row text-${
            darkMode ? 'white' : 'black'
          } justify-between  rounded-lg border  border-gray-400 items-center     mt-3 `,
        ]}>
        <TextInput
          placeholder={placeholder}
          onChangeText={onchangetext}
          placeholderTextColor={darkMode ? 'white' : 'black'}
          onBlur={onblur}
          value={value}
          keyboardType={phonepad}
          secureTextEntry={entry}
          style={[
            tw`h-12 w-70  rounded-3xl text-${
              darkMode ? 'white' : 'black'
            } text-start pl-5 border-gray-400 `,
          ]}></TextInput>
        <Image source={source} style={tw`h-5 w-5 -left-5  justify-end`} />
      </View>
    </>
  );
};

export const Input1 = ({placeholder, onchangetext, onblur, value, entry}) => (
  <>
    <View style={tw`flex-row justify-center  mt-3 `}>
      <TextInput
        placeholder={placeholder}
        onChangeText={onchangetext}
        onBlur={onblur}
        value={value}
        secureTextEntry={entry}
        style={[
          tw`h-12  w-80 border rounded-md text-start pl-5 border-white `,
          {backgroundColor: '#EEEEEE'},
        ]}></TextInput>
    </View>
  </>
);

export const Error = ({error, errors, touch}) => (
  <>
    {errors && touch && (
      <Text style={tw`ml-10  mt-3 text-red-500`}>{error}</Text>
    )}
  </>
);
