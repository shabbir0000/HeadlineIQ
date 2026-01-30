import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [headline, setHeadline] = useState(
    'Trump threatens Canada with 100% tariffs...',
  );

  // Mock API Data based on your JSON
  const result = {
    prediction: 'Medium Sensational',
    improvement:
      'This headline is well-balanced. You may slightly enhance emotional wording, but keep it factual to maintain SEO quality.',
    features: [
      { label: 'Word Count', value: '25.62%' },
      { label: 'Char Count', value: '38.54%' },
      { label: 'Has Number', value: '13.83%' },
      { label: 'Emotion', value: '4.01%' },
    ],
    platforms: 'Google, Discover, Facebook, X',
  };

  return (
    <ImageBackground
      source={require('../../Images/simplebg.png')} // 👈 Background image path
      style={{
        flex: 1,
        width: width,
        height: height,
      }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 20, alignItems: 'center' }}
        >
          {/* Header */}
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginTop: 40,
              letterSpacing: 2,
            }}
          >
            HEADLINE <Text style={{ color: '#00F2EA' }}>IQ</Text>
          </Text>

          {/* AI Brain Visual Image */}
          {/* <View
            style={{
              width: 380,
              height: 380,
              // marginVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
              // Glow Effect
              // shadowColor: '#00F2EA',
              // shadowOpacity: 0.8,
              // shadowRadius: 20,
              // elevation: 15,
            }}
          >
            <Image
              source={require('../../Images/brainvisual-removebg-preview.png')} // Yahan apni image ka path check karlein
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View> */}

          {/* Input Field */}
          <TextInput
            style={{
              width: '100%',
              marginTop :50,
              backgroundColor: 'rgba(255,255,255,0.3)',
              // backgroundColor :'lightgray',
              borderRadius: 12,
              padding: 15,
              color: '#ffffff',
              borderWidth: 1,
              borderColor: 'rgba(0,242,234,0.9)',
              marginBottom: 20,
              textAlignVertical: 'top',
            }}
            placeholder="Enter Your Headline Here..."
            placeholderTextColor="#ffffff"
            multiline={true}
            numberOfLines={3}
            value={headline}
            onChangeText={setHeadline}
          />

          {/* Analyze Button */}
          <TouchableOpacity style={{ width: '100%', marginBottom: 30 }}>
            <LinearGradient
              colors={['#00F2EA', '#A742F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ padding: 15, borderRadius: 30, alignItems: 'center' }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
                ANALYZE HEADLINE
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Results Card */}
          <View
            style={{
              width: '100%',
              backgroundColor: 'rgba(11, 22, 34, 0.8)',
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: '#00F2EA',
              shadowColor: '#00F2EA',
              shadowOpacity: 0.2,
              shadowRadius: 15,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 15,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#A0AEC0', fontSize: 12 }}>
                  Prediction:
                </Text>
                <Text
                  style={{ color: '#00F2EA', fontSize: 18, fontWeight: 'bold' }}
                >
                  {result.prediction}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={{ color: '#A0AEC0', fontSize: 12 }}>
                  Platforms:
                </Text>
                <Text style={{ color: '#FFF', fontSize: 12 }}>
                  {result.platforms}
                </Text>
              </View>
            </View>

            <Text style={{ color: '#A0AEC0', fontSize: 12, marginBottom: 5 }}>
              Improvement Suggestion:
            </Text>
            <Text
              style={{
                color: '#FFF',
                fontSize: 13,
                lineHeight: 18,
                marginBottom: 20,
              }}
            >
              {result.improvement}
            </Text>

            {/* Feature Grid */}
            <Text
              style={{
                color: '#A742F5',
                fontSize: 12,
                fontWeight: 'bold',
                marginBottom: 10,
              }}
            >
              CONTRIBUTING FACTORS:
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {result.features.map((f, i) => (
                <View
                  key={i}
                  style={{
                    width: '48%',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                    {f.label}
                  </Text>
                  <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                    {f.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
