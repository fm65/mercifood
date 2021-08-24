package models;

public enum State {
    TODO, DOING,DONE;

    public static String getStatesChoices() {
        String choices = "";
        int count = 1;
        for(State state: State.values()) {
            choices += count + ". " + state + "\n";
            count++;
        }
        return choices;
    }
}
