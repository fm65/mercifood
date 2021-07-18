package database;

public class Account {

    /*
    Account attributes
     */
    private String user;
    private String password;

    /*
    Constructor
     */
    public Account(String user, String password) {
        this.user = user;
        this.password = password;
    }

    /*
    Accessors
     */
    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
