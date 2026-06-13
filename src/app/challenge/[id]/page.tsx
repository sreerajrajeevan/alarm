"use client"

import React, { useRef, useState, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Camera, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DotMatrixText } from '@/components/DotMatrixText';
import { useStats } from '@/lib/alarm-store';
import { identifyObjectInImage } from '@/ai/flows/object-identification-core';
import { cn } from '@/lib/utils';

export default function ChallengeScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetObject = searchParams.get('target') || 'Object';
  const { addCompletion } = useStats();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      }
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
    }
  };

  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        return dataUrl;
      }
    }
    return null;
  }, []);

  const handleValidation = async () => {
    const dataUri = captureFrame();
    if (!dataUri) return;

    setIsValidating(true);
    setError(null);

    try {
      const result = await identifyObjectInImage({
        photoDataUri: dataUri,
        targetObject: targetObject,
        minConfidence: 0.8
      });

      if (result.isIdentified) {
        setSuccess(true);
        addCompletion(targetObject);
        // Stop the "alarm" - in a real app we'd trigger a signal here
        setTimeout(() => router.push('/'), 3000);
      } else {
        setError(result.message);
        setCapturedImage(null);
      }
    } catch (err) {
      setError('AI Validation failed. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Viewport */}
      <div className="relative flex-1 bg-muted/20 overflow-hidden">
        {hasPermission ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover grayscale opacity-60"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Initializing camera sensor...</p>
          </div>
        )}

        {/* Framing Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-dashed border-white/20 rounded-3xl" />
        </div>

        {/* UI Overlays */}
        <div className="absolute top-8 left-0 right-0 px-8 flex justify-between items-start pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 pointer-events-auto">
            <DotMatrixText className="text-[10px] text-muted-foreground mb-1 tracking-widest">TARGET</DotMatrixText>
            <div className="text-xl font-headline font-bold text-white uppercase">{targetObject}</div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-auto"
            onClick={() => router.back()}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {error && (
          <div className="absolute bottom-32 left-8 right-8 bg-destructive/90 backdrop-blur-md text-white p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="absolute inset-0 z-20 bg-primary flex flex-col items-center justify-center p-12 text-center text-background animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8">
              <Check className="w-12 h-12" />
            </div>
            <DotMatrixText className="text-4xl font-bold mb-4">SUCCESS</DotMatrixText>
            <p className="text-xl font-medium">Quest Completed.<br/>Have a great day!</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-28 bg-background border-t border-white/5 flex items-center justify-center px-8">
        <div className="flex-1" />
        <button 
          disabled={isValidating || success}
          onClick={handleValidation}
          className={cn(
            "w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all active:scale-90",
            isValidating ? "border-muted border-t-primary animate-spin" : "border-primary bg-transparent"
          )}
        >
          {isValidating ? null : <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-background" />
          </div>}
        </button>
        <div className="flex-1 flex justify-end">
          <DotMatrixText className="text-[10px] text-muted-foreground tracking-widest">Vision AI v2.5</DotMatrixText>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
