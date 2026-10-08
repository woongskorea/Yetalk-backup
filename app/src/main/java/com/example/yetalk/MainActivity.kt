package com.example.yetalk

import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.view.View
import android.view.WindowManager
import android.webkit.*
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.core.view.WindowCompat
import androidx.webkit.WebViewAssetLoader
import java.io.File

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var isLockAudioKept: Boolean = false

    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var cameraImageUri: Uri? = null
    private var isReturningFromChooser: Boolean = false

    // 🌟 카메라 런타임 권한 요청 런처
    private val requestCameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        // 권한 부여 결과 처리
    }

    private fun checkAndRequestCameraPermission() {
        if (ContextCompat.checkSelfPermission(
                this,
                android.Manifest.permission.CAMERA
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            requestCameraPermissionLauncher.launch(android.Manifest.permission.CAMERA)
        }
    }

    // 🌟 Chromium 중복 호출 크래시 방지 안전 콜백 전송기
    @Synchronized
    private fun sendFileChooserResult(results: Array<Uri>?) {
        val callback = filePathCallback ?: return
        filePathCallback = null
        try {
            callback.onReceiveValue(results)
        } catch (e: Throwable) {
            e.printStackTrace()
        }
    }

    // 카메라 및 파일 선택 결과 처리 런처
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        var results: Array<Uri>? = null
        if (result.resultCode == RESULT_OK) {
            val dataUri = result.data?.data
            val clipData = result.data?.clipData

            if (clipData != null && clipData.itemCount > 0) {
                results = Array(clipData.itemCount) { i -> clipData.getItemAt(i).uri }
            } else if (dataUri != null) {
                results = arrayOf(dataUri)
            } else if (cameraImageUri != null) {
                // 카메라로 직접 촬영한 경우
                results = arrayOf(cameraImageUri!!)
            }
        }
        sendFileChooserResult(results)

        if (result.resultCode == RESULT_OK) {
            // AndroidBridge.openCamera() 호출된 경우 웹뷰 JS에 즉시 알림
            webView.evaluateJavascript("javascript:if(window.handleRealCameraResultDirect) window.handleRealCameraResultDirect();", null)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 🌟 100% 엣지-투-엣지 투명 상태표시줄
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.BLACK
        WindowCompat.setDecorFitsSystemWindows(window, false)

        val insetsController = WindowCompat.getInsetsController(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = false
        insetsController.isAppearanceLightNavigationBars = false

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        setContentView(R.layout.activity_main)

        checkAndRequestCameraPermission()

        webView = findViewById(R.id.webView)
        setupWebView()

        // 뒤로가기 버튼 처리: 서브 화면에서는 메인 복귀, 메인에서는 2회 클릭 시 종료
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            private var lastBackTime: Long = 0

            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                    return
                }

                webView.evaluateJavascript("javascript:window.handleAppBackPress ? window.handleAppBackPress() : false;") { result ->
                    if (result == "true") {
                        return@evaluateJavascript
                    }
                    val now = System.currentTimeMillis()
                    if (now - lastBackTime < 2000) {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                    } else {
                        lastBackTime = now
                        android.widget.Toast.makeText(this@MainActivity, "'뒤로' 버튼을 한 번 더 누르면 예톡이 종료됩니다.", android.widget.Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })

        // 유튜브 153 차단 방지 & 내부 링크 정상 작동용 공식 가상 HTTPS 도메인
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true

        // 🌟 [핵심 1] 터치 없이도 첫 영상 즉각 자동 재생 허용 (로딩 지연 및 검은 화면 방지)
        settings.mediaPlaybackRequiresUserGesture = false

        // 🌟 [핵심 2] 그래픽 하드웨어 가속 강제 활성화 (렌더링 렉 제거)
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)

        // 🌟 [핵심 3] 캐시 및 고속 로딩 모드 설정
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // 🌟 [핵심 4] 화면 깜빡임 방지를 위한 배경 투명화
        webView.setBackgroundColor(Color.TRANSPARENT)

        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        settings.textZoom = 100

        // 유튜브 모바일 앱 차단 우회
        val defaultUa = settings.userAgentString
        settings.userAgentString = defaultUa.replace("; wv", "")

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.addJavascriptInterface(AndroidBridge(), "AndroidBridge")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                val url = request?.url ?: return null
                return assetLoader.shouldInterceptRequest(url)
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                if (request != null && !request.isForMainFrame) {
                    return false
                }

                val url = request?.url?.toString() ?: return false

                if (url.startsWith("intent:") || url.startsWith("market:") ||
                    url.startsWith("kakaotalk:") || url.startsWith("instagram:") ||
                    url.startsWith("coupang:") || url.startsWith("naversearchapp:") ||
                    url.startsWith("kbbank:") || url.startsWith("nhapp:") || url.startsWith("kakaobank:")
                ) {
                    try {
                        val intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
                        if (intent != null) {
                            try {
                                startActivity(intent)
                                return true
                            } catch (e: Exception) {
                                val fallbackUrl = intent.getStringExtra("browser_fallback_url")
                                if (!fallbackUrl.isNullOrEmpty()) {
                                    view?.loadUrl(fallbackUrl)
                                    return true
                                }
                                val pkg = intent.`package`
                                if (!pkg.isNullOrEmpty()) {
                                    launchInstalledAppOrMarket(pkg)
                                    return true
                                }
                            }
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                    return true
                }

                // 앱 내부 도메인 및 유튜브 영상 재생, 구글 비디오 스트림은 앱 안에서 유지
                if (url.startsWith("https://appassets.androidplatform.net") ||
                    url.contains("youtube.com") || url.contains("youtu.be") ||
                    url.contains("googlevideo.com") || url.contains("doubleclick.net") ||
                    url.contains("google.com")
                ) {
                    return false
                }

                // 외부 사이트만 기본 브라우저 띄우기
                try {
                    val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(browserIntent)
                    return true
                } catch (e: Exception) {
                    e.printStackTrace()
                }

                return false
            }
        }

        webView.webChromeClient = object : WebChromeClient() {

            override fun onJsAlert(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("예톡 알림")
                    .setMessage(message ?: "")
                    .setPositiveButton("확인") { _, _ -> result?.confirm() }
                    .setCancelable(false)
                    .show()
                return true
            }

            override fun onJsConfirm(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("예톡 확인")
                    .setMessage(message ?: "")
                    .setPositiveButton("확인") { _, _ -> result?.confirm() }
                    .setNegativeButton("취소") { _, _ -> result?.cancel() }
                    .setCancelable(false)
                    .show()
                return true
            }

            override fun onPermissionRequest(request: PermissionRequest?) {
                runOnUiThread {
                    try {
                        request?.grant(request.resources)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }

            override fun onShowFileChooser(
                view: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                sendFileChooserResult(null)
                this@MainActivity.filePathCallback = filePathCallback

                try {
                    checkAndRequestCameraPermission()

                    val imageDir = File(cacheDir, "images").apply { if (!exists()) mkdirs() }
                    val photoFile = File(imageDir, "camera_capture_${System.currentTimeMillis()}.jpg")
                    val photoUri = FileProvider.getUriForFile(
                        this@MainActivity,
                        "${applicationContext.packageName}.fileprovider",
                        photoFile
                    )
                    cameraImageUri = photoUri

                    val captureIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                        putExtra(MediaStore.EXTRA_OUTPUT, photoUri)
                        addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION or Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }

                    val pickIntent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                        type = "image/*"
                        addCategory(Intent.CATEGORY_OPENABLE)
                    }
                    val chooserIntent = Intent(Intent.ACTION_CHOOSER).apply {
                        putExtra(Intent.EXTRA_INTENT, pickIntent)
                        putExtra(Intent.EXTRA_TITLE, "통장 사본 / 계좌 QR 촬영 또는 갤러리 선택")
                        putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(captureIntent))
                    }
                    isReturningFromChooser = true
                    fileChooserLauncher.launch(chooserIntent)
                    return true
                } catch (e: Exception) {
                    e.printStackTrace()
                    this@MainActivity.filePathCallback = null
                    return false
                }
            }
        }
    }

    inner class AndroidBridge {

        @JavascriptInterface
        fun launchApp(target: String) {
            runOnUiThread {
                val packageName = when (target) {
                    "kakaotalk" -> "com.kakao.talk"
                    "instagram" -> "com.instagram.android"
                    "coupang" -> "com.coupang.mobile"
                    "naver" -> "com.nhn.android.search"
                    "chatgpt" -> "com.openai.chatgpt"
                    "bible" -> "kr.co.GoodTVBible"
                    else -> null
                }
                if (packageName != null) {
                    launchInstalledAppOrMarket(packageName)
                }
            }
        }

        @JavascriptInterface
        fun launchCoupangDirect() {
            runOnUiThread {
                launchInstalledAppOrMarket("com.coupang.mobile")
            }
        }

        // 🌟 [핵심 수정] 나에게만 가지 않고 '친구/대화방 선택 창'이 반드시 뜨도록 설정
        @JavascriptInterface
        fun shareToKakaoFriends(message: String) {
            runOnUiThread {
                try {
                    // 카카오톡 친구/대화방 선택 화면(피커)을 바로 호출하는 인텐트
                    val kakaoPickerIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_TEXT, message)
                        setClassName("com.kakao.talk", "com.kakao.talk.activity.friend.picker.QuickForwardActivity")
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    }
                    startActivity(kakaoPickerIntent)
                } catch (e: Exception) {
                    try {
                        // 대안 1: 카카오톡 일반 공유 인텐트
                        val kakaoIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, message)
                            setPackage("com.kakao.talk")
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        }
                        startActivity(kakaoIntent)
                    } catch (e2: Exception) {
                        // 대안 2: 시스템 공유기 (친구 선택창)
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, message)
                        }
                        val chooser = Intent.createChooser(shareIntent, "예톡 초청장 보낼 친구 선택").apply {
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        }
                        startActivity(chooser)
                    }
                }
            }
        }

        @JavascriptInterface
        fun openCamera() {
            runOnUiThread {
                try {
                    checkAndRequestCameraPermission()

                    val imageDir = File(cacheDir, "images").apply { if (!exists()) mkdirs() }
                    val photoFile = File(imageDir, "camera_capture_${System.currentTimeMillis()}.jpg")
                    val photoUri = FileProvider.getUriForFile(
                        this@MainActivity,
                        "${applicationContext.packageName}.fileprovider",
                        photoFile
                    )
                    cameraImageUri = photoUri

                    val captureIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                        putExtra(MediaStore.EXTRA_OUTPUT, photoUri)
                        addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION or Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }
                    isReturningFromChooser = true
                    fileChooserLauncher.launch(captureIntent)
                } catch (e: Exception) {
                    e.printStackTrace()
                    android.widget.Toast.makeText(this@MainActivity, "카메라를 실행할 수 없습니다.", android.widget.Toast.LENGTH_SHORT).show()
                }
            }
        }

        @JavascriptInterface
        fun setLockKeepAudio(enable: Boolean) {
            runOnUiThread {
                isLockAudioKept = enable
                if (enable) {
                    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                } else {
                    window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                }
            }
        }
    }

    private fun launchInstalledAppOrMarket(packageName: String) {
        try {
            val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                startActivity(launchIntent)
                return
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        try {
            val directIntent = Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
                setPackage(packageName)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
            }
            startActivity(directIntent)
            return
        } catch (e: Exception) {
            e.printStackTrace()
        }

        try {
            val marketIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$packageName")).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(marketIntent)
        } catch (e: Exception) {
            try {
                val webMarketIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=$packageName")).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                startActivity(webMarketIntent)
            } catch (e2: Exception) {
                e2.printStackTrace()
            }
        }
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()

        if (isReturningFromChooser) {
            isReturningFromChooser = false
            return
        }

        val currentUrl = webView.url ?: ""
        if (!currentUrl.contains("index.html")) {
            webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
        } else {
            webView.evaluateJavascript(
                "javascript:if(window.returnToFirstMainPortal){window.returnToFirstMainPortal();}else if(window.resetToFirstHomeScreen){window.resetToFirstHomeScreen();}",
                null
            )
        }
    }

    override fun onPause() {
        super.onPause()
        if (!isLockAudioKept) {
            webView.onPause()
        }
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}