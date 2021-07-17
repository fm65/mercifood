package models;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class Backup {

    private JSONObject project;
    private JSONArray projectMembers;
    private JSONArray projectTasks;

    public Backup() {}

    public JSONObject getProject() {
        return this.project;
    }

    public JSONArray getProjectTasks() {
        return projectTasks;
    }

    public JSONArray getProjectMembers() {
        return projectMembers;
    }

    public void importChanges() {
        JSONParser jsonParser = new JSONParser();
        try (FileReader reader = new FileReader("files/backup.json")) {
            Object obj = jsonParser.parse(reader);
            JSONObject backup = (JSONObject) obj;

            this.project = backup;

            Project project = new Project((String) this.project.get("name"));
            project.setBackup(this);

            if(this.project.get("deadline") != null) {
                project.importDeadline((String) this.project.get("deadline"));
            }
            if(this.project.get("next_appointment") != null) {
                project.importNextAppointment((String) this.project.get("next_appointment"));
            }
            this.projectMembers = (JSONArray) backup.get("members");
            int i = 0;
            while (i < this.projectMembers.size()) {
                JSONObject m = (JSONObject) this.projectMembers.get(i);
                Member member = new Member((String) m.get("name"));
                project.newMember(member);
                i++;
            }

            this.projectTasks = (JSONArray) backup.get("tasks");
            int j = 0;
            while (j < this.projectTasks.size()) {
                JSONObject t = (JSONObject) this.projectTasks.get(j);
                Task task = new Task((String) t.get("name"));
                task.importCreationDate((String) t.get("date"));
                if (t.get("deadline") != null) {
                    task.importDeadline((String) t.get("deadline"));
                }
                project.newTask(task);
                if (t.get("owner") != null) {
                    task.importOwner((String) t.get("owner"));
                }
                task.importState((String) t.get("state"));
                task.importComment((String) t.get("comment"));
                j++;
            }
            launch(project);
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
    }

    public void launch(Project projectImported) throws IOException {
        System.out.println(projectImported.update().toString());
    }


    public void newMember(JSONArray array, String name) throws IOException {
            JSONObject obj = new JSONObject();
            JSONArray arr = new JSONArray();
            obj.put("name", name);
            obj.put("tasks", arr);

            array.add(array.size(), obj);
            this.project.put("members", array);
            writeObject(this.project);
    }

    public void newTask(JSONArray array, String name) throws IOException {
        JSONObject obj = new JSONObject();
        LocalDate date = LocalDate.now();
        State state = State.TODO;

        obj.put("name", name);
        obj.put("owner", null);
        obj.put("state", state.toString());
        obj.put("date", date.toString());
        obj.put("deadline", null);
        obj.put("comment", "");

        array.add(array.size(), obj);
        this.project.put("tasks", array);
        writeObject(this.project);
    }

    public void replaceInProject(JSONObject object,String key, Object value) throws IOException {
        object.replace(key,value);
        writeObject(object);
    }

    public void replaceInTask(JSONObject object,String key, Object value) throws IOException {
        object.replace(key,value);
        this.project.put("tasks", this.projectTasks);
        writeObject(this.project);
    }
    public void addTaskInMember(JSONArray array,String name) throws IOException {
        JSONObject task = new JSONObject();
        task.put("name",name);
        array.add(array.size(), task);
        this.project.put("members", this.projectMembers);
        writeObject(this.project);
    }

    public void writeObject(JSONObject object) throws IOException {
        FileWriter backup = new FileWriter("files/backup.json");
        try {
            backup.write(object.toJSONString());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            backup.flush();
            backup.close();
        }
    }

}
