// Simple mock upload function for demo purposes
export async function uploadToIPFS(file: File, onProgress?: (progress: number) => void): Promise<string> {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress?.(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Return a mock URL for demo purposes
        resolve(`https://example.com/audio/${file.name}`);
      }
    }, 500);
  });
}