import React from 'react';
import { Table, TableColumn, TableRow, TableCell, CheckBox, Button, Label } from '@ui5/webcomponents-react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskTableProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onToggleComplete, onDeleteTask }) => {

  return (
    <Table
        noDataText='No Tasks'
        columns={
            <>
                <TableColumn style={{ width: "30%" }}>
                    <Label>Status</Label>
                </TableColumn>
                <TableColumn style={{ width: "60%" }}>
                    <Label>Task</Label>
                </TableColumn>
                <TableColumn>
                    <Label>Actions</Label>
                </TableColumn>
            </>
        }
    >


      {
        tasks.map(task => (
            <TableRow key={task.id}>
            <TableCell style={{ width: "30%" }}>
                <CheckBox
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                />
            </TableCell>
            <TableCell style={{ width: "60%" }}>{task.title}</TableCell>
            <TableCell>
                <Button icon="delete" design="Negative" onClick={() => onDeleteTask(task.id)}>
                Delete
                </Button>
            </TableCell>
            </TableRow>
        ))
      }
    </Table>
  );
};

export default TaskTable;
