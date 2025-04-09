export type Timestamp = {
    seconds: number;
    nanoseconds: number;
};

export type Bookmark = {
    id: string;
    title: string;
    url: string;
    createdAt: Timestamp;
    setRefreshKey: React.Dispatch<React.SetStateAction<string>>;
};