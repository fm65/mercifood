package models;

import database.Account;
import database.Database;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Home {

    /*
    Home attributes
    */
    private String name;
    private List<Project> projects;
    private List<Member> members;


    /*
    Constructor
    */
    public Home() {
        this.projects = new ArrayList<Project>();
        this.members = new ArrayList<Member>();
    }


    /*
    Accessors
    */
    public List<Project> getProjects() {
        return projects;
    }

    public List<Member> getMembers() {
        return members;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    /*
    User interactions
    */
    public void removeProject(Project project) throws FileNotFoundException {
        int project_id = Database.getProjectId(project.getName());

        String deleteTasks = "DELETE FROM task WHERE id_project = '"+ project_id + "'";
        String deleteMembers = "DELETE FROM member WHERE id_project = '"+ project_id + "'";
        String deleteProject = "DELETE FROM project WHERE id_project = "+ project_id + "" ;

        Database.update(deleteTasks);
        Database.update(deleteMembers);
        Database.update(deleteProject);
        this.projects.remove(project);
    }

    public String getHomeChoices() {
        return "1. Create a new project\n2. Update an existing project\n3. Nothing\n";
    }

    public void connection() throws FileNotFoundException {
        Scanner scanner = new Scanner( System.in );
        String username ="";
        String password ="";
        System.out.println("Connection");
        System.out.println("**********\n");
        do {

            System.out.println("Username: ");
            username = scanner.next();

            System.out.println("Password: ");
            password = scanner.next();

            System.out.println("**********\n\n");


            /*
            Launch App only if account exists
             */
            if(accountExists(username, password)) {
                System.out.println(this.start().getProjects());
            } else {
                System.out.println("Unknown user\n");
            }
        } while(!accountExists(username,password));

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

    public Home start() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        System.out.println("What do you want to do ?");
        System.out.println(this.getHomeChoices());
        Scanner scanner = new Scanner( System.in );
        int choice = scanner.nextInt();
        while( choice < 1 || choice > 3) {
            System.out.println("Please retry..");
            choice = scanner.nextInt();
        }
        try {
            switch (choice) {
                case 1:
                    Project project = Project.newProject();
                    addProject(project);
                    break;
                case 2:
                    if(this.projects.size() > 0) {
                            updateExistingProject();
                    } else {
                        System.out.println("There are no projects yet.");
                    }
                    break;
                case 3:
                    return this;
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
        return this;
    }

    public String getProjectChoices() {
        String projectList = "";
        int count = 1;
        for(Project project: projects) {
            projectList += count + ". " + project.getName()+ "\n";
            count++;
        }
        return projectList;
    }

    public Project updateExistingProject() throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter ("logs.txt");

        System.out.println("Which project (0 to cancel) ? ");
        System.out.println(getProjectChoices());
        Scanner scanner = new Scanner( System.in );
        int choice = scanner.nextInt();
        while( choice < 0 || choice > this.projects.size()) {
            System.out.println("Please retry..");
            choice = scanner.nextInt();
        }
        try {
            if(choice != 0) {
                this.projects.get(choice - 1).update();
                return null;
            } else {
                return null;
            }
        } catch (Error | Exception e) {
            printWriter.println(e);
            printWriter.close();
        }
        return null;
    }


    /*
    Database imports
    */
    public void addProject(Project project) {
        project.setHome(this);
        this.projects.add(project);
    }


}
