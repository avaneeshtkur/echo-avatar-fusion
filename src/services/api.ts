
// Base API functions for making requests to the backend services

// Helper function for uploading files to any API endpoint
export const uploadFile = async (file: File, endpoint: string, apiKey?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...(apiKey && { 'X-API-Key': apiKey }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error uploading file to ${endpoint}:`, error);
    throw error;
  }
};

// Helper function for JSON API calls with latency tracking
export const apiCall = async (endpoint: string, data: any, apiKey?: string) => {
  try {
    const startTime = performance.now();
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-API-Key': apiKey }),
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const result = await response.json();
    const endTime = performance.now();
    const latency = (endTime - startTime) / 1000; // Convert to seconds
    
    // Track individual API latency for performance monitoring
    console.log(`API call to ${endpoint} completed in ${latency.toFixed(2)}s`);
    
    return { ...result, latency };
  } catch (error) {
    console.error(`Error calling API ${endpoint}:`, error);
    throw error;
  }
};

// Utility to get file duration for videos and audio
export const getFileDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    if (file.type.includes('video')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration);
        window.URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    } else if (file.type.includes('audio')) {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
        window.URL.revokeObjectURL(audio.src);
      };
      audio.src = URL.createObjectURL(file);
    } else {
      // Default duration for other file types
      resolve(10);
    }
  });
};
