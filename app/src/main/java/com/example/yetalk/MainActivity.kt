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
                webView.evaluateJavascript("javascript:(function(){ if (window.handleAppBackPress && window.handleAppBackPress()) return 'handled'; return 'not_handled'; })()") { result ->
                    if (result == "\"handled\"" || result == "handled") {
                        return@evaluateJavascript
                    }
                    if (webView.canGoBack()) {
                        webView.goBack()
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

        // 유튜브 150/153 차단 방지 및 고속 재생용 실제 도메인 가상 HTTPS 매핑
        WebView.setWebContentsDebuggingEnabled(true)
        val rawUrl = intent?.dataString
        val targetInitialUrl = resolveYetalkTargetUrl(rawUrl)
        webView.loadUrl(targetInitialUrl)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        setIntent(intent)
        val rawUrl = intent?.dataString
        if (!rawUrl.isNullOrBlank()) {
            val resolvedUrl = resolveYetalkTargetUrl(rawUrl)
            webView.loadUrl(resolvedUrl)
        } else {
            // 앱 아이콘 또는 런처를 통해 재실행되었을 경우 항상 예톡 TV 홈(index.html)으로 시작
            webView.loadUrl("https://yetalk.cc/assets/index.html")
        }
    }

    private fun resolveYetalkTargetUrl(rawUrl: String?): String {
        if (rawUrl.isNullOrBlank()) {
            return "https://yetalk.cc/assets/index.html"
        }
        val trimmed = rawUrl.trim()
        if (trimmed.startsWith("yetalk://") ||
            trimmed == "https://yetalk.cc" || trimmed == "https://yetalk.cc/" ||
            trimmed == "http://yetalk.cc" || trimmed == "http://yetalk.cc/"
        ) {
            return "https://yetalk.cc/assets/onemain.html"
        }
        if (trimmed.startsWith("https://yetalk.cc/assets/") || trimmed.startsWith("https://yetalk.kr/assets/")) {
            return trimmed
        }
        if (trimmed.startsWith("http://yetalk.cc/assets/") || trimmed.startsWith("http://yetalk.kr/assets/")) {
            return trimmed.replace("http://", "https://")
        }
        if (trimmed.startsWith("https://yetalk.cc/") || trimmed.startsWith("http://yetalk.cc/")) {
            val sub = trimmed.substringAfter("yetalk.cc/").trimStart('/')
            return if (sub.isEmpty()) "https://yetalk.cc/assets/onemain.html" else "https://yetalk.cc/assets/$sub"
        }
        return trimmed
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

        val assetLoaderYetalkCc = WebViewAssetLoader.Builder()
            .setDomain("yetalk.cc")
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        val assetLoaderYetalk = WebViewAssetLoader.Builder()
            .setDomain("yetalk.kr")
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        val assetLoaderDefault = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.addJavascriptInterface(AndroidBridge(), "AndroidBridge")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                val url = request?.url ?: return null
                return assetLoaderYetalkCc.shouldInterceptRequest(url)
                    ?: assetLoaderYetalk.shouldInterceptRequest(url)
                    ?: assetLoaderDefault.shouldInterceptRequest(url)
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

                // 앱 내부 도메인 및 가상 자산은 앱 안에서 유지
                if (url.startsWith("https://yetalk.cc") ||
                    url.startsWith("https://yetalk.kr") ||
                    url.startsWith("https://appassets.androidplatform.net")
                ) {
                    return false
                }

                // 유튜브 웹페이지 직접 이동은 외부 브라우저/유튜브 앱으로 열어 예톡 메인 화면 보호
                if (url.contains("youtube.com") || url.contains("youtu.be")) {
                    try {
                        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(browserIntent)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                    return true
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

        // 🌟 [핵심 수정] 카카오톡 친구/대화방 선택(피커) 창을 열고, 초대 문구와 yetalk.cc 링크를 온전히 전달
        @JavascriptInterface
        fun shareToKakaoFriends(message: String) {
            shareToKakaoDirect(message)
        }

        @JavascriptInterface
        fun shareToKakaoWithQr(message: String, qrUrl: String?) {
            // 카카오톡 ACTION_SEND는 image/* 전송 시 Intent.EXTRA_TEXT(문구 및 링크)를 완전히 무시하고 버립니다.
            // 따라서 친구가 터치했을 때 개인앱이 열리려면 반드시 text/plain 형식으로 링크와 문구가 카톡 방에 전달되어야 합니다.
            shareToKakaoDirect(message)
        }

        private fun shareToKakaoDirect(message: String) {
            runOnUiThread {
                try {
                    // 카카오톡 친구/채팅방 선택 피커 액티비티 직통 호출
                    val kakaoIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_TEXT, message)
                        setClassName("com.kakao.talk", "com.kakao.talk.activity.RecentExcludeIntentFilterActivity")
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    startActivity(kakaoIntent)
                } catch (e: Exception) {
                    try {
                        val fallbackIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, message)
                            setPackage("com.kakao.talk")
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        }
                        startActivity(fallbackIntent)
                    } catch (e2: Exception) {
                        try {
                            val chooserIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_TEXT, message)
                            }
                            startActivity(Intent.createChooser(chooserIntent, "예톡 모바일 초청장 보내기"))
                        } catch (e3: Exception) {
                            e3.printStackTrace()
                        }
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