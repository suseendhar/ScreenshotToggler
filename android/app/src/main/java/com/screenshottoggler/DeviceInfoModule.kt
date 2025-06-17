package com.reactnativescreenshottoggler

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.wifi.WifiInfo
import android.net.wifi.WifiManager
import android.os.Build
import android.provider.Settings
import android.telephony.TelephonyManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Arguments

import java.net.NetworkInterface
import java.util.*

class DeviceInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceInfoModule"
    }

    @ReactMethod
    fun getDeviceDetails(promise: Promise) {
        val details = Arguments.createMap()

        try {
            // OS
            details.putString("osName", "Android")
            details.putString("osVersion", Build.VERSION.RELEASE)
            details.putInt("osAPILevel", Build.VERSION.SDK_INT)

            // Device Name
            details.putString("deviceName", Build.MODEL)
            details.putString("deviceManufacturer", Build.MANUFACTURER)

            // Android ID (Unique per app installation on Android 8.0+, consistent for the app)
            details.putString("androidId", Settings.Secure.getString(reactApplicationContext.contentResolver, Settings.Secure.ANDROID_ID))

            // MAC Address (Limited on modern Android)
            var macAddress = "N/A"
            val wifiManager = reactApplicationContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager?
            if (wifiManager != null) {
                val wifiInfo: WifiInfo? = wifiManager.connectionInfo
                if (wifiInfo != null) {
                    macAddress = wifiInfo.macAddress
                    // On Android 6.0 (API 23) and above, WifiInfo.getMacAddress() returns "02:00:00:00:00:00"
                    // for apps not granted specific permissions (like system apps or device owners).
                    if (macAddress == "02:00:00:00:00:00" && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        macAddress = "Not available (Android 6.0+ privacy)"
                        try {
                            val all: List<NetworkInterface> = Collections.list(NetworkInterface.getNetworkInterfaces())
                            for (nif in all) {
                                if (!nif.name.equals("wlan0", ignoreCase = true)) continue

                                val macBytes = nif.hardwareAddress
                                if (macBytes == null) continue

                                val res1 = StringBuilder()
                                for (b in macBytes) {
                                    res1.append(String.format("%02X:", b))
                                }
                                if (res1.isNotEmpty()) {
                                    res1.deleteCharAt(res1.length - 1)
                                }
                                macAddress = res1.toString()
                                break
                            }
                        } catch (ex: Exception) {
                            macAddress = "Error getting MAC from NetworkInterface"
                        }
                    }
                }
            }
            details.putString("macAddress", macAddress)

            // IMEI (Limited on modern Android)
            var imei = "N/A"
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) { // Android 8.0+
                imei = "Not available (Android 8.0+ privacy)"
            } else if (reactApplicationContext.checkCallingOrSelfPermission(Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
                val telephonyManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager?
                if (telephonyManager != null) {
                    imei = telephonyManager.deviceId ?: "N/A (Deprecated or restricted)"
                }
            } else {
                imei = "Permission READ_PHONE_STATE not granted"
            }
            details.putString("imei", imei)

            promise.resolve(details)

        } catch (e: Exception) {
            promise.reject("DEVICE_DETAILS_ERROR", "Failed to get device details: ${e.message}")
        }
    }
}