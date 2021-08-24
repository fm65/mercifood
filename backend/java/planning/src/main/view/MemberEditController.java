package view;

import database.Database;

import javafx.fxml.FXML;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import models.Member;

import java.io.FileNotFoundException;

public class MemberEditController {
    @FXML
    private TextField nameField;

    private Stage dialogStage;
    private Member member;
    private boolean okClicked = false;

    @FXML
    private void initialize() {
    }

    public void setDialogStage(Stage dialogStage) {
        this.dialogStage = dialogStage;
    }

    public void setMember(Member member) {
        this.member = member;
        nameField.setText(member.getName());
    }

    public boolean isOkClicked() {
        return okClicked;
    }

    @FXML
    private void handleOk() throws Exception {
        int memberId = Database.getMemberId(member.getName());

        if(nameField.getText() != null) {
            member.setName(nameField.getText());
            String nameRequest = "UPDATE member SET name = '"+nameField.getText()+"' WHERE id_member = "+memberId+";";
            Database.update(nameRequest);
        }

        okClicked = true;
        dialogStage.close();
    }

    @FXML
    private void handleCancel() {
        dialogStage.close();
    }
}
