'use client';
import { useEffect } from 'react';
import { useRecentClasses } from './RecentClassesProvider';

interface Props {
  id: string;
  courseSlug: string;
  title: string;
}

export default function TrackRecentClass({ id, courseSlug, title }: Props) {
  const { add } = useRecentClasses();

  useEffect(() => {
    add({ id, courseSlug, title });
  }, [id, courseSlug, title, add]);

  return null;
}
