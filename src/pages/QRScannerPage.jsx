import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../styles/QRScannerPage.css';

const QRScannerPage = () => {
  const navigate = useNavigate();
  const [scanMethod, setScanMethod] = useState(null); // 'camera' or 'upload'
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerInstanceRef.current) {
        scannerInstanceRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const handleCameraScan = () => {
    setScanMethod('camera');
    setError('');
    setScanning(true);

    // Initialize scanner after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            rememberLastUsedCamera: true,
            supportedScanTypes: []
          },
          false
        );

        scanner.render(onScanSuccess, onScanError);
        scannerInstanceRef.current = scanner;
      }
    }, 100);
  };

  const handleUploadScan = () => {
    setScanMethod('upload');
    setError('');
    setScanning(true);

    // Initialize scanner for file upload
    setTimeout(() => {
      if (scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            showTorchButtonIfSupported: false,
            rememberLastUsedCamera: false,
            supportedScanTypes: []
          },
          false
        );

        scanner.render(onScanSuccess, onScanError);
        scannerInstanceRef.current = scanner;
      }
    }, 100);
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    console.log('QR Code scanned:', decodedText);
    
    // Stop scanner
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current.clear().catch(console.error);
      scannerInstanceRef.current = null;
    }

    // Check if the QR contains the payment URL or just redirect to payment page
    if (decodedText.includes('millancefurniture.com/pay') || decodedText.includes('/pay')) {
      navigate('/pay');
    } else {
      // For any QR code, redirect to payment (in production, validate the QR content)
      navigate('/pay');
    }
  };

  const onScanError = (errorMessage) => {
    // Don't show every scan error to avoid spam
    console.log('Scan error:', errorMessage);
  };

  const handleBack = () => {
    // Stop scanner if active
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current.clear().catch(console.error);
      scannerInstanceRef.current = null;
    }
    navigate('/dashboard');
  };

  return (
    <div className="qr-scanner-page">
      <div className="scanner-container">
        {/* Header */}
        <div className="scanner-header">
          <button className="back-btn" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1>Scan QR Code</h1>
        </div>

        {/* Content */}
        {!scanMethod ? (
          <div className="scan-options">
            <div className="scan-intro">
              <div className="scan-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h2>Scan Millance Payment QR</h2>
              <p>Choose how you'd like to scan the QR code</p>
            </div>

            {error && (
              <div className="error-banner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="scan-buttons">
              <button className="scan-option-btn camera" onClick={handleCameraScan}>
                <div className="option-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3>Use Camera</h3>
                <p>Scan QR code directly with your camera</p>
              </button>

              <button className="scan-option-btn upload" onClick={handleUploadScan}>
                <div className="option-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3>Upload Image</h3>
                <p>Choose a QR code image from gallery</p>
              </button>
            </div>

            <div className="scan-help">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Look for the Millance Payment QR code at any store counter</p>
            </div>
          </div>
        ) : (
          <div className="scanner-view">
            <div id="qr-reader" ref={scannerRef}></div>
            
            <div className="scanner-instructions">
              <div className="instruction-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{scanMethod === 'camera' ? 'Position QR code within the frame' : 'Click "Choose File" to upload QR image'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScannerPage;
