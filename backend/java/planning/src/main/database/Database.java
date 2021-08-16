package database;

import models.*;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

import java.awt.*;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.sql.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Database {


    /*
    Database attributes
     */
    private static String user = "root";
    private static String password = "root";
    private static String db = "home_projects";
    private static Integer port = 3306;
    private static Connection connection;
    private static Statement statement;

    private static ArrayList<Account> accounts;
    private static Home home = new Home();
    private static ArrayList<Project> projects;
    private static ArrayList<Member> members;
    private static ArrayList<Task> tasks;

    /*
    JavaFx Nodes
     */
    private static ObservableList<Project> projectsView = FXCollections.observableArrayList();


    /*
    Accessors
     */
    public static Home getHome() {
        return home;
    }

    public static ObservableList<Project> getProjectsView() {
        return projectsView;
    }

    public static ArrayList<Account> getAccounts() {
        return accounts;
    }

    /*
        Connection and database settings
         */
    public static void setup() throws FileNotFoundException, ClassNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        Class.forName("com.mysql.jdbc.Driver");
        String url = "jdbc:mysql://localhost:"+ port +"/" + db;
        try {
            connection = DriverManager.getConnection(url,user,password);
            statement = connection.createStatement();
            createTableAccount("account");
            createTableHome("home");
            createTableProject("project");
            createTableMember("member");
            createTableTask("task");
            insertIntoAccount();
            insertIntoHome();

           getOldData();

        } catch (SQLException | FileNotFoundException e) {
            printWriter.println(e);
        }
    }


    /*
    Tables Creation
     */
    public static void createTableAccount(String name) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        try {
            String sqlCreate = "CREATE TABLE IF NOT EXISTS " + name
                    + "  (id_user           INTEGER AUTO_INCREMENT primary key,"
                    + "name VARCHAR(20),"
                    + "password VARCHAR(20))";

            statement.execute(sqlCreate);
        } catch (SQLException e) {
            System.out.println(e);
            printWriter.println(e);
        }
    }

    public static void createTableHome(String name) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        try {
            String sqlCreate = "CREATE TABLE IF NOT EXISTS " + name
                + "  (id_home           INTEGER AUTO_INCREMENT,"
                + "name VARCHAR(20),"
                + "constraint primary key (id_home))";

            statement.execute(sqlCreate);
        } catch (SQLException e) {
            printWriter.println(e);
        }
    }

    public static void createTableProject(String name) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        try {
            String sqlCreate = "CREATE TABLE IF NOT EXISTS " + name
                + "  (id_project           INTEGER AUTO_INCREMENT,"
                + "  name           VARCHAR(30),"
                + "  deadline           VARCHAR(30),"
                + "  nextAppointment           VARCHAR(30),"
                + "   id_home INTEGER,"
                + "constraint primary key (id_project))";

            statement.execute(sqlCreate);
        } catch (SQLException e) {
            printWriter.println(e);
        }
    }

    public static void createTableMember(String name) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        try {
            String sqlCreate = "CREATE TABLE IF NOT EXISTS " + name
                + "  (id_member         INTEGER AUTO_INCREMENT,"
                + "  name           VARCHAR(30),"
                + "   id_project INTEGER,"
                + "constraint primary key (id_member),"
                + "constraint foreign key (id_project) references project(id_project))";

            statement.execute(sqlCreate);
        } catch (SQLException e) {
            printWriter.println(e);
        }
    }

    public static void createTableTask(String name) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        try {
            String sqlCreate = "CREATE TABLE IF NOT EXISTS " + name
                + "  (id_task           INTEGER AUTO_INCREMENT,"
                + "  name           VARCHAR(30),"
                + "  state           VARCHAR(30),"
                + "  creationDate           VARCHAR(30),"
                + "  deadline           VARCHAR(30),"
                + "  comment           VARCHAR(30),"
                + "   id_member INTEGER,"
                + "   id_project INTEGER,"
                + "constraint primary key (id_task),"
                + "constraint foreign key (id_project) references project(id_project),"
                + "constraint foreign key (id_member) references member(id_member))";

            statement.execute(sqlCreate);
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    public static void insertIntoAccount() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        try {
            statement.executeUpdate("REPLACE INTO account (id_user,name,password) VALUES (1,'guest','guest3AL')");
            statement.executeUpdate("REPLACE INTO account (id_user, name,password) VALUES (2, 'fidel','fidelm3AL')");
            statement.executeUpdate("REPLACE INTO account (id_user, name,password) VALUES (3, 'halisia','halisiah3AL')");
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    public static void insertIntoHome() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        try {
            statement.executeUpdate("REPLACE INTO home (id_home,name) VALUES (1,'3AL_projects')");
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }


    /*
    Import existing data in Home
     */
    public static void getOldData() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        String sql = "SELECT * FROM home";
        try {
            ResultSet result = statement.executeQuery(sql);

            while (result.next()) {
                home.setName(result.getString("name"));
            }

            getFromAccount();
            getFromProject(home);
            getFromMember();
            getFromTasks();

        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    public static void getFromAccount() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        accounts = new ArrayList<Account>();
        try {
            String sql = "SELECT * FROM account";
            ResultSet result = statement.executeQuery(sql);

            while ( result.next() ) {
                String user = result.getString("name");
                String password = result.getString("password");
                Account account = new Account(user, password);
                accounts.add(account);
            }

        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    public static void getFromProject(Home home) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        try {
            String sql = "SELECT * FROM project";
            ResultSet result = statement.executeQuery(sql);
            Project project;

            while ( result.next() ) {
                project = new Project("");
                project.setName(result.getString("name"));
                if(result.getString("nextAppointment") != null) {
                    project.setNextAppointment(LocalDate.parse(result.getString("nextAppointment")));
                }
                if(result.getString("deadline") != null) {

                        project.setDeadline(LocalDate.parse(result.getString("deadline")));

                }
                home.addProject(project);
                projectsView.add(project);
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    public static void getFromMember() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            for(Project project:home.getProjects()) {
                String sql = "SELECT * FROM member m,project p WHERE p.name ='"+ project.getName() +"' AND m.id_project = p.id_project";
                Statement st = connection.createStatement();

                ResultSet result = null;
                result = st.executeQuery(sql);

                Member member;
                while ( result.next() ) {
                    member = new Member("");
                    member.setName(result.getString("name"));
                    project.newMember(member);
                    project.getMembersView().add(member);
                }
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    public static void getFromTasks() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            for(Project project:home.getProjects()) {
                String sqlProject = "SELECT * FROM project p, task t WHERE p.name ='"+ project.getName() +"' AND t.id_project = p.id_project";
                Statement st = connection.createStatement();

                ResultSet result = st.executeQuery(sqlProject);
                Task task = null;
                while ( result.next() ) {
                    task = new Task("");
                    task.setName(result.getString("t.name"));
                    if(result.getString("t.deadline") != null) {
                        task.setDeadline(LocalDate.parse(result.getString("t.deadline")));
                    }
                    if(result.getString("t.creationDate") != null) {
                        task.setCreationDate(LocalDate.parse(result.getString("t.creationDate")));
                    }

                    task.setState(State.valueOf(result.getString("t.state")));
                    task.setComment(result.getString("t.comment"));

                    assign(task, result.getInt("t.id_task"), project);

                    project.newTask(task);
                    project.getTasksView().add(task);
                }
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    public static void assign(Task task, int taskId, Project project) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            String sqlMember = "SELECT * FROM member m, task t WHERE  t.id_task = "+taskId+" AND t.id_member = m.id_member ";
            Statement st = connection.createStatement();
            ResultSet result2 = st.executeQuery(sqlMember);
            while ( result2.next() ) {
                for(Member member:project.getMembers()) {
                    if(member.getName().equalsIgnoreCase(result2.getString("m.name"))) {

                        task.assignTo(member);
                    }
                }
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    /*
    Get data for plugins
     */
    public static Map<String,Integer> getTaskDays(Project currentProject) throws FileNotFoundException {

        Map<String,Integer> taskDays = new HashMap<>();

        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
                String sqlProject = "SELECT * FROM task WHERE id_project = "+ getProjectId(currentProject.getName());
                Statement st = connection.createStatement();


                ResultSet result = st.executeQuery(sqlProject);

                String taskName;
                LocalDate creationDate;
                LocalDate deadline;

                while ( result.next() ) {
                    if(result.getString("name") != null && result.getString("deadline") != null && result.getString("creationDate") != null) {
                        taskName = result.getString("name");
                        creationDate = LocalDate.parse(result.getString("creationDate"));
                        deadline = LocalDate.parse(result.getString("deadline"));

                        Integer daysBetween = (int)ChronoUnit.DAYS.between(creationDate, deadline);
                        taskDays.put(taskName, daysBetween);
                        System.out.println(taskName + " " +daysBetween);
                    }

                }

        } catch (Error | Exception e) {

            System.out.println(e);
            printWriter.println(e);
            printWriter.close();
        }
        return taskDays;

    }


    /*
    Others
     */
    public static int getProjectId(String name) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            int id = 0;
            String sql = "SELECT id_project FROM project WHERE name = '"+name+"'";
            ResultSet resultat = null;
            resultat = statement.executeQuery(sql);

            while ( resultat.next() ) {
                id = resultat.getInt("id_project");
            }
            return id;
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
            return 0;
        }
    }

    public static int getMemberId(String name) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            int id = 0;
            String sql = "SELECT id_member FROM member WHERE name = '"+name+"'";
            ResultSet resultat = statement.executeQuery(sql);
            while ( resultat.next() ) {
                id = resultat.getInt("id_member");
            }
            return id;
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
            return 0;
        }
    }

    public static int getTaskId(String name) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            int id = 0;
            String sql = "SELECT id_task FROM task WHERE name = '"+name+"'";
            ResultSet resultat = statement.executeQuery(sql);
            while ( resultat.next() ) {
                id = resultat.getInt("id_task");
            }
            return id;
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
            return 0;
        }
    }

    public static void insertInto(String sql) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            statement.executeUpdate(sql);
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }

    public static void update(String sql) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");
        try {
            statement.executeUpdate(sql);
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
    }


}
