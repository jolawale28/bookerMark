export function timeAgoFromTimestamp(timestamp: number): string {
    const now = new Date();
    const date = new Date(timestamp * 1000); // I convert seconds to milliseconds
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // Then I calculate the difference in seconds

    if (diff < 60) {
        return `${diff} second${diff === 1 ? '' : 's'} ago`;
    } else if (diff < 3600) {
        const mins = Math.floor(diff / 60);
        return `${mins} minute${mins === 1 ? '' : 's'} ago`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
        const days = Math.floor(diff / 86400);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }
}

export function copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log("Text copied to clipboard:", text);
        })
        .catch((err) => {
            console.error("Failed to copy text: ", err);
        });
}