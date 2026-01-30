import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import Deviceinfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Welcome to HeadlineIQ',
    description: 'AI-powered analysis to understand, optimize, and score your news headlines.',
  },
  {
    title: 'Analyze Headlines Instantly',
    description: 'Check whether your headline is Normal, Medium Sensational, or High Clickbait in seconds.',
  },
  {
    title: 'AI-Driven Insights',
    description: 'See feature-level breakdowns like emotion, length, capitalization, and click potential.',
  },
  {
    title: 'Write SEO & Click-Smart Headlines',
    description: 'Get smart suggestions to improve reach, SEO performance, and audience engagement.',
  },
];



export default function Onboard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      const id = await Deviceinfo.getUniqueId();
      // AsyncStorage.setItem('mobileid', id).then(() => {
        navigation.navigate('Home_Screen');
      // });
    }
  };

  const handleSkip = async () => {
   
      navigation.navigate('Home_Screen');
    // });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <ImageBackground
      source={require('../../Images/welcomebg.png')} // 👈 Background image path
      style={styles.background}
      resizeMode="cover"
    >
      <FlatList
        data={onboardingData}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        // renderItem={({ item }) => (
        //   <View style={styles.page}>
        //     <View style={styles.container}>
        //       <Text style={styles.title}>{item.title}</Text>
        //       <Text style={styles.description}>{item.description}</Text>
        //     </View>
        //   </View>
        // )}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <View style={styles.container}>
              <View style={tw`items-center`}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>

                <View style={[styles.indicatorContainer, , tw`mt-5`]}>
                  {onboardingData.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        currentIndex === index && styles.activeIndicator,
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Footer inside container */}
              <View style={styles.footerInside}>
                {currentIndex < onboardingData.length - 1 ? (
                  <TouchableOpacity onPress={() => handleSkip()}>
                    <Text style={styles.skip}>Skip</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 60 }} />
                )}

                <TouchableOpacity onPress={() => handleNext()}>
                  {/* <Text style={styles.next}> */}
                  {currentIndex === onboardingData.length - 1 ? (
                    <View>
                      {/* <TouchableOpacity> */}
                      <View
                        style={[{backgroundColor:"#00F2EA"},tw`w-40  h-10 rounded-3xl items-center justify-center`]}
                      >
                        <Text style={{color:"#000000"}}>Continue</Text>
                      </View>
                      {/* </TouchableOpacity> */}
                    </View>
                  ) : (
                    <Image
                      source={require('../../Images/rightarrow.png')}
                      style={tw`h-7 w-7`}
                    />
                  )}
                  {/* </Text> */}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Bottom Controls */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  page: {
    width: width,
    height: height,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: height * 0.55,
    width: width * 0.8,
    // backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: '#0B1622',
    borderRadius: 40,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    // marginTop: 20,
    color: '#ffffff',
  },
  footerInside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    alignSelf: 'flex-end',
    // marginTop: 90,
    // top: 90,

    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  skip: {
    fontSize: 16,
    color: '#ffffff',
  },
  next: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#A742F5',
    width: 20,
  },
});
