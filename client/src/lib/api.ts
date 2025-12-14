import { handleApiError } from "./toast-utils";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRequestOptions extends RequestInit {
    body?: any;
}

/**
 * Validates URLs to ensure they're well-formed.
 * Checks for empty strings and whitespace.
 * Returns true if valid, false otherwise.
 */
const isValidUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;
    return true;
};

/**
 * Universal API Request Function
 * Wraps fetch with error handling, JSON parsing, and automatic headers.
 */
export const apiRequest = async <T = any>(
    endpoint: string,
    method: RequestMethod = "GET",
    data?: any,
    headers: HeadersInit = {}
): Promise<T> => {
    try {
        if (!isValidUrl(endpoint)) {
            throw new Error(`Invalid URL: ${endpoint}`);
        }

        const config: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        // Determine if it's a full URL or relative path
        // Assuming relative paths start with / and direct to /api... usually handled by Next.js rewrites or same origin
        const url = endpoint;

        const response = await fetch(url, config);

        // Parse JSON safely
        let responseData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        if (!response.ok) {
            // Throw an object that looks like the response data or a standard error
            throw new Error(responseData?.message || `Error ${response.status}: ${response.statusText}`);
        }

        return responseData as T;
    } catch (error: any) {
        // Re-throw so the caller can handle it, or use handleApiError if you want it automatic
        // But usually callers might want to do loading states, etc.
        throw error;
    }
};

// Convenience methods
export const api = {
    get: <T>(url: string, headers?: HeadersInit) => apiRequest<T>(url, "GET", undefined, headers),
    post: <T>(url: string, data: any, headers?: HeadersInit) => apiRequest<T>(url, "POST", data, headers),
    put: <T>(url: string, data: any, headers?: HeadersInit) => apiRequest<T>(url, "PUT", data, headers),
    delete: <T>(url: string, headers?: HeadersInit) => apiRequest<T>(url, "DELETE", undefined, headers),
    patch: <T>(url: string, data: any, headers?: HeadersInit) => apiRequest<T>(url, "PATCH", data, headers),
};
