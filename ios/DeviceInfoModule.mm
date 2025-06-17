#import "DeviceInfoModule.h"
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>
#import <sys/utsname.h> // For device model

@implementation DeviceInfoModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getDeviceDetails:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    UIDevice *device = [UIDevice currentDevice];
    NSMutableDictionary *details = [NSMutableDictionary dictionary];

    @try {
        // OS
        [details setObject:device.systemName forKey:@"osName"];
        [details setObject:device.systemVersion forKey:@"osVersion"];

        // Device Name
        // UIDevice.current.name returns the user-assigned device name (e.g., "My iPhone").
        // Starting iOS 16, accessing this name requires the com.apple.developer.device-information.user-assigned-device-name entitlement
        // for apps submitted to the App Store. Without it, it might return a generic name or be restricted.
        [details setObject:device.name forKey:@"deviceName"];

        // Device Model (e.g., iPhone15,5)
        struct utsname systemInfo;
        uname(&systemInfo);
        [details setObject:[NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding] forKey:@"deviceModel"];

        // Identifier for Vendor (unique to the app vendor on a device, changes if all apps from vendor are uninstalled)
        if (device.identifierForVendor) {
            [details setObject:[device.identifierForVendor UUIDString] forKey:@"identifierForVendor"];
        } else {
            [details setObject:@"N/A (identifierForVendor)" forKey:@"identifierForVendor"];
        }

        // MAC Address (Not accessible on iOS for privacy reasons)
        [details setObject:@"Not available (iOS privacy)" forKey:@"macAddress"];

        // IMEI (Not accessible on iOS for privacy reasons)
        [details setObject:@"Not available (iOS privacy)" forKey:@"imei"];

        // Public IP Address (requires network call from JS)
        // [details setObject:@"Fetch from JS" forKey:@"publicIpAddress"];

        resolve(details);

    } @catch (NSException *exception) {
        reject(@"DEVICE_DETAILS_ERROR", exception.reason, nil);
    }
}

@end
