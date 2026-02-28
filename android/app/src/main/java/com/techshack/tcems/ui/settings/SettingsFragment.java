package com.techshack.tcems.ui.settings;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Switch;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.datastore.preferences.core.Preferences;
import androidx.datastore.core.DataStore;
import androidx.fragment.app.Fragment;
import com.techshack.tcems.R;

/**
 * Settings Fragment - User preferences and app configuration
 */
public class SettingsFragment extends Fragment {

    private Switch notificationsSwitch;
    private Button clearDataButton;

    public SettingsFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_settings, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        notificationsSwitch = view.findViewById(R.id.notifications_switch);
        clearDataButton = view.findViewById(R.id.clear_data_button);

        // Load preferences
        loadPreferences();

        // Set listeners
        notificationsSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            savePreference("notifications_enabled", isChecked);
        });

        clearDataButton.setOnClickListener(v -> clearAllData());
    }

    private void loadPreferences() {
        // TODO: Load preferences from DataStore
        notificationsSwitch.setChecked(true);
    }

    private void savePreference(String key, boolean value) {
        // TODO: Save preference using DataStore
        Toast.makeText(requireContext(), "Preference saved", Toast.LENGTH_SHORT).show();
    }

    private void clearAllData() {
        if (getContext() != null) {
            // TODO: Clear app data using DataStore
            Toast.makeText(requireContext(), "Data cleared", Toast.LENGTH_SHORT).show();
        }
    }
}
