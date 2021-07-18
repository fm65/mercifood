package view;

import database.Account;
import database.Database;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import javax.xml.crypto.Data;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;

public class ConnexionController {
    @FXML
    private TextField userField;

    @FXML
    private PasswordField passwordField;

    @FXML
    private Button loginButton;

    @FXML
    private Label errorLabel;

    private Stage homeStage;

    @FXML
    private void initialize() {
    }


    @FXML
    private void handleOk() throws IOException {
        if(accountExists(userField.getText(), passwordField.getText())) {
            errorLabel.setText("");
            Parent root = FXMLLoader.load(getClass().getResource("Home.fxml"));
            homeStage = new Stage();
            homeStage.setTitle("Project Planning");
            homeStage.setScene(new Scene(root));
            homeStage.show();
        } else {
            errorLabel.setText("Unknown user");
        }
    }

    private boolean accountExists(String username, String password) {
        Account account = new Account(username, password);

        for(Account existingAccount:Database.getAccounts()) {
            if (existingAccount.getUser().equals(account.getUser())) {
                if(existingAccount.getPassword().equals(account.getPassword())) {
                    return true;
                }
            }
        }
        return false;
    }
}
