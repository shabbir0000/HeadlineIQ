import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import Ionicon from 'react-native-vector-icons/SimpleLineIcons';
import tw from 'twrnc';
import {AppContext} from '../../AppContext';
// import LottieView from 'lottie-react-native'

const Screensheader = ({name, onPress, left}) => {
  const {darkMode} = useContext(AppContext);
  return (
    <>
      <View style={tw`flex flex-row  mb-10 mt-5 top-5 items-center`}>
        <View style={tw`left-5 h-10  bg-white items-center justify-center rounded-full w-10  `}>
          <TouchableOpacity onPress={onPress}>
            <Image
              style={tw`h-8 w-8 `}
              source={ require('../../Images/leftarrow.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={tw`items-center  self-center`}>
          <Text
            numberOfLines={1}
            style={[
              tw`text-center text-${
                darkMode ? 'white' : 'black'
              } w-65  left-5 text-2xl font-normal`,
              // {color: '#000000'},
            ]}>
            {name}
          </Text>
        </View>
      </View>
    </>
  );
};

export default Screensheader;
