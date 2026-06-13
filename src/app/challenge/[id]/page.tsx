
"use client"

import React, { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

// Satisfy Next.js static export requirements
export async function generateStaticParams() {
  return [];
}

export default function ChallengeRedirect() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const target = searchParams.get('target');

  useEffect(() => {
    // Redirect to the non-dynamic route which uses search params
    router.replace(`/challenge?id=${id}${target ? `&target=${target}` : ''}`);
  }, [id, target, router]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
    </div>
  );
}
