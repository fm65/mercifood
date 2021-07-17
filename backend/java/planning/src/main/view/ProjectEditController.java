package view;

import database.Database;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;
import models.Project;
import models.Task;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDate;

public class ProjectEditController {

    @FXML
    private TextField nameField;

    @FXML
    private TextField deadlineField;

    @FXML
    private TextField nextAppointmentField;

    @FXML
    private Button edit_task_btn;

    @FXML
    private Button edit_member_btn;

    private Stage dialogStage;
    private Project project;
    private boolean okClicked = false;

    @FXML
    private void initialize() {
    }

    public void setDialogStage(Stage dialogStage) {
        this.dialogStage = dialogStage;
    }

    public void setProject(Project project) {
        this.project = project;
        nameField.setText(project.getName());
        deadlineField.setText(project.getDeadline() != null ? project.getDeadline().toString() : null);
        nextAppointmentField.setText(project.getNextAppointment() != null ? project.getNextAppointment().toString() : null);
    }

    public boolean isOkClicked() {
        return okClicked;
    }

    @FXML
    private void handleOk() throws SQLException, FileNotFoundException {
        int projectId = Database.getProjectId(project.getName());

        if(nameField.getText() != null) {
            project.setName(nameField.getText());
            String nameRequest = "UPDATE project SET name = '"+nameField.getText()+"' WHERE id_project = "+projectId+";";
            Database.update(nameRequest);
        }

        if(deadlineField.getText() != null) {
            project.setDeadline(LocalDate.parse(deadlineField.getText()));
            String deadlineRequest = "UPDATE project SET deadline = '"+LocalDate.parse(deadlineField.getText())+"' WHERE id_project = "+projectId+";";
            Database.update(deadlineRequest);
        } else {
            project.setDeadline(null);
            String deadlineRequest = "UPDATE project SET deadline = "+null+" WHERE id_project = "+projectId+";";
            Database.update(deadlineRequest);
        }

        if(nextAppointmentField.getText() != null) {
            project.setNextAppointment(LocalDate.parse(nextAppointmentField.getText()));
            String nextAppointmentRequest = "UPDATE project SET nextAppointment = '" + LocalDate.parse(nextAppointmentField.getText()) + "' WHERE id_project = " + projectId + ";";
            Database.update(nextAppointmentRequest);
        } else {
            project.setNextAppointment(null);
            String nextAppointmentRequest = "UPDATE project SET nextAppointment = " +null+ " WHERE id_project = " + projectId + ";";
            Database.update(nextAppointmentRequest);
        }
        okClicked = true;
        dialogStage.close();
    }

    @FXML
    private void handleCancel() {
        dialogStage.close();
    }

    @FXML
    private void handleEditTask() throws IOException, ClassNotFoundException {

        showTasks(this.project);
    }

    @FXML
    private void handleEditMember() throws IOException, ClassNotFoundException {

        showMembers(this.project);
    }

    @FXML
    public static void showTasks(Project project) throws IOException, ClassNotFoundException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(ProjectTasksController.class.getResource("ProjectTasks.fxml"));
        AnchorPane page = (AnchorPane) loader.load();


        Stage primaryStage = new Stage();
        primaryStage.setTitle(project.getName() + " Task List");
        primaryStage.setScene(new Scene(page));

        ProjectTasksController controller = loader.getController();

        controller.setStage(primaryStage);
        controller.setTasks(project);


        primaryStage.show();
    }

    @FXML
    public static void showMembers(Project project) throws IOException, ClassNotFoundException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(ProjectMembersController.class.getResource("ProjectMembers.fxml"));
        AnchorPane page = (AnchorPane) loader.load();


        Stage primaryStage = new Stage();
        primaryStage.setTitle(project.getName() + " Member List");
        primaryStage.setScene(new Scene(page));

        ProjectMembersController controller = loader.getController();

        controller.setStage(primaryStage);
        controller.setMembers(project);


        primaryStage.show();
    }
}
