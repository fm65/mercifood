package view;

import database.Database;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.AnchorPane;
import javafx.stage.FileChooser;
import javafx.stage.Modality;
import javafx.stage.Stage;
import models.Member;
import models.Project;
import models.Task;
import plugins.Plugin;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.net.URLClassLoader;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.jar.JarFile;

public class HomeController {
    static final String PLUGIN_FOLDER = "plugins";

    @FXML
    private TableView<Project> tableView_project;

    @FXML
    private javafx.scene.control.TableColumn<Project, String> projects_project_column;

    @FXML
    private Label name_project_label;

    @FXML
    private Label deadline_project_label;

    @FXML
    private Label nextAppointment_project_label;

    @FXML
    private Label members_project_label;

    @FXML
    private Label tasks_project_label;

    @FXML
    private Button new_project_btn;

    @FXML
    private Button edit_project_btn;

    @FXML
    private Button delete_project_btn;

    @FXML
    private ButtonBar button_bar_place = new ButtonBar();

    @FXML
    private Button print_btn;

    @FXML
    private Button add_plugin_btn;

    @FXML
    private Label label_place;


    @FXML
    private void initialize() {
        /*
        Set the projects table
         */
        projects_project_column = new TableColumn<>();
        projects_project_column.setCellValueFactory(cellData -> cellData.getValue().nameProperty());

        tableView_project.getColumns().add(projects_project_column);
        tableView_project.setItems(Database.getProjectsView());

        /*
        Clear project details
         */
        showProjectDetails(null);

        /*
        Display project after click
         */
        tableView_project.getSelectionModel().selectedItemProperty().addListener(
                (observable, oldValue, newValue) -> showProjectDetails(newValue));
    }

    public void showProjectDetails(Project project) {

        if (project != null) {
            name_project_label.setText(project.getName());
            deadline_project_label.setText(project.getDeadline() != null ? project.getDeadline().toString() : "");
            nextAppointment_project_label.setText(project.getNextAppointment() != null ? project.getNextAppointment().toString() : "");

            String membersNames = "";
            for (Member member : project.getMembers()) {
                membersNames += " - " + member.getName() + "\n";
            }
            members_project_label.setText("\n" + membersNames + "\n");

            String tasksNames = "";
            for (Task task : project.getTasks()) {
                tasksNames += " - " + task.getName() + "\n";
            }
            tasks_project_label.setText("\n" + tasksNames + "\n");

        } else {
            name_project_label.setText("");
            deadline_project_label.setText("");
            nextAppointment_project_label.setText("");
            tasks_project_label.setText("");
            members_project_label.setText("");
        }
    }

    @FXML
    private void handleNewProject() throws IOException, SQLException {
        PrintWriter printWriter = new PrintWriter("logs.txt");
        try {
            Project newProject = new Project("New Project");

            String sql = "INSERT INTO project (name, deadline, nextAppointment, id_home) VALUES ('" + newProject.getName() + "', " + null + ", " + null + ", 1);";
            Database.insertInto(sql);

            boolean okClicked = HomeController.showProjectEdit(newProject);
            if (okClicked) {
                Database.getProjectsView().add(newProject);
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }

    }

    @FXML
    private void handleEditProject() throws IOException {
        Project selectedProject = tableView_project.getSelectionModel().getSelectedItem();
        if (selectedProject != null) {
            boolean okClicked = showProjectEdit(selectedProject);
            if (okClicked) {
                this.showProjectDetails(selectedProject);
            }

        }
    }

    @FXML
    private void handleDeleteProject() throws Exception {
        PrintWriter printWriter = new PrintWriter("logs.txt");
        try {
            int selectedIndex = tableView_project.getSelectionModel().getSelectedIndex();
            Project project = tableView_project.getSelectionModel().getSelectedItem();

            if (selectedIndex >= 0) {
                tableView_project.getItems().remove(selectedIndex);
                Database.getHome().removeProject(project);
            } else {
                System.out.println("No projects");
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }

    }

    @FXML
    private void handleAddAPlugin() throws Exception {
        PrintWriter printWriter = new PrintWriter("logs.txt");
        try {
            Stage mainStage = new Stage();
            FileChooser fileChooser = new FileChooser();
            fileChooser.setTitle("Open Resource File");
            fileChooser.getExtensionFilters().addAll(
                    new FileChooser.ExtensionFilter("Jar Files", "*.jar"));
            File selectedFile = fileChooser.showOpenDialog(mainStage);
            if (selectedFile != null) {
                loadPlugin(selectedFile);
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }

    }

    private void loadPlugin(File file) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter("logs.txt");
        try {
            ArrayList<URL> urls = new ArrayList<>();
            ArrayList<String> classes = new ArrayList<>();

            JarFile jarFile = new JarFile(file);
            urls.add(new URL("jar:file:" + PLUGIN_FOLDER + "/" + file.getName() + "!/"));
            jarFile.stream().forEach(jarEntry -> {
                if (jarEntry.getName().endsWith(".class")) {
                    classes.add(jarEntry.getName());
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

                                    Project project = tableView_project.getSelectionModel().getSelectedItem();
                                    System.out.println("Loaded plugin successfully");
                                    Button button = plugin.getPluginButton();

                                    ButtonBar.setButtonData(button, ButtonBar.ButtonData.YES);
                                    button_bar_place.getButtons().removeAll();
                                    button_bar_place.getButtons().add(button);
                                    plugin.setProject(project);

                                    break;
                                }
                            }
                        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | NoSuchMethodException | InvocationTargetException e) {
                            e.printStackTrace();
                        }
                    });
            System.out.println("Application stopped.");
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    @FXML
    public static boolean showProjectEdit(Project project) throws IOException {
        PrintWriter printWriter = new PrintWriter("logs.txt");
        try {
            // Load the fxml file and create a new stage for the popup dialog.
            FXMLLoader loader = new FXMLLoader();
            loader.setLocation(ProjectEditController.class.getResource("ProjectEdit.fxml"));
            AnchorPane page = (AnchorPane) loader.load();

            // Create the dialog Stage.
            Stage dialogStage = new Stage();
            dialogStage.setTitle("Edit Project");
            dialogStage.initModality(Modality.WINDOW_MODAL);
            Scene scene = new Scene(page);
            dialogStage.setScene(scene);

            // Set the person into the controller.
            ProjectEditController controller = loader.getController();
            controller.setDialogStage(dialogStage);
            controller.setProject(project);

            // Show the dialog and wait until the user closes it
            dialogStage.showAndWait();
            return controller.isOkClicked();
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
            return false;
        }
    }

}
