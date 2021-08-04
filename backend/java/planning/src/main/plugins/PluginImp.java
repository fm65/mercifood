package plugins;

public class PluginImp implements Plugin {
    @Override
    public boolean load() {
        System.out.println("Plugin loaded");
        return true;
    }
}
