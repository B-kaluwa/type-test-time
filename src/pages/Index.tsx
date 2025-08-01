import { TypingTest } from '@/components/TypingTest';
import { Keyboard } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Keyboard className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Type Test Time
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test your typing speed and accuracy with our classic typing test. 
            Perfect your skills with real-time feedback and detailed statistics.
          </p>
        </div>

        {/* Typing Test Component */}
        <TypingTest />

        {/* Instructions */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl">🎯</div>
              <h3 className="font-medium">Focus</h3>
              <p className="text-sm text-muted-foreground">
                Click in the input field and press Enter to start the 60-second test
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">⚡</div>
              <h3 className="font-medium">Type</h3>
              <p className="text-sm text-muted-foreground">
                Type the text exactly as shown. Correct text appears in green, errors in red
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📊</div>
              <h3 className="font-medium">Improve</h3>
              <p className="text-sm text-muted-foreground">
                Track your WPM and accuracy to monitor your typing progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;