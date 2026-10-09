import { User, Camera, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';

const ProfileHeader = ({ user, onPhotoUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);
  
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      console.log('📸 Starting upload...');
      
      // Compression options
      const options = {
        maxSizeMB: 0.2, // 200KB
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/jpeg'
      };
      
      // Compress image
      const compressedFile = await imageCompression(file, options);
      console.log('✅ Image compressed');
      
      // Upload to server
      const formData = new FormData();
      formData.append('file', compressedFile);
      
      const token = localStorage.getItem('token');
      const response = await fetch('https://www.millancefurniture.com/api/users/profile-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      console.log('✅ Upload response:', data);
      
      // Show success modal
      setShowSuccess(true);
      
      // Hide modal after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      
      // Notify parent component to refresh user data
      if (onPhotoUpdate) {
        await onPhotoUpdate(data.profile_photo);
        console.log('✅ User data refreshed');
      }
      
      // Force re-render with new photo
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Photo upload failed:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };
  
  const photoUrl = user?.profile_photo 
    ? `https://www.millancefurniture.com${user.profile_photo}` 
    : null;

  return (
    <>
      {/* Success Modal */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: 'clamp(30px, 8vw, 40px)',
            textAlign: 'center',
            maxWidth: '300px',
            width: '100%',
            animation: 'scaleIn 0.3s ease-out'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10B981, #34D399)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'checkPop 0.5s ease-out'
            }}>
              <CheckCircle style={{ 
                width: '50px', 
                height: '50px',
                color: 'white'
              }} />
            </div>
            <h3 style={{
              fontSize: 'clamp(18px, 5vw, 22px)',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '10px'
            }}>
              Success!
            </h3>
            <p style={{
              fontSize: 'clamp(14px, 3.8vw, 16px)',
              color: '#666',
              margin: 0
            }}>
              Profile photo updated successfully
            </p>
          </div>
        </div>
      )}
    
      <div style={{
        background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
        borderRadius: 'clamp(12px, 3vw, 16px)',
        padding: 'clamp(20px, 5vw, 28px)',
        textAlign: 'center',
        color: 'white',
        marginBottom: 'clamp(16px, 4vw, 20px)',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <div 
          onClick={handlePhotoClick}
          style={{
            width: 'clamp(80px, 20vw, 100px)',
            height: 'clamp(80px, 20vw, 100px)',
            background: photoUrl ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto clamp(12px, 3vw, 16px)',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
            backgroundImage: photoUrl ? `url(${photoUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {!photoUrl && !uploading && (
            <User style={{ 
              width: 'clamp(35px, 9vw, 45px)', 
              height: 'clamp(35px, 9vw, 45px)' 
            }} />
          )}
          
          {uploading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTop: '4px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          )}
          
          {!uploading && (
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              background: 'linear-gradient(135deg, #EC4899, #F472B6)',
              borderRadius: '50%',
              padding: 'clamp(6px, 2vw, 8px)',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <Camera style={{ 
                width: 'clamp(14px, 4vw, 16px)', 
                height: 'clamp(14px, 4vw, 16px)' 
              }} />
            </div>
          )}
        </div>
        
        <h2 style={{
          fontSize: 'clamp(18px, 5vw, 22px)',
          fontWeight: '700',
          marginBottom: 'clamp(4px, 1vw, 6px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '0 clamp(8px, 2vw, 12px)'
        }}>
          {user?.full_name || 'User'}
        </h2>
        <p style={{
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          opacity: 0.9,
          fontWeight: '500',
          letterSpacing: '0.5px'
        }}>
          MLD #{user?.mld_id || 'N/A'}
        </p>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes scaleIn {
            0% { 
              transform: scale(0.8);
              opacity: 0;
            }
            100% { 
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes checkPop {
            0% { 
              transform: scale(0);
            }
            50% { 
              transform: scale(1.1);
            }
            100% { 
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default ProfileHeader;
