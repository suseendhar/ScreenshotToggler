import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import {ScreenshotManager} from '../../nativeModules/ScreenshotModule';
import {DeviceInfoManager} from '../../nativeModules/DeviceInfoModule';
import CustomToggleButton from '../../components/CustomToggle/CustomToggleButton';
import {
  submitDeviceStatus,
  getPublicIpAddress,
} from '../../services/apiService';
import {styles} from './styles';
import Geolocation from '@react-native-community/geolocation';
import strings from '../../utils/strings';

const HomeScreen: React.FC = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const screenshotListener = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.getCurrentPosition(
        position => console.log('Got position:', position),
        error => {
          console.error('Error fetching location:', error);
          Alert.alert(
            strings.location.errorAlertTitle,
            strings.location.errorFetching,
          );
        },
        {enableHighAccuracy: false, timeout: 10000, maximumAge: 10000},
      );
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      try {
        Geolocation.requestAuthorization();
        return true;
      } catch (err) {
        console.error('iOS Location permission request FAILED:', err);
        Alert.alert(
          strings.permission.errorTitle,
          strings.permission.requestFailed(err),
        );
        return false;
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: strings.location.permissionTitle,
            message: strings.location.permissionMessage,
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Android Location permission request failed:', err);
        return false;
      }
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<{
    latitude: number | null;
    longitude: number | null;
  }> => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        strings.location.permissionDenied,
        strings.location.permissionRequired,
      );
      return {latitude: null, longitude: null};
    }

    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting location:', error);
          Alert.alert(
            strings.location.errorAlertTitle,
            strings.location.unableToGet,
          );
          resolve({latitude: null, longitude: null});
        },
        {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
      );
    });
  }, [requestLocationPermission]);

  const collectDeviceDetails = useCallback(
    async (currentScreenshotStatus: boolean) => {
      try {
        const [deviceDetails, publicIp, location] = await Promise.all([
          DeviceInfoManager.getDeviceDetails(),
          getPublicIpAddress(),
          getCurrentLocation(),
        ]);

        return {
          os: deviceDetails.osName,
          osVersion: deviceDetails.osVersion,
          deviceName: deviceDetails.deviceName || 'Unknown',
          macAddress: deviceDetails.macAddress || 'N/A',
          imei: deviceDetails.imei || 'N/A',
          location,
          publicIpAddress: publicIp,
          screenshotStatus: currentScreenshotStatus ? 'disabled' : 'enabled',
          timestamp: new Date().toISOString(),
          platformSpecificId:
            Platform.OS === 'android'
              ? deviceDetails.androidId || 'N/A'
              : deviceDetails.identifierForVendor || 'N/A',
        };
      } catch (error) {
        console.error('Error collecting device details:', error);
        throw new Error(strings.device.collectionError);
      }
    },
    [getCurrentLocation],
  );

  const initializeScreenshotPrevention = useCallback(async () => {
    try {
      await ScreenshotManager.disablePrevention();
      if (Platform.OS === 'android') {
        ScreenshotManager.startDetection().catch(console.warn);
      }
    } catch (e) {
      console.error('Initialization error:', e);
    }
  }, []);

  useEffect(() => {
    initializeScreenshotPrevention();
  }, [initializeScreenshotPrevention]);

  const handleToggle = useCallback(async () => {
    setIsLoading(true);
    const newStatus = !isActivated;

    try {
      if (newStatus) {
        await ScreenshotManager.enablePrevention();
        if (Platform.OS === 'android') {
          await ScreenshotManager.stopDetection();
        }
      } else {
        await ScreenshotManager.disablePrevention();
        if (Platform.OS === 'android') {
          await ScreenshotManager.startDetection();
        }
      }

      setIsActivated(newStatus);

      const payload = await collectDeviceDetails(newStatus);
      await submitDeviceStatus(payload);

      Alert.alert(
        strings.screenshot.successTitle,
        strings.screenshot.successMessage(newStatus),
      );
    } catch (error: any) {
      console.error('Toggle error:', error);
      Alert.alert(
        strings.screenshot.errorTitle,
        error.message || strings.screenshot.errorMessage,
      );
    } finally {
      setIsLoading(false);
    }
  }, [isActivated, collectDeviceDetails]);

  useEffect(() => {
    const shouldListen =
      Platform.OS === 'ios' || (Platform.OS === 'android' && !isActivated);

    if (shouldListen) {
      screenshotListener.current?.remove?.();

      if (Platform.OS === 'android' && !isActivated) {
        ScreenshotManager.startDetection().catch(console.warn);
      }

      screenshotListener.current = ScreenshotManager.onScreenshotDetected(
        async () => {
          Alert.alert(
            strings.screenshot.detectedTitle,
            strings.screenshot.detectedMessage,
          );
          try {
            const payload = await collectDeviceDetails(isActivated);
            payload.screenshotStatus = 'detected_event';
            await submitDeviceStatus(payload);
          } catch (e) {
            console.error('Error submitting screenshot event:', e);
          }
        },
      );
    }

    return () => {
      screenshotListener.current?.remove?.();
      screenshotListener.current = null;

      if (Platform.OS === 'android') {
        ScreenshotManager.stopDetection().catch(console.warn);
      }
    };
  }, [isActivated, collectDeviceDetails]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
        testID="logo-image"
      />
      <CustomToggleButton
        isActive={isActivated}
        onPress={handleToggle}
        isLoading={isLoading}
      />

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loaderText}>
            {strings.toggleButton.loaderText}
          </Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
