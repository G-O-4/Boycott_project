import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/language';
import BarcodeScanner from '../components/BarcodeScanner';

export function ScanPage() {
  const { t } = useLanguageStore();
  const navigate = useNavigate();
  const [hasCamera, setHasCamera] = useState(true);
  const [manualBarcode, setManualBarcode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setIsScanning] = useState(false);

  useEffect(() => {
    // Check for camera support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamera(false);
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsScanning(true);
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        setHasCamera(false);
      }
    };

    startCamera();

    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      navigate(`/scan/${manualBarcode.trim()}`);
    }
  };

  // Simulated scan - in real app, use a barcode scanning library
  const handleDemoScan = () => {
    // Demo barcode
    navigate('/scan/6281006850118');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-dark-100 mb-2">{t('scanProduct')}</h1>
        <p className="text-dark-400">{t('pointCameraAtBarcode')}</p>
      </div>

      {/* Camera View */}
      <div className="relative glass-card overflow-hidden rounded-2xl mb-6" style={{ aspectRatio: '4/3' }}>
        {hasCamera ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Scan overlay */}
            <div className="scan-overlay-dark" />
            
            {/* Scan frame */}
            <div className="scan-frame-dark">
              <div className="absolute inset-0 animate-scan-line">
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
              </div>
            </div>

            {/* Corner markers */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-48 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-400 rounded-br-lg" />
            </div>

            {/* Demo scan button */}
            <button
              onClick={handleDemoScan}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 btn-primary"
            >
              تجربة المسح (عرض توضيحي)
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-dark-100 mb-2">الكاميرا غير متاحة</h3>
            <p className="text-dark-400 text-sm">
              يمكنك إدخال الباركود يدوياً أدناه
            </p>
          </div>
        )}
      </div>

      {/* Manual Entry */}
      <div className="glass-card p-6">
        <h3 className="font-medium text-dark-100 mb-4">أو أدخل الباركود يدوياً</h3>
        <form onSubmit={handleManualSearch} className="flex gap-3">
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="أدخل رقم الباركود..."
            className="input flex-1"
            dir="ltr"
          />
          <button type="submit" className="btn-primary">
            بحث
          </button>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-dark-800/50 rounded-xl">
        <h4 className="font-medium text-dark-200 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          نصائح للمسح
        </h4>
        <ul className="text-sm text-dark-400 space-y-1">
          <li>• تأكد من وجود إضاءة كافية</li>
          <li>• اجعل الباركود في منتصف الإطار</li>
          <li>• حافظ على ثبات الكاميرا</li>
        </ul>
      </div>
    </div>
  );
}

