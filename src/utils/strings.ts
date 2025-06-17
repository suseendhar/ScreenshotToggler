const strings = {
  location: {
    permissionTitle: 'Location Permission',
    permissionMessage:
      'This app needs access to your location to get device details.',
    permissionDenied: 'Permission Denied',
    permissionRequired:
      'Location permission is required to get device location.',
    errorFetching:
      'Unable to fetch location. Please ensure location is enabled in Settings.',
    unableToGet:
      'Unable to get location. Please ensure permissions are granted.',
    errorAlertTitle: 'Location Error',
  },
  permission: {
    errorTitle: 'Permission Error',
    requestFailed: (err: any) =>
      `iOS Location permission request failed: ${
        err?.message || 'Unknown error'
      }`,
  },
  screenshot: {
    detectedTitle: 'Screenshot Detected',
    detectedMessage: 'A screenshot has been taken.',
    successTitle: 'Success',
    errorTitle: 'Error',
    successMessage: (status: boolean) =>
      `Screenshot feature ${
        status ? 'disabled' : 'enabled'
      } and details submitted.`,
    errorMessage: 'An error occurred while toggling screenshot feature.',
  },
  toggleButton: {
    loaderText: 'Processing...',
  },
  device: {
    collectionError: 'Device detail collection failed.',
  },
};

export default strings;
