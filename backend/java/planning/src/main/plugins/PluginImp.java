package plugins;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.chart.*;
import javafx.scene.control.Button;
import javafx.stage.Stage;
import models.Project;
import models.Task;

import java.time.temporal.ChronoUnit;
import java.util.*;

public class PluginImp implements Plugin {
    Project project;

    @Override
    public Button getPluginButton() {
        Button button = new Button();
        button.setText("Task time view");
        EventHandler<ActionEvent> event = new EventHandler<ActionEvent>() {
            public void handle(ActionEvent e)
            {
                handleClick();
            }
        };

        button.setOnAction(event);
       return button;
    }

    @Override
    public void setProject(Project project) {
        this.project = project;
    }

    public Map<String,Integer> getTaskDays() {

        Map<String, Integer> taskDays = new HashMap<>();
        for ( Task task: this.project.getTasks()) {
            if(task.getDeadline() != null) {
                Integer daysBetween = (int) ChronoUnit.DAYS.between(task.getCreationDate(), task.getDeadline());
                taskDays.put(task.getName(), daysBetween);
                System.out.println(task.getName() + " " +daysBetween);
            }

        }
        return taskDays;
    }

    public void handleClick() {
        Map<String, Integer> values;
        Stage stage = new Stage();
        CategoryAxis xAxis = new CategoryAxis ();
        xAxis.setLabel ("Task");

        NumberAxis yAxis = new NumberAxis ();
        yAxis.setLabel ("Number of days");

        BarChart<String,Number> barChart = new BarChart<> (xAxis, yAxis);
        barChart.setTitle("Tasks Time View");

        XYChart.Series series = new XYChart.Series();

        series.setName("Days spent");
        for(Map.Entry<String, Integer> entry : getTaskDays().entrySet()) {
            String key = entry.getKey();
            Integer value = entry.getValue();
            series.getData (). add (new XYChart.Data (key,value));
        }

        Scene scene  = new Scene(barChart,800,600);
        barChart.getData().add(series);

        stage.setScene(scene);
        stage.show();

    }


}
