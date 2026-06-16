import axios from 'axios';
import type { Note } from '../types/note';

export interface NotesFetchResult {
  notes: Note[];
  totalPages: number;
}

export interface NewNoteProps {
  title: string;
  content: string;
  tag: string;
}

export interface QueryFilterOptions {
  keyword?: string;
  currentPage?: number;
  itemsPerPage?: number;
  tag?: string;
}
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchNotes = async ({
  keyword = '',
  currentPage = 1,
  itemsPerPage = 10,
  tag,
}: QueryFilterOptions): Promise<NotesFetchResult> => {
  const { data } = await api.get<NotesFetchResult>('/notes', {
    params: {
      search: keyword,
      page: currentPage,
      perPage: itemsPerPage,
      tag,
    },
  });
  return data;
};

export const createNote = async (notePayload: NewNoteProps): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', notePayload);
  return data;
};

export const deleteNote = async (targetId: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${targetId}`);
  return data;
};

export const fetchNoteById = async (targetId: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${targetId}`);
  return data;
};
