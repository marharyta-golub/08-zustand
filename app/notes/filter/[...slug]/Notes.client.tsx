'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import css from './NotesPage.module.css';

interface NotesClientProps {
  initialTag?: string;
}

export default function NotesClient({ initialTag = 'all' }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

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

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load notes from the server.', {
        id: 'fetch-error',
      });
    }
  }, [isError]);

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
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && <Loader />}

      {!isLoading && notesList.length > 0 && <NoteList notes={notesList} />}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
