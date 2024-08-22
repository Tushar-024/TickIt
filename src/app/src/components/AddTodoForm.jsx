import React from 'react';
import { toast } from 'sonner';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Todo title is required").max(100, "Todo title must be 100 characters or less"),
});

const AddTodoForm = ({ onAddTodo }) => {
  const { control, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await onAddTodo(values);
      reset();
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error('Failed to add todo');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" gap={2}>
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Add a new todo..."
            variant="outlined"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error ? fieldState.error.message : null}
          />
        )}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        disabled={formState.isSubmitting}
      >
        {formState.isSubmitting ? 'Adding...' : 'Add Todo'}
      </Button>
    </Box>
  );
};

export default AddTodoForm;
