package view;

import database.Database;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.Stage;
import models.Member;
import models.State;
import models.Task;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.time.LocalDate;

public class TaskEditController {
    @FXML
    private TextField nameField;

    @FXML
    private TextField deadlineField;

    @FXML
    private TextField ownerField;

    @FXML
    private TextField commentField;

    @FXML
    private Label errorField;

    @FXML
    private RadioButton doingButton;

    @FXML
    private RadioButton todoButton;

    @FXML
    private RadioButton doneButton;

    @FXML
    private Button edit_task_btn;

    @FXML
    private Button edit_member_btn;

    private Stage dialogStage;
    private Task task;
    private boolean okClicked = false;
    ToggleGroup group = new ToggleGroup();

    @FXML
    private void initialize() {
    }

    public void setDialogStage(Stage dialogStage) {
        this.dialogStage = dialogStage;
    }

    public void setTask(Task task) throws Exception {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        this.task = task;
        nameField.setText(task.getName());
        ownerField.setText(task.getOwner() != null ? task.getOwner().getName() : null);
        commentField.setText(task.getComment());
        deadlineField.setText(task.getDeadline() != null ? task.getDeadline().toString() : null);

        todoButton.setToggleGroup(group);
        doingButton.setToggleGroup(group);
        doneButton.setToggleGroup(group);

        switch(task.getState().toString()) {
            case "TODO":
                todoButton.setSelected(true);
                break;
            case "DOING":
                doingButton.setSelected(true);
                break;
            case "DONE":
                doneButton.setSelected(true);
                break;
        }

        group.selectedToggleProperty().addListener(new ChangeListener<Toggle>() {
            @Override
            public void changed(ObservableValue<? extends Toggle> ov, Toggle old_toggle, Toggle new_toggle) {
                // Has selection.
                if (group.getSelectedToggle() != null) {
                    RadioButton button = (RadioButton) group.getSelectedToggle();
                    task.setState(State.valueOf(button.getText()));
                    try {
                        String stateRequest = "UPDATE task SET state = '"+task.getState().toString()+"' WHERE id_task = "+ Database.getTaskId(task.getName())+";";
                        Database.update(stateRequest);
                    } catch (Error | Exception e) {
                        printWriter.println(e);
                        printWriter.close();
                    }

                }
            }
        });
    }

    public boolean isOkClicked() {
        return okClicked;
    }

    @FXML
    private void handleOk() throws Exception {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            Member oldOwner = task.getOwner();

            int taskId = Database.getTaskId(task.getName());
            boolean memberExists = false;
            if(nameField.getText() != null) {
                task.setName(nameField.getText());
                String nameRequest = "UPDATE task SET name = '"+nameField.getText()+"' WHERE id_task = "+taskId+";";
                Database.update(nameRequest);
            }

            if(ownerField.getText() != null) {
                Member member;
                for(Member existingMember:this.task.getProject().getMembers()) {
                    if(existingMember.getName().equalsIgnoreCase(ownerField.getText())) {
                        member = existingMember;
                        task.assignTo(member);
                        task.setProject(this.task.getProject());
                        memberExists = true;
                    }
                }
                if(ownerField.getText().equals("")) {
                    task.assignTo(null);
                    String memberRequest = "UPDATE task SET id_member = "+null+" WHERE id_task = "+taskId+";";
                    Database.update(memberRequest);
                    oldOwner.getTasks().clear();
                }

                if(task.getOwner() != null) {
                    int memberId = Database.getMemberId(task.getOwner().getName());
                    String memberRequest = "UPDATE task SET id_member = '"+memberId+"' WHERE id_task = "+taskId+";";
                    Database.update(memberRequest);
                }
                errorField.setText(memberExists ? "": "Member not exists");
            }

            if(todoButton.isSelected()) {
                task.setState(State.TODO);
                String stateRequest = "UPDATE task SET state = '"+task.getState().toString()+"' WHERE id_task = "+taskId+";";
                Database.update(stateRequest);
            }

            if(commentField.getText() != null) {
                task.setComment(commentField.getText());
                String commentRequest = "UPDATE task SET comment = '"+commentField.getText()+"' WHERE id_task = "+taskId+";";
                Database.update(commentRequest);
            }

            if(deadlineField.getText() != null ) {
                if(LocalDate.parse(deadlineField.getText()).isAfter(LocalDate.now()) || LocalDate.parse(deadlineField.getText()).isEqual(LocalDate.now())) {
                    task.setDeadline(LocalDate.parse(deadlineField.getText()));
                    String deadlineRequest = "UPDATE task SET deadline = '"+LocalDate.parse(deadlineField.getText())+"' WHERE id_task = "+taskId+";";
                    Database.update(deadlineRequest);
                }
            } else {
                task.setDeadline(null);
                String deadlineRequest = "UPDATE task SET deadline = "+null+" WHERE id_task = "+taskId+";";
                Database.update(deadlineRequest);
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }


        okClicked = true;
        dialogStage.close();
    }

    @FXML
    private void handleCancel() {
        dialogStage.close();
    }

}
