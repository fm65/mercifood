package models;

import database.Database;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;

public class Task {

    /*
    Task attributes
     */
    private String name;
    private State state; //TODO //DOING //DONE
    private Member owner;
    private LocalDate creationDate;
    private LocalDate deadline;
    private String comment;
    private Project project;


    /*
    Constructor
     */
    public Task(String name) {
        this.name = name;
        this.state = State.TODO;
        this.creationDate = LocalDate.now();
        this.owner = null;
        this.comment = "";
        this.deadline = null;
    }


    /*
    Accessors
     */
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setState(State state) {
        this.state = state;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public State getState() {
        return state;
    }

    public Member getOwner() {
        return owner;
    }

    public Project getProject() {
        return project;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public String getComment() {
        return comment;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public StringProperty nameProperty() {
        return new SimpleStringProperty(name);
    }


    /*
    User Interactions
     */
    public void updateState() throws Exception {

        System.out.println("What is the new state ?");
        System.out.println(State.getStatesChoices());
        State[] stateList = State.values();
        Scanner scanner = new Scanner( System.in );

        int choice = scanner.nextInt();
        while(choice > stateList.length || choice < 1) {
            System.out.println("Please retry..");
            choice = scanner.nextInt();
        }
        this.state = stateList[choice-1];

        String sql = "UPDATE task SET state = '"+this.state.toString()+"' WHERE id_task = "+ Database.getTaskId(this.name)+";";
        Database.update(sql);

        System.out.println(this.name + " is now " + this.state + ".");
    }

    public void setDeadline() throws Exception {

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

        String sql = "UPDATE task SET deadline = '"+this.deadline.toString()+"' WHERE id_task = "+ Database.getTaskId(this.name)+";";
        Database.update(sql);

    }

    public void assignTo() throws FileNotFoundException {

        System.out.println("To which member ?");
        System.out.println(this.project.getMemberChoices());
        List<Member> memberList = this.project.getMembers();
        Scanner scanner = new Scanner( System.in );
        int choice = scanner.nextInt();
        while(choice > memberList.size() + 1 || choice < 1) {
            System.out.println("Please retry..");
            choice = scanner.nextInt();
        }
        if(this.owner != null) {
            List<Task> oldOwnerTasks = this.owner.getTasks();
            oldOwnerTasks.remove(oldOwnerTasks.indexOf(this));
        }
        if(choice == memberList.size() + 1) {
            this.owner = null;
        } else {
            this.owner = memberList.get(choice - 1);
            this.owner.getTasks().add(this);

            String sql = "UPDATE task SET id_member = '"+Database.getMemberId(this.owner.getName())+"' WHERE id_task = "+ Database.getTaskId(this.name)+";";
            Database.update(sql);
        }
    }

    public void writeComment() throws FileNotFoundException {

        System.out.println("Enter your comment here (0 to cancel) : ");
        Scanner scanner = new Scanner( System.in );
        String comment = scanner.nextLine();
        if(comment.equals("0")) {
            this.comment = "";
        } else {
            this.comment = comment;

            String sql = "UPDATE task SET comment = '"+this.comment+"' WHERE id_task = "+ Database.getTaskId(this.name)+";";
            Database.update(sql);
        }
    }

    public String getTaskChoices() {
        return "1. Update the state\n2. Update the owner\n3. Update the deadline\n4. Write a comment\n5. Remove from project\n6. Nothing\n";
    }

    public Task update() throws Exception {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        System.out.println("What do you want to do with this task ?");
        System.out.println(this.getTaskChoices());
        Scanner scannerYear = new Scanner( System.in );
        int choice = scannerYear.nextInt();
        try {
            do {
            while( choice < 1 || choice > 6) {
                System.out.println("Please retry..");
                choice = scannerYear.nextInt();
            }
            switch (choice) {
                case 1:
                    updateState();
                    break;
                case 2:
                    assignTo();
                    break;
                case 3:
                    setDeadline();
                    break;
                case 4:
                    writeComment();
                    break;
                case 5:
                    this.project.removeTask(this);
                    return this;
                case 6:
                    return this;
            }
            System.out.println("What do you want to do with this task ?");
            System.out.println(this.getTaskChoices());
            scannerYear = new Scanner( System.in );
            choice = scannerYear.nextInt();
            } while (choice != 5);
            return this;
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
            return null;
        }
    }

    public void assignTo(Member member) {
        if(this.owner != null) {
            List<Task> oldOwnerTasks = this.owner.getTasks();
            oldOwnerTasks.remove(this);
        }
        this.owner = member;
        if(this.owner != null) {
            this.owner.getTasks().add(this);
        }
    }

    /*
    Others
     */
    public String toString() {
        String ownerName = this.owner == null ? null : this.owner.getName();
        return "\n\t" + this.name + "\n\t---\n\tOwner : " + ownerName +"\n\tState : " + this.state  + "\n\tDate : " + this.creationDate +  "\n\tDeadline : " + this.deadline +  "\n\tComment : " + this.comment + "\n";
    }
}
