import { toast } from "sonner";

// Standardized Toast Utilities
export const showToast = {
    success: (message: string) => {
        toast.success(message, {
            style: { background: "#10B981", color: "#fff", border: "none" }, // Custom styling if needed, or rely on richColors
        });
    },
    error: (message: string) => {
        toast.error(message, {
            style: { background: "#EF4444", color: "#fff", border: "none" },
        });
    },
    warning: (message: string) => {
        toast.warning(message, {
            style: { background: "#F59E0B", color: "#fff", border: "none" },
        });
    },
    info: (message: string) => {
        toast.info(message, {
            style: { background: "#3B82F6", color: "#fff", border: "none" },
        });
    },
};

// Helper to handle API errors globally
export const handleApiError = (error: any) => {
    console.error("API Error Identity:", error);
    const message =
        error.response?.data?.message || // Axios style
        error.message || // Standard Error object
        "An unexpected error occurred. Please try again.";

    showToast.error(message);
};
