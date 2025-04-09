import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, TextField, Typography } from "@mui/material"
import { Ref, useImperativeHandle, useState, useTransition } from "react";
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from '../context/AppContext';
import { useSnackbar } from '../components/SnackBarProvider';
import { BookmarkAdd, CommentBank } from "@mui/icons-material";
import { randomBytes } from "crypto";

type AddBookmarkDialogProps = {
    ref: Ref<{ open: () => void; close: () => void }>;
    setRefreshKey?: React.Dispatch<React.SetStateAction<string>>;
};

type EditBookmarkDialogProps = {
    ref: Ref<{ open: () => void; close: () => void }>;
    setRefreshKey?: React.Dispatch<React.SetStateAction<string>>;
    id: string;
    title: string;
    url: string
};

export const AddBookmarkDialog = ({ ref: refProp, setRefreshKey }: AddBookmarkDialogProps) => {

    const { showMessage } = useSnackbar();

    const [title, setTitle] = useState('')
    const [url, setURL] = useState('')

    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const handleCloseDialog = () => {
        setOpen(false);
    };

    useImperativeHandle(refProp, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
    }));

    const doesTitleExistForUser = async (url: string, userId: string): Promise<boolean> => {
        const q = query(
            collection(db, "bookmarks"),
            where("url", "==", url),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const [addBookmarkStart, startBookmarkAdd] = useTransition()
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("You must be logged in");

        showMessage('Adding bookmark...', 'info', true, false);

        startBookmarkAdd(async () => {
            const exists = await doesTitleExistForUser(url, user?.uid || "");

            if (exists) {
                showMessage('You already have a bookmark with this url.', 'error', false, false);
                return;
            }

            try {
                const docRef = await addDoc(collection(db, "bookmarks"), {
                    title: title,
                    url: url,
                    userId: user?.uid,
                    createdAt: serverTimestamp(),
                });

                showMessage('Bookmark added successfully.', 'success', false, false);
                setTimeout(() => {
                    setTitle('')
                    setURL('')
                    if (setRefreshKey) {
                        setRefreshKey(docRef.id);
                    }
                    handleCloseDialog();
                }, 5)
            } catch (e) {
                console.error("Error adding document: ", e);
                showMessage('Operation error! Bookmark not added.', 'error', false, false);
            }
        })
    };

    return (
        <>
            <Dialog
                open={open}
                component="form"
                onClose={handleCloseDialog}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                slotProps={{
                    paper: {
                        sx: {
                            width: 500
                        },
                    },
                }}
            >
                <DialogTitle id="scroll-dialog-title" sx={{ fontWeight: 'bold', display: 'flex', gap: 1, alignItems: 'center' }}>
                    <BookmarkAdd />
                    <Typography component="div" sx={{ fontWeight: 'bold', fontSize: 20 }}>Add Bookmark</Typography>
                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText component="div" id="scroll-dialog-description" tabIndex={-1} >
                        <Box
                            onSubmit={() => ''}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                maxWidth: '100%'
                            }}
                        >
                            <TextField
                                label="Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />

                            <TextField
                                label="URL"
                                variant="outlined"
                                value={url}
                                onChange={(e) => setURL(e.target.value)}
                                required
                            />
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ paddingY: 1.5 }}>
                    <Button disabled={addBookmarkStart} onClick={handleCloseDialog}>Cancel</Button>
                    <Button disabled={addBookmarkStart} onClick={handleSubmit} variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export const EditBookmarkDialog = ({ ref: refProp, setRefreshKey, id, url, title }: EditBookmarkDialogProps) => {

    const { showMessage } = useSnackbar();

    const [localTitle, setLocalTitle] = useState(title)
    const [localURL, setLocalURL] = useState(url)

    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const handleCloseDialog = () => {
        setOpen(false);
    };

    useImperativeHandle(refProp, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
    }));

    const [editBookmarkStart, startBookmarkEdit] = useTransition()
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("You must be logged in");

        showMessage('Editing bookmark...', 'info', true, false);

        startBookmarkEdit(async () => {

            try {
                const docRef = doc(db, "bookmarks", id);
                await updateDoc(docRef, {
                    title: localTitle,
                    url: localURL,
                    updatedAt: serverTimestamp(),
                });

                const refreshKey = randomBytes(16).toString('hex');

                showMessage('Bookmark edited successfully.', 'success', false, false);
                setTimeout(() => {
                    setLocalTitle('')
                    setLocalURL('')
                    if (setRefreshKey) {
                        setRefreshKey(refreshKey);
                    }
                    handleCloseDialog();
                }, 5)
            } catch (e) {
                console.error("Error editing document: ", e);
                showMessage('Operation error! Bookmark not edited.', 'error', false, false);
            }
        })
    };

    return (
        <>
            <Dialog
                open={open}
                component="form"
                onClose={handleCloseDialog}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                slotProps={{
                    paper: {
                        sx: {
                            width: 500
                        },
                    },
                }}
            >
                <DialogTitle id="scroll-dialog-title" sx={{ fontWeight: 'bold', display: 'flex', gap: 1, alignItems: 'center' }}>
                    <CommentBank />
                    <Typography component="div" sx={{ fontWeight: 'bold', fontSize: 20 }}>Edit Bookmark</Typography>
                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText component="div" id="scroll-dialog-description" tabIndex={-1} >
                        <Box
                            onSubmit={() => ''}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                maxWidth: '100%'
                            }}
                        >
                            <TextField
                                label="Title"
                                variant="outlined"
                                value={localTitle}
                                onChange={(e) => setLocalTitle(e.target.value)}
                                required
                            />

                            <TextField
                                label="URL"
                                variant="outlined"
                                value={localURL}
                                onChange={(e) => setLocalURL(e.target.value)}
                                required
                            />
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ paddingY: 1.5 }}>
                    <Button disabled={editBookmarkStart} onClick={handleCloseDialog}>Cancel</Button>
                    <Button disabled={editBookmarkStart} onClick={handleSubmit} variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export const ConfirmDialog = ({
    open,
    title = "Confirm Action",
    message,
    processing,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title?: string;
    message: string;
    processing: boolean,
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {title}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ paddingY: 2 }}>
                <Button disabled={processing} onClick={onCancel} sx={{ color: "gray" }}>Cancel</Button>
                <Button disabled={processing} onClick={onConfirm} color="error" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};