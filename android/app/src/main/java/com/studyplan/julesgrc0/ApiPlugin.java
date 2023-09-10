package com.studyplan.julesgrc0;

import android.util.Log;

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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@CapacitorPlugin(name="ApiPlugin")
public class ApiPlugin  extends Plugin {
    public ApiPlugin()
    {

    }
    private  String getExecutionString(String url) {
        try {
            URL requestUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("POST");
            connection.setInstanceFollowRedirects(false);

            if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder htmlContent = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    htmlContent.append(line);
                }
                reader.close();

                String regex = "name=\"execution\"\\s+value=\"([^\"]+)\"\\s*";
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(htmlContent.toString());

                if (matcher.find() && matcher.groupCount() >= 1) {
                    return matcher.group(1);
                }
            }
            connection.disconnect();
        } catch (IOException e) {
            Log.e("SessionManager", "Error getting execution string: " + e.getMessage());
        }
        return null;
    }
    private String getFormattedDate(Date date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        return dateFormat.format(date);
    }
    private String getSession(String url, String username, String password) {
        String execution = this.getExecutionString(url);
        if (execution == null) return null;

        try {
            URL requestUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("POST");
            connection.setInstanceFollowRedirects(false);

            connection.setDoOutput(true);
            connection.setRequestProperty("credentials", "include");

            StringBuilder postData = new StringBuilder();
            postData.append("username=").append(username);
            postData.append("&password=").append(password);
            postData.append("&execution=").append(execution);
            postData.append("&_eventId=submit");
            postData.append("&geolocation=");

            byte[] postDataBytes = postData.toString().getBytes("UTF-8");
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            connection.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
            connection.setRequestProperty("Accept-Language", "fr-FR");
            connection.setRequestProperty("Origin", url);

            OutputStream os = connection.getOutputStream();
            os.write(postDataBytes);
            os.flush();
            os.close();

            if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                String cookies = connection.getHeaderField("Set-Cookie");
                if (cookies != null && !cookies.isEmpty()) {
                    return cookies;
                }
            }
            connection.disconnect();
        } catch (IOException ignored) {}
        return null;
    }
    private String getCalendarData(String base_url, String session, int projectId, int resourceId, Date startDate, Date endDate) {
        try {
            String d0Str = this.getFormattedDate(startDate);
            String d1Str = this.getFormattedDate(endDate);

            String url = base_url +
                    "?resources=" + resourceId +
                    "&projectId=" + projectId +
                    "&calType=ical" +
                    "&firstDate=" + d0Str +
                    "&lastDate=" + d1Str;

            URL requestUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Cookie", session);

            if (connection.getResponseCode() == HttpURLConnection.HTTP_OK)
            {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder calendarData = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    calendarData.append(line);
                }
                reader.close();
                return calendarData.toString();
            }
            connection.disconnect();
        } catch (IOException ignored) {}
        return null;
    }

    @PluginMethod
    public void plugin_getSession(PluginCall call)
    {
        String session = this.getSession(
                call.getString("url"),
                call.getString("username"),
                call.getString("password"));

        JSObject ret = new JSObject();
        ret.put("session", session);
        call.resolve(ret);
    }

    @PluginMethod
    public void plugin_getCalendarData(PluginCall call)
    {
        String data = this.getCalendarData(
                call.getString("url"),
                call.getString("session"),
                call.getInt("projectId"),
                call.getInt("resourceId"),
                new Date(call.getLong("startDate")),
                new Date(call.getLong("endDate"))
                );

        JSObject ret = new JSObject();
        ret.put("data", data);
        call.resolve(ret);
    }
}



