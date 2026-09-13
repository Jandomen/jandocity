package com.jandocity.app;

import android.os.Bundle;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Ventana contenida: nunca debajo de hora/senal ni de los 3 botones
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        // true = WebView NO se extiende bajo system bars, respeta barras opacas
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        if (controller != null) {
            controller.show(androidx.core.view.WindowInsetsCompat.Type.systemBars());
            controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_DEFAULT);
        }
        // Android 15 edge-to-edge: aplica padding top/bottom a content y al WebView
        try {
            androidx.core.view.ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content), (v, insets) -> {
                int top = insets.getInsets(androidx.core.view.WindowInsetsCompat.Type.statusBars()).top;
                int bottom = insets.getInsets(androidx.core.view.WindowInsetsCompat.Type.navigationBars()).bottom;
                // gestos vs 3 botones: ambos cubiertos con bottom
                v.setPadding(v.getPaddingLeft(), top, v.getPaddingRight(), bottom);
                // tambien asegura WebView interno si existe
                try {
                    if (getBridge() != null && getBridge().getWebView() != null) {
                        android.view.View wv = getBridge().getWebView();
                        wv.setPadding(wv.getPaddingLeft(), 0, wv.getPaddingRight(), 0);
                    }
                } catch (Exception ignored) {}
                return insets;
            });
        } catch (Exception e) {}
    }
}
