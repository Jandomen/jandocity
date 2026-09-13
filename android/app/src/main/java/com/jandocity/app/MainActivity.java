package com.jandocity.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private void applyImmersive() {
        View decor = getWindow().getDecorView();
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), decor);
        if (controller != null) {
            controller.hide(WindowInsetsCompat.Type.systemBars());
            controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // FULLSCREEN IMMERSIVE: WebView ocupa toda la ventana, edge-to-edge
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        // false = contenido se extiende bajo barras (edge-to-edge), nosotros gestionamos insets en CSS/JS
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        applyImmersive();

        // Mantener barras transparentes y re-aplicar recorte de notch/cutout
        try {
            androidx.core.view.ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content), (v, insets) -> {
                // No aplicamos padding nativo: dejamos que CSS env(safe-area-inset-*) + display-cutout maneje notch
                // Solo consumimos insets para que el sistema no reserve espacio opaco
                return WindowInsetsCompat.CONSUMED;
            });
        } catch (Exception e) {}
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyImmersive();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        applyImmersive();
    }
}
