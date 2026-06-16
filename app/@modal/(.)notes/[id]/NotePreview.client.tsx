'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewModalProps {
  id: string;
}

export default function NotePreviewModal({ id }: NotePreviewModalProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note-details', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) return <div>Loading note details...</div>;
  if (isError || !note) return <div>Failed to load note details.</div>;

  return (
    <Modal onCloseModal={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>

          <p className={css.content}>{note.content}</p>
          <button className={css.backBtn} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
