'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';

import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import css from './NotesPage.module.css';

interface NotesClientProps {
  initialTag?: string;
}

export default function NotesClient({ initialTag = 'all' }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const NOTES_PER_PAGE = 12;

  const debouncedSearch = useDebouncedCallback((inputValue: string) => {
    setCurrentPage(1);
    setSearchKeyword(inputValue);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', searchKeyword, currentPage, initialTag],
    queryFn: () =>
      fetchNotes({
        keyword: searchKeyword,
        currentPage: currentPage,
        itemsPerPage: NOTES_PER_PAGE,
        ...(initialTag !== 'all' && { tag: initialTag }),
      }),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    toast.error('Failed to load notes from the server.', { id: 'fetch-error' });
  }

  const notesList = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearchChange={debouncedSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </div>

      {isLoading && <Loader />}

      {!isLoading && notesList.length > 0 && <NoteList notes={notesList} />}

      {isModalOpen && (
        <Modal onCloseModal={() => setIsModalOpen(false)}>
          <NoteForm onCancelForm={() => setIsModalOpen(false)} />
        </Modal>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
