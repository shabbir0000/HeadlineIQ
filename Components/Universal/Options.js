import {View, Text, Image, TouchableOpacity, Switch} from 'react-native';
import React, {useContext, useState} from 'react';
import tw from 'twrnc';
import {AppContext} from '../../AppContext';
import {width} from './Input';

const Options = ({text, top, onPress, top1, text1, flag, left, logo}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const {darkMode} = useContext(AppContext);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <>
      <View>
        <View style={[{width: width * 0.90}, tw`  h-15 self-center `]}>
          <TouchableOpacity onPress={onPress}>
            <View style={tw` flex-row justify-between items-center`}>
              <View style={tw` w-63 flex-row items-center justify-center h-15`}>
                <Image source={logo} style={tw`h-6 w-6 ml-5`} />
                <Text
                  style={tw`text-lg text-${
                    darkMode ? 'white' : 'black'
                  } ml-3 w-53 font-mono font-bold `}>
                  {text}
                </Text>
              </View>
              <View>
                {flag ? (
                  <Image
                    source={
                      darkMode
                        ? require('../../Images/rightd.png')
                        : require('../../Images/right-arrow.png')
                    }
                    style={tw`h-6 w-6  top-1`}
                  />
                ) : (
                  <>
                    <Text style={tw`h-6 w-6 font-bold text-blue-600  top-1`}>
                      {text1}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
          <Image
            source={require('../../Images/line.png')}
            style={[{width: width * 0.90}, tw`  self-center`]}
          />
        </View>
        {/* <Image
          source={require('../../Images/line.png')}
          style={tw`w-80 top-${top1} self-center`}
        /> */}
      </View>
    </>
  );
};

export default Options;
