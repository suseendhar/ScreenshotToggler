import {NativeModules, Platform, NativeEventEmitter} from 'react-native';

interface ScreenshotModuleInterface {
  enableScreenshotPrevention(
    callback: (success: boolean, error?: string) => void,
  ): void;
  disableScreenshotPrevention(
    callback: (success: boolean, error?: string) => void,
  ): void;
  startScreenshotDetection(
    callback: (success: boolean, error?: string) => void,
  ): void;
  stopScreenshotDetection(
    callback: (success: boolean, error?: string) => void,
  ): void;
}

const {ScreenshotModule} = NativeModules;

if (!ScreenshotModule) {
  console.warn(
    'ScreenshotModule not found. Make sure native modules are linked correctly.',
  );
}

const ScreenshotEventEmitter = new NativeEventEmitter(ScreenshotModule);

export const ScreenshotManager = {
  enablePrevention: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      ScreenshotModule.enableScreenshotPrevention(
        (success: boolean, error?: string) => {
          if (success) {
            resolve();
          } else {
            reject(
              new Error(error || 'Failed to enable screenshot prevention.'),
            );
          }
        },
      );
    });
  },

  disablePrevention: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      ScreenshotModule.disableScreenshotPrevention(
        (success: boolean, error?: string) => {
          if (success) {
            resolve();
          } else {
            reject(
              new Error(error || 'Failed to disable screenshot prevention.'),
            );
          }
        },
      );
    });
  },

  startDetection: (): Promise<void> => {
    if (Platform.OS === 'android') {
      return new Promise((resolve, reject) => {
        (
          ScreenshotModule as ScreenshotModuleInterface
        ).startScreenshotDetection((success: boolean, error?: string) => {
          if (success) {
            resolve();
          } else {
            reject(new Error(error || 'Failed to start screenshot detection.'));
          }
        });
      });
    } else if (Platform.OS === 'ios') {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error('Screenshot detection not implemented for this platform.'),
    );
  },

  stopDetection: (): Promise<void> => {
    if (Platform.OS === 'android') {
      return new Promise((resolve, reject) => {
        (ScreenshotModule as ScreenshotModuleInterface).stopScreenshotDetection(
          (success: boolean, error?: string) => {
            if (success) {
              resolve();
            } else {
              reject(
                new Error(error || 'Failed to stop screenshot detection.'),
              );
            }
          },
        );
      });
    } else if (Platform.OS === 'ios') {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error('Screenshot detection not implemented for this platform.'),
    );
  },

  onScreenshotDetected: (callback: () => void) => {
    return ScreenshotEventEmitter.addListener('onScreenshotDetected', callback);
  },
};
