'use client'

import { useEffect, useRef, useState, useTransition } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button, Grid2, Skeleton } from '@mui/material';
import { BookmarkAdd } from '@mui/icons-material';
import BookMarkCard from '../components/BookMarkCard';
import { AddBookmarkDialog, EditBookmarkDialog } from '../components/DialogComp';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BookmarkCardSkeleton } from '../components/Skeletons';
import { useAuth } from '../context/AppContext';

export default function HomePage() {

  const { user } = useAuth();

  const [refreshKey, setRefreshKey] = useState<string>('')

  const [bookmarks, setBookmarks] = useState<{ id: string;[key: string]: any }[]>([]);

  const addBookmarkDialogRef = useRef<{ open: () => void; close: () => void }>(null);
  const handleOpenDialog = () => {
    addBookmarkDialogRef.current?.open();
  };

  const [fetchBookmarks, startFetchBookmarks] = useTransition()
  useEffect(() => {
    (() => {
      startFetchBookmarks(async () => {
        try {
          const q = query(
            collection(db, "bookmarks"),
            orderBy("createdAt", "desc") // query fetches most recent first
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            userId: doc.data().userId,
            ...doc.data(),
          }));
          setBookmarks(data.filter((ele) => ele.userId == user?.uid));

        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      })
    })()
  }, [refreshKey, user?.uid])

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: {sm: 'row', xs: 'column'}, justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h5" component="h5">
          My Bookmarks ({bookmarks.length})
        </Typography>
        <Button sx={{ display: 'flex', gap: 1 }} variant='contained' onClick={handleOpenDialog}>
          <BookmarkAdd />
          <Typography>Add Bookmark</Typography>
        </Button>

      </Box>

      <Grid2 container spacing={2}>
        {
          (fetchBookmarks) && ([1, 2, 4]).map((_, idx) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} key={`skeleton_card_bookmarks_${idx}`}>
              <BookmarkCardSkeleton />
            </Grid2>
          ))
        }
        {
          (!fetchBookmarks && bookmarks.length > 0) && bookmarks.map((ele, idx) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} key={`hgfyut_${idx}`}>
              <BookMarkCard id={ele.id} title={ele.title} url={ele.url} createdAt={ele.createdAt} setRefreshKey={setRefreshKey} />
            </Grid2>
          ))
        }

        {
          (!fetchBookmarks && bookmarks.length < 1) && (
            <Box sx = {{height: 150, color: 'rgb(200, 200, 200)', backgroundColor: 'rgb(250, 250, 250)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1.5}}>
              You have no bookmarks!
            </Box>
          )
        }
      </Grid2>
      <AddBookmarkDialog ref={addBookmarkDialogRef} setRefreshKey={setRefreshKey} />
      
    </>
  );
}
