package com.studyplan.julesgrc0;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity
{
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        this.registerPlugin(ApiPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
