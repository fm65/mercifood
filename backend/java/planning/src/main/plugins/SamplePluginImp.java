package plugins;

public class SamplePluginImp implements Plugin {
    @Override
    public boolean load() {
        System.out.println("SamplePlugin loaded");
        return true;
    }
}
