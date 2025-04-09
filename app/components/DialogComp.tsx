import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, TextField, Typography } from "@mui/material"
import { Ref, useImperativeHandle, useState, useTransition } from "react";
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { useAuth } from '../context/AppContext';
import { useSnackbar } from '../components/SnackBarProvider';
import { BookmarkAdd } from "@mui/icons-material";

type AddBookmarkDialogProps = {
    ref: Ref<{ open: () => void; close: () => void }>;
    setRefreshKey?: React.Dispatch<React.SetStateAction<string>>;
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
                            minWidth: 500, // or use width: 500, or maxWidth, etc.
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
            <DialogTitle sx = {{fontWeight: 'bold'}}>
                {title}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions sx = {{paddingY: 2}}>
                <Button disabled = {processing} onClick={onCancel} sx = {{color: "gray"}}>Cancel</Button>
                <Button disabled = {processing} onClick={onConfirm} color="error" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};