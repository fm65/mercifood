import database.Database;

import java.io.PrintWriter;
import java.sql.*;

import java.io.IOException;

public class App {

    public static void main(String[] args) throws ClassNotFoundException, IOException, SQLException {

        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {

        /*
        Data recovering and application starting
        */
            Database.setup();
            System.out.println(Database.getHome().start().getProjects());
        } catch (ClassNotFoundException e) {
            printWriter.println(e);
            printWriter.close ();
        }

    }
}

