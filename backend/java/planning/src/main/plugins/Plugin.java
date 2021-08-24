package plugins;

import javafx.scene.control.Button;
import models.Project;

public interface Plugin {
    Button getPluginButton();

    void setProject(Project project);
}
