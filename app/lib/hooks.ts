import { useSnackbar } from "../components/SnackBarProvider";

export function useCopyToClipboard() {
    const { showMessage } = useSnackbar();

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            showMessage('URL link copied to clipboard', 'success', false, false);
        } catch (err) {
            console.error("Failed to copy:", err);
            showMessage('Try again! Please check console for error details.', 'error', false, false);
        }
    };

    return { copy };
}
