import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createNote, type NewNoteProps } from '../../lib/api';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancelForm: () => void;
}

const noteValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('This field is required'),
  content: Yup.string().max(500, 'Content must be at most 500 characters'),
  tag: Yup.string()
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Please select a valid tag',
    )
    .required('Tag is required'),
});

const initialFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const NoteForm = ({ onCancelForm }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: (newNoteData: NewNoteProps) => createNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancelForm();
      toast.success('Note created successfully!');
    },
    onError: () => {
      toast.error('Failed to create the note.');
    },
  });

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={noteValidationSchema}
      onSubmit={(values, actions) => {
        createNoteMutation.mutate(values, {
          onSettled: () => {
            actions.setSubmitting(false);
          },
        });
      }}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            name="content"
            as="textarea"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" name="tag" as="select" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCancelForm}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={createNoteMutation.isPending}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
