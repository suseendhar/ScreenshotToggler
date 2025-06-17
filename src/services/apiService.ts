const MOCK_API_URL =
  'https://685183448612b47a2c0a629c.mockapi.io/device-status';

interface DeviceStatusPayload {
  os: string;
  osVersion: string;
  deviceName: string;
  macAddress: string;
  imei: string;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
  publicIpAddress: string;
  screenshotStatus: 'enabled' | 'disabled';
  timestamp: string;
  platformSpecificId: string;
}

export const submitDeviceStatus = async (
  payload: DeviceStatusPayload,
): Promise<any> => {
  try {
    const response = await fetch(MOCK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `API submission failed: ${response.status} ${response.statusText} - ${errorData}`,
      );
    }

    const responseData = await response.json();
    console.log('API Response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error submitting device status:', error);
    throw error;
  }
};

export const getPublicIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error(
        `Failed to fetch public IP: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching public IP:', error);
    return 'N/A';
  }
};
