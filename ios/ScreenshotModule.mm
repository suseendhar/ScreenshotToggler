#import "ScreenshotModule.h"
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>

@implementation ScreenshotModule {
  UITextField *secureOverlayTextField;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onScreenshotDetected"];
}

- (void)startObserving {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(userDidTakeScreenshot:)
                                               name:UIApplicationUserDidTakeScreenshotNotification
                                             object:nil];
}

- (void)stopObserving {
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:UIApplicationUserDidTakeScreenshotNotification
                                                object:nil];
}

- (void)userDidTakeScreenshot:(NSNotification *)notification {
  RCTLogInfo(@"User took screenshot!");
  [self sendEventWithName:@"onScreenshotDetected" body:@{@"status": @"Screenshot taken"}];
}

- (UIWindow *)getKeyWindow {
  if (@available(iOS 13.0, *)) {
    for (UIWindowScene *scene in [UIApplication sharedApplication].connectedScenes) {
      if (scene.activationState == UISceneActivationStateForegroundActive) {
        for (UIWindow *window in scene.windows) {
          if (window.isKeyWindow) {
            return window;
          }
        }
      }
    }
    return nil;
  } else {
    return [UIApplication sharedApplication].keyWindow;
  }
}

RCT_EXPORT_METHOD(enableScreenshotPrevention:(RCTResponseSenderBlock)callback) {
  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow *keyWindow = [self getKeyWindow];
    if (!keyWindow) {
      callback(@[@(NO), @"No key window found."]);
      return;
    }

    if (!secureOverlayTextField) {
      secureOverlayTextField = [[UITextField alloc] initWithFrame:keyWindow.bounds];
      secureOverlayTextField.secureTextEntry = YES;
      secureOverlayTextField.userInteractionEnabled = NO;
      secureOverlayTextField.tag = 999;
      secureOverlayTextField.backgroundColor = [UIColor clearColor];
      secureOverlayTextField.textColor = [UIColor clearColor];
      secureOverlayTextField.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

      [keyWindow addSubview:secureOverlayTextField];
      [keyWindow bringSubviewToFront:secureOverlayTextField];
    }

    callback(@[@(YES), [NSNull null]]);
  });
}

RCT_EXPORT_METHOD(disableScreenshotPrevention:(RCTResponseSenderBlock)callback) {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (secureOverlayTextField) {
      [secureOverlayTextField removeFromSuperview];
      secureOverlayTextField = nil;
    }
    callback(@[@(YES), [NSNull null]]);
  });
}

@end
