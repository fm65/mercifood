package plugins;

import javafx.scene.control.Button;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.jar.JarFile;

public class AppPlugin {
    static final String PLUGIN_FOLDER = "plugins";

    public static void main(String[] args) {
        File pluginFolder = new File(PLUGIN_FOLDER);
        if (!pluginFolder.exists()) {
            if (pluginFolder.mkdirs()) {
                System.out.println("Created plugin folder");
            }
        }
        File[] files = pluginFolder.listFiles((dir, name) -> name.endsWith(".jar"));

        ArrayList<URL> urls = new ArrayList<>();
        ArrayList<String> classes = new ArrayList<>();
        if (files != null) {
            Arrays.stream(files).forEach(file -> {
                try {
                    JarFile jarFile = new JarFile(file);
                    urls.add(new URL("jar:file:" + PLUGIN_FOLDER + "/" + file.getName() + "!/"));
                    jarFile.stream().forEach(jarEntry -> {
                        if (jarEntry.getName().endsWith(".class")) {
                            classes.add(jarEntry.getName());
                        }
                    });
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            URLClassLoader pluginLoader = new URLClassLoader(urls.toArray(new URL[urls.size()]));
            classes.stream()
                    .forEach(s -> {
                try {
                    Class classs = pluginLoader.loadClass(s.replaceAll("/", ".").replace(".class", ""));
                    Class[] interfaces = classs.getInterfaces();
                    for (Class anInterface : interfaces) {

                        if (anInterface == Plugin.class) {
                            System.out.println(anInterface.getCanonicalName());
                            Plugin plugin = (Plugin) classs.getDeclaredConstructor().newInstance();
                           // Button fd = plugin.recuperetTrucJavaFx();


                            if (plugin.load()) {
                                System.out.println("Loaded plugin successfully");
                            }
                            break;
                        }
                    }
                } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | NoSuchMethodException | InvocationTargetException e) {
                    e.printStackTrace();
                }
            });
        }
        System.out.println("Application stopped.");
    }
}
