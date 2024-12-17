package papricut.app.mobile;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

import com.google.android.gms.tasks.Task;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;
import com.google.android.material.snackbar.Snackbar;
import android.content.IntentSender;

public class MainActivity extends BridgeActivity {

  private AppUpdateManager appUpdateManager;
  private InstallStateUpdatedListener installStateUpdatedListener;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initialize AppUpdateManager
    appUpdateManager = AppUpdateManagerFactory.create(this);

    // Register InstallStateUpdatedListener
    installStateUpdatedListener = state -> {
      if (state.installStatus() == InstallStatus.DOWNLOADED) {
        // Show a Snackbar prompting the user to restart the app
        popupSnackbarForCompleteUpdate();
      }
    };
    appUpdateManager.registerListener(installStateUpdatedListener);

    // Start the update process
    Task<AppUpdateInfo> appUpdateInfoTask = appUpdateManager.getAppUpdateInfo();
    appUpdateInfoTask.addOnSuccessListener(appUpdateInfo -> {
      if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE &&
        appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
        try {
          appUpdateManager.startUpdateFlowForResult(
            appUpdateInfo,
            AppUpdateType.FLEXIBLE,
            this,
            100); // Request code for update
        } catch (IntentSender.SendIntentException e) {
          e.printStackTrace();
          // Handle the exception here
        }
      }
    });
  }

  @Override
  public void onResume() {
    super.onResume();

    // Check if an update is downloaded but not installed
    appUpdateManager.getAppUpdateInfo().addOnSuccessListener(appUpdateInfo -> {
      if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
        popupSnackbarForCompleteUpdate();
      }
    });
  }

  private void popupSnackbarForCompleteUpdate() {
    Snackbar snackbar = Snackbar.make(
      findViewById(R.id.activity_main_layout),
      "An update has been downloaded.",
      Snackbar.LENGTH_INDEFINITE
    );
    snackbar.setAction("RESTART", view -> appUpdateManager.completeUpdate());
    snackbar.show();
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    // Unregister the listener to avoid memory leaks
    if (appUpdateManager != null) {
      appUpdateManager.unregisterListener(installStateUpdatedListener);
    }
  }
}
