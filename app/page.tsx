'use client';
import { useState, useRef } from 'react';

function Home() {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  let finalUrl: string;

  const fetchWebsite = async (url: string): Promise<string> => {
    const response = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error(`Network response: ${response}`);
    return response.text();
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (url) {
      setIsLoading(true);
      setError(null);
      setIsLoaded(false);

      const lowerCaseUrl = url.toLowerCase();

      if (!lowerCaseUrl.startsWith('http://') && !lowerCaseUrl.startsWith('https://')) finalUrl = `https://${lowerCaseUrl}`;
      else finalUrl = lowerCaseUrl;

      try {
        const result = await fetchWebsite(finalUrl);
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            doc.open();
            doc.write(result);
            doc.close();
          }
        }
        setIsLoaded(true);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="overflow-hidden min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-0">
      {!isLoaded && (
        <>
          <h1 className="text-4xl font-bold mb-6">Custos</h1>
          <h3 className="text-2xl font-bold mb-6">Privacy first</h3>
        </>
      )}
      {!isLoaded && (
        <form onSubmit={handleSearch} className="flex mb-4 w-full max-w-md">
          <input
            type="text"
            className="flex-grow p-2 rounded-l-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            className="
              p-2 bg-blue-600 rounded-r-md 
              hover:bg-blue-500 transition duration-200"
            disabled={isLoading}>
            Search
          </button>
        </form>
      )}
      {isLoading && <p className="text-gray-400">Loading and building site...</p>}
      {error && <p className="text-red-500">Error building website: {error}</p>}
      <div className="mt-4 w-full h-full">
        <iframe
          ref={iframeRef}
          className="w-full h-screen outline-none border-none"
        />
      </div>
    </div>
  );
}

export default Home;