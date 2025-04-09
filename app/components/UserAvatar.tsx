'use client'

import { Avatar, Box } from "@mui/material"
import { useAuth } from "../context/AppContext";

const UserAvatar = () => {
    const { user } = useAuth();

    return (
        <Box sx = {{display: 'flex', alignItems: 'center', gap: 2, width: '300px'}}>
            <Avatar alt= {user?.displayName || undefined} src={user?.photoURL || undefined} />
            {user?.displayName || undefined}
        </Box>
    )
}

export default UserAvatar