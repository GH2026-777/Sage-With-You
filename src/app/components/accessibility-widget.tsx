import { useState, useEffect } from "react";
import { Settings, Type, Contrast, Volume2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);

  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast mode
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  const handleTextToSpeech = () => {
    if (!textToSpeech) {
      setTextToSpeech(true);
      const utterance = new SpeechSynthesisUtterance(
        "Text to speech enabled. Click on any text to have it read aloud."
      );
      window.speechSynthesis.speak(utterance);
    } else {
      setTextToSpeech(false);
      window.speechSynthesis.cancel();
    }
  };

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setTextToSpeech(false);
    window.speechSynthesis.cancel();
  };

  // Add click listener for text-to-speech
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!textToSpeech) return;
      
      const target = e.target as HTMLElement;
      if (target && target.textContent) {
        const text = target.textContent.trim();
        if (text.length > 0 && text.length < 500) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    if (textToSpeech) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [textToSpeech]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-sage-600 hover:bg-sage-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Accessibility Settings"
      >
        <Settings className="h-6 w-6" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 animate-in slide-in-from-bottom-5">
          <Card className="shadow-2xl border-2 border-sage-600">
            <CardHeader className="bg-sage-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-sage-600" />
                  Accessibility
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Font Size */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-sage-600" />
                  <Label className="text-sm font-medium">
                    Text Size: {fontSize}%
                  </Label>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={75}
                  max={150}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                  <span>XL</span>
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Contrast className="h-4 w-4 text-sage-600" />
                  <Label className="text-sm font-medium">High Contrast</Label>
                </div>
                <Switch
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>

              {/* Text to Speech */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-sage-600" />
                  <Label className="text-sm font-medium">
                    Text to Speech
                  </Label>
                </div>
                <Switch
                  checked={textToSpeech}
                  onCheckedChange={handleTextToSpeech}
                />
              </div>

              {textToSpeech && (
                <p className="text-xs text-gray-600 bg-sage-50 p-2 rounded">
                  Click on any text to hear it read aloud
                </p>
              )}

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={resetSettings}
              >
                Reset to Default
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
