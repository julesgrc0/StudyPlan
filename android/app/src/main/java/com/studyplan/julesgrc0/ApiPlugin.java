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
    public ApiPlugin()
    {

    }

    /*private  String getExecutionString(String url) {
        try {
            URL requestUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("GET");
            connection.setInstanceFollowRedirects(true);

            if (connection.getResponseCode() == HttpURLConnection.HTTP_OK)
            {
                connection.disconnect();
                return null;
            }

            String htmlContent = this.readConnection(connection);
            if (htmlContent == null) {
                connection.disconnect();
                return null;
            }

            Pattern pattern = Pattern.compile("name=\"execution\"\\s+value=\"([^\"]+)\"\\s*");
            Matcher matcher = pattern.matcher(htmlContent);
            if (matcher.find() && matcher.groupCount() >= 1)
            {
                return matcher.group(1);
            }
            connection.disconnect();
        } catch (IOException ignored) {
        }
        return null;
    }

    private String getSession(String url, String username, String password)
    {
        String execution = this.getExecutionString(url);
        if (execution == null) return null;

        try {
            URL requestUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("POST");
            connection.setInstanceFollowRedirects(true);

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
    }*/
    private String getSession(String url, String username, String password)
    {
        try{
            Thread.sleep(500);
        }catch (Exception ignored) {}
        return "session";
    }

    private String getCalendarData(String base_url, int projectId, int resourceId, String date) {
        try {
            String url = base_url +
                    "?resources=" + resourceId +
                    "&projectId=" + projectId +
                    "&calType=ical" +
                    "&firstDate=" +  date +
                    "&lastDate=" + date;

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
                call.getInt("projectId"),
                call.getInt("resourceId"),
                call.getString("date"));

        JSObject ret = new JSObject();
        ret.put("data", data);
        call.resolve(ret);
    }
}



