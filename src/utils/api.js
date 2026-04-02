export async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    
    // Check for 500-level errors
    if (response.status >= 500) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        error: data.message || 'A server error occurred. Please try again later.',
        status: response.status
      };
    }

    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { success: response.ok };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `Error: ${response.status}`,
        status: response.status,
        details: data.details
      };
    }

    return data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}
