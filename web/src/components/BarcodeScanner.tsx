import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../store/language';

interface BarcodeScannerProps {
  onClose: () => void;
}

export default function BarcodeScanner({ onClose }: BarcodeScannerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    const scannerId = 'barcode-scanner';
    
    const startScanner = async () => {
      try {
        scannerRef.current = new Html5Qrcode(scannerId);
        
        await scannerRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.777,
          },
          (decodedText) => {
            // Barcode detected
            stopScanner();
            navigate(`/scan/${decodedText}`);
          },
          () => {
            // Ignore scanning errors (no barcode found)
          }
        );
        setIsStarting(false);
      } catch (err) {
        console.error('Scanner error:', err);
        setError(t(
          'فشل تشغيل الكاميرا. يرجى السماح بالوصول إلى الكاميرا.',
          'Failed to start camera. Please allow camera access.'
        ));
        setIsStarting(false);
      }
    };

    const stopScanner = async () => {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {
          // Ignore stop errors
        }
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [navigate, t]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Scanner area */}
      <div id="barcode-scanner" className="w-full h-full" />

      {/* Overlay */}
      {!error && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="scan-overlay h-full" />
          <div className="scan-frame">
            <div className="absolute inset-0 border-4 border-white/30 rounded-2xl" />
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-400 rounded-br-2xl" />
            
            {/* Scan line animation */}
            <div className="absolute inset-x-4 top-4 h-0.5 bg-primary-400 animate-scan-line" />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-20 left-0 right-0 text-center text-white px-4">
        {isStarting ? (
          <div className="flex items-center justify-center gap-2">
            <CameraIcon className="w-6 h-6 animate-pulse" />
            <span>{t('جاري تشغيل الكاميرا...', 'Starting camera...')}</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/80 rounded-xl p-4">
            <p>{error}</p>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-white text-red-600 rounded-lg font-medium"
            >
              {t('إغلاق', 'Close')}
            </button>
          </div>
        ) : (
          <p className="text-lg">{t('وجّه الكاميرا نحو الباركود', 'Point camera at barcode')}</p>
        )}
      </div>
    </div>
  );
}

