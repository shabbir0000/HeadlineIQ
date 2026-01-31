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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { showToast } from '../Universal/Input';

const { width, height } = Dimensions.get('window');

export default function Home_Screen() {
  const [headline, setHeadline] = useState('');
  const [result, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock API Data based on your JSON
  //   const result = {
  //     prediction: 'Medium Sensational',
  //     improvement:
  //       'This headline is well-balanced. You may slightly enhance emotional wording, but keep it factual to maintain SEO quality.',
  //     features: [
  //       { label: 'Word Count', value: '25.62%' },
  //       { label: 'Char Count', value: '38.54%' },
  //       { label: 'Has Number', value: '13.83%' },
  //       { label: 'Emotion', value: '4.01%' },
  //     ],
  //     platforms: 'Google, Discover, Facebook, X',
  //   };

  const analyzeHeadline = async () => {
    if (!headline) {
      showToast('error', 'Error', 'Please Fill The All Input', true, 4000);
      return;
    }
    try {
      console.log('====================================');
      console.log('Headline :', headline);
      console.log('====================================');
      setLoading(true)
      const response = await fetch(
        'https://41db54af2376.ngrok-free.app/predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            headline: headline,
          }),
        },
      );

      if (!response.ok) {
        setLoading(false)
        console.log('====================================');
        console.log('MODEL Error');
        console.log('====================================');
        throw new Error('Failed to analyze headline');
      } else {
        setLoading(false)
        const data = await response.json();
        console.log('====================================');
        console.log('data :', data);
        console.log('====================================');
        setResults(data);
      }

      //   return {
      //     success: true,
      //     data,
      //   };
    } catch (error) {
        setLoading(false)
      console.log('====================================');
      console.log('MODEL Error', error);
      console.log('====================================');
      return {
        success: false,
        error: error.message,
      };
    }
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
              marginTop: 50,
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
          {loading ? (
            <ActivityIndicator size={'large'} color={'#00b9e2'} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                analyzeHeadline();
              }}
              style={{ width: '100%', marginBottom: 30 }}
            >
              <LinearGradient
                colors={['#00F2EA', '#A742F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: 15, borderRadius: 30, alignItems: 'center' }}
              >
                <Text
                  style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}
                >
                  ANALYZE HEADLINE
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
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
                  {result?.prediction}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={{ color: '#A0AEC0', fontSize: 12 }}>
                  Platforms:
                </Text>

                {result?.headline_analysis?.best_platforms?.map(data => (
                  <Text style={{ color: '#FFF', fontSize: 12 }}>{data}</Text>
                ))}
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
              {result?.headline_analysis?.improvement_suggestion}
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
              <View
                // key={i}
                style={{
                  width: '48%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                  {'Capital Ratio'}
                </Text>
                <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                  {result?.feature_contribution_percent?.capital_ratio}
                </Text>
              </View>

              <View
                // key={i}
                style={{
                  width: '48%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                  {'Emotion Score'}
                </Text>
                <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                  {result?.feature_contribution_percent?.emotion_score}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <View
                // key={i}
                style={{
                  width: '48%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                  {'Numbers Score'}
                </Text>
                <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                  {result?.feature_contribution_percent?.has_number}
                </Text>
              </View>

              <View
                // key={i}
                style={{
                  width: '48%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                  {'Question Score'}
                </Text>
                <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                  {result?.feature_contribution_percent?.has_question}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <View
                // key={i}
                style={{
                  width: '48%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                  {'Word Count'}
                </Text>
                <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                  {result?.feature_contribution_percent?.headline_word_count}
                </Text>
              </View>

              <View
                // key={i}
                style={{
                  width: '48%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                  {'Char Count'}
                </Text>
                <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                  {result?.feature_contribution_percent?.headline_char_count}
                </Text>
              </View>
            </View>

            {/* Seo Contribution */}
            <Text
              style={{
                color: '#A742F5',
                fontSize: 12,
                fontWeight: 'bold',
                marginBottom: 10,
              }}
            >
              SEO CONTRIBUTING FACTORS:
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <View
                // key={i}
                style={{
                  width: '48%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                  {'SEO Friendly'}
                </Text>
                <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                  {result?.headline_analysis?.seo_friendly === true
                    ? 'Yes'
                    : 'No'}
                </Text>
              </View>

              <View
                // key={i}
                style={{
                  width: '48%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                  {'Google Search Friendly'}
                </Text>
                <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                  {result?.feature_contribution_percent
                    ?.google_search_friendly === true
                    ? 'Yes'
                    : 'No'}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <View
                // key={i}
                style={{
                  width: '48%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#A0AEC0', fontSize: 10 }}>
                  {'Social Media Friendly'}
                </Text>
                <Text style={{ color: '#00F2EA', fontWeight: 'bold' }}>
                  {result?.feature_contribution_percent
                    ?.social_media_friendly === true
                    ? 'Yes'
                    : 'No'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </ImageBackground>
  );
}
