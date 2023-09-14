package com.studyplan.julesgrc0;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@CapacitorPlugin(name="ApiPlugin")
public class ApiPlugin  extends Plugin {
    public ApiPlugin() {
    }

    private String getCalendarData(String base_url, int projectId, int resourceId, String date) {
        try {
            String url = base_url+"?projectId="+ projectId + "&calType=ical&resources="+resourceId  +"&firstDate="+date+"&lastDate="+date;

            URL requestUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("GET");

            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder htmlContent = new StringBuilder();

            String line;
            while ((line = reader.readLine()) != null) {
                htmlContent.append(line).append("\n");
            }

            connection.disconnect();
            return htmlContent.toString();
        } catch (IOException ignored) {}
        return null;
    }

    @PluginMethod
    public void plugin_getCalendarData(PluginCall call)
    {
        String data = this.getCalendarData(
                call.getString("url"),
                call.getInt("projectId"),
                call.getInt("resourceId"),
                call.getString("date"));

        JSObject ret = new JSObject();
        ret.put("data", data);
        call.resolve(ret);
    }
}



