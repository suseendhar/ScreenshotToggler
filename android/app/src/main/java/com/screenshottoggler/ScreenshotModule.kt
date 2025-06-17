package com.reactnativescreenshottoggler

import android.app.Activity
import android.content.Context
import android.os.Build
import android.util.Log
import android.view.WindowManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.ref.WeakReference

class ScreenshotModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var currentActivityRef: WeakReference<Activity>? = WeakReference(reactContext.currentActivity)
    private var screenCaptureCallback: Activity.ScreenCaptureCallback? = null
    private var isCallbackRegistered = false

    override fun getName(): String = "ScreenshotModule"

    init {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            screenCaptureCallback = Activity.ScreenCaptureCallback {
                Log.d("ScreenshotModule", "Screenshot taken detected")
                emitEvent("onScreenshotDetected", null)
            }
        }
    }

    @ReactMethod
    fun enableScreenshotPrevention(callback: Callback) {
        val activity = currentActivity ?: reactApplicationContext.currentActivity
        if (activity == null) {
            callback.invoke(false, "No current activity.")
            return
        }
        activity.runOnUiThread {
            try {
                activity.window?.setFlags(
                    WindowManager.LayoutParams.FLAG_SECURE,
                    WindowManager.LayoutParams.FLAG_SECURE
                )
                callback.invoke(true, null)
            } catch (e: Exception) {
                callback.invoke(false, "Failed to enable screenshot prevention: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun disableScreenshotPrevention(callback: Callback) {
        val activity = currentActivity ?: reactApplicationContext.currentActivity
        if (activity == null) {
            callback.invoke(false, "No current activity.")
            return
        }
        activity.runOnUiThread {
            try {
                activity.window?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                callback.invoke(true, null)
            } catch (e: Exception) {
                callback.invoke(false, "Failed to disable screenshot prevention: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun startScreenshotDetection(callback: Callback) {
        val activity = currentActivity ?: reactApplicationContext.currentActivity
        if (activity == null) {
            callback.invoke(false, "No current activity for detection.")
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE && screenCaptureCallback != null) {
            try {
                if (!isCallbackRegistered) {
                    activity.registerScreenCaptureCallback(reactApplicationContext.mainExecutor, screenCaptureCallback!!)
                    isCallbackRegistered = true
                    Log.d("ScreenshotModule", "Screenshot detection registered")
                }
                callback.invoke(true, null)
            } catch (e: Exception) {
                callback.invoke(false, "Failed to start screenshot detection: ${e.message}")
            }
        } else {
            callback.invoke(false, "Screenshot detection API requires Android 14+.")
        }
    }

    @ReactMethod
    fun stopScreenshotDetection(callback: Callback) {
        val activity = currentActivity ?: reactApplicationContext.currentActivity
        if (activity == null) {
            callback.invoke(false, "No current activity.")
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE && screenCaptureCallback != null) {
            try {
                if (isCallbackRegistered) {
                    activity.unregisterScreenCaptureCallback(screenCaptureCallback!!)
                    isCallbackRegistered = false
                    Log.d("ScreenshotModule", "Screenshot detection unregistered")
                }
                callback.invoke(true, null)
            } catch (e: Exception) {
                callback.invoke(false, "Failed to stop screenshot detection: ${e.message}")
            }
        } else {
            callback.invoke(false, "Screenshot detection API requires Android 14+.")
        }
    }

    private fun emitEvent(eventName: String, message: String?) {
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, message)
    }
}
