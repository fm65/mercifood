import database.Database;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintWriter;

public class AppInterface extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception{
        PrintWriter printWriter = new PrintWriter (new FileOutputStream(new File("logs.txt"), true));
        try {
            printWriter.println("coucou");
            Database.setup();
            Parent root = FXMLLoader.load(getClass().getResource("view/Connexion.fxml"));
            primaryStage.setTitle("Connexion");
            primaryStage.setScene(new Scene(root));
            primaryStage.show();

        } catch (Exception e){
            printWriter.println(e);
            printWriter.close ();
        }
    }

    public static void main(String[] args) {
        launch(args);
    }




}
