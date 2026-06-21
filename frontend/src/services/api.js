const BASE_URL = 'http://localhost:8000';

export const apiClient = async (endpoint, options = {}) => {
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
    };

    if (
        config.body &&
        typeof config.body === 'object' &&
        !(config.body instanceof FormData) &&
        !(config.body instanceof URLSearchParams)
    ) {
        config.body = JSON.stringify(config.body)
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (!response.ok){
            if(response.status === 401) {
                console.error('Session has expired. Please login again.')
            }
            let errorMessage = 'An error orccured';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || response.statusText;
            } catch (error) {
                errorMessage = response.statusText;
            }
            throw new Error(errorMessage);
        }
        if (response.status ===204){
            return null
        }
        return await response.json();
    } catch (error) {
        console.error(`[API ERROR] ${endpoint}:`, error.message);
        throw error;
    }
};
