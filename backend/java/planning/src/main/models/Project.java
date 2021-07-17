package models;

import database.Database;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Project {

    /*
    Project attributes
     */
    private String name;
    private List<Task> tasks;
    private List<Member> members;
    private LocalDate deadline;
    private LocalDate nextAppointment;
    private Home home;

    /*
    JavaFX Nodes
     */
    private ObservableList<Task> tasksView = FXCollections.observableArrayList();
    private ObservableList<Member> membersView = FXCollections.observableArrayList();


    /*
    Constructor
     */
    public Project(String name) {
        this.name = name;
        this.tasks = new ArrayList<Task>();
        this.members = new ArrayList<Member>();
        this.home = new Home();
    }


    /*
    Accessors
     */
    public void setName(String name) {
        this.name = name;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public LocalDate getNextAppointment() {
        return nextAppointment;
    }

    public void setNextAppointment(LocalDate nextAppointment) {
        this.nextAppointment = nextAppointment;
    }

    public String getName() {
        return name;
    }

    public void setHome(Home home) {
        this.home = home;
    }

    public List<Member> getMembers() {
        return members;
    }

    public StringProperty nameProperty() {
        return new SimpleStringProperty(name);
    }

    public ObservableList<Task> getTasksView() {
        return tasksView;
    }

    public ObservableList<Member> getMembersView() {
        return membersView;
    }

    /*
            User interactions
             */
    public void setName() throws FileNotFoundException {

        int projectId = Database.getProjectId(this.getName());
        System.out.println("Project name :");
        Scanner scanner = new Scanner( System.in );
        String choiceName = scanner.nextLine();
        this.setName(choiceName);

        String sql = "UPDATE project SET name = '"+choiceName+"' WHERE id_project = "+projectId+";";
        Database.insertInto(sql);
    }

    public static Project newProject() throws FileNotFoundException {

        System.out.println("Project name :");
        Scanner scanner = new Scanner( System.in );
        String choiceName = scanner.nextLine();
        Project newProject = new Project(choiceName);

        String sql = "INSERT INTO project (name, deadline, nextAppointment, id_home) VALUES ('"+choiceName+"', "+null+", "+null+", 1);";
        Database.insertInto(sql);
        return newProject.update();
    }

    public void setNextAppointment() throws FileNotFoundException {

        System.out.println("Which day ?");
        Scanner scannerDay = new Scanner( System.in );
        int dayChoice = scannerDay.nextInt();
        while(dayChoice > 31 || dayChoice < 1) {
            System.out.println("Please retry..");
            dayChoice = scannerDay.nextInt();
        }
        System.out.println("Which month ?");
        Scanner scannerMonth = new Scanner( System.in );
        int monthChoice = scannerMonth.nextInt();
        while(monthChoice > 12 || monthChoice < 1) {
            System.out.println("Please retry..");
            monthChoice = scannerMonth.nextInt();
        }
        System.out.println("Which year ?");
        Scanner scannerYear = new Scanner( System.in );
        int yearChoice = scannerYear.nextInt();
        while( yearChoice < LocalDate.now().getYear()) {
            System.out.println("Please retry..");
            yearChoice = scannerYear.nextInt();
        }

        this.nextAppointment = LocalDate.of(yearChoice, monthChoice, dayChoice);
        String sql = "UPDATE project SET nextAppointment = '"+this.nextAppointment.toString()+"' WHERE id_project = "+Database.getProjectId(this.name)+";";
        System.out.println(sql);
        Database.update(sql);
    }

    public String getTaskChoices() {
        String tasksList = "";
        int count = 1;
        for(Task task: tasks) {
            tasksList += count + ". " + task.toString();
            count++;
        }
        return tasksList;
    }


    public String getMemberChoices() {
        String choices = "";
        int count = 1;
        for(Member member:members) {
            choices += count + ". " + member.getName() + "\n";
            count++;
        }
        choices += count + ". No one";
        return choices;
    }

    public void setDeadline() throws FileNotFoundException {

        System.out.println("Which day ?");
        Scanner scannerDay = new Scanner( System.in );
        int dayChoice = scannerDay.nextInt();
        while(dayChoice > 31 || dayChoice < 1) {
            System.out.println("Please retry..");
            dayChoice = scannerDay.nextInt();
        }
        System.out.println("Which month ?");
        Scanner scannerMonth = new Scanner( System.in );
        int monthChoice = scannerMonth.nextInt();
        while(monthChoice > 12 || monthChoice < 1) {
            System.out.println("Please retry..");
            monthChoice = scannerMonth.nextInt();
        }
        System.out.println("Which year ?");
        Scanner scannerYear = new Scanner( System.in );
        int yearChoice = scannerYear.nextInt();
        while( yearChoice < LocalDate.now().getYear()) {
            System.out.println("Please retry..");
            yearChoice = scannerYear.nextInt();
        }
        this.deadline = LocalDate.of(yearChoice, monthChoice, dayChoice);

        String sql = "UPDATE project SET deadline = '"+this.deadline.toString()+"' WHERE id_project = "+Database.getProjectId(this.name)+";";
        Database.update(sql);
    }

    public void newMember() throws FileNotFoundException {

        System.out.println("Member name :");
        Scanner scanner = new Scanner( System.in );
        String choiceName = scanner.nextLine();
        Member newMember = new Member(choiceName);
        this.members.add(newMember);
        this.home.getMembers().add(newMember);
        newMember.setProject(this);

        int id_project = Database.getProjectId(this.name);

        String sql = "INSERT INTO member (name, id_project) VALUES ('"+choiceName+"', "+id_project+");";
        Database.insertInto(sql);

    }

    public void removeMember() throws FileNotFoundException {

        System.out.println("Wich member ?");
        System.out.println(this.getMemberChoices());
        List<Member> memberList = this.members;

        Scanner scanner = new Scanner( System.in );
        int choice = scanner.nextInt();
        while(choice > memberList.size() + 1 || choice < 1) {
            System.out.println("Please retry..");
            choice = scanner.nextInt();
        }
        if(memberList.size() > 0) {
            if(memberList.get(choice - 1).getTasks().size() > 0) {
                for(Task task:memberList.get(choice - 1).getTasks()) {
                    task.assignTo(null);
                }
            }
            System.out.println(memberList.get(choice-1));
            if(choice != memberList.size() + 1) {

                String sqlTasks = "UPDATE task SET id_member = "+null+" WHERE id_member = "+ Database.getMemberId(memberList.get(choice - 1).getName())+";";
                System.out.println(sqlTasks);
                Database.update(sqlTasks);
                String sqlMember = "DELETE FROM member WHERE id_member = "+ Database.getMemberId(memberList.get(choice - 1).getName())+";";
                System.out.println(sqlMember);

                    Database.update(sqlMember);

                this.members.remove(memberList.get(choice-1));
            }
        }

    }

    public void removeMember(Member member) throws FileNotFoundException {

        String sqlTasks = "UPDATE task SET id_member = "+null+" WHERE id_member = "+ Database.getMemberId(member.getName())+";";
        Database.update(sqlTasks);

        String sqlMember = "DELETE FROM member WHERE id_member = "+ Database.getMemberId(member.getName())+";";
        Database.update(sqlMember);

        this.members.remove(member);
    }

    public Task newTask() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        System.out.println("Task name :");
        Scanner scanner = new Scanner( System.in );
        String choiceName = scanner.nextLine();
        try {
            Task newTask = new Task(choiceName);
            this.tasks.add(newTask);
            newTask.setProject(this);

            int id_project = Database.getProjectId(this.name);

            String sql = "INSERT INTO task (name, state, creationDate, deadline, comment, id_member, id_project) VALUES ('"+choiceName+"', 'TODO', '"+LocalDate.now().toString()+"', "+null+", '', "+null+", "+id_project+");";
            Database.insertInto(sql);

            return newTask.update();
        } catch (IOException e) {
            printWriter.println(e);
            return null;
        }
    }

    public Task updateExistingTask() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        System.out.println("Which task (0 to cancel) ? ");
        System.out.println(getTaskChoices());
        Scanner scanner = new Scanner( System.in );
        try {
            int choice = scanner.nextInt();
            while( choice < 0 || choice > this.tasks.size()) {
                System.out.println("Please retry..");
                choice = scanner.nextInt();
            }
            if(choice != 0) {
                this.tasks.get(choice - 1).update();
                return null;
            }
        } catch (IOException e) {
            printWriter.println(e);
        }
        return null;
    }

    public void removeTask(Task task) throws FileNotFoundException {

        String sql = "DELETE FROM task WHERE id_task = "+ Database.getTaskId(task.getName())+";";
        Database.update(sql);

        this.tasks.remove(this.tasks.indexOf(task));
    }

    public String getProjectChoices() {
        return "1. Change the name\n2. Add a member\n3. Remove a member\n4. Add a task\n5. Update an existing task\n6. Update next appointment\n7. Update the deadline\n8. Remove from home\n9. Nothing\n";
    }

    public Project update() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        System.out.println("What do you want to do in this project ?");
        System.out.println(this.getProjectChoices());
        Scanner scanner = new Scanner( System.in );
        int choice = scanner.nextInt();

        try {
            do {
                while( choice < 1 || choice > 9) {
                    System.out.println("Please retry..");
                    choice = scanner.nextInt();
                }
                switch (choice) {
                    case 1:
                        this.setName();
                        break;
                    case 2:
                        newMember();
                        break;
                    case 3:
                        removeMember();
                        break;
                    case 4:
                        newTask();
                        break;
                    case 5:
                        if(this.tasks.size() > 0) {
                            updateExistingTask();
                        } else {
                            System.out.println("There are no tasks yet.");
                        }
                        break;
                    case 6:
                        setNextAppointment();
                        break;
                    case 7:
                        setDeadline();
                        break;
                    case 8:
                        this.home.removeProject(this);
                        this.home.start();

                        return this;
                    case 9:
                        return this;
                }
                System.out.println("What do you want to do in this project ?");
                System.out.println(this.getProjectChoices());
                scanner = new Scanner( System.in );
                choice = scanner.nextInt();
            } while (choice != 7);
            return this;
        } catch (FileNotFoundException e) {
            printWriter.println(e);
            return null;
        }
    }


    /*
   Database imports
    */
    public void newMember(Member member) {
        this.members.add(member);
        this.home.getMembers().add(member);
        member.setProject(this);
    }

    public void newTask(Task task) {
        this.tasks.add(task);
        task.setProject(this);
    }


    /*
    Others
     */
    public String toString() {
        String membersNames = "";
        for(Member member:members) {
            membersNames += " - " + member.getName();
        }
        return "PROJECT " + this.name + "\n---------------------------\nMembers : " + membersNames + "\nNext Appointement : " + nextAppointment + "\nDeadline : " + deadline + "\nTasks : " + tasks.toString() + "\n\n";
    }

}


