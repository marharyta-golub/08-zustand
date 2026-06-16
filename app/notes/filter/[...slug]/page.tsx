import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface FilterNotesPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function FilterNotesPage({
  params,
}: FilterNotesPageProps) {
  const queryClient = new QueryClient();
  const { slug } = await params;

  const activeTag = slug && slug[0] !== 'all' ? slug[0] : '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', activeTag || 'all'],
    queryFn: () =>
      fetchNotes({
        keyword: '',
        currentPage: 1,
        itemsPerPage: 12,
        ...(activeTag && { tag: activeTag }),
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={activeTag || 'all'} />
    </HydrationBoundary>
  );
}
