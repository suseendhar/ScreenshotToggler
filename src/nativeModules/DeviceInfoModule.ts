import {NativeModules} from 'react-native';

interface DeviceDetails {
  osName: string;
  osVersion: string;
  deviceName: string;
  deviceManufacturer?: string;
  deviceModel?: string;
  androidId?: string;
  identifierForVendor?: string;
  macAddress: string;
  imei: string;
}

interface DeviceInfoModuleInterface {
  getDeviceDetails(): Promise<DeviceDetails>;
}

const {DeviceInfoModule} = NativeModules;

if (!DeviceInfoModule) {
  console.warn(
    'DeviceInfoModule not found. Make sure native modules are linked correctly.',
  );
}

export const DeviceInfoManager: DeviceInfoModuleInterface = DeviceInfoModule;
