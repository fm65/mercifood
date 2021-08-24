package view;

import database.Database;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Modality;
import javafx.stage.Stage;
import models.Member;
import models.Project;
import models.Task;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.time.LocalDate;

public class ProjectMembersController {
    @FXML
    private TableView<Member> tableView_member;

    @FXML
    private javafx.scene.control.TableColumn<Member, String> members_member_column;

    @FXML
    private Label name_member_label;

    @FXML
    private Label tasks_member_label;

    @FXML
    private Button new_member_btn;

    @FXML
    private Button edit_member_btn;

    @FXML
    private Button delete_member_btn;

    private Project project;
    private Stage stage;

    public void setMembers(Project project) {
        this.project = project;

        members_member_column = new TableColumn<>();
        members_member_column.setCellValueFactory(cellData -> cellData.getValue().nameProperty());
        tableView_member.getColumns().add(members_member_column);
        tableView_member.setItems(this.project.getMembersView());

        showMemberDetails(null);

        tableView_member.getSelectionModel().selectedItemProperty().addListener(
                (observable, oldValue, newValue) -> showMemberDetails(newValue));

    }

    public void setStage(Stage stage) {
        this.stage = stage;

    }

    public void showMemberDetails(Member member)  {
        if(member != null) {
            name_member_label.setText(member.getName());

            String tasksNames = "";
            for(Task task:member.getTasks()) {
                tasksNames += " - " + task.getName() + "\n";
            }
            tasks_member_label.setText("\n" + tasksNames + "\n");
        } else {
            name_member_label.setText("");
            tasks_member_label.setText("");
        }

    }

    @FXML
    private void handleNewMember() throws Exception {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            Member newMember = new Member("New Member");
            newMember.setProject(project);
            String sql = "INSERT INTO member (name, id_project) VALUES ('"+newMember.getName()+"', "+ Database.getProjectId(project.getName())+");";
            Database.insertInto(sql);

            boolean okClicked = ProjectMembersController.showMemberEdit(newMember);
            if (okClicked) {
                project.getMembersView().add(newMember);
                project.newMember(newMember);
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }

    }

    @FXML
    private void handleDeleteMember() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        try {
            int selectedIndex = tableView_member.getSelectionModel().getSelectedIndex();
            Member member = tableView_member.getSelectionModel().getSelectedItem();

            if (selectedIndex >= 0) {
                tableView_member.getItems().remove(selectedIndex);

                    project.removeMember(member);

            } else {
                System.out.println("No members");
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    @FXML
    private void handleEditMember() throws IOException {
        Member selectedMember = tableView_member.getSelectionModel().getSelectedItem();
        if (selectedMember != null) {
            boolean okClicked = showMemberEdit(selectedMember);
            if (okClicked) {
                this.showMemberDetails(selectedMember);
            }

        } else {
            System.out.println("Nothing selected");
        }
    }

    @FXML
    public static boolean showMemberEdit(Member member) throws IOException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            FXMLLoader loader = new FXMLLoader();
            loader.setLocation(ProjectEditController.class.getResource("MemberEdit.fxml"));
            AnchorPane page = (AnchorPane) loader.load();

            Stage dialogStage = new Stage();
            dialogStage.setTitle("New Member");
            dialogStage.initModality(Modality.WINDOW_MODAL);
            Scene scene = new Scene(page);
            dialogStage.setScene(scene);

            // Set the person into the controller.
            MemberEditController controller = loader.getController();
            controller.setDialogStage(dialogStage);
            controller.setMember(member);

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
