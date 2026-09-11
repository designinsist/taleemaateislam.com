package com.taleemaateislam.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String LINK_HOST = "taleemaateislam.com";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NotificationTopicsPlugin.class);
        super.onCreate(savedInstanceState);
        // Cold start via an App Link (app not already running): the bridge just
        // loaded the default server.url, so navigate on to the specific page
        // the link pointed at, if any.
        navigateToDeepLink(getIntent());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // Warm start (app already running/backgrounded, singleTask reuses this
        // activity): the WebView is already showing something else, so route it.
        setIntent(intent);
        navigateToDeepLink(intent);
    }

    private void navigateToDeepLink(Intent intent) {
        if (intent == null || !Intent.ACTION_VIEW.equals(intent.getAction())) return;
        Uri data = intent.getData();
        if (data == null || !LINK_HOST.equals(data.getHost())) return;
        final String url = data.toString();
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().post(() -> getBridge().getWebView().loadUrl(url));
        }
    }
}
