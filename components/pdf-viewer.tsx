"use client";

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// Dynamically import PDF components to avoid SSR issues
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false, loading: () => <div>Loading PDF...</div> }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
}

export function PDFViewer({ pdfUrl, title = "PDF Document" }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(0.6);
  const [loading, setLoading] = useState<boolean>(true);

  // Set up PDF.js worker only on client side
  useEffect(() => {
    import('react-pdf').then((pdfjs) => {
      pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  // Memoize options to prevent unnecessary reloads
  const pdfOptions = useMemo(() => ({
    renderMode: 'canvas' as const,
    renderTextLayer: false,
    renderAnnotationLayer: false,
  }), []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setLoading(false);
  }

  function goToPrevPage() {
    setPageNumber(pageNumber <= 1 ? 1 : pageNumber - 1);
  }

  function goToNextPage() {
    setPageNumber(pageNumber >= numPages ? numPages : pageNumber + 1);
  }

  function zoomIn() {
    setScale(scale + 0.2);
  }

  function zoomOut() {
    setScale(scale > 0.4 ? scale - 0.2 : 0.4);
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Controls */}
      <div className="bg-gray-100 p-4 border-b flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-sm font-medium">
            {loading ? 'Loading...' : `${pageNumber} of ${numPages}`}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.4}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          <span className="text-sm font-medium min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex justify-center bg-gray-50 p-4 min-h-96">
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">Loading PDF...</div>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          options={pdfOptions}
          error={
            <div className="flex items-center justify-center h-96 text-red-500">
              Failed to load PDF. Please try downloading it directly.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="shadow-lg"
            loading={null}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            error={
              <div className="flex items-center justify-center h-96 text-red-500">
                Failed to load page.
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
}