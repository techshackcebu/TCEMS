package com.techshack.tcems

import android.os.Bundle
import android.graphics.Color
import android.view.View
import android.view.WindowManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import com.getcapacitor.BridgeActivity
import java.util.concurrent.Executor

class MainActivity : BridgeActivity() {
    private lateinit var executor: Executor
    private lateinit var biometricPrompt: BiometricPrompt
    private lateinit var promptInfo: BiometricPrompt.PromptInfo

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // --- EDGE-TO-EDGE HYBRID ENGINE ---
        window.apply {
            addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
            statusBarColor = Color.TRANSPARENT
            navigationBarColor = Color.TRANSPARENT
            decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or 
                                          View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                                          View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR.inv()
        }

        // --- NATIVE BIOMETRIC ENGINE (v3.0) ---
        executor = ContextCompat.getMainExecutor(this)
        biometricPrompt = BiometricPrompt(this, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                }

                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                }
            })

        promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("TCEMS Kiosk Master Access")
            .setSubtitle("Biometric bypass for TechShack Admin")
            .setNegativeButtonText("Use PIN Instead")
            .build()
    }
    
    fun triggerBiometricAuth() {
        runOnUiThread {
            biometricPrompt.authenticate(promptInfo)
        }
    }
}
