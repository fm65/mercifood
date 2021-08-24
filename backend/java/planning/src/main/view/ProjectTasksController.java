package view;

import database.Database;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Modality;
import javafx.stage.Stage;
import models.Project;
import models.Task;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.time.LocalDate;

public class ProjectTasksController {
    @FXML
    private TableView<Task> tableView_task;

    @FXML
    private javafx.scene.control.TableColumn<Task, String> tasks_task_column;

    @FXML
    private Label name_task_label;

    @FXML
    private Label deadline_task_label;

    @FXML
    private Label creationDate_task_label;

    @FXML
    private Label state_task_label;

    @FXML
    private Label owner_task_label;

    @FXML
    private Label comment_task_label;

    @FXML
    private Button new_task_btn;

    @FXML
    private Button edit_task_btn;

    @FXML
    private Button delete_task_btn;

    private Project project;
    private Stage stage;

    public void setTasks(Project project) {
        this.project = project;

        tasks_task_column = new TableColumn<>();
        tasks_task_column.setCellValueFactory(cellData -> cellData.getValue().nameProperty());
        tableView_task.getColumns().add(tasks_task_column);
        tableView_task.setItems(this.project.getTasksView());

        showTaskDetails(null);

        tableView_task.getSelectionModel().selectedItemProperty().addListener(
                (observable, oldValue, newValue) -> showTaskDetails(newValue));

    }

    public void setStage(Stage stage) {
        this.stage = stage;

    }

    public void showTaskDetails(Task task)  {
        if(task != null) {
            name_task_label.setText(task.getName());
            deadline_task_label.setText(task.getDeadline() != null ? task.getDeadline().toString() : null);
            creationDate_task_label.setText(task.getCreationDate() != null ? task.getCreationDate().toString() : null);
            owner_task_label.setText(task.getOwner() != null ? task.getOwner().getName() : null);
            state_task_label.setText(task.getState().toString());
            comment_task_label.setText(task.getComment());
        } else {
            name_task_label.setText("");
            deadline_task_label.setText("");
            creationDate_task_label.setText("");
            owner_task_label.setText("");
            state_task_label.setText("");
            comment_task_label.setText("");

        }

    }

    @FXML
    private void handleNewTask() throws Exception {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            Task newTask = new Task("New Task");
            newTask.setProject(project);
            String sql = "INSERT INTO task (name, state, creationDate, deadline, comment, id_project) VALUES ('"+newTask.getName()+"', 'TODO', '"+ LocalDate.now().toString() +"', "+null+",'"+ ""+"', "+Database.getProjectId(project.getName())+");";
            Database.insertInto(sql);

            boolean okClicked = ProjectTasksController.showTaskEdit(newTask);
            if (okClicked) {
                project.getTasksView().add(newTask);
                project.newTask(newTask);
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }

    }

    @FXML
    private void handleDeleteTask() throws Exception {
        PrintWriter printWriter = new PrintWriter("logs.txt");
        try {
            int selectedIndex = tableView_task.getSelectionModel().getSelectedIndex();
            Task task = tableView_task.getSelectionModel().getSelectedItem();

            if (selectedIndex >= 0) {
                tableView_task.getItems().remove(selectedIndex);
                project.removeTask(task);
            } else {
                System.out.println("No tasks");
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }

    }

    @FXML
    private void handleEditProject() throws IOException {
        Task selectedTask = tableView_task.getSelectionModel().getSelectedItem();
        if (selectedTask != null) {
            boolean okClicked = showTaskEdit(selectedTask);
            if (okClicked) {
                this.showTaskDetails(selectedTask);
            }

        } else {
            System.out.println("Nothing selected");
        }
    }

    @FXML
    public static boolean showTaskEdit(Task task) throws IOException {
        PrintWriter printWriter = new PrintWriter("logs.txt");
        try {
            FXMLLoader loader = new FXMLLoader();
            loader.setLocation(ProjectEditController.class.getResource("TaskEdit.fxml"));
            AnchorPane page = (AnchorPane) loader.load();

            Stage dialogStage = new Stage();
            dialogStage.setTitle("Edit Task");
            dialogStage.initModality(Modality.WINDOW_MODAL);
            Scene scene = new Scene(page);
            dialogStage.setScene(scene);

            TaskEditController controller = loader.getController();
            controller.setDialogStage(dialogStage);
            controller.setTask(task);

            dialogStage.showAndWait();
            return controller.isOkClicked();
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
            return false;
        }
    }


}
