import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider, Link, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material';
import { useState } from 'react';
import { BookmarkRemove, ContentCopy, DeleteOutline, Edit } from '@mui/icons-material';
import { Bookmark } from '../models/Bookmark';
import { timeAgoFromTimestamp } from '../lib/utitlities';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useSnackbar } from './SnackBarProvider';
import { ConfirmDialog } from './DialogComp';
import { useCopyToClipboard } from '../lib/hooks';

export default function BookMarkCard({ id, title, url, createdAt, setRefreshKey }: Bookmark) {

    const [bookmarkID, setBookmarkID] = useState('')

    const { showMessage } = useSnackbar();
    const {copy} = useCopyToClipboard()

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [deleteBookmarkStart, startBookmarkDelete] = React.useTransition()
    const deleteBookmark = async () => {

        handleClose()
        showMessage('Deleting bookmark...', 'info', true, false);
        startBookmarkDelete(async () => {
            try {
                const docRef = await deleteDoc(doc(db, "bookmarks", bookmarkID));
                console.log("Bookmark deleted successfully:", docRef);
                showMessage('Bookmark deleted successfully.', 'success', false, false);
                if (setRefreshKey) {
                    setRefreshKey(bookmarkID)
                }
            } catch (error) {
                console.error("Error deleting bookmark:", error);
                showMessage('Operation error! Bookmark not deleted.', 'error', false, false);
            }
        })
    };

    return (
        <>
            <ConfirmDialog
                open={confirmDeleteOpen}
                title="Delete Bookmark?"
                message="Are you sure you want to delete this bookmark? This action cannot be undone."
                processing={deleteBookmarkStart}
                onConfirm={deleteBookmark}
                onCancel={() => { setConfirmDeleteOpen(false) }}
            />
            <Card sx={{ maxWidth: '100%' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {title.substring(0, 1).toUpperCase()}
                        </Avatar>
                    }
                    action={
                        <>
                            <IconButton aria-label="settings" onClick={handleClick}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}

                            >
                                <MenuList sx={{ width: '200px' }}>
                                    <MenuItem>
                                        <ListItemIcon>
                                            <Edit fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Edit</ListItemText>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            ⌘+X
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        copy(url)
                                        handleClose()
                                    }}>
                                        <ListItemIcon>
                                            <ContentCopy fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Copy Link</ListItemText>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            ⌘+C
                                        </Typography>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem sx={{ color: red[500] }} onClick={() => {
                                        setBookmarkID(id)
                                        setConfirmDeleteOpen(true)
                                        handleClose()
                                    }}>
                                        <ListItemIcon>
                                            <DeleteOutline fontSize="small" color="error" />
                                        </ListItemIcon>
                                        <ListItemText>Delete</ListItemText>
                                        <Typography variant="body2" sx={{ color: 'text.error' }}>
                                            ⌘+V
                                        </Typography>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    }
                    title={
                        <Tooltip title={title} placement='top' arrow>
                            <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
                        </Tooltip>
                    }
                    subheader={timeAgoFromTimestamp(createdAt.seconds)}
                />
                <CardMedia
                    component="img"
                    height="100"
                    image={'https://mui.com/static/images/cards/paella.jpg'}
                    alt="Paella dish"
                />
                <Divider />
                <CardContent>
                    <Tooltip title={url} placement='top' arrow>
                        <Link href = "/jhghfhjkk" target="_blank" rel="noopener noreferrer" variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', textDecoration: 'none', '&:hover': {textDecoration: 'underline'} }} className='line-clamp-1' onClick = {() => alert()}>
                            {url}
                        </Link>
                    </Tooltip>
                </CardContent>
            </Card>
        </>
    );
}
