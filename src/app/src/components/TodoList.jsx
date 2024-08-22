import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const TodoList = ({ todos, isLoading, error, onDeleteTodo, onUpdateTodo }) => {
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={160}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={160}
        color="error.main"
      >
        <AlertCircle style={{ marginRight: "8px" }} />
        <Typography>Error loading todos</Typography>
      </Box>
    );
  }

  const onChangeCheckbox = async (event, todo) => {
    try {
      await onUpdateTodo({
        ...todo,
        completed: event.target.checked,
      });
      toast.success("Todo updated successfully");
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const onClickEdit = (todo) => {
    setEditingTodoId(todo._id);
    setNewTitle(todo.title);
  };

  const onSaveEdit = async (todo) => {
    try {
      await onUpdateTodo({
        ...todo,
        title: newTitle,
      });
      toast.success("Todo updated successfully");
      setEditingTodoId(null); // Exit edit mode
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const onCancelEdit = () => {
    setEditingTodoId(null); // Exit edit mode without saving
  };

  return (
    <List sx={{ mt: 3 }}>
      {todos.map((todo) => (
        <ListItem
          key={todo._id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "background.paper",
            p: 2,
            mb: 1,
            borderRadius: 1,
          }}
        >
          <Box display="flex" alignItems="center" flex="1">
            <Checkbox
              checked={todo.completed}
              onChange={(event) => onChangeCheckbox(event, todo)}
            />
            {editingTodoId === todo._id ? (
              <TextField
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                variant="outlined"
                size="small"
                multiline
                fullWidth={true}
                style={{ marginRight: 10 }}
              />
            ) : (
              <ListItemText
                primary={todo.title}
                primaryTypographyProps={{
                  style: {
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "text.disabled" : "text.primary",
                  },
                }}
              />
            )}
          </Box>

          <div>
            {editingTodoId === todo._id ? (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onSaveEdit(todo)}
                >
                  Save
                </Button>
                <Button variant="outlined" size="small" onClick={onCancelEdit}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onClickEdit(todo)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={async () => {
                    try {
                      await onDeleteTodo(todo._id);
                      toast.success("Todo deleted successfully");
                    } catch (error) {
                      toast.error("Failed to delete todo");
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default TodoList;
