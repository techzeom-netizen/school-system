import React from 'react';
import { useNavbarColors } from '@/hooks/useNavbarColors';
import { presetColorSchemes } from '@/utils/navbarColors';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import { Button } from './button';
import { Badge } from './badge';

interface NavbarColorPickerProps {
  className?: string;
}

export const NavbarColorPicker: React.FC<NavbarColorPickerProps> = ({
  className,
}) => {
  const { currentPreset, availablePresets, changeColorPreset, resetColors } =
    useNavbarColors();

  const colorPreview = (colorScheme: any, isDark: boolean = false) => {
    const colors = isDark ? colorScheme.dark : colorScheme.light;
    return {
      backgroundColor: `hsl(${colors.bg})`,
      color: `hsl(${colors.text})`,
    };
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Navbar Color Settings</CardTitle>
        <CardDescription>
          Choose a color scheme for your navigation bar. Changes are applied
          instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Selection:</label>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {currentPreset}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={resetColors}
              className="ml-auto"
            >
              Reset to Default
            </Button>
          </div>
        </div>

        {/* Color Presets Grid */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Choose Color Scheme:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePresets.map(presetName => {
              const colorScheme = presetColorSchemes[presetName];
              const isSelected = currentPreset === presetName;

              return (
                <div
                  key={presetName}
                  className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => changeColorPreset(presetName)}
                >
                  <div className="space-y-2">
                    {/* Light Mode Preview */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Light:
                      </span>
                      <div
                        className="w-8 h-4 rounded border"
                        style={colorPreview(colorScheme, false)}
                      />
                    </div>

                    {/* Dark Mode Preview */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Dark:
                      </span>
                      <div
                        className="w-8 h-4 rounded border"
                        style={colorPreview(colorScheme, true)}
                      />
                    </div>

                    <div className="text-sm font-medium capitalize">
                      {presetName}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Live Preview:</label>
          <div className="border rounded-lg p-4 space-y-3">
            <div
              className="flex items-center justify-between p-2 rounded"
              style={colorPreview(presetColorSchemes[currentPreset], false)}
            >
              <span className="text-sm font-medium">
                Sample Navigation Item
              </span>
              <span className="text-xs opacity-75">Light Mode</span>
            </div>

            <div
              className="flex items-center justify-between p-2 rounded"
              style={colorPreview(presetColorSchemes[currentPreset], true)}
            >
              <span className="text-sm font-medium">
                Sample Navigation Item
              </span>
              <span className="text-xs opacity-75">Dark Mode</span>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            • Colors are automatically saved and will persist across sessions
          </p>
          <p>• Changes are applied instantly to the navigation bar</p>
          <p>• Both light and dark mode variants are included</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NavbarColorPicker;
