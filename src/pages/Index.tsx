import { BackgroundRemover } from '@/components/BackgroundRemover';
import { Scissors } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Scissors className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Background Remover
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Remove backgrounds from your images instantly using AI. 
            Upload any image and get a professional transparent background in seconds.
          </p>
        </div>

        {/* Background Remover Component */}
        <BackgroundRemover />

        {/* Instructions */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl">📁</div>
              <h3 className="font-medium">Upload</h3>
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop your image file
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🤖</div>
              <h3 className="font-medium">Process</h3>
              <p className="text-sm text-muted-foreground">
                AI automatically detects and removes the background
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">💾</div>
              <h3 className="font-medium">Download</h3>
              <p className="text-sm text-muted-foreground">
                Download your image with transparent background as PNG
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;