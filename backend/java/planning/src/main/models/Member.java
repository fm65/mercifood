package models;

import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;

import java.util.ArrayList;
import java.util.List;

public class Member {

    /*
    Member attributes
     */
    private String name;
    private List<Task> tasks;
    private Project project;


    /*
    Constructor
     */
    public Member(String name) {
        this.name = name;
        this.tasks = new ArrayList<Task>();
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

    public List<Task> getTasks() {
        return tasks;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public StringProperty nameProperty() {
        return new SimpleStringProperty(name);
    }

    /*
    Others
     */
    public String toString() {
        String tasksNames = "";
        for(Task task:tasks) {
            tasksNames += "- " + task.getName() + "\n";
        }
        return "\n"+ this.name + "\nTasks :\n" + tasksNames;
    }
}


